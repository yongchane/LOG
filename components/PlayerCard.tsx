"use client";

import { Player } from "@/types";
import { m as motion } from "framer-motion";
import { getTranslations } from "@/lib/i18n";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PlayerCardProps {
  player: Player | null;
  position: string;
  onClick?: () => void;
  isRevealing?: boolean;
}

export default function PlayerCard({
  player,
  position,
  onClick,
  isRevealing = false,
}: PlayerCardProps) {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sparkle particles animation - memoized
  const sparkles = useMemo(() => {
    if (!player) return [];
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 4,
    }));
  }, [player?.id]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    // Cancel previous frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Throttle with requestAnimationFrame
    rafIdRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateXValue = ((y - centerY) / centerY) * -15;
      const rotateYValue = ((x - centerX) / centerX) * 15;

      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
      setGlareX((x / rect.width) * 100);
      setGlareY((y / rect.height) * 100);
      setIsHovered(true);
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
    setIsHovered(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);
  if (!player) {
    // Empty slot
    return (
      <motion.button
        onClick={onClick}
        className="relative w-full aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
        style={{
          background: "rgba(10, 15, 20, 0.8)",
          boxShadow: '0 0 20px rgba(0,0,0,0.5), inset 0 0 40px rgba(160, 210, 255, 0.05)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Premium Border Layers */}
        <div className="absolute inset-0 border-[3px] border-lol-gold/10 z-20 pointer-events-none" />
        <div 
          className="absolute inset-[1px] border border-white/5 z-20 pointer-events-none" 
          style={{ boxShadow: `inset 0 0 20px #C89B3C20` }}
        />
        
        {/* Hextech Corner Decorators */}
        <div className="absolute top-0 left-0 p-1.5 z-30 pointer-events-none">
          <div className="w-6 h-6 border-t-2 border-l-2 border-lol-gold/40 rounded-tl-sm transition-all group-hover:w-8 group-hover:h-8 group-hover:border-lol-gold" />
        </div>
        <div className="absolute top-0 right-0 p-1.5 z-30 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-lol-gold/20 mb-1" />
          <div className="w-6 h-6 border-t-2 border-r-2 border-lol-gold/40 rounded-tr-sm transition-all group-hover:w-8 group-hover:h-8 group-hover:border-lol-gold" />
        </div>
        <div className="absolute bottom-0 left-0 p-1.5 z-30 pointer-events-none">
          <div className="w-6 h-6 border-b-2 border-l-2 border-lol-gold/40 rounded-bl-sm transition-all group-hover:w-8 group-hover:h-8 group-hover:border-lol-gold" />
          <div className="w-2 h-2 rounded-full bg-lol-gold/20 mt-1" />
        </div>
        <div className="absolute bottom-0 right-0 p-1.5 z-30 pointer-events-none text-right">
          <div className="w-6 h-6 border-b-2 border-r-2 border-lol-gold/40 rounded-br-sm transition-all group-hover:w-8 group-hover:h-8 group-hover:border-lol-gold ml-auto" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
          <div className="text-5xl mb-2 opacity-30 text-lol-gold group-hover:opacity-60 transition-opacity">
            ?
          </div>
          <div className="text-lol-gold/60 font-bold text-sm tracking-widest uppercase group-hover:text-lol-gold transition-colors">
            {position}
          </div>
          <div className="text-lol-light/30 text-[10px] mt-2 group-hover:text-lol-light transition-colors">
             CLICK TO SUMMON
          </div>
        </div>

        {/* Animated glow on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(200, 155, 60, 0.1) 0%, transparent 70%)",
          }}
        />
      </motion.button>
    );
  }

  const isWorldsWinner = player.isWinner && player.championshipLeague === 'WORLDS';

  return (
    <div className="relative w-full aspect-[3/4]">
      <motion.div
        ref={cardRef}
        className={`relative w-full h-full rounded-xl overflow-hidden cursor-pointer ${isWorldsWinner ? 'worlds-card' : ''}`}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? "translateZ(30px)" : ""}`,
          background: "rgba(10, 15, 20, 0.9)",
          boxShadow: isWorldsWinner 
            ? `0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(200, 155, 60, 0.4), inset 0 0 60px rgba(200, 155, 60, 0.1)`
            : `0 15px 35px rgba(0,0,0,0.7), 0 0 ${isHovered ? "30" : "15"}px ${player.teamColor}50`,
          transition: "transform 0.1s ease-out, box-shadow 0.3s ease",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* OUTER BORDER GLOW */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-40'}`}
             style={{ border: `1px solid ${player.teamColor}50`, boxShadow: `inset 0 0 15px ${player.teamColor}30` }} />
        
        {/* BACKGROUND GLOW */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${player.teamColor}, transparent 80%)`,
          }}
        />

        {/* TEAM SHORT NAME BG */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span 
            className="text-[120px] font-black opacity-10 leading-none select-none blur-[1px]"
            style={{ color: player.teamColor || '#aaa' }}
          >
            {player.teamShort}
          </span>
        </div>

        {/* HEX GRID OVERLAY WITH TILT IMPACT */}
        <div 
          className="absolute inset-x-[-20%] inset-y-[-20%] hexagon-pattern opacity-10 mix-blend-overlay pointer-events-none" 
          style={{
            transform: `translate(${rotateY * 0.5}px, ${rotateX * 0.5}px)`,
          }}
        />

        {/* ARCANE CIRCLE (Decorative Background) */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 border-[1px] border-white/5 rounded-full z-0 pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-56 h-56 border-[1px] border-white/5 rounded-full z-0 pointer-events-none" 
             style={{ borderStyle: 'dashed' }} />

        {/* CONTENT LAYOUT */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
          {/* TOP SECTION */}
          <div className="space-y-0.5">
            <div 
              className="text-xs font-bold tracking-tighter"
              style={{ color: player.teamColor || '#C89B3C' }}
            >
              {player.position}
            </div>
            <div className={`text-2xl font-black leading-tight drop-shadow-md ${isWorldsWinner ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-lol-gold to-yellow-600' : 'text-white'}`}>
              {player.name}
            </div>
            <div className="text-[10px] text-lol-light/80 font-medium">
              {player.realName || player.nationality}
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="space-y-3">
             <div className="flex items-center gap-2">
                <span className="text-xl shadow-sm">{getFlagEmoji(player.iso)}</span>
                <span className="text-[10px] text-lol-light/60 font-bold tracking-wide uppercase">{player.nationality}</span>
             </div>

             <div className="flex items-end justify-between border-t border-white/10 pt-2">
                <div className="flex flex-col">
                   <div 
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black text-white"
                    style={{ backgroundColor: `${player.teamColor}cc` }}
                   >
                     {player.region && (
                       <img 
                        src={`/${player.region.toLowerCase()}.${player.region === 'LEC' ? 'webp' : 'svg'}`} 
                        className="h-2.5 w-auto" 
                        alt={player.region}
                       />
                     )}
                     {player.teamShort}
                   </div>
                </div>
                <div className="text-lg font-black text-lol-gold tabular-nums leading-none">
                  {player.year}
                </div>
             </div>
          </div>
        </div>

        {/* WORLDS CHAMPION PREMIUM FRAME */}
        {isWorldsWinner && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            <div className="absolute inset-0 border-[4px] border-lol-gold/40 animate-pulse" />
            <div className="absolute inset-1 border border-lol-gold/20" />
            <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-lol-gold z-40" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-[3px] border-r-[3px] border-lol-gold z-40" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[3px] border-l-[3px] border-lol-gold z-40" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-lol-gold z-40" />
          </div>
        )}

        {/* WORLDS CHAMPION BADGE (Modern Style) */}
        {player.isWinner && (
          <div className="absolute top-0 right-0 p-3 z-20 flex flex-col items-end gap-1">
             {/* Badge Icon */}
             <motion.div 
              className="relative"
              animate={isWorldsWinner ? {
                filter: ['brightness(1) drop-shadow(0 0 5px gold)', 'brightness(1.5) drop-shadow(0 0 15px gold)', 'brightness(1) drop-shadow(0 0 5px gold)']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
             >
                <div className={`p-1.5 rounded-full ${isWorldsWinner ? 'bg-gradient-to-br from-lol-gold to-lol-gold-dark shadow-[0_0_15px_rgba(200,155,60,0.8)]' : 'bg-lol-grey/80'}`}>
                  <img 
                    src={player.championshipLeague === 'WORLDS' ? '/worlds.svg' : player.championshipLeague === 'MSI' ? '/msi.svg' : `/${player.region.toLowerCase()}.${player.region === 'LEC' ? 'webp' : 'svg'}`} 
                    className={`h-5 w-5 ${isWorldsWinner ? 'brightness-125' : 'opacity-80'}`} 
                    alt="Champ"
                  />
                </div>
             </motion.div>
             
             {/* Championship Label Box */}
             {/* <div className={`px-2 py-0.5 rounded border text-[8px] font-black whitespace-nowrap ${isWorldsWinner ? 'bg-black/80 border-lol-gold text-lol-gold' : 'bg-black/60 border-white/20 text-white/60'}`}>
                {player.championshipYear || player.year} {player.championshipLeague} CHAMPION
             </div> */}
          </div>
        )}

        {/* WORLDS WINNER AURA EFFECTS */}
        {isWorldsWinner && mounted && (
          <>
            {/* Particle particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-lol-gold rounded-full z-20 pointer-events-none shadow-[0_0_5px_gold]"
                style={{
                  left: `${(i * 13) % 100}%`,
                  top: `${(i * 17) % 100}%`,
                }}
                animate={{
                  y: [0, -40],
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                  filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            
            {/* Golden Core Glow */}
            <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.4)_0%,transparent_70%)]" />
            
            {/* Golden Edge Glow - Multi-layered */}
            <div className="absolute inset-0 border-2 border-lol-gold/50 animate-pulse pointer-events-none z-30" style={{ boxShadow: 'inset 0 0 15px rgba(212, 175, 55, 0.4), 0 0 10px rgba(212, 175, 55, 0.2)' }} />
            <div className="absolute inset-[-4px] border border-lol-gold/20 pointer-events-none z-30 blur-[2px]" />
          </>
        )}

        {/* GLASS SHIMMER EFFECTS */}
        <div
          className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
            mixBlendMode: 'overlay',
            opacity: isHovered ? 1 : 0,
          }}
        />
        
        {/* Sweep effect (Enhanced Holographic) */}
        <motion.div
           className="absolute inset-0 z-40 pointer-events-none"
           style={{
             background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
             mixBlendMode: 'overlay',
             filter: 'blur(5px)',
           }}
           animate={{ 
             x: isHovered ? ['-200%', '300%'] : '-200%',
             opacity: isHovered ? [0, 1, 0] : 0
           }}
           transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* CORNER ACCENTS (Premium Look) */}
        <div className="absolute top-0 left-0 w-8 h-8 rounded-br-2xl border-t border-l border-lol-gold/50 z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-tl-2xl border-b border-r border-lol-gold/50 z-20 pointer-events-none" />
      </motion.div>
    </div>

  );
}

// Helper function to get flag emoji from ISO code
function getFlagEmoji(isoCode: string): string {
  const codePoints = isoCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
