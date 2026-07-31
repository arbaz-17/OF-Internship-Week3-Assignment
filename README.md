# GameBox - Week 3 Assignment

## Overview

GameBox is a Vanilla JavaScript API Search Application created as the Week 3 internship assignment.

The application allows users to search for video games using the RAWG API. It supports debounced searching, request cancellation, loading and error states, pagination, race-condition protection, and in-memory caching.

The project is built using:

- HTML
- CSS
- Vanilla JavaScript
- ES modules
- RAWG API

## What Was Created

- Search games by title
- Debounced automatic search
- Immediate search using Enter or the Search button
- Loading skeletons
- Error and empty-result states
- Previous and Next pagination
- Request cancellation using `AbortController`
- Protection against stale API responses
- In-memory caching using `Map`
- Responsive game-card interface
- Separate modules with individual documentation

## Project Structure

```text
OF-Internship-Week3-Assignment/
├── css/
│   └── styles.css
│
├── src/
│   ├── api/
│   │   ├── api.js
│   │   └── README.md
│   │
│   ├── cache/
│   │   ├── cache.js
│   │   └── README.md
│   │
│   ├── config/
│   │   ├── config.example.js
│   │   ├── config.js
│   │   └── README.md
│   │
│   ├── debounce/
│   │   ├── debounce.js
│   │   └── README.md
│   │
│   ├── ui/
│   │   ├── ui.js
│   │   └── README.md
│   │
│   ├── main.js
│   └── README.md
│
├── .gitignore
├── index.html
└── README.md
```

> `config.js` is committed because GitHub Pages is a static hosting service and the browser must load this file at runtime.
> The project uses a separate, rotatable demo API key. The key should not be treated as private because frontend configuration is visible in browser developer tools.
> `config.example.js` documents the required configuration structure using a placeholder value.  

## Module Responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Defines the application structure, including the search form, status messages, results grid, and pagination controls. |
| `css/styles.css` | Controls the visual design, responsive layout, game cards, loading skeletons, states, and pagination styling. |
| `src/main.js` | Acts as the application controller. It coordinates user events, debounce, caching, API requests, cancellation, race protection, and UI updates. |
| `src/api/api.js` | Builds RAWG API requests, handles responses and errors, normalizes game data, and returns pagination information. |
| `src/ui/ui.js` | Creates game cards and controls the initial, loading, success, empty, error, and pagination UI states. |
| `src/debounce/debounce.js` | Delays automatic searching until the user pauses typing and supports cancelling a pending search. |
| `src/cache/cache.js` | Stores successful API results in an in-memory `Map` to prevent repeated requests for the same query and page. |
| `src/config/config.js` | Stores the local API key and application settings. |
| `src/config/config.example.js` | Provides the required configuration structure without including a real API key. |

## Week 3 Concepts Used

### Promises and Async/Await

The application uses `async` and `await` to handle API requests and asynchronous search results.

### Fetch API

The RAWG games endpoint is called using the browser `fetch()` API.

### Error Handling

`try...catch...finally` and a custom `ApiError` class are used to handle network, authorization, rate-limit, parsing, and server errors.

### AbortController

Previous requests are cancelled when the user changes the search query or starts another search.

### Race Conditions

Each request receives an ID. Only the latest request is allowed to update the interface.

### DOM Manipulation

JavaScript dynamically creates game cards, loading skeletons, messages, and pagination states.

### Browser Events

The application handles:

- Input events
- Form submission
- Button clicks
- Image loading errors

### Asynchronous Browser APIs

Timers are used for debouncing, while Fetch and AbortController handle asynchronous network operations.

## Local Setup

1. Clone the repository.
2. Open the `src/config` folder.
3. Copy `config.example.js`.
4. Rename the copy to `config.js`.
5. Add a valid RAWG API key.
6. Run the project using Live Server or another local development server.

Example:

```js
export const API_CONFIG = {
  baseUrl: "https://api.rawg.io/api",
  apiKey: "GAME_DB_API_KEY",
  pageSize: 12,
};

export const SEARCH_CONFIG = {
  debounceDelay: 400,
};
```

## Demo

**Live Application:**  
[Open GameBox](https://arbaz-17.github.io/OF-Internship-Week3-Assignment/)
