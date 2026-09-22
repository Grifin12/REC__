import { createClient } from '@/lib/supabase/server';
import { getMovieDetails } from '@/lib/tmdb';
import Link from 'next/link';
import { Users, MessageSquare, ListVideo, User, Star } from 'lucide-react';
import Image from 'next/image';

export default async function CommunityPage() {
  const supabase = await createClient();

  // 1. En son yapılan 5 film yorumunu (reviews) çek
  const { data: latestReviews } = await supabase
    .from('reviews')
    .select('*, profiles(username, id)')
    .order('created_at', { ascending: false })
    .limit(5);

  // 2. En son oluşturulan 4 Herkese Açık listeyi çek
  const { data: latestLists } = await supabase
    .from('lists')
    .select('*, profiles(username, id), list_movies(count)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(4);

  // Yorumlar için TMDB'den film isimlerini ve posterlerini paralel çek
  const reviewsWithMovies = latestReviews && latestReviews.length > 0 
    ? await Promise.all(latestReviews.map(async (review) => {
        const movie = await getMovieDetails(String(review.tmdb_movie_id));
        return { ...review, movie };
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 min-h-screen">
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-[#d4af37]/10 rounded-2xl mb-2">
          <Users className="w-12 h-12 text-[#d4af37]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Topluluk Akışı</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">RECON sinema ağındaki en son etkinlikleri, incelemeleri ve kullanıcı listelerini keşfet.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Son İncelemeler */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Son İncelemeler</h2>
          </div>

          <div className="space-y-4">
            {reviewsWithMovies.map((item) => (
              <div key={item.id} className="glass p-5 rounded-2xl border border-white/5 flex gap-4 hover:bg-white/5 transition">
                <Link href={`/movie/${item.tmdb_movie_id}`} className="shrink-0">
                  <div className="w-16 h-24 bg-gray-900 rounded-lg overflow-hidden relative border border-white/10">
                    {item.movie.poster_path && (
                      <Image 
                        src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`} 
                        alt={item.movie.title} 
                        fill 
                        className="object-cover" 
                      />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Link href={`/movie/${item.tmdb_movie_id}`} className="font-bold text-white truncate hover:text-[#d4af37]">
                      {item.movie.title} <span className="text-gray-500 font-normal text-xs ml-1">({item.movie.release_date?.substring(0,4)})</span>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3 h-3 text-gray-500" />
                    <Link href={`/users/${item.profiles?.username}`} className="text-xs font-semibold text-gray-400 hover:text-white transition">
                      {item.profiles?.username}
                    </Link>
                  </div>

                  {item.has_spoilers ? (
                    <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">Spoiler İçeriyor</span>
                  ) : (
                    <p className="text-sm text-gray-300 line-clamp-2">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Yeni Topluluk Listeleri */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <ListVideo className="w-6 h-6 text-pink-500" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Keşfedilen Listeler</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {latestLists?.map((list) => (
              <Link key={list.id} href={`/lists/${list.id}`} className="group glass p-6 rounded-2xl border border-white/5 hover:border-pink-500/40 transition">
                <h3 className="text-lg font-bold text-white group-hover:text-pink-400 line-clamp-1">{list.title}</h3>
                <div className="flex items-center gap-2 mt-2 mb-4">
                  <User className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-400">{list.profiles?.username}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">{list.description || 'Açıklama yok.'}</p>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(list.created_at).toLocaleDateString('tr-TR')}</span>
                  <span className="font-bold bg-white/5 px-2 py-1 rounded">{list.list_movies?.[0]?.count || 0} Film</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
