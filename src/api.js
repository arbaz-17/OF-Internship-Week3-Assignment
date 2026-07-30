import { API_CONFIG } from "./config.js";

function normalizeGame(game) {
  return {
    id: game.id,
    name: game.name || "Untitled game",
    released: game.released || "Unknown",
    rating:
      typeof game.rating === "number"
        ? game.rating
        : 0,
    image: game.background_image || null,
    platforms: Array.isArray(game.platforms)
      ? game.platforms
          .map((item) => item.platform?.name)
          .filter(Boolean)
      : [],
    genres: Array.isArray(game.genres)
      ? game.genres
          .map((genre) => genre.name)
          .filter(Boolean)
      : [],
  };
}

function validateApiResponse(data) {
  if (
    !data ||
    typeof data !== "object" ||
    !Array.isArray(data.results)
  ) {
    throw new Error(
      "The game service returned an unexpected response"
    );
  }
}

export async function searchGames({
  query,
  page = 1,
  signal,
}) {
  const url = new URL(`${API_CONFIG.baseUrl}/games`);

  url.searchParams.set("key", API_CONFIG.apiKey);
  url.searchParams.set("search", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set(
    "page_size",
    String(API_CONFIG.pageSize)
  );

  const response = await fetch(url, {
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Game request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  validateApiResponse(data);

  const totalResults =
    typeof data.count === "number" ? data.count : 0;

  const totalPages = Math.max(
    1,
    Math.ceil(totalResults / API_CONFIG.pageSize)
  );

  return {
    games: data.results.map(normalizeGame),
    totalResults,
    totalPages,
    currentPage: page,
    hasPrevious: Boolean(data.previous),
    hasNext: Boolean(data.next),
  };
}