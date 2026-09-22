import { createClient } from '@/lib/supabase/server';
import { getRecommendationsForMovie, getMovieDetails } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { Sparkles, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ForYouPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Kullanıcının etkileşimlerini çek (Favoriler veya puanı >= 7 olanlar)
  const { data: interactions } = await supabase
    .from('movie_interactions')
    .select('tmdb_movie_id, is_favourite, rating, is_watched')
    .eq('user_id', user.id);

  if (!interactions || interactions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-screen">
        <Sparkles className="w-16 h-16 text-[#d4af37] mx-auto mb-6 opacity-50" />
        <h1 className="text-3xl font-black text-white mb-4">Sana Özel Öneriler</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Sana film önerebilmemiz için önce zevklerini öğrenmemiz gerekiyor. 
          Birkaç filmi favorilerine ekle veya yüksek puan ver, ardından buraya tekrar gel!
        </p>
        <Link href="/explore" className="inline-block mt-8 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-lg hover:bg-[#b5952f] transition">
          Filmleri Keşfetmeye Başla
        </Link>
      </div>
    );
  }

  // Zaten izlenen filmlerin ID'lerini bir Set içinde tut (önermemek için)
  const watchedIds = new Set(
    interactions.filter(i => i.is_watched).map(i => String(i.tmdb_movie_id))
  );

  // Öneri için temel alınacak filmleri seç (Favori olanlar veya 7+ puan alanlar)
  const seedInteractions = interactions.filter(i => i.is_favourite || (i.rating && i.rating >= 7));
  
  // Eğer favori/yüksek puanlı yoksa, izlediklerinden rastgele seç
  const seeds = seedInteractions.length > 0 
    ? seedInteractions.slice(0, 3) 
    : interactions.slice(0, 3);

  // Seçilen her "Seed" film için paralel olarak hem kendi detayını hem de önerilerini çek
  const recommendationSections = await Promise.all(
    seeds.map(async (seed) => {
      const sourceMovie = await getMovieDetails(String(seed.tmdb_movie_id));
      const recsData = await getRecommendationsForMovie(String(seed.tmdb_movie_id));
      
      // İzlediklerini filtrele ve max 6 film al
      const filteredRecs = (recsData.results || [])
        .filter((r: any) => !watchedIds.has(String(r.id)))
        .slice(0, 6);

      return {
        source: sourceMovie,
        recommendations: filteredRecs,
        reason: seed.is_favourite ? 'favorilerinde olduğu için' : 'yüksek puan verdiğin için'
      };
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 min-h-screen">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-[#d4af37]/10 rounded-2xl mb-2">
          <Sparkles className="w-12 h-12 text-[#d4af37]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Sana Özel</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          İzleme geçmişin, favorilerin ve puanlamaların doğrultusunda algoritmamızın sadece senin için seçtiği filmler.
        </p>
      </div>

      <div className="space-y-16">
        {recommendationSections.map((section, idx) => {
          if (section.recommendations.length === 0) return null;
          
          return (
            <section key={idx} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {section.reason.includes('favori') ? (
                      <Heart className="w-4 h-4 text-orange-400" />
                    ) : (
                      <Star className="w-4 h-4 text-cyan-400" />
                    )}
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Algoritma Eşleşmesi</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    <span className="text-[#d4af37]">{section.source.title}</span> {section.reason} öneriler
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {section.recommendations.map((movie: any) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
