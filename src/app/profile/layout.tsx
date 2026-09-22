import Link from 'next/link';
import { User, Film, Heart, Bookmark, Star, Users, ListVideo } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Kullanıcı istatistikleri
  const { data: interactions } = await supabase
    .from('movie_interactions')
    .select('*')
    .eq('user_id', user.id);

  const stats = {
    watched: interactions?.filter(i => i.is_watched).length || 0,
    favorites: interactions?.filter(i => i.is_favourite).length || 0,
    watchlist: interactions?.filter(i => i.in_watchlist).length || 0,
    rated: interactions?.filter(i => i.rating !== null).length || 0,
  };

  const navItems = [
    { href: '/profile', label: 'Genel Bakış', icon: User },
    { href: '/profile/watched', label: `İzlenenler (${stats.watched})`, icon: Film },
    { href: '/profile/favorites', label: `Favoriler (${stats.favorites})`, icon: Heart },
    { href: '/profile/watchlist', label: `İzlenecekler (${stats.watchlist})`, icon: Bookmark },
    { href: '/profile/ratings', label: `Puanlamalar (${stats.rated})`, icon: Star },
    { href: '/profile/lists', label: 'Listelerim (0)', icon: ListVideo },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-8 px-4 flex flex-col md:flex-row gap-8 min-h-screen">
      
      {/* Profil Sidebar (Sol) */}
      <aside className="w-full md:w-1/4 shrink-0 space-y-6">
        <div className="glass p-6 rounded-2xl flex flex-col items-center text-center border border-white/10 shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#d4af37] to-cyan-500 rounded-full flex items-center justify-center p-1 mb-4">
            <div className="w-full h-full bg-[#0b0c10] rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-300" />
            </div>
          </div>
          <h1 className="text-xl font-black text-white truncate w-full">{user.email?.split('@')[0]}</h1>
          <p className="text-gray-400 text-sm truncate w-full mb-4">{user.email}</p>
          <button className="w-full py-2 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition">
            Profili Düzenle
          </button>
        </div>

        <nav className="glass rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} href={item.href} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-gray-300 hover:text-white">
                <Icon className="w-5 h-5 text-[#d4af37]" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Profil İçerik Alanı (Sağ) */}
      <main className="w-full md:w-3/4 pb-20">
        {children}
      </main>

    </div>
  );
}
