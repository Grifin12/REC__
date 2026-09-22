import { discoverMovies } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { Filter, SlidersHorizontal, Film } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Keşfet | RECON',
  description: 'Gelişmiş filtreleme ile aradığın filmi nokta atışı bul.',
};

// Basit Genre Listesi (TMDB Standart)
const genres = [
  { id: 28, name: 'Aksiyon' },
  { id: 12, name: 'Macera' },
  { id: 16, name: 'Animasyon' },
  { id: 35, name: 'Komedi' },
  { id: 80, name: 'Suç' },
  { id: 99, name: 'Belgesel' },
  { id: 18, name: 'Dram' },
  { id: 10751, name: 'Aile' },
  { id: 14, name: 'Fantastik' },
  { id: 36, name: 'Tarih' },
  { id: 27, name: 'Korku' },
  { id: 10402, name: 'Müzik' },
  { id: 9648, name: 'Gizem' },
  { id: 10749, name: 'Romantik' },
  { id: 878, name: 'Bilim Kurgu' },
  { id: 53, name: 'Gerilim' },
  { id: 10752, name: 'Savaş' },
  { id: 37, name: 'Vahşi Batı' },
];

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  
  // URL'den parametreleri al
  const selectedGenre = params.genre as string;
  const sort = (params.sort as string) || 'popularity.desc';
  const minRating = params.rating as string;
  const year = params.year as string;

  // TMDB API için Query objesi oluştur
  const apiParams: Record<string, string | number> = {
    sort_by: sort,
  };

  if (selectedGenre) apiParams['with_genres'] = selectedGenre;
  if (minRating) apiParams['vote_average.gte'] = minRating;
  if (year) apiParams['primary_release_year'] = year;

  // 3 sayfa (60 film) birden çekelim
  const [res1, res2, res3] = await Promise.all([
    discoverMovies({ ...apiParams, page: 1 }),
    discoverMovies({ ...apiParams, page: 2 }),
    discoverMovies({ ...apiParams, page: 3 })
  ]);
  const allMovies = [...(res1.results || []), ...(res2.results || []), ...(res3.results || [])];

  const uniqueMoviesMap = new Map();
  allMovies.forEach((m: any) => {
    if (!uniqueMoviesMap.has(m.id)) {
      uniqueMoviesMap.set(m.id, m);
    }
  });
  const movies = Array.from(uniqueMoviesMap.values());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="p-3 glass rounded-xl">
          <SlidersHorizontal className="w-8 h-8 text-[#d4af37]" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">Detaylı Keşif</h1>
          <p className="text-gray-400 text-sm">Gelişmiş filtrelerle tam aradığın filmi bul.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sol Kolon - Filtreler (Server-side Form Submit) */}
        <aside className="w-full md:w-1/4 shrink-0">
          <form method="GET" action="/explore" className="glass p-6 rounded-2xl border border-white/10 space-y-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#d4af37]" />
              <h2 className="text-lg font-bold text-white">Filtreler</h2>
            </div>

            {/* Tür */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Tür</label>
              <select name="genre" defaultValue={selectedGenre || ''} className="w-full bg-[#0b0c10] border border-white/10 rounded-lg p-2 text-white focus:border-[#d4af37] focus:outline-none">
                <option value="">Tümü</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Sıralama</label>
              <select name="sort" defaultValue={sort} className="w-full bg-[#0b0c10] border border-white/10 rounded-lg p-2 text-white focus:border-[#d4af37] focus:outline-none">
                <option value="popularity.desc">En Popüler</option>
                <option value="vote_average.desc">En Yüksek Puanlı</option>
                <option value="primary_release_date.desc">En Yeniler</option>
                <option value="revenue.desc">En Çok Hasılat Yapanlar</option>
              </select>
            </div>

            {/* Yıl */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Yıl</label>
              <input 
                type="number" 
                name="year" 
                defaultValue={year || ''} 
                placeholder="Örn: 2023"
                className="w-full bg-[#0b0c10] border border-white/10 rounded-lg p-2 text-white focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {/* Minimum Puan */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Minimum Puan (0-10)</label>
              <input 
                type="number" 
                name="rating" 
                min="0" max="10" step="0.1"
                defaultValue={minRating || ''} 
                placeholder="Örn: 7.5"
                className="w-full bg-[#0b0c10] border border-white/10 rounded-lg p-2 text-white focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-[#d4af37] text-black font-bold rounded-lg hover:bg-[#b5952f] transition mt-4">
              Sonuçları Göster
            </button>
            <Link href="/explore" className="block text-center text-sm text-gray-500 hover:text-white mt-2">
              Filtreleri Temizle
            </Link>
          </form>
        </aside>

        {/* Sağ Kolon - Film Grid */}
        <main className="w-full md:w-3/4">
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="glass p-12 rounded-2xl text-center border border-white/10 flex flex-col items-center justify-center h-64">
              <Film className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400">Bu filtrelere uygun film bulunamadı.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
