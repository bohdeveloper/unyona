const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}`);

  if (!response.ok) {
    throw new Error(`Error TMDB: ${response.status}`);
  }

  return response.json();
}

export async function searchMovie(title: string) {
  return tmdbFetch(
    `/search/movie?query=${encodeURIComponent(title)}&language=es-ES`
  );
}
