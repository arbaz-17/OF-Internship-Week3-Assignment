import {
  ApiError,
  searchGames,
} from "./api/api.js";

import {
  API_CONFIG,
  SEARCH_CONFIG,
} from "./config/config.js";

import { createSearchCache } from "./cache/cache.js";
import { debounce } from "./debounce/debounce.js";

import {
  showEmptyState,
  showErrorState,
  showInitialState,
  showLoadingState,
  showResults,
  updatePagination,
} from "./ui/ui.js";

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

const searchCache = createSearchCache();

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

function renderSearchResult(
  result,
  query,
  { fromCache = false } = {}
) {
  searchState.activeQuery = query;
  searchState.currentPage = result.currentPage;
  searchState.totalPages = result.totalPages;

  if (result.games.length === 0) {
    showEmptyState(query);
    return;
  }

  const formattedCount =
    result.totalResults.toLocaleString();

  const cacheLabel = fromCache
    ? " · Cached result"
    : "";

showResults(
  result.games,
  `${formattedCount} games found for “${query}” · Page ${result.currentPage} of ${result.totalPages}`,
  fromCache
);

  updatePagination({
    currentPage: result.currentPage,
    totalPages: result.totalPages,
    hasPrevious: result.hasPrevious,
    hasNext: result.hasNext,
  });
}

async function performSearch(query, page = 1) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery || !Number.isInteger(page) || page < 1) {
    return;
  }

  cancelActiveRequest();

  searchState.activeQuery = trimmedQuery;
  searchState.currentPage = page;

  const cacheParameters = {
    query: trimmedQuery,
    page,
    pageSize: API_CONFIG.pageSize,
  };

  const cachedResult =
    searchCache.get(cacheParameters);

  if (cachedResult) {
    searchButton.disabled = false;

    renderSearchResult(
      cachedResult,
      trimmedQuery,
      {
        fromCache: true,
      }
    );

    return;
  }

  const controller = new AbortController();
  const requestId = ++searchState.latestRequestId;

  searchState.activeController = controller;

  showLoadingState(trimmedQuery);
  searchButton.disabled = true;

  try {
    const result = await searchGames({
      query: trimmedQuery,
      page,
      signal: controller.signal,
    });

    if (requestId !== searchState.latestRequestId) {
      return;
    }
    searchCache.set(cacheParameters, result);

    renderSearchResult(result, trimmedQuery);
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    if (requestId !== searchState.latestRequestId) {
      return;
    }

    console.error("Game search failed:", error);

    showErrorState(getUserErrorMessage(error));
  } finally {
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