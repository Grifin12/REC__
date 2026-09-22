import { createClient } from '@/lib/supabase/server';
import { getMovieDetails } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { Heart } from 'lucide-react';

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: interactions } = await supabase
    .from('movie_interactions')
    .select('tmdb_movie_id')
    .eq('user_id', user.id)
    .eq('is_favourite', true)
    .order('updated_at', { ascending: false });

  const movies = interactions && interactions.length > 0 
    ? await Promise.all(interactions.map((i: any) => getMovieDetails(String(i.tmdb_movie_id))))
    : [];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-white uppercase tracking-wider border-l-4 border-orange-500 pl-3">
        Favori Filmlerin
      </h2>

      {movies.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center border border-white/10 flex flex-col items-center justify-center">
          <Heart className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400">Favorilerine henüz bir film eklemedin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies.map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
