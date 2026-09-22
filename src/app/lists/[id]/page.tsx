import { createClient } from '@/lib/supabase/server';
import { getMovieDetails } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { ListVideo, Lock, Globe, User } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const listId = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Listeyi ve oluşturan kişiyi (profiles) çek
  const { data: list, error } = await supabase
    .from('lists')
    .select('*, profiles(username, id)')
    .eq('id', listId)
    .single();

  if (error || !list) {
    notFound(); // Eğer liste gizliyse veya yoksa 404 sayfasına at (RLS koruması)
  }

  // Listedeki filmleri çek
  const { data: listMovies } = await supabase
    .from('list_movies')
    .select('tmdb_movie_id, added_at')
    .eq('list_id', listId)
    .order('added_at', { ascending: false });

  const movies = listMovies && listMovies.length > 0 
    ? await Promise.all(listMovies.map((lm: any) => getMovieDetails(String(lm.tmdb_movie_id))))
    : [];

  const isOwner = user?.id === list.user_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 min-h-screen">
      
      {/* Liste Başlığı */}
      <header className="glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl text-center max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#d4af37]/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#0b0c10] border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <ListVideo className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            {list.title}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
            {list.description || 'Bu liste için açıklama girilmemiş.'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <User className="w-4 h-4 text-gray-400" />
              Oluşturan: <span className="text-white">{list.profiles?.username || 'Kullanıcı'}</span>
            </span>
            <span className={`flex items-center gap-2 px-4 py-2 rounded-full border ${list.is_public ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {list.is_public ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {list.is_public ? 'Herkese Açık' : 'Gizli Liste'}
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-white">
              {movies.length} Film
            </span>
          </div>
        </div>
      </header>

      {/* Filmler */}
      <section>
        {movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Bu listede henüz hiç film yok.</p>
            {isOwner && (
              <p className="text-gray-400 mt-2">Film detay sayfalarına gidip "Listeye Ekle" butonuyla bu listeye film ekleyebilirsin.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
