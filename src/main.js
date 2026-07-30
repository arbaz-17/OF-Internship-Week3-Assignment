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

if (!searchForm || !searchInput || !searchButton) {
  throw new Error(
    "Required search interface elements were not found"
  );
}

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
  showLoadingState(query);
  searchButton.disabled = true;

  try {
    const result = await searchGames({
      query,
      page,
    });

    if (result.games.length === 0) {
      showEmptyState(query);
      return;
    }

    const formattedCount =
      result.totalResults.toLocaleString();

    showResults(
      result.games,
      `${formattedCount} games found for “${query}”`
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

  performSearch(query);
});

showInitialState();