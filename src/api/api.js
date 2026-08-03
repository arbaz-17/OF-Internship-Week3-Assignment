import { API_CONFIG } from "../config/config.js";
import { getMockGames } from "./mockData.js";


export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message, {
      cause: options.cause,
    });

    this.name = "ApiError";
    this.status = options.status ?? null;
  }
}

function validateApiConfiguration() {
  const hasValidKey =
    typeof API_CONFIG.apiKey === "string" &&
    API_CONFIG.apiKey.trim() !== "" &&
    API_CONFIG.apiKey !== "GAME_DB_KEY";

  if (!hasValidKey) {
    throw new ApiError("GAME DB API key is not configured");
  }
}

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
    throw new ApiError(
      "The game service returned an unexpected response"
    );
  }
}

export async function searchGames({
  query,
  page = 1,
  signal,
}) {
  validateApiConfiguration();

  const url = new URL(`${API_CONFIG.baseUrl}/games`);

  url.searchParams.set("key", API_CONFIG.apiKey);
  url.searchParams.set("search", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set(
    "page_size",
    String(API_CONFIG.pageSize)
  );

let response;

try {
  response = await fetch(url, {
    signal,
  });
} catch (error) {
  console.warn(
    "RAWG API unavailable. Using fallback data."
  );

  return getMockGames(query);
}

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new ApiError(
      "The game service returned invalid JSON",
      {
        status: response.status,
        cause: error,
      }
    );
  }

  if (!response.ok) {
    const apiMessage =
      typeof data.detail === "string"
        ? data.detail
        : `Game request failed with status ${response.status}`;

    throw new ApiError(apiMessage, {
      status: response.status,
    });
  }

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