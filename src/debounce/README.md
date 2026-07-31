# Debounce Module

## Overview

The debounce module delays a function until the user stops triggering it for a specified amount of time.

In GameBox, it prevents an API request from being sent on every keystroke. The search runs only after the user pauses typing.

## How It Connects to Other Files

* Imported by `main.js`.
* Receives the debounce delay from `config.js` through `main.js`.
* Wraps the search callback that eventually calls `performSearch()`.
* Provides a `cancel()` method used when the input changes, clears, or submits immediately.

## Key Features

* Delays callback execution.
* Clears the previous timer when called again.
* Uses a closure to preserve the timeout ID.
* Passes the latest arguments to the callback.
* Supports cancelling a pending callback.
* Validates the callback and delay values.

## Important Functions and Signatures

### `debounce(callback, delay)`

```js
const debouncedFunction = debounce(callback, delay);
```

Creates and returns a debounced version of the provided callback.

Every new call resets the timer, so only the latest call executes after the delay.

Example:

```js
const debouncedSearch = debounce((query) => {
  performSearch(query, 1);
}, 400);
```

---

### `debounced(...argumentsList)`

```js
debouncedSearch("Mario");
```

Schedules the callback using the latest arguments.

If another call happens before the delay finishes, the previous timer is cancelled and restarted.

---

### `debounced.cancel()`

```js
debouncedSearch.cancel();
```

Cancels a callback that is waiting to run.

GameBox uses this when the input is cleared or the form is submitted immediately.

## Basic Execution Flow

```text
1. main.js creates a debounced search function.
2. The user types in the search input.
3. The debounced function starts a timer.
4. Another keystroke clears the previous timer.
5. A new timer starts with the latest query.
6. The user stops typing.
7. The callback runs after the configured delay.
8. cancel() can stop the pending callback before it runs.
```
