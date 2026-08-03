const mockGames = [
  {
    id: 1,
    name: "F1 24",
    released: "2024-05-31",
    rating: 4.2,
    image:
      "https://media.rawg.io/media/games/123/f1-24.jpg",
    platforms: [
      "PC",
      "PlayStation 5",
      "Xbox Series X"
    ],
    genres: [
      "Racing",
      "Sports"
    ],
  },

  {
    id: 2,
    name: "Forza Horizon 5",
    released: "2021-11-09",
    rating: 4.5,
    image:
      "https://media.rawg.io/media/games/456/forza-horizon-5.jpg",
    platforms: [
      "PC",
      "Xbox One",
      "Xbox Series X"
    ],
    genres: [
      "Racing",
      "Open World"
    ],
  },

  {
    id: 3,
    name: "Gran Turismo 7",
    released: "2022-03-04",
    rating: 4.3,
    image:
      "https://media.rawg.io/media/games/789/gran-turismo-7.jpg",
    platforms: [
      "PlayStation 4",
      "PlayStation 5"
    ],
    genres: [
      "Racing",
      "Simulation"
    ],
  },

  {
    id: 4,
    name: "Elden Ring",
    released: "2022-02-25",
    rating: 4.6,
    image:
      "https://media.rawg.io/media/games/101/elden-ring.jpg",
    platforms: [
      "PC",
      "PlayStation 5",
      "Xbox Series X"
    ],
    genres: [
      "Action",
      "RPG"
    ],
  },

  {
    id: 5,
    name: "Cyberpunk 2077",
    released: "2020-12-10",
    rating: 4.1,
    image:
      "https://media.rawg.io/media/games/202/cyberpunk-2077.jpg",
    platforms: [
      "PC",
      "PlayStation 5",
      "Xbox Series X"
    ],
    genres: [
      "Action",
      "Adventure"
    ],
  },

  {
    id: 6,
    name: "The Witcher 3: Wild Hunt",
    released: "2015-05-18",
    rating: 4.7,
    image:
      "https://media.rawg.io/media/games/303/witcher-3.jpg",
    platforms: [
      "PC",
      "PlayStation",
      "Xbox",
      "Nintendo Switch"
    ],
    genres: [
      "RPG",
      "Adventure"
    ],
  },

  {
    id: 7,
    name: "Grand Theft Auto V",
    released: "2013-09-17",
    rating: 4.5,
    image:
      "https://media.rawg.io/media/games/404/gta-v.jpg",
    platforms: [
      "PC",
      "PlayStation",
      "Xbox"
    ],
    genres: [
      "Action",
      "Open World"
    ],
  },

  {
    id: 8,
    name: "Red Dead Redemption 2",
    released: "2018-10-26",
    rating: 4.8,
    image:
      "https://media.rawg.io/media/games/505/rdr2.jpg",
    platforms: [
      "PC",
      "PlayStation",
      "Xbox"
    ],
    genres: [
      "Action",
      "Adventure"
    ],
  },

  {
    id: 9,
    name: "Marvel's Spider-Man 2",
    released: "2023-10-20",
    rating: 4.4,
    image:
      "https://media.rawg.io/media/games/606/spiderman-2.jpg",
    platforms: [
      "PlayStation 5"
    ],
    genres: [
      "Action",
      "Adventure"
    ],
  },

  {
    id: 10,
    name: "Minecraft",
    released: "2011-11-18",
    rating: 4.5,
    image:
      "https://media.rawg.io/media/games/707/minecraft.jpg",
    platforms: [
      "PC",
      "Xbox",
      "PlayStation",
      "Nintendo Switch"
    ],
    genres: [
      "Sandbox",
      "Adventure"
    ],
  },

  {
    id: 11,
    name: "Counter Strike 2",
    released: "2023-09-27",
    rating: 4.2,
    image:
      "https://media.rawg.io/media/games/808/cs2.jpg",
    platforms: [
      "PC"
    ],
    genres: [
      "Shooter",
      "Competitive"
    ],
  },

  {
    id: 12,
    name: "Valorant",
    released: "2020-06-02",
    rating: 4.0,
    image:
      "https://media.rawg.io/media/games/909/valorant.jpg",
    platforms: [
      "PC"
    ],
    genres: [
      "Shooter",
      "Competitive"
    ],
  },
];


export function getMockGames(query, page = 1) {
  const normalizedQuery =
    query.trim().toLowerCase();


  const filteredGames =
    mockGames.filter((game) =>
      game.name
        .toLowerCase()
        .includes(normalizedQuery)
    );


  return {
    games: filteredGames,
    totalResults: filteredGames.length,
    totalPages: 1,
    currentPage: page,
    hasPrevious: false,
    hasNext: false,
  };
}