import { showInitialState } from "./ui.js";

const searchForm = document.querySelector("#search-form");

if (!searchForm) {
  throw new Error("Search form was not found");
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

showInitialState();

console.log("Video Game Discovery Library initialized");