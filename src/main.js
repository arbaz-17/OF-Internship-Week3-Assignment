import { searchGames } from "./api.js";
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

    showErrorState(
      "We could not search the game library. Please try again."
    );
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