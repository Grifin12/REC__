'use client';

import { useState, useTransition } from 'react';
import { Eye, Heart, Bookmark, Star, ListVideo, X } from 'lucide-react';
import { toggleMovieInteraction, updateMovieRating } from '@/app/movie/actions';
import { addMovieToList } from '@/app/lists/actions';

interface Props {
  movieId: number;
  initialState?: any;
  userLists?: any[];
}

export default function MovieInteractions({ movieId, initialState, userLists = [] }: Props) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState({
    is_watched: initialState?.is_watched || false,
    is_favourite: initialState?.is_favourite || false,
    in_watchlist: initialState?.in_watchlist || false,
    rating: initialState?.rating || null
  });

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [addingToListId, setAddingToListId] = useState<string | null>(null);

  const handleToggle = (type: 'watched' | 'favourite' | 'watchlist') => {
    startTransition(async () => {
      setState(prev => ({
        ...prev,
        [`is_${type}`]: type === 'watched' || type === 'favourite' ? !prev[`is_${type}` as keyof typeof prev] : prev.in_watchlist,
        in_watchlist: type === 'watchlist' ? !prev.in_watchlist : prev.in_watchlist
      }));
      
      await toggleMovieInteraction(movieId, type);
    });
  };

  const handleRating = (rating: number) => {
    startTransition(async () => {
      setState(prev => ({ ...prev, rating }));
      await updateMovieRating(movieId, rating);
    });
  };

  const handleAddToList = async (listId: string) => {
    setAddingToListId(listId);
    const res = await addMovieToList(listId, movieId);
    if (res?.success) {
      alert('Film listeye eklendi!');
    } else {
      alert(res?.error || 'Hata oluştu');
    }
    setAddingToListId(null);
    setIsListModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Etkileşim Butonları */}
      <div className="grid grid-cols-4 gap-2">
        <button 
          onClick={() => handleToggle('watched')}
          disabled={isPending}
          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${state.is_watched ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
        >
          <Eye className={`w-6 h-6 mb-1 ${state.is_watched ? 'fill-green-400/20' : ''}`} />
          <span className="text-[10px] sm:text-xs font-semibold">İzledim</span>
        </button>

        <button 
          onClick={() => handleToggle('favourite')}
          disabled={isPending}
          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${state.is_favourite ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
        >
          <Heart className={`w-6 h-6 mb-1 ${state.is_favourite ? 'fill-orange-400/50' : ''}`} />
          <span className="text-[10px] sm:text-xs font-semibold">Favori</span>
        </button>

        <button 
          onClick={() => handleToggle('watchlist')}
          disabled={isPending}
          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${state.in_watchlist ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
        >
          <Bookmark className={`w-6 h-6 mb-1 ${state.in_watchlist ? 'fill-blue-400/50' : ''}`} />
          <span className="text-[10px] sm:text-xs font-semibold truncate w-full text-center">İzleyeceğim</span>
        </button>

        <button 
          onClick={() => setIsListModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 rounded-xl transition-all bg-white/5 text-gray-400 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/50"
        >
          <ListVideo className={`w-6 h-6 mb-1 ${isListModalOpen ? 'text-[#d4af37]' : ''}`} />
          <span className="text-[10px] sm:text-xs font-semibold text-center truncate w-full">Listeye Ekle</span>
        </button>
      </div>

      {/* Puanlama Kartı */}
      <div className="glass p-4 rounded-xl border border-white/10">
        <p className="text-sm text-gray-400 text-center mb-2 font-medium">Bu filme puan ver</p>
        <div className="flex items-center justify-center gap-1 cursor-pointer group">
          {[1,2,3,4,5,6,7,8,9,10].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              disabled={isPending}
              className={`p-1 transition-all hover:scale-125 focus:outline-none`}
            >
              <Star 
                className={`w-5 h-5 md:w-6 md:h-6 ${state.rating && star <= state.rating ? 'text-cyan-400 fill-cyan-400' : 'text-gray-600'} hover:text-cyan-400`} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Listeye Ekle (Inline Dropdown / Accordion) */}
      {isListModalOpen && (
        <div className="glass p-4 rounded-xl border border-[#d4af37]/30 mt-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Hangi Listeye Eklensin?</h3>
            <button onClick={() => setIsListModalOpen(false)} className="text-gray-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {userLists.length === 0 ? (
            <div className="text-center py-2">
              <p className="text-xs text-gray-400 mb-2">Henüz hiçbir listen yok.</p>
              <a href="/profile/lists" className="text-xs font-bold text-[#d4af37] hover:underline">Liste Oluştur</a>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {userLists.map(list => (
                <button
                  key={list.id}
                  onClick={() => handleAddToList(list.id)}
                  disabled={addingToListId === list.id}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs flex justify-between items-center transition disabled:opacity-50"
                >
                  <span className="line-clamp-1">{list.title}</span>
                  {addingToListId === list.id && <span className="text-[10px] text-[#d4af37]">Ekleniyor...</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
