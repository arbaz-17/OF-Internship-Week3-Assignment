export function getMockGames(query) {
  const games = [
    {
      id: 1,
      name: "F1 24",
      released: "2024-05-31",
      rating: 4.2,
      image: null,
      platforms: ["PC", "PlayStation 5"],
      genres: ["Racing"],
    },
    {
      id: 2,
      name: "Elden Ring",
      released: "2022-02-25",
      rating: 4.6,
      image: null,
      platforms: ["PC", "PlayStation"],
      genres: ["RPG"],
    },
    {
      id: 3,
      name: "Cyberpunk 2077",
      released: "2020-12-10",
      rating: 4.1,
      image: null,
      platforms: ["PC", "Xbox"],
      genres: ["Action"],
    },
  ];

  const filteredGames = games.filter((game) =>
    game.name
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return {
    games: filteredGames,
    totalResults: filteredGames.length,
    totalPages: 1,
    currentPage: 1,
    hasPrevious: false,
    hasNext: false,
  };
}