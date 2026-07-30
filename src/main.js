import { renderGames } from "./ui.js";

const gamesGrid = document.querySelector("#games-grid");
const resultsSummary = document.querySelector("#results-summary");
const initialState = document.querySelector("#initial-state");

const sampleGames = [
  {
    id: 1,
    name: "Elden Ring",
    released: "2022-02-25",
    rating: 4.4,
    platforms: ["PC", "PlayStation", "Xbox"],
    genres: ["Action", "RPG"],
    image: null,
  },
  {
    id: 2,
    name: "Hades",
    released: "2020-09-17",
    rating: 4.3,
    platforms: ["PC", "Nintendo Switch"],
    genres: ["Action", "Indie"],
    image: null,
  },
  {
    id: 3,
    name: "Forza Horizon 5",
    released: "2021-11-09",
    rating: 4.3,
    platforms: ["PC", "Xbox"],
    genres: ["Racing"],
    image: null,
  },
  {
    id: 4,
    name: "Stardew Valley",
    released: "2016-02-26",
    rating: 4.4,
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    genres: ["Simulation", "Indie"],
    image: null,
  },
];

if (!gamesGrid || !resultsSummary || !initialState) {
  throw new Error("Required application elements were not found");
}

initialState.hidden = true;
resultsSummary.textContent = `${sampleGames.length} preview games`;

renderGames(sampleGames, gamesGrid);

console.log("Video Game Discovery Library initialized");