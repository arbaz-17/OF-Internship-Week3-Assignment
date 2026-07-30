import {
  ApiError,
  searchGames,
} from "./api.js";

import { SEARCH_CONFIG } from "./config.js";
import { debounce } from "./debounce.js";

import {
  showEmptyState,
  showErrorState,
  showInitialState,
  showLoadingState,
  showResults,
  updatePagination,
} from "./ui.js";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

const previousPageButton =
  document.querySelector("#previous-page");

const nextPageButton =
  document.querySelector("#next-page");

if (
  !searchForm ||
  !searchInput ||
  !searchButton ||
  !previousPageButton ||
  !nextPageButton
) {
  throw new Error(
    "Required application interface elements were not found"
  );
}

const searchState = {
  activeQuery: "",
  currentPage: 1,
  totalPages: 1,
  activeController: null,
  latestRequestId: 0,
};

function getUserErrorMessage(error) {
  if (!(error instanceof ApiError)) {
    return "A network error occurred. Check your connection and try again.";
  }

  if (error.status === 401 || error.status === 403) {
    return "The game service could not authorize this request.";
  }

  if (error.status === 429) {
    return "Too many searches were made. Please wait and try again.";
  }

  if (error.status && error.status >= 500) {
    return "The game service is temporarily unavailable.";
  }

  return "We could not search the game library. Please try again.";
}

function cancelActiveRequest() {
  if (searchState.activeController) {
    searchState.activeController.abort();
    searchState.activeController = null;
  }

  /*
   * Any previous request now has an outdated ID and
   * cannot update the current interface.
   */
  searchState.latestRequestId += 1;
}

function resetSearchInterface(message) {
  cancelActiveRequest();

  searchState.activeQuery = "";
  searchState.currentPage = 1;
  searchState.totalPages = 1;

  searchButton.disabled = false;

  showInitialState(message);
}

async function performSearch(query, page = 1) {
  /*
   * A page change or immediate submission may happen
   * while another request is active.
   */
  if (searchState.activeController) {
    searchState.activeController.abort();
  }

  const controller = new AbortController();
  const requestId = ++searchState.latestRequestId;

  searchState.activeController = controller;
  searchState.activeQuery = query;
  searchState.currentPage = page;

  showLoadingState(query);
  searchButton.disabled = true;

  try {
    const result = await searchGames({
      query,
      page,
      signal: controller.signal,
    });

    /*
     * Even if cancellation did not stop an operation in
     * time, an outdated request cannot update the UI.
     */
    if (requestId !== searchState.latestRequestId) {
      return;
    }

    searchState.currentPage = result.currentPage;
    searchState.totalPages = result.totalPages;

    if (result.games.length === 0) {
      showEmptyState(query);
      return;
    }

    const formattedCount =
      result.totalResults.toLocaleString();

    showResults(
      result.games,
      `${formattedCount} games found for “${query}” · Page ${result.currentPage} of ${result.totalPages}`
    );

    updatePagination({
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      hasPrevious: result.hasPrevious,
      hasNext: result.hasNext,
    });
  } catch (error) {
    /*
     * Cancellation is expected when the query changes.
     * It should not appear as an application error.
     */
    if (controller.signal.aborted) {
      return;
    }

    if (requestId !== searchState.latestRequestId) {
      return;
    }

    console.error("Game search failed:", error);

    showErrorState(getUserErrorMessage(error));
  } finally {
    /*
     * Only the latest request may change shared loading
     * controls or clear the current controller.
     */
    if (requestId === searchState.latestRequestId) {
      searchButton.disabled = false;

      if (searchState.activeController === controller) {
        searchState.activeController = null;
      }
    }
  }
}

const debouncedSearch = debounce((query) => {
  performSearch(query, 1);
}, SEARCH_CONFIG.debounceDelay);

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  /*
   * The previous query becomes outdated immediately,
   * not only after the debounce timer completes.
   */
  debouncedSearch.cancel();
  cancelActiveRequest();

  if (query.length === 0) {
    searchState.activeQuery = "";
    searchState.currentPage = 1;
    searchState.totalPages = 1;

    showInitialState(
      "Start typing a game title to discover games."
    );

    return;
  }

  if (query.length < 2) {
    showInitialState(
      "Enter at least two characters to search for games."
    );

    return;
  }

  showInitialState(
    `Waiting to search for “${query}”...`
  );

  debouncedSearch(query);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();

  /*
   * Pressing Enter should search immediately instead of
   * waiting for the remaining debounce delay.
   */
  debouncedSearch.cancel();

  if (query.length < 2) {
    resetSearchInterface(
      "Enter at least two characters to search for games."
    );

    searchInput.focus();
    return;
  }

  performSearch(query, 1);
});

previousPageButton.addEventListener("click", () => {
  if (searchState.currentPage <= 1) {
    return;
  }

  performSearch(
    searchState.activeQuery,
    searchState.currentPage - 1
  );
});

nextPageButton.addEventListener("click", () => {
  if (
    searchState.currentPage >= searchState.totalPages
  ) {
    return;
  }

  performSearch(
    searchState.activeQuery,
    searchState.currentPage + 1
  );
});

showInitialState();