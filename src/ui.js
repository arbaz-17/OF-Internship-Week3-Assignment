function getRequiredElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element;
}

const elements = {
    statusRegion: getRequiredElement("#status-region"),
  initialState: getRequiredElement("#initial-state"),
  loadingState: getRequiredElement("#loading-state"),
  errorState: getRequiredElement("#error-state"),
  emptyState: getRequiredElement("#empty-state"),
  resultsSection: getRequiredElement("#results-section"),
  resultsSummary: getRequiredElement("#results-summary"),
  gamesGrid: getRequiredElement("#games-grid"),
  pagination: getRequiredElement("#pagination"),
  previousPage: getRequiredElement("#previous-page"),
  nextPage: getRequiredElement("#next-page"),
  currentPage: getRequiredElement("#current-page"),
  totalPages: getRequiredElement("#total-pages"),
};

function hideStatusMessages() {
  elements.initialState.hidden = true;
  elements.loadingState.hidden = true;
  elements.errorState.hidden = true;
  elements.emptyState.hidden = true;
}

function setBusyState(isBusy) {
  elements.statusRegion.setAttribute(
    "aria-busy",
    String(isBusy)
  );

  elements.resultsSection.setAttribute(
    "aria-busy",
    String(isBusy)
  );
}

function createMetadataItem(label, value) {
  const item = document.createElement("li");

  const labelElement = document.createElement("span");
  labelElement.className = "game-card__label";
  labelElement.textContent = `${label}:`;

  const valueElement = document.createElement("span");
  valueElement.textContent = value || "Not available";

  item.append(labelElement, valueElement);

  return item;
}

function createCoverPlaceholder(gameName) {
  const placeholder = document.createElement("div");

  placeholder.className = "game-card__placeholder";
  placeholder.setAttribute("role", "img");
  placeholder.setAttribute(
    "aria-label",
    `Cover placeholder for ${gameName}`
  );

  placeholder.textContent = gameName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return placeholder;
}

export function createGameCard(game) {
  const card = document.createElement("article");
  card.className = "game-card";

  const mediaContainer = document.createElement("div");
  mediaContainer.className = "game-card__media";

if (game.image) {
  const image = document.createElement("img");

  image.src = game.image;
  image.alt = `${game.name} cover`;
  image.loading = "lazy";
  image.decoding = "async";

  image.addEventListener(
    "error",
    () => {
      const placeholder = createCoverPlaceholder(game.name);

      image.replaceWith(placeholder);
    },
    {
      once: true,
    }
  );

  mediaContainer.append(image);
} else {
  mediaContainer.append(createCoverPlaceholder(game.name));
}

  const content = document.createElement("div");
  content.className = "game-card__content";

  const title = document.createElement("h3");
  title.textContent = game.name;

  const metadata = document.createElement("ul");
  metadata.className = "game-card__metadata";

  metadata.append(
    createMetadataItem("Released", game.released),
    createMetadataItem("Rating", `${game.rating} / 5`),
    createMetadataItem("Platforms", game.platforms.join(", ")),
    createMetadataItem("Genres", game.genres.join(", "))
  );

  content.append(title, metadata);
  card.append(mediaContainer, content);

  return card;
}

export function renderGames(games) {
  const fragment = document.createDocumentFragment();

  games.forEach((game) => {
    fragment.append(createGameCard(game));
  });

  elements.gamesGrid.replaceChildren(fragment);
}

export function clearResults() {
  elements.gamesGrid.replaceChildren();
  elements.resultsSummary.textContent = "";
  elements.resultsSection.hidden = true;
}

export function hidePagination() {
  elements.pagination.hidden = true;
}

export function showInitialState(
  message = "Start typing a game title to discover games."
) {
  hideStatusMessages();
  clearResults();
  hidePagination();
  setBusyState(false);

  elements.initialState.textContent = message;
  elements.initialState.hidden = false;
}

export function showLoadingState(query) {
  hideStatusMessages();
  clearResults();
  hidePagination();
  setBusyState(true);

  elements.loadingState.textContent = query
    ? `Searching the game library for “${query}”...`
    : "Searching the game library...";

  elements.loadingState.hidden = false;
}


export function showErrorState(
  message = "We could not load the games. Please try again."
) {
  hideStatusMessages();
  clearResults();
  hidePagination();
  setBusyState(false);

  elements.errorState.textContent = message;
  elements.errorState.hidden = false;
}

export function showEmptyState(query) {
  hideStatusMessages();
  clearResults();
  hidePagination();
  setBusyState(false);

  elements.emptyState.textContent = query
    ? `No matching games were found for “${query}”.`
    : "No matching games were found.";

  elements.emptyState.hidden = false;
}

export function showResults(games, summary) {
  hideStatusMessages();
  setBusyState(false);

  renderGames(games);

  elements.resultsSummary.textContent = summary;
  elements.resultsSection.hidden = false;
}

export function updatePagination({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
}) {
  elements.currentPage.textContent = String(currentPage);
  elements.totalPages.textContent = String(totalPages);

  elements.previousPage.disabled = !hasPrevious;
  elements.nextPage.disabled = !hasNext;

  elements.pagination.hidden = totalPages <= 1;
}