# Main Application Module

## Overview

The main module is the entry point and controller of GameBox.

It listens to user actions and coordinates the API, UI, debounce, cache, configuration, request cancellation, race-condition protection, and pagination modules.

It decides **when** searches should run and **which UI state** should be displayed.

## How It Connects to Other Files

* Imports `searchGames()` and `ApiError` from `api.js`.
* Imports page-size and debounce settings from `config.js`.
* Creates the in-memory cache using `cache.js`.
* Creates the delayed search function using `debounce.js`.
* Calls rendering and state functions from `ui.js`.
* Selects search and pagination elements from `index.html`.

## Key Features

* Handles search-input and form-submit events.
* Delays automatic searches using debounce.
* Allows Enter or the Search button to search immediately.
* Cancels outdated requests using `AbortController`.
* Uses request IDs to prevent stale responses from updating the UI.
* Checks the cache before sending an API request.
* Stores successful responses for repeated searches.
* Handles loading, success, empty, and error states.
* Tracks the active query and pagination state.
* Handles Previous and Next page navigation.

## Application State

```js
const searchState = {
  activeQuery: "",
  currentPage: 1,
  totalPages: 1,
  activeController: null,
  latestRequestId: 0,
};
```

The state stores the active query, pagination values, current request controller, and latest request identifier.

## Important Functions and Signatures

### `performSearch(query, page?)`

```js
await performSearch("Mario", 1);
```

Coordinates the complete search process.

It validates the input, cancels old requests, checks the cache, calls the API, protects against stale responses, stores successful results, and updates the UI.

---

### `renderSearchResult(result, query, options?)`

```js
renderSearchResult(result, "Mario", {
  fromCache: true,
});
```

Processes a completed API or cached result.

It updates application state, handles empty results, displays game cards, and updates pagination controls.

---

### `cancelActiveRequest()`

```js
cancelActiveRequest();
```

Aborts the active Fetch request and increases the latest request ID.

This prevents an outdated request from updating the current interface.

---

### `resetSearchInterface(message)`

```js
resetSearchInterface(
  "Enter at least two characters to search for games."
);
```

Cancels active work, resets query and pagination state, enables the Search button, and displays an initial or validation message.

---

### `getUserErrorMessage(error)`

```js
const message = getUserErrorMessage(error);
```

Converts technical API and network errors into user-friendly messages.

It handles authorization errors, rate limits, server failures, and general network errors.

## Basic Execution Flow

```text
1. The user types in the search input.
2. Pending debounce timers and outdated requests are cancelled.
3. The query is validated.
4. The debounce utility waits for the user to stop typing.
5. performSearch() starts on page 1.
6. The cache is checked for the query and page.
7. A cached result is rendered immediately when available.
8. On a cache miss, an AbortController and request ID are created.
9. The loading state is displayed.
10. api.js sends the game-search request.
11. Outdated or cancelled responses are ignored.
12. Successful results are stored in the cache.
13. ui.js renders results, empty feedback, or an error.
14. Pagination buttons request previous or next cached/API pages.
```
