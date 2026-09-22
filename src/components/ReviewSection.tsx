'use client';

import { useState, useTransition } from 'react';
import { User, MessageSquare, AlertTriangle } from 'lucide-react';
import { submitReview } from '@/app/movie/actions';

export default function ReviewSection({ 
  movieId, 
  userId,
  initialReviews = []
}: { 
  movieId: number; 
  userId?: string;
  initialReviews: any[];
}) {
  const [content, setContent] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [reviews, setReviews] = useState(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !userId) return;

    startTransition(async () => {
      const result = await submitReview(movieId, content, hasSpoilers);
      if (result.success && result.data) {
        setReviews([result.data, ...reviews]);
        setContent('');
        setHasSpoilers(false);
      }
    });
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <MessageSquare className="w-6 h-6 text-[#d4af37]" />
        <h2 className="text-2xl font-bold text-white">Topluluk Yorumları</h2>
        <span className="text-sm bg-white/10 px-3 py-1 rounded-full text-gray-300">{reviews.length}</span>
      </div>

      {userId ? (
        <div className="space-y-4">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-colors"
          >
            {isFormOpen ? 'Vazgeç' : 'Sen Ne Düşünüyorsun? Yorum Yaz'}
          </button>

          {isFormOpen && (
            <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl border border-[#d4af37]/30 shadow-lg animate-in fade-in slide-in-from-top-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bu film hakkında ne düşünüyorsun? Düşüncelerini paylaş..."
                className="w-full bg-[#0b0c10] border border-white/10 rounded-xl p-4 text-white focus:border-[#d4af37] focus:outline-none min-h-[120px] resize-none"
                required
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                  <input 
                    type="checkbox" 
                    checked={hasSpoilers}
                    onChange={(e) => setHasSpoilers(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-transparent text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-0"
                  />
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Sürprizbozan (Spoiler) içerir
                </label>
                <button 
                  type="submit" 
                  disabled={isPending || !content.trim()}
                  className="px-6 py-2 bg-[#d4af37] text-black font-bold rounded-lg hover:bg-[#b5952f] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Gönderiliyor...' : 'Yorum Yap'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="glass p-6 rounded-2xl border border-white/10 text-center">
          <p className="text-gray-400">Yorum yapabilmek için giriş yapmalısın.</p>
        </div>
      )}

      {/* Review Listesi */}
      <div className="space-y-4 mt-8">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">Henüz kimse yorum yapmamış. İlk yorumu sen yap!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="glass p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-tr from-[#d4af37] to-cyan-500 rounded-full flex items-center justify-center p-0.5">
                     <div className="w-full h-full bg-[#0b0c10] rounded-full flex items-center justify-center">
                       <User className="w-5 h-5 text-gray-400" />
                     </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{review.profiles?.username || review.profiles?.id.substring(0,8) || 'Kullanıcı'}</p>
                    <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
                {review.has_spoilers && (
                  <span className="text-xs font-bold bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full flex items-center gap-1 border border-orange-500/20">
                    <AlertTriangle className="w-3 h-3" /> Spoiler
                  </span>
                )}
              </div>
              
              <div className="pl-14">
                {review.has_spoilers ? (
                  <details className="cursor-pointer group">
                    <summary className="text-orange-400/80 hover:text-orange-400 font-medium list-none flex items-center gap-2">
                      <span className="bg-orange-500/20 px-2 py-1 rounded text-xs">Spoilerı Göster</span>
                    </summary>
                    <p className="text-gray-300 mt-3 leading-relaxed whitespace-pre-wrap">{review.content}</p>
                  </details>
                ) : (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{review.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
