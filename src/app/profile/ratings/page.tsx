import { createClient } from '@/lib/supabase/server';
import { getMovieDetails } from '@/lib/tmdb';
import { Star, Film } from 'lucide-react';
import Link from 'next/link';

export default async function RatingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: interactions } = await supabase
    .from('movie_interactions')
    .select('tmdb_movie_id, rating')
    .eq('user_id', user.id)
    .not('rating', 'is', null)
    .order('updated_at', { ascending: false });

  let ratedMovies: any[] = [];
  if (interactions && interactions.length > 0) {
    const movieDetails = await Promise.all(interactions.map((i: any) => getMovieDetails(String(i.tmdb_movie_id))));
    ratedMovies = movieDetails.map((movie, index) => ({
      ...movie,
      userRating: interactions[index].rating
    }));
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-white uppercase tracking-wider border-l-4 border-cyan-500 pl-3">
        Puanlamaların
      </h2>

      {ratedMovies.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center border border-white/10 flex flex-col items-center justify-center">
          <Star className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400">Henüz hiçbir filme puan vermedin.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {ratedMovies.map((movie: any) => (
            <div key={movie.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-16 h-24 rounded-lg bg-gray-900 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden relative">
                  {movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <Film className="w-6 h-6 text-gray-700" />
                  )}
                </div>
                <div>
                  <Link href={`/movie/${movie.id}`} className="text-xl text-white font-bold hover:text-[#d4af37] transition-colors">
                    {movie.title}
                  </Link>
                  <p className="text-gray-400 text-sm mt-1">{movie.release_date?.substring(0, 4)}</p>
                </div>
              </div>
              <div className="flex flex-col items-center bg-[#0b0c10] p-4 rounded-xl border border-white/5 min-w-[100px]">
                <Star className="w-8 h-8 text-cyan-400 mb-2 fill-cyan-400/20" />
                <span className="text-2xl font-black text-white">{movie.userRating}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
