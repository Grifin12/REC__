'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import RobotCharacter from './RobotCharacter';

export default function GlobalRobot() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  
  // Sürükleme (Drag) state'leri
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    // İlk pozisyonu sağ alttan biraz daha içeriye al
    setPosition({ x: window.innerWidth - 200, y: window.innerHeight - 200 });
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/') {
        // Ana sayfada ise sadece aşağı kaydırıldığında göster
        setIsVisible(window.scrollY > 400);
      }
    };

    if (pathname === '/login') {
      setIsVisible(false);
    } else if (pathname === '/') {
      handleScroll();
      window.addEventListener('scroll', handleScroll);
    } else {
      setIsVisible(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaX = e.clientX - dragInfo.current.startX;
    const deltaY = e.clientY - dragInfo.current.startY;
    
    // Ekran dışına çıkmasını engelle
    let newX = dragInfo.current.initialX + deltaX;
    let newY = dragInfo.current.initialY + deltaY;
    
    const maxW = window.innerWidth - 180; // Sağdan biraz daha boşluk
    const maxH = window.innerHeight - 180; // Alttan biraz daha boşluk
    
    newX = Math.max(20, Math.min(newX, maxW));
    newY = Math.max(20, Math.min(newY, maxH));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div 
      className={`fixed z-[9999] touch-none transition-transform ${isDragging ? 'scale-[0.55] cursor-grabbing' : 'scale-50 cursor-grab opacity-90 hover:opacity-100 hover:scale-[0.55]'}`}
      style={{ left: position.x, top: position.y, transformOrigin: 'center center' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Tıklamayı RobotCharacter'e değil bu kapsayıcıya aldığımız için pointer-events-none ile içerdeki sürükleme çakışmasını engelliyoruz */}
      <div className="pointer-events-none">
        <RobotCharacter />
      </div>
    </div>
  );
}
