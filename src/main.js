import {
  ApiError,
  searchGames,
} from "./api.js";

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
  isSearching: false,
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

async function performSearch(query, page = 1) {
  if (searchState.isSearching) {
    return;
  }

  searchState.isSearching = true;
  searchState.activeQuery = query;
  searchState.currentPage = page;

  showLoadingState(query);
  searchButton.disabled = true;

  try {
    const result = await searchGames({
      query,
      page,
    });

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
    console.error("Game search failed:", error);

    showErrorState(getUserErrorMessage(error));
  } finally {
    searchState.isSearching = false;
    searchButton.disabled = false;
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (query.length < 2) {
    showInitialState(
      "Enter at least two characters to search for games."
    );

    searchInput.focus();
    return;
  }

  performSearch(query, 1);
});

previousPageButton.addEventListener("click", () => {
  if (
    searchState.isSearching ||
    searchState.currentPage <= 1
  ) {
    return;
  }

  performSearch(
    searchState.activeQuery,
    searchState.currentPage - 1
  );
});

nextPageButton.addEventListener("click", () => {
  if (
    searchState.isSearching ||
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