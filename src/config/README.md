# Configuration Module

## Overview

The configuration module stores values used by GameBox, including the API base URL, API key, page size, and debounce delay.

## Deployment Configuration

`config.js` is committed because the application is deployed through GitHub Pages.

GitHub Pages serves static files and cannot privately inject environment variables into browser JavaScript. Therefore, the API key used by the deployed frontend is visible in the source code and browser Network tab.

The project uses a separate, rotatable demo key rather than a sensitive production credential.

`config.example.js` remains available to document the expected configuration structure.

## How It Connects to Other Files

* `api.js` imports `API_CONFIG` to build game-search requests.
* `main.js` imports `API_CONFIG.pageSize` for cache keys.
* `main.js` imports `SEARCH_CONFIG.debounceDelay` for debounced searches.

## Key Features

* Centralizes reusable application settings.
* Keeps the real API key out of the repository.
* Provides a safe example configuration for other developers.
* Defines the API endpoint and result page size.
* Defines the search debounce delay.

## Configuration Objects

### `API_CONFIG`

```js
export const API_CONFIG = {
  baseUrl: "https://api.rawg.io/api",
  apiKey: "GAME_DB_API_KEY",
  pageSize: 12,
};
```

Contains the API URL, local API key, and number of games requested per page.

### `SEARCH_CONFIG`

```js
export const SEARCH_CONFIG = {
  debounceDelay: 400,
};
```

Defines how long the application waits after typing before starting a search.

## Local Setup

1. Copy `config.example.js`.
2. Rename the copy to `config.js`.
3. Replace `GAME_DB_API_KEY` with a valid API key.
4. Keep `config.js` uncommitted.

```text
config.example.js → safe and committed
config.js         → local and ignored
```

## Basic Execution Flow

```text
1. The developer creates a local config.js file.
2. api.js reads the API URL, key, and page size.
3. main.js reads the page size and debounce delay.
4. config.example.js remains available as setup documentation.
```