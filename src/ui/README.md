# UI Module

## Overview

The UI module manages all DOM rendering for GameBox.

It creates game cards, displays loading skeletons, switches between initial, loading, error, empty, and success states, and updates pagination controls.

It does not make API requests or manage search logic.

## How It Connects to Other Files

* Receives normalized game data from `main.js`.
* Uses element IDs defined in `index.html`.
* Applies CSS classes defined in `styles.css`.
* Exports UI functions that `main.js` calls after search events and API responses.


## Key Features

* Stores references to required DOM elements.
* Throws a clear error when an expected element is missing.
* Creates game cards using DOM methods.
* Displays a simple fallback when a game image is missing or broken.
* Renders multiple cards using `DocumentFragment`.
* Shows loading skeleton cards during requests.
* Manages initial, loading, error, empty, and success states.
* Updates pagination numbers and button availability.
* Displays a highlighted label for cached results.

## Important Functions and Signatures

### `createGameCard(game)`

```js
createGameCard(game);
```

Creates and returns one game-card `<article>`.

The card contains the game image, title, release date, rating, platforms, and genres.

---

### `renderGames(games)`

```js
renderGames(games);
```

Converts an array of game objects into cards and inserts them into the games grid.

It uses a `DocumentFragment` and replaces any previous cards or loading skeletons.

---

### `showLoadingState(query)`

```js
showLoadingState("Mario");
```

Resets the current view, displays the loading message, shows the results section, and renders skeleton cards.

---

### `showResults(games, summary, fromCache?)`

```js
showResults(
  games,
  "250 games found for Mario",
  true
);
```

Renders successful game results and displays the result summary.

When `fromCache` is `true`, it adds a highlighted `Cached result` label.

---

### `showErrorState(message)`

```js
showErrorState(
  "The game service is temporarily unavailable."
);
```

Clears old results and pagination, then displays a user-friendly error message.

---

### `showEmptyState(query)`

```js
showEmptyState("Unknown Game");
```

Displays an empty state when the request succeeds but returns no matching games.

---

### `updatePagination(options)`

```js
updatePagination({
  currentPage: 2,
  totalPages: 10,
  hasPrevious: true,
  hasNext: true,
});
```

Updates the current and total page numbers.

It also enables or disables the Previous and Next buttons and hides pagination when only one page exists.

## Basic Execution Flow

```text
1. main.js calls a UI state function.
2. Existing status messages and results are reset when needed.
3. During loading, skeleton cards are rendered.
4. After success, normalized games are converted into game cards.
5. Cards replace the previous content in the results grid.
6. The result summary is updated.
7. Pagination controls are updated separately.
8. Error or empty responses display their matching state.
```
