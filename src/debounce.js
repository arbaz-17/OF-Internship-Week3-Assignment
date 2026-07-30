export function debounce(callback, delay) {
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function");
  }

  if (!Number.isFinite(delay) || delay < 0) {
    throw new RangeError(
      "Delay must be a non-negative finite number"
    );
  }

  let timeoutId = null;
  let latestArguments = [];
  let latestContext = null;

  function debounced(...argumentsList) {
    latestArguments = argumentsList;
    latestContext = this;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;

      callback.apply(latestContext, latestArguments);

      latestArguments = [];
      latestContext = null;
    }, delay);
  }

  debounced.cancel = function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = null;
    latestArguments = [];
    latestContext = null;
  };

  debounced.flush = function flush() {
    if (timeoutId === null) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = null;

    callback.apply(latestContext, latestArguments);

    latestArguments = [];
    latestContext = null;
  };

  return debounced;
}