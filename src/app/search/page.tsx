import { parseMovieQuery } from '@/lib/parseMovieQuery';
import { discoverMovies, searchMovies } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { Search, Sparkles } from 'lucide-react';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q;

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-screen">
        <h1 className="text-3xl font-black text-white">Lütfen bir arama terimi girin.</h1>
      </div>
    );
  }

  // NLP Parse (Doğal Dil Analizi)
  const parsed = parseMovieQuery(query);
  
  let movies = [];
  let isAiSearch = false;
  
  if (parsed.isDiscover) {
    isAiSearch = true;
    const queryParams = {
      sort_by: 'popularity.desc',
      include_adult: 'false',
      include_video: 'false',
      page: '1',
      ...parsed.params
    };
    
    // 3 sayfa (60 film) çekip birleştirelim
    const [res1, res2, res3] = await Promise.all([
      discoverMovies({ ...queryParams, page: '1' } as any),
      discoverMovies({ ...queryParams, page: '2' } as any),
      discoverMovies({ ...queryParams, page: '3' } as any)
    ]);
    
    movies = [...(res1.results || []), ...(res2.results || []), ...(res3.results || [])];
  } else {
    // Normal metin araması
    const [res1, res2] = await Promise.all([
      searchMovies(query, 1),
      searchMovies(query, 2)
    ]);
    movies = [...(res1.results || []), ...(res2.results || [])];
  }

  // Duplicate key (aynı filmin birden fazla gelmesi) hatasını engellemek için benzersiz filtreleme:
  const uniqueMoviesMap = new Map();
  movies.forEach((m: any) => {
    if (!uniqueMoviesMap.has(m.id)) {
      uniqueMoviesMap.set(m.id, m);
    }
  });
  movies = Array.from(uniqueMoviesMap.values());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-12">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-2 font-semibold">
              <Search className="w-5 h-5" />
              <span>Arama Sonuçları</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white">
              "{query}"
            </h1>
          </div>
          
          {isAiSearch && (
            <div className="glass px-4 py-3 rounded-xl border border-cyan-500/20 max-w-sm">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">RECON Zeka Analizi</span>
              </div>
              <p className="text-xs text-gray-300">
                Aramanızdaki gizli türler, ruh halleri ve yıllar tespit edilerek akıllı filtreleme uygulandı.
              </p>
            </div>
          )}
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          Bu kriterlere uygun film bulunamadı. Lütfen başka bir ruh hali veya kelime dene.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
