export function normalizeSearchQuery(query) {
  if (typeof query !== "string") {
    throw new TypeError("Search query must be a string");
  }

  return query.trim().toLowerCase();
}

export function createCacheKey({
  query,
  page,
  pageSize,
}) {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    throw new Error("Search query cannot be empty");
  }

  return `${normalizedQuery}|${page}|${pageSize}`;
}

export function createSearchCache() {
  const entries = new Map();

  function get(searchParameters) {
    const key = createCacheKey(searchParameters);

    return entries.get(key) ?? null;
  }

  function set(searchParameters, value) {
    const key = createCacheKey(searchParameters);

    entries.set(key, value);
  }

  return {
    get,
    set,
  };
}