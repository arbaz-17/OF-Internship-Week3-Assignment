export const mockGames = [
  {
    id: 1,
    title: "F1 24",
    release_date: "2024-05-31",
    thumbnail: null,
    platform: "PC",
    genre: "Racing",
  },

  {
    id: 2,
    title: "Forza Horizon 5",
    release_date: "2021-11-09",
    thumbnail: null,
    platform: "PC",
    genre: "Racing",
  },

  {
    id: 3,
    title: "Elden Ring",
    release_date: "2022-02-25",
    thumbnail: null,
    platform: "PC",
    genre: "RPG",
  },

  {
    id: 4,
    title: "Cyberpunk 2077",
    release_date: "2020-12-10",
    thumbnail: null,
    platform: "PC",
    genre: "Action",
  },

  {
    id: 5,
    title: "Grand Theft Auto V",
    release_date: "2013-09-17",
    thumbnail: null,
    platform: "PC",
    genre: "Action",
  },
];


export function getMockGames(query) {
  return mockGames.filter((game) =>
    game.title
      .toLowerCase()
      .includes(query.toLowerCase())
  );
}