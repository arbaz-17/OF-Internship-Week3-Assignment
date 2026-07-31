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

  function debounced(...argumentsList) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      callback(...argumentsList);
    }, delay);
  }

  debounced.cancel = function cancel() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}