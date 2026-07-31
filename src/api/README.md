# API Module

## Overview

The API module handles communication between GameBox and the external game database API.

It builds search requests, sends them using `fetch()`, validates responses, handles API-related errors and converts raw game records into a simpler format used by the application.

## How It Connects to Other Files

* Imports API settings from `../config/config.js`.
* Exports `searchGames()` for use in `main.js`.
* Exports `ApiError` so `main.js` can identify API-specific errors.
* Returns normalized game data that is eventually passed to `ui.js` for rendering.

## Key Features

* Validates the API key before sending requests.
* Builds URLs using `URL` and `searchParams`.
* Supports pagination through `page` and `page_size`.
* Supports request cancellation using an `AbortSignal`.
* Handles invalid JSON and unsuccessful HTTP responses.
* Converts nested API data into a simple game model.
* Returns pagination information with the game results.

## Important Functions and Signatures

### `new ApiError(message, options?)`

```js
new ApiError(message, {
  status,
  cause,
});
```

Creates an API-specific error containing a message, optional HTTP status, and the original error cause.

It allows `main.js` to distinguish API failures from normal network or JavaScript errors.

---

### `validateApiConfiguration()`

```js
validateApiConfiguration();
```

Checks that the API key exists, is a string, and is not still using the placeholder value.

It throws an `ApiError` before the request is sent when the configuration is invalid.

---

### `normalizeGame(game)`

```js
normalizeGame(game);
```

Converts one raw API game object into the simpler format expected by GameBox.

```js
{
  id,
  name,
  released,
  rating,
  image,
  platforms,
  genres
}
```

It also provides fallback values for missing fields.

---

### `validateApiResponse(data)`

```js
validateApiResponse(data);
```

Checks that the returned value is an object containing a `results` array.

It prevents the application from processing an unexpected response structure.

---

### `searchGames({ query, page, signal })`

```js
await searchGames({
  query: "Mario",
  page: 1,
  signal: controller.signal,
});
```

Builds and sends a game-search request.

It validates the response, normalizes the games, calculates pagination details, and returns:

```js
{
  games,
  totalResults,
  totalPages,
  currentPage,
  hasPrevious,
  hasNext
}
```

## Basic Execution Flow

```text
1. main.js calls searchGames().
2. The API configuration is validated.
3. The games endpoint URL is created.
4. Search, page, page size, and API key parameters are added.
5. fetch() sends the request with an optional cancellation signal.
6. The response body is parsed as JSON.
7. HTTP and response-structure errors are checked.
8. Each raw game is normalized.
9. Pagination information is calculated.
10. The clean result is returned to main.js.
```
