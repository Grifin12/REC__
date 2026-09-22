const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
const ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function fetchFromTMDB<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;
  
  const url = new URL(`${TMDB_API_BASE_URL}${endpoint}`);
  
  url.searchParams.append('language', 'tr-TR');
  url.searchParams.append('api_key', API_KEY || '');
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      ...init.headers,
    },
    next: { revalidate: 3600, ...init.next },
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} - ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getTrendingMovies() {
  return fetchFromTMDB<any>('/trending/movie/day');
}

export async function getPopularMovies() {
  return fetchFromTMDB<any>('/movie/popular');
}

export async function getTopRatedMovies() {
  return fetchFromTMDB<any>('/movie/top_rated');
}

export async function searchMovies(query: string, page: number = 1) {
  return fetchFromTMDB<any>('/search/movie', {
    params: { query, include_adult: false, page },
    next: { revalidate: 0 }, 
  });
}

export async function discoverMovies(params: Record<string, string | number>) {
  return fetchFromTMDB<any>('/discover/movie', { 
    params,
    next: { revalidate: 0 } 
  });
}

// YENİ EKLENENLER: Epic 3 - Film Detay Sayfası için

export async function getMovieDetails(id: string) {
  return fetchFromTMDB<any>(`/movie/${id}`, {
    params: { append_to_response: 'videos,credits' }
  });
}

export async function getRecommendationsForMovie(movieId: string | number) {
  return fetchFromTMDB<any>(`/movie/${movieId}/recommendations`);
}

