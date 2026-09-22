'use client';

import { useState, useTransition } from 'react';
import { Plus, X } from 'lucide-react';
import { createList } from '@/app/lists/actions';

export default function CreateListForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      const res = await createList(title, description, isPublic);
      if (res?.success) {
        setIsOpen(false);
        setTitle('');
        setDescription('');
        setIsPublic(true);
      } else {
        alert(res?.error || 'Bir hata oluştu');
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-black font-bold rounded-lg hover:bg-[#b5952f] transition"
      >
        <Plus className="w-5 h-5" /> Yeni Liste
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0b0c10] border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wide">Yeni Liste Oluştur</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Liste Adı</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#d4af37] focus:outline-none"
                  required
                  placeholder="Örn: Favori Bilim Kurgu Filmlerim"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Açıklama</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#d4af37] focus:outline-none min-h-[100px] resize-none"
                  placeholder="Bu liste ne hakkında?"
                />
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-transparent text-[#d4af37] focus:ring-[#d4af37]"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-300 cursor-pointer">
                  Bu liste herkese açık olsun (Topluluk görebilir)
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={isPending || !title.trim()}
                className="w-full py-3 mt-4 bg-[#d4af37] text-black font-bold rounded-lg hover:bg-[#b5952f] transition disabled:opacity-50"
              >
                {isPending ? 'Oluşturuluyor...' : 'Listeyi Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
