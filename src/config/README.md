# Configuration Module

## Overview

The configuration module stores values used across GameBox that may need to change without modifying application logic.

It currently contains API connection settings, pagination size, and the debounce delay used by the search input.

## How It Connects to Other Files

* `api.js` imports `API_CONFIG` to build RAWG requests.
* `main.js` imports `API_CONFIG.pageSize` when creating cache keys.
* `main.js` imports `SEARCH_CONFIG.debounceDelay` when creating the debounced search function.

## Key Features

* Keeps reusable settings in one location.
* Avoids hardcoding the same values across multiple modules.
* Controls the RAWG API base URL.
* Defines the number of games requested per page.
* Defines how long the search waits after typing.

## Important Configuration Objects

### `API_CONFIG`

```js
API_CONFIG.baseUrl
API_CONFIG.apiKey
API_CONFIG.pageSize
```

Contains the API endpoint, API key, and number of results requested per page.

Changing `pageSize` affects both API pagination and cache keys.

---

### `SEARCH_CONFIG`

```js
SEARCH_CONFIG.debounceDelay
```

Contains the delay in milliseconds before a search runs after the user stops typing.

A value of `400` means the application waits 400 milliseconds.

## Basic Execution Flow

```text
1. The application modules import the required configuration object.
2. api.js uses the base URL, key, and page size to build requests.
3. main.js uses the page size when identifying cached pages.
4. main.js passes the debounce delay to the debounce utility.
5. Changing a configuration value updates all modules that import it.
```
