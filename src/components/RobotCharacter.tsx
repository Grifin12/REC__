'use client';

import { useEffect, useState, useRef } from 'react';
import { PlayCircle, Star, Tv } from 'lucide-react';

type Emotion = 'normal' | 'angry' | 'squint' | 'surprise' | 'fear' | 'love' | 'cool' | 'peeking';

export default function RobotCharacter({ className = "mx-auto lg:mx-0 mt-8 scale-100", canFloat = false }: { className?: string, canFloat?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [emotion, setEmotion] = useState<Emotion>('normal');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordPeekState, setPasswordPeekState] = useState<'innocent' | 'peeking'>('innocent');

  useEffect(() => {
    // Fare takibi
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isPasswordFocused) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const maxRadius = emotion === 'fear' ? 5 : 15;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY) / 10, maxRadius);
      
      setEyePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    // Scroll takibi (Aşağı kaydırınca asistan moduna geç)
    const handleScroll = () => {
      if (canFloat) {
        setIsFloating(window.scrollY > 400);
      }
    };

    const handleClick = () => {
      if (isPasswordFocused) return;
      const reactions: Emotion[] = ['angry', 'surprise', 'fear', 'squint', 'love', 'cool'];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      setEmotion(randomReaction);
      setTimeout(() => setEmotion('normal'), 800); 
    };

    // Şifre alanı odaklanma takibi (Çaktırmadan bakma)
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      if (target && target.type === 'password') {
        setIsPasswordFocused(true);
        setPasswordPeekState('innocent');
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      if (target && target.type === 'password') {
        setIsPasswordFocused(false);
        setEmotion('normal');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    
    // İlk render'da scroll durumunu kontrol et
    handleScroll();

    // Şifre girerken arada bir çaktırmadan bakma mantığı
    let peekTimeout: NodeJS.Timeout;
    const peekInterval = setInterval(() => {
      if (isPasswordFocused) {
        setPasswordPeekState('peeking');
        // 1-1.5 saniye bakıp geri "masum" (ilgisiz) moda dön
        peekTimeout = setTimeout(() => {
          if (isPasswordFocused) setPasswordPeekState('innocent');
        }, 1000 + Math.random() * 500);
      }
    }, 4000); // Her 4 saniyede bir dikizle

    // Rastgele Göz Kırpma
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);

    // Rastgele Duygular
    const emotionInterval = setInterval(() => {
      setEmotion(prev => {
        if (prev === 'angry' || isPasswordFocused) return prev;
        const rand = Math.random();
        let nextEmotion: Emotion = 'normal';
        if (rand > 0.90) nextEmotion = 'love';
        else if (rand > 0.85) nextEmotion = 'cool';
        else if (rand > 0.75) nextEmotion = 'surprise';
        else if (rand > 0.65) nextEmotion = 'fear';
        else if (rand > 0.50) nextEmotion = 'squint';
        
        if (nextEmotion !== 'normal') {
          setTimeout(() => setEmotion(current => current === nextEmotion && !isPasswordFocused ? 'normal' : current), 2500);
        }
        return nextEmotion;
      });
    }, 6000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      clearInterval(blinkInterval);
      clearInterval(emotionInterval);
      clearInterval(peekInterval);
      clearTimeout(peekTimeout);
    };
  }, [emotion, canFloat, isPasswordFocused]);

  // Duygulara göre göz stillerini belirle
  let eyeHeight = 'h-8';
  let eyeWidth = 'w-6';
  let eyeColor = 'bg-cyan-400';
  let eyeMargin = 'mt-0';
  let isAngry = emotion === 'angry';
  let currentEyePos = eyePos;

  if (isPasswordFocused) {
    if (passwordPeekState === 'innocent') {
      // Şifre girilirken masum modda yukarı/sola ıslık çalar gibi bakar
      eyeHeight = 'h-8';
      eyeWidth = 'w-6';
      eyeColor = 'bg-cyan-400';
      currentEyePos = { x: -10, y: -10 }; 
    } else {
      // Çaktırmadan (peek) modunda sağa doğru (şifre kutusuna) kısık gözle bakar
      eyeHeight = 'h-1';
      eyeWidth = 'w-4';
      eyeColor = 'bg-cyan-200';
      eyeMargin = 'mt-2';
      currentEyePos = { x: 15, y: 5 }; 
    }
  } else if (isBlinking) {
    eyeHeight = 'h-0.5';
    eyeMargin = 'mt-4';
  } else if (emotion === 'angry') {
    eyeHeight = 'h-3'; 
    eyeColor = 'bg-cyan-400'; 
    eyeMargin = 'mt-3';
  } else if (emotion === 'squint') {
    eyeHeight = 'h-3';
    eyeMargin = 'mt-2';
  } else if (emotion === 'surprise') {
    eyeHeight = 'h-12';
    eyeWidth = 'w-8';
    eyeColor = 'bg-yellow-400';
    eyeMargin = '-mt-2';
  } else if (emotion === 'fear') {
    eyeHeight = 'h-3';
    eyeWidth = 'w-3';
    eyeColor = 'bg-purple-400';
    eyeMargin = 'mt-4';
  } else if (emotion === 'love') {
    eyeHeight = 'h-6';
    eyeColor = 'bg-pink-500';
  } else if (emotion === 'cool') {
    eyeHeight = 'h-2';
    eyeWidth = 'w-8'; // Gözlük takmış gibi geniş ve kısık
    eyeMargin = 'mt-1';
  }

  return (
    <div 
      className={`w-64 h-64 transition-all duration-700 ease-in-out z-50
        ${isFloating 
          ? 'fixed bottom-4 right-4 scale-50 opacity-90 hover:opacity-100 hover:scale-[0.55]' 
          : `relative ${className}`
        }`}
    >
      {/* Yüzen Efekt (Sabit Bounce) */}
      <div className={`absolute inset-0 flex items-center justify-center animate-[bounce_4s_ease-in-out_infinite] ${emotion === 'fear' ? 'animate-[pulse_0.5s_ease-in-out_infinite]' : ''}`}>
        
        {/* Robot Kafası */}
        <div 
          ref={containerRef}
          className={`relative w-32 h-32 bg-gradient-to-br from-gray-800 to-black rounded-3xl border-2 transition-colors duration-300 ${isAngry ? 'border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.3)]' : 'border-white/10 shadow-[0_0_50px_rgba(212,175,55,0.2)]'} flex items-center justify-center overflow-hidden cursor-pointer`}
        >
          {/* Kızgınlık İşareti (Anger Vein) */}
          <div className={`absolute top-2 left-2 text-2xl transition-all duration-300 ${isAngry ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            💢
          </div>

          {/* Gözler Container */}
          <div 
            className="flex gap-4 z-10 transition-transform duration-150 ease-out"
            style={{ transform: `translate(${currentEyePos.x}px, ${currentEyePos.y}px)` }}
          >
            <div className={`${eyeWidth} transition-all duration-200 ${eyeHeight} ${eyeColor} ${eyeMargin} rounded-full shadow-[0_0_15px_currentColor]`} />
            <div className={`${eyeWidth} transition-all duration-200 ${eyeHeight} ${eyeColor} ${eyeMargin} rounded-full shadow-[0_0_15px_currentColor]`} />
          </div>
          
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent transition-colors duration-300 ${isAngry ? 'via-red-500/20' : 'via-[#d4af37]/20'} to-transparent h-10 w-full animate-[ping_3s_linear_infinite]`} />
        </div>
        
        {/* Etrafta dönen ikonlar */}
        <div className="absolute w-48 h-48 animate-[spin_10s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-purple-500/30">
            <PlayCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-yellow-500/30">
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-cyan-500/30">
            <Tv className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </div>
      
      {/* Alt Gölge */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/50 rounded-full blur-md transition-transform duration-200 ${emotion === 'fear' ? 'scale-75 opacity-50' : 'animate-[pulse_4s_ease-in-out_infinite]'}`} />
    </div>
  );
}
