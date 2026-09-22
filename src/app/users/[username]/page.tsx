import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { User, Users, Film, ListVideo } from 'lucide-react';
import FollowButton from '@/components/FollowButton';
import Link from 'next/link';

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  // Hedef kullanıcıyı bul
  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!targetProfile) {
    notFound();
  }

  const targetUserId = targetProfile.id;

  // Takipçi ve Takip Edilen sayıları
  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', targetUserId);
    
  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', targetUserId);

  // Ziyaret eden kişi bu kullanıcıyı takip ediyor mu?
  let isFollowing = false;
  if (currentUser) {
    const { data: followRecord } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', currentUser.id)
      .eq('following_id', targetUserId)
      .single();
    if (followRecord) isFollowing = true;
  }

  // Kullanıcının Public (Herkese Açık) listeleri
  const { data: publicLists } = await supabase
    .from('lists')
    .select('*, list_movies(count)')
    .eq('user_id', targetUserId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(4);

  // Kullanıcının son etkileşimleri (Film detayları TMDB'den çekilmeyecek, sadece sayı veya basit görünüm)
  const { count: watchedCount } = await supabase
    .from('movie_interactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', targetUserId)
    .eq('is_watched', true);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 min-h-screen">
      
      {/* Profil Header */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#d4af37]/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-[#0b0c10] border-4 border-[#d4af37] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          <User className="w-16 h-16 text-gray-500" />
        </div>
        
        <div className="relative z-10 flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white">{targetProfile.username}</h1>
            <p className="text-gray-400 mt-2 max-w-lg">{targetProfile.bio || 'Sinema tutkunu henüz bir biyografi eklemedi.'}</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-semibold">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl text-white font-black">{followersCount || 0}</span>
              <span className="text-gray-500 uppercase tracking-wider text-xs">Takipçi</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl text-white font-black">{followingCount || 0}</span>
              <span className="text-gray-500 uppercase tracking-wider text-xs">Takip</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl text-white font-black">{watchedCount || 0}</span>
              <span className="text-gray-500 uppercase tracking-wider text-xs">Film İzledi</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <FollowButton 
            targetUserId={targetUserId} 
            initialIsFollowing={isFollowing} 
            isSelf={currentUser?.id === targetUserId} 
            currentUserId={currentUser?.id}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Kolon - Listeler */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <ListVideo className="w-6 h-6 text-[#d4af37]" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Açık Listeler</h2>
          </div>
          
          {!publicLists || publicLists.length === 0 ? (
            <div className="glass p-8 rounded-2xl text-center border border-white/5">
              <p className="text-gray-500">Bu kullanıcının henüz herkese açık bir listesi yok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {publicLists.map(list => (
                <Link key={list.id} href={`/lists/${list.id}`} className="group glass p-6 rounded-2xl border border-white/5 hover:border-[#d4af37]/40 transition">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#d4af37] line-clamp-1">{list.title}</h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2 min-h-[40px]">{list.description || 'Açıklama yok.'}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-4">{list.list_movies?.[0]?.count || 0} Film</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Kolon - Etkinlikler / İstatistikler */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Film className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Aktivite</h2>
          </div>
          <div className="glass p-6 rounded-2xl border border-white/5 text-center">
            <p className="text-gray-400 text-sm">Film etkinlikleri ve son yaptığı yorumlar buraya eklenecek.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
