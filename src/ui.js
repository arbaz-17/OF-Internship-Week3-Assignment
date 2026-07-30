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

export function renderGames(games, container) {
  const fragment = document.createDocumentFragment();

  games.forEach((game) => {
    fragment.append(createGameCard(game));
  });

  container.replaceChildren(fragment);
}