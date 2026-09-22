import { createClient } from '@/lib/supabase/server';
import { ListVideo, Plus } from 'lucide-react';
import Link from 'next/link';
import CreateListForm from '@/components/CreateListForm';

export default async function ProfileListsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Kullanıcının listelerini ve her listenin içindeki film sayısını çek
  const { data: lists } = await supabase
    .from('lists')
    .select('*, list_movies(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-wider border-l-4 border-[#d4af37] pl-3">
          Listelerim
        </h2>
        <CreateListForm />
      </div>

      {!lists || lists.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center border border-white/10 flex flex-col items-center justify-center">
          <ListVideo className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400">Henüz hiçbir özel liste oluşturmadın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lists.map((list) => (
            <Link key={list.id} href={`/lists/${list.id}`} className="group glass p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors line-clamp-1">{list.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${list.is_public ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {list.is_public ? 'Public' : 'Private'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
                {list.description || 'Açıklama bulunmuyor.'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{new Date(list.created_at).toLocaleDateString('tr-TR')}</span>
                <span className="font-semibold text-white bg-white/10 px-3 py-1 rounded-full">
                  {list.list_movies?.[0]?.count || 0} Film
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
