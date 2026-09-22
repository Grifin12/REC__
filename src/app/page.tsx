import { Film, Sparkles, Flame, Clock, Brain, Trophy, Users, Heart } from 'lucide-react';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, discoverMovies, getRecommendationsForMovie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { createClient } from '@/lib/supabase/server';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import RobotCharacter from '@/components/RobotCharacter';

// Yeniden kullanılabilir yatay liste bileşeni (Rail)
function MovieRail({ title, icon: Icon, movies, linkUrl, linkText = "Tümünü Gör →" }: { title: string, icon: any, movies: any[], linkUrl?: string, linkText?: string }) {
  if (!movies || movies.length === 0) return null;
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white border-l-4 border-[#d4af37] pl-3 flex items-center gap-2">
          <Icon className="w-5 h-5 text-[#d4af37]" /> {title}
        </h2>
        {linkUrl && (
          <Link href={linkUrl} className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            {linkText}
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  // Bütün filmleri paralel olarak çek (Performans için Promise.all)
  const [trendingRes, popularRes, topRatedRes, mysteryRes, shortRes] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    discoverMovies({ with_genres: '53,9648', sort_by: 'popularity.desc' }), // Gerilim ve Gizem
    discoverMovies({ 'with_runtime.lte': 90, sort_by: 'popularity.desc' })  // 90 DK Altı
  ]);
  
  const trendingMovies = trendingRes.results?.slice(0, 5) || [];
  const popularMovies = popularRes.results?.slice(0, 5) || [];
  const topRatedMovies = topRatedRes.results?.slice(0, 5) || [];
  const mysteryMovies = mysteryRes.results?.slice(0, 5) || [];
  const shortMovies = shortRes.results?.slice(0, 5) || [];

  // Kullanıcıya özel öneriler (Giriş yapılmışsa)
  let user = null;
  let recommendedMovies: any[] = [];
  let lovedMoviesRecommendations: any[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    
    if (user) {
      // Kullanıcının en son izlediği filmi bul
      const { data: watched } = await supabase
        .from('movie_interactions')
        .select('tmdb_movie_id')
        .eq('user_id', user.id)
        .eq('is_watched', true)
        .order('updated_at', { ascending: false })
        .limit(1);
        
      if (watched && watched.length > 0) {
        const recRes = await getRecommendationsForMovie(watched[0].tmdb_movie_id);
        recommendedMovies = recRes.results?.slice(0, 5) || [];
      }

      // Kullanıcının yüksek puan verdiği veya favoriye aldığı son filmi bul
      const { data: loved } = await supabase
        .from('movie_interactions')
        .select('tmdb_movie_id')
        .eq('user_id', user.id)
        .or('is_favourite.eq.true,rating.gte.8')
        .order('updated_at', { ascending: false })
        .limit(1);
        
      if (loved && loved.length > 0) {
        const lovedRes = await getRecommendationsForMovie(loved[0].tmdb_movie_id);
        lovedMoviesRecommendations = lovedRes.results?.slice(0, 5) || [];
      }
    }
  } catch (error) {
    console.log("Supabase yapılandırılmadı.");
  }

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION - Gelişmiş NLP Arama Merkezi */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 -mt-16 pt-32 pb-16 overflow-hidden">
        {/* Arka plan ışık efektleri */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#d4af37]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="mb-8 mt-12 flex items-center justify-center h-[180px] sm:h-[220px]">
          <RobotCharacter className="mx-auto transform scale-[0.6] sm:scale-75 md:scale-90 origin-bottom" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 text-white text-balance mt-4">
          Bu Akşam Ne İzlemek İstiyorsun?
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mb-12 text-balance font-medium">
          "90 dakikadan kısa, sonu şaşırtan bir uzay filmi" gibi doğal cümleler kur. 
          Yapay zeka asistanı senin için en uygun filmleri saniyeler içinde bulsun.
        </p>

        {/* Ana Arama Çubuğu */}
        <div className="w-full max-w-4xl relative z-20">
          <SearchBar />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Rail 1: Şu An Popüler */}
        <MovieRail title="🔥 Şu An Popüler" icon={Flame} movies={popularMovies} linkUrl="/explore?sort=popular" />

        {/* Rail 2: Sana Özel */}
        {user && recommendedMovies.length > 0 && (
          <MovieRail title="✨ Sana Özel" icon={Sparkles} movies={recommendedMovies} linkUrl="/for-you" />
        )}

        {/* Rail 3: Sevdiğin Filmlere Göre */}
        {user && lovedMoviesRecommendations.length > 0 && (
          <MovieRail title="🎯 Sevdiğin Filmlere Göre" icon={Heart} movies={lovedMoviesRecommendations} />
        )}

        {/* Rail 4: Sonu Şaşırtan Filmler */}
        <MovieRail title="🤯 Sonu Şaşırtan Filmler" icon={Brain} movies={mysteryMovies} linkUrl="/explore?genres=53,9648" />

        {/* Rail 5: 90 Dakikadan Kısa */}
        <MovieRail title="⏱️ 90 Dakikadan Kısa" icon={Clock} movies={shortMovies} linkUrl="/explore?runtime=90" />

        {/* Rail 6: En Yüksek Puanlı */}
        <MovieRail title="🏆 En Yüksek Puanlı" icon={Trophy} movies={topRatedMovies} linkUrl="/explore?sort=top_rated" />

        {/* Rail 7: Toplulukta Trend */}
        <MovieRail title="🌟 Toplulukta Trend" icon={Users} movies={trendingMovies} linkUrl="/trending" />

        {/* Rail 8: Ruh Haline Göre (Kategori Kartları) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white border-l-4 border-purple-500 pl-3 flex items-center gap-2">
              🎭 Ruh Haline Göre
            </h2>
            <Link href="/mood" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
              Hepsini Gör →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '😊', label: 'Eğlenceli', color: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20 text-yellow-500' },
              { emoji: '😢', label: 'Duygusal', color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-500' },
              { emoji: '😨', label: 'Gerilimli', color: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-500' },
              { emoji: '🤯', label: 'Beyin Yakan', color: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-500' },
            ].map((mood, idx) => (
              <Link key={idx} href={`/search?q=${mood.label.toLowerCase()}`} className={`glass p-6 rounded-2xl flex flex-col items-center justify-center gap-3 border transition-all ${mood.color}`}>
                <span className="text-4xl">{mood.emoji}</span>
                <span className="font-bold tracking-wider">{mood.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}
