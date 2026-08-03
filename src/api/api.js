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

function normalizeGame(game) {
  return {
    id: game.id,
    name: game.title || "Untitled game",
    released: game.release_date || "Unknown",
    rating: null,
    image: game.thumbnail || null,
    platforms: game.platform ? [game.platform] : [],
    genres: game.genre ? [game.genre] : [],
  };
}

function validateApiResponse(data) {
  if (!Array.isArray(data)) {
    throw new ApiError("The game service returned an unexpected response");
  }
}

function paginateGames(games, page) {
  const startIndex = (page - 1) * API_CONFIG.pageSize;

  const endIndex = startIndex + API_CONFIG.pageSize;

  const paginatedGames = games.slice(startIndex, endIndex);

  const totalPages = Math.max(1, Math.ceil(games.length / API_CONFIG.pageSize));

  return {
    games: paginatedGames,
    totalResults: games.length,
    totalPages,
    currentPage: page,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };
}

async function fetchWithTimeout(url, signal) {
  const timeoutController = new AbortController();

  const timeoutId = setTimeout(() => {
    timeoutController.abort();
  }, API_CONFIG.timeout);

  signal?.addEventListener("abort", () => {
    timeoutController.abort();
  });

  try {
    return await fetch(url, {
      signal: timeoutController.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function createFallbackResponse(query, page) {
  const mockGames = getMockGames(query).map(normalizeGame);

  return {
    ...paginateGames(mockGames, page),
    source: "mock",
  };
}

export async function searchGames({ query, page = 1, signal }) {
  const url = `${API_CONFIG.baseUrl}/games`;

  try {
    const response = await fetchWithTimeout(url, signal);

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError("Game service returned invalid JSON", {
        cause: error,
      });
    }

    if (!response.ok) {
      throw new ApiError("Game service request failed", {
        status: response.status,
      });
    }

    validateApiResponse(data);

    const normalizedGames = data
      .filter((game) => game.title.toLowerCase().includes(query.toLowerCase()))
      .map(normalizeGame);

    return {
      ...paginateGames(normalizedGames, page),
      source: "api",
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError("The game service is taking too long to respond.");
    }

    console.warn("API unavailable. Using fallback data.");

    return createFallbackResponse(query, page);
  }
}
