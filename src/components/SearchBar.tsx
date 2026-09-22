'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Film } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklayınca sonuç listesini kapatma
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce ve API çağrısı
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results?.slice(0, 5) || []);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative hidden md:block flex-1 max-w-xl mx-8" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-[#d4af37] border-t-transparent rounded-full" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Ruh halini yaz (örn: 90'lar uzay korku filmleri...)"
          className="block w-full pl-12 pr-4 py-3 border border-white/20 rounded-full leading-5 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent sm:text-base font-medium shadow-inner transition-all"
        />
      </div>

      {/* Arama Sonuçları Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-3 w-full bg-[#0b0c10]/95 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-white/20 z-50">
          <div className="max-h-96 overflow-y-auto">
            {results.map((movie) => (
              <Link 
                href={`/movie/${movie.id}`} 
                key={movie.id}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 hover:bg-white/5 transition border-b border-white/5 last:border-0"
              >
                <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-900">
                  {movie.poster_path ? (
                    <Image 
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Film className="w-6 h-6 m-auto text-gray-600 absolute inset-0" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white line-clamp-1">{movie.title}</h4>
                  <p className="text-xs text-gray-400">
                    {movie.release_date?.substring(0,4)} • ★ {movie.vote_average?.toFixed(1)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
