# Cache Module

## Overview

The cache module stores successful search results in memory using a JavaScript `Map`.

It prevents duplicate API requests when the user searches for the same query and page again during the current browser session.

## How It Connects to Other Files

* Imported by `main.js`.
* Receives search parameters from `main.js`.
* Stores results returned by `api.js`.
* Returns cached results back to `main.js` for rendering through `ui.js`.


## Key Features

* Uses an in-memory `Map`.
* Normalizes search queries for consistent cache matching.
* Creates a unique key using query, page, and page size.
* Stores separate results for each page.
* Returns cached data without sending another API request.
* Clears automatically when the browser page is refreshed.

## Important Functions and Signatures

### `normalizeSearchQuery(query)`

```js
normalizeSearchQuery("  MARIO  ");
```

Removes surrounding spaces and converts the query to lowercase.

This ensures values such as `Mario`, `MARIO`, and `mario` use the same cache entry.

---

### `createCacheKey({ query, page, pageSize })`

```js
createCacheKey({
  query: "Mario",
  page: 1,
  pageSize: 12,
});
```

Creates a unique cache key using the normalized query, page number, and page size.

Example result:

```text
mario|1|12
```

---

### `createSearchCache()`

```js
const searchCache = createSearchCache();
```

Creates a private `Map` and returns two methods:

```js
searchCache.get(searchParameters);
searchCache.set(searchParameters, result);
```

`get()` returns the stored result or `null`, while `set()` saves a result using the generated cache key.

## Basic Execution Flow

```text
1. main.js prepares the query, page, and page size.
2. cache.js normalizes the query.
3. A unique cache key is created.
4. main.js checks the cache before calling the API.
5. A cached result is returned immediately when available.
6. On a cache miss, main.js requests data from api.js.
7. The successful result is stored in the cache.
8. Revisiting the same query and page reuses the stored result.
```
