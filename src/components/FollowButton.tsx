'use client';

import { useState, useTransition } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { toggleFollow } from '@/app/users/actions';

interface Props {
  targetUserId: string;
  initialIsFollowing: boolean;
  isSelf: boolean;
  currentUserId?: string;
}

export default function FollowButton({ targetUserId, initialIsFollowing, isSelf, currentUserId }: Props) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  if (isSelf) return null; // Kendi profilinde takip butonu gösterme

  const handleToggle = () => {
    if (!currentUserId) {
      alert('Takip etmek için giriş yapmalısınız.');
      return;
    }
    
    startTransition(async () => {
      setIsFollowing(!isFollowing); // Optimistik güncelleme
      const res = await toggleFollow(targetUserId, isFollowing);
      if (res?.error) {
        setIsFollowing(isFollowing); // Hata varsa geri al
        alert(res.error);
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 ${
        isFollowing 
          ? 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 border border-transparent' 
          : 'bg-[#d4af37] text-black hover:bg-[#b5952f]'
      }`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-5 h-5" />
          <span>Takibi Bırak</span>
        </>
      ) : (
        <>
          <UserPlus className="w-5 h-5" />
          <span>Takip Et</span>
        </>
      )}
    </button>
  );
}
