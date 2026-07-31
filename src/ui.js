function getRequiredElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }

  return element;
}

const elements = {
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

export function clearResults() {
  elements.gamesGrid.replaceChildren();
  elements.resultsSummary.textContent = "";
  elements.resultsSection.hidden = true;
}

export function hidePagination() {
  elements.pagination.hidden = true;
}

function resetView() {
  hideStatusMessages();
  clearResults();
  hidePagination();
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

    image.addEventListener(
      "error",
      () => {
        mediaContainer.textContent = "No image available";
      },
      {
        once: true,
      },
    );

    mediaContainer.append(image);
  } else {
    mediaContainer.textContent = "No image available";
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
    createMetadataItem("Genres", game.genres.join(", ")),
  );

  content.append(title, metadata);
  card.append(mediaContainer, content);

  return card;
}

function createSkeletonCard() {
  const card = document.createElement("article");
  card.className = "game-card game-card--skeleton";

  const media = document.createElement("div");
  media.className = "skeleton skeleton--media";

  const content = document.createElement("div");
  content.className = "game-card__content";

  const title = document.createElement("div");
  title.className = "skeleton skeleton--title";

  const lineOne = document.createElement("div");
  lineOne.className = "skeleton skeleton--line";

  const lineTwo = document.createElement("div");
  lineTwo.className = "skeleton skeleton--line skeleton--short";

  const lineThree = document.createElement("div");
  lineThree.className = "skeleton skeleton--line";

  content.append(title, lineOne, lineTwo, lineThree);

  card.append(media, content);

  return card;
}

function renderSkeletons(count = 6) {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    fragment.append(createSkeletonCard());
  }

  elements.gamesGrid.replaceChildren(fragment);
}

export function renderGames(games) {
  const fragment = document.createDocumentFragment();

  games.forEach((game) => {
    fragment.append(createGameCard(game));
  });

  elements.gamesGrid.replaceChildren(fragment);
}

export function showInitialState(
  message = "Start typing a game title to discover games.",
) {
  resetView();

  elements.initialState.textContent = message;
  elements.initialState.hidden = false;
}

export function showLoadingState(query) {
  resetView();

  elements.loadingState.textContent = query
    ? `Searching the game library for “${query}”...`
    : "Searching the game library...";

  elements.loadingState.hidden = false;

  elements.resultsSummary.textContent = "Loading results...";
  elements.resultsSection.hidden = false;

  renderSkeletons();
}

export function showErrorState(
  message = "We could not load the games. Please try again.",
) {
  resetView();

  elements.errorState.textContent = message;
  elements.errorState.hidden = false;
}

export function showEmptyState(query) {
  resetView();

  elements.emptyState.textContent = query
    ? `No matching games were found for “${query}”.`
    : "No matching games were found.";

  elements.emptyState.hidden = false;
}

export function showResults(
  games,
  summary,
  fromCache = false
) {
  hideStatusMessages();
  renderGames(games);

  elements.resultsSummary.textContent = summary;

  if (fromCache) {
    const cacheLabel = document.createElement("strong");
    cacheLabel.className = "cache-label";
    cacheLabel.textContent = " · Cached result";

    elements.resultsSummary.append(cacheLabel);
  }

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
