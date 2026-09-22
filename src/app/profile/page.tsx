import { createClient } from '@/lib/supabase/server';
import { Film } from 'lucide-react';
import Link from 'next/link';

export default async function ProfileOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let recentInteractions: any[] = [];

  if (user) {
    const { data: interactions } = await supabase
      .from('movie_interactions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(10);

    if (interactions) {
      recentInteractions = interactions;
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-white uppercase tracking-wider border-l-4 border-[#d4af37] pl-3">
        Genel Bakış
      </h2>
      
      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-300">Son Sinematik Hareketlerin</h3>
        
        {recentInteractions.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center border border-white/10 flex flex-col items-center justify-center">
            <Film className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400">Henüz hiçbir filme puan vermedin veya izlemedin.</p>
            <Link href="/" className="mt-4 px-6 py-2 bg-[#d4af37] text-black font-bold rounded-full hover:bg-[#b5952f] transition">
              Film Keşfet
            </Link>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
            {recentInteractions.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 rounded bg-gray-900 flex items-center justify-center shrink-0 border border-white/10">
                    <Film className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <Link href={`/movie/${item.tmdb_movie_id}`} className="text-white font-semibold hover:text-[#d4af37] transition-colors text-lg">
                      Film ID: {item.tmdb_movie_id}
                    </Link>
                    <div className="flex gap-3 mt-2 text-sm font-medium">
                      {item.is_watched && <span className="text-green-400 bg-green-400/10 px-2 py-0.5 rounded">✓ İzlendi</span>}
                      {item.is_favourite && <span className="text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">❤ Favori</span>}
                      {item.in_watchlist && <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">🔖 İzlenecek</span>}
                      {item.rating && <span className="text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">★ {item.rating}/10</span>}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium bg-black/40 px-3 py-1 rounded-full">
                  {new Date(item.updated_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
