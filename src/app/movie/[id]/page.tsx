import Image from 'next/image';
import { Suspense } from 'react';
import { getMovieDetails } from '@/lib/tmdb';
import { Star, Clock, Calendar, Film as FilmIcon } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import { createClient } from '@/lib/supabase/server';
import MovieInteractions from '@/components/MovieInteractions';
import ReviewSection from '@/components/ReviewSection';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const movie = await getMovieDetails(resolvedParams.id);
  const imageUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '';
  
  return {
    title: `${movie.title} | RECON`,
    description: movie.overview,
    openGraph: {
      title: `${movie.title} | RECON`,
      description: movie.overview,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const movie = await getMovieDetails(resolvedParams.id);
  
  let user = null;
  let supabase = null;
  let reviews = [];

  try {
    supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    // Film yorumlarını çek (Herkes görebilir)
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*, profiles(username, id)')
      .eq('tmdb_movie_id', movie.id)
      .order('created_at', { ascending: false });
    
    if (reviewsData) reviews = reviewsData;

  } catch(e) {}
  
  let initialState = null;
  let userLists: any[] = [];
  
  if (user && supabase) {
    // 1. Film etkileşimleri
    const { data } = await supabase
      .from('movie_interactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('tmdb_movie_id', movie.id)
      .single();
    if (data) initialState = data;

    // 2. Kullanıcının listeleri
    const { data: listsData } = await supabase
      .from('lists')
      .select('id, title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (listsData) userLists = listsData;
  }

  const backdropPath = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
    
  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const director = movie.credits?.crew?.find((c: any) => c.job === 'Director')?.name;
  const cast = movie.credits?.cast?.slice(0, 5) || [];
  
  // YouTube Fragman
  const trailer = movie.videos?.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');

  return (
    <article className="relative min-h-screen">
      {/* Arka Plan (Backdrop) Blur Efekti */}
      {backdropPath && (
        <figure className="absolute inset-0 -z-10 h-[70vh] w-full m-0">
          <Image 
            src={backdropPath} 
            alt="Backdrop" 
            fill 
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
        </figure>
      )}

      <div className="max-w-6xl mx-auto pt-12 md:pt-24 flex flex-col md:flex-row gap-12 px-4">
        
        {/* Sol Kolon (Poster ve Sosyal Etkileşimler) */}
        <aside className="w-full md:w-1/3 space-y-6 shrink-0">
          <figure className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 m-0">
            {posterPath ? (
              <Image src={posterPath} alt={movie.title} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">Afiş Yok</div>
            )}
          </figure>
          
          <MovieInteractions movieId={movie.id} initialState={initialState} userLists={userLists} />
        </aside>

        {/* Sağ Kolon (Film Detayları) */}
        <section className="w-full md:w-2/3 space-y-8">
          <header>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#d4af37] font-semibold tracking-widest">
              <span>{movie.release_date?.substring(0, 4)}</span>
              <span>•</span>
              <span>Yönetmen: {director || 'Bilinmiyor'}</span>
              <span>•</span>
              <span>{movie.runtime} dk</span>
            </div>
          </header>

          {/* Türler */}
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((g: any) => (
              <span key={g.id} className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium border border-white/5">
                {g.name}
              </span>
            ))}
          </div>

          {/* Özet */}
          <div>
            <h3 className="text-xl font-bold mb-3 border-l-4 border-[#d4af37] pl-3">Özet</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {movie.overview || 'Bu film için özet bulunmuyor.'}
            </p>
          </div>

          {/* Oyuncular */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-l-4 border-cyan-400 pl-3">Oyuncular</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {cast.map((actor: any) => (
                <div key={actor.id} className="text-center">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 bg-gray-800">
                    {actor.profile_path && (
                      <Image 
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                        alt={actor.name} 
                        fill 
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-1">{actor.name}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fragman */}
          {trailer && (
            <div>
              <h3 className="text-xl font-bold mb-4 border-l-4 border-red-500 pl-3">Fragman</h3>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Yorumlar (Sosyal Bölüm) */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <ReviewSection movieId={movie.id} userId={user?.id} initialReviews={reviews || []} />
      </div>
    </article>
  );
}
