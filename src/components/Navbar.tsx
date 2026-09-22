'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, User, Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Yukarı kaydırıyorsa veya en tepedeyse göster, aşağı kaydırıyorsa gizle
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-transform duration-500 flex justify-center ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div 
        className="bg-[#0b0c10]/95 backdrop-blur-2xl w-full border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6 max-w-7xl mx-auto shadow-2xl"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 w-24">
          <Film className="h-6 w-6 text-[#d4af37] shrink-0" />
          <span className="font-bold text-xl tracking-widest text-white uppercase block">Recon</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <Link href="/for-you" className="hover:text-[#d4af37] transition-colors flex items-center gap-1"><Sparkles className="w-4 h-4"/> Sana Özel</Link>
          <Link href="/explore" className="hover:text-white transition-colors">Keşfet</Link>
          <Link href="/community" className="hover:text-white transition-colors">Topluluk</Link>
        </div>

        {/* Sumora NLP Search Bar */}
        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>

        {/* User Actions */}
        <div className="flex items-center">
          <Link 
            href="/profile" 
            className="flex items-center justify-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/50 transition-all group shrink-0 rounded-full px-4 py-2"
          >
            <User className="h-5 w-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-[#d4af37] text-sm tracking-wide hidden sm:block">Profil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
