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
  const cardRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

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
        className="relative w-full aspect-[3/5] sm:aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
        style={{
          background: "linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Ornate border frame */}
        <div className="absolute inset-0">
          {/* Top ornate border */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-lol-gold via-lol-gold-dark to-transparent opacity-80">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(200, 155, 60, 0.3) 10px, rgba(200, 155, 60, 0.3) 11px)",
              }}
            />
          </div>

          {/* Bottom ornate border */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-lol-gold via-lol-gold-dark to-transparent opacity-80">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(200, 155, 60, 0.3) 10px, rgba(200, 155, 60, 0.3) 11px)",
              }}
            />
          </div>

          {/* Side borders with ornaments */}
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-lol-gold to-transparent opacity-80" />
          <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-lol-gold to-transparent opacity-80" />

          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-lol-gold opacity-60" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-lol-gold opacity-60" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-lol-gold opacity-60" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-lol-gold opacity-60" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
          <div className="text-6xl mb-4 opacity-50 filter drop-shadow-[0_0_10px_rgba(200,155,60,0.5)]">
            ?
          </div>
          <div className="text-lol-gold font-bold text-xl tracking-wider drop-shadow-lg">
            {position}
          </div>
          <div className="text-lol-light text-sm mt-3 opacity-70">
            Click to Summon
          </div>
        </div>

        {/* Mystical pattern overlay */}
        <div className="absolute inset-0 hexagon-pattern opacity-20"></div>

        {/* Animated glow on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(200, 155, 60, 0.2) 0%, transparent 70%)",
          }}
        />

        {/* Shimmering light effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      </motion.button>
    );
  }

  const isWorldsChampion =
    player.isWinner && player.championshipLeague === "WORLDS";

  return (
    <div className="relative w-full aspect-[3/5] sm:aspect-[3/4]">
      {/* Championship indicator - outside card for no clipping */}
      {isWorldsChampion && (
        <div className="absolute -top-3 -right-3 z-20">
          <div className="relative group">
            {/* Subtle glow */}
            <div
              className="absolute inset-0 rounded-full blur-lg"
              style={{
                background:
                  "radial-gradient(circle, rgba(201, 168, 80, 0.4) 0%, transparent 70%)",
              }}
            />

            {/* Trophy badge */}
            <div
              className="relative p-2 rounded-full shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #C9A850 50%, #B8945F 100%)",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 168, 80, 0.3)",
              }}
            >
              <img
                src="/worlds.svg"
                alt="League of Legends Worlds Championship trophy icon - golden cup symbolizing world champion title"
                className="w-6 h-6"
              />
            </div>

            {/* Tooltip on hover */}
            <div
              className="absolute top-full mt-1 right-0 px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #C9A850 0%, #B8945F 100%)",
                color: "#1a1410",
                border: "1px solid rgba(201, 168, 80, 0.5)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              {t.championshipWinner(
                player.championshipYear || player.year,
                player.championshipLeague || "WORLDS",
              )}
            </div>
          </div>
        </div>
      )}
      <motion.div
        ref={cardRef}
        className="relative w-full aspect-[3/5] sm:aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
        style={{
          background: `
            linear-gradient(135deg, ${player.teamColor}50 0%, rgba(20, 25, 30, 0.95) 50%, ${player.teamColor}30 100%),
            radial-gradient(circle at 30% 50%, ${player.teamColor}20, transparent 70%)
          `,
          border: isWorldsChampion
            ? `3px solid ${player.teamColor}`
            : `3px solid ${player.teamColor}`,
          transformStyle: "preserve-3d",
          perspective: "1000px",
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? "translateZ(20px)" : ""}`,
          willChange: isHovered ? "transform, box-shadow" : "auto",
          boxShadow: isWorldsChampion
            ? `
              0 20px 40px rgba(0, 0, 0, 0.6),
              0 0 ${isHovered ? "35" : "25"}px ${player.teamColor}${isHovered ? "90" : "60"},
              inset 0 0 40px ${player.teamColor}15,
              0 0 0 1px ${player.teamColor}40,
              0 0 60px rgba(212, 175, 55, ${isHovered ? "0.3" : "0.15"})
            `
            : `
              0 15px 40px rgba(0, 0, 0, 0.5),
              0 0 ${isHovered ? "40" : "25"}px ${player.teamColor}${isHovered ? "80" : "50"},
              inset 0 0 40px rgba(255, 255, 255, 0.08),
              0 0 0 1px ${player.teamColor}40
            `,
          transition: "all 0.15s ease-out",
        }}
        initial={
          isRevealing
            ? { rotateY: 180, opacity: 0, scale: 0.8 }
            : { rotateY: 0, opacity: 1, scale: 1 }
        }
        animate={{ rotateY: 0, opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Ornate decorative frame overlay */}
        <div className="absolute inset-0 pointer-events-none z-50">
          {/* Top ornamental border */}
          <div className="absolute top-0 left-0 right-0 h-16">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${player.teamColor}, transparent)`,
              }}
            />
            <div
              className="absolute top-2 left-0 right-0 h-px"
              style={{
                background: `repeating-linear-gradient(90deg, transparent, transparent 8px, ${player.teamColor}50 8px, ${player.teamColor}50 10px)`,
              }}
            />
          </div>

          {/* Bottom ornamental border */}
          <div className="absolute bottom-0 left-0 right-0 h-20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, transparent, ${player.teamColor}, transparent)`,
              }}
            />
            <div
              className="absolute bottom-2 left-0 right-0 h-px"
              style={{
                background: `repeating-linear-gradient(90deg, transparent, transparent 8px, ${player.teamColor}50 8px, ${player.teamColor}50 10px)`,
              }}
            />
          </div>

          {/* Corner ornaments */}
          <svg className="absolute top-2 left-2 w-12 h-12" viewBox="0 0 50 50">
            <path
              d="M0,0 L20,0 L10,10 L0,20 Z"
              fill={player.teamColor}
              opacity="0.6"
            />
            <path d="M2,2 L15,2 L10,7 L2,15 Z" fill="url(#cornerGrad)" />
            <defs>
              <linearGradient
                id="cornerGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={player.teamColor}
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor={player.teamColor}
                  stopOpacity="0.2"
                />
              </linearGradient>
            </defs>
          </svg>

          <svg className="absolute top-2 right-2 w-12 h-12" viewBox="0 0 50 50">
            <path
              d="M50,0 L30,0 L40,10 L50,20 Z"
              fill={player.teamColor}
              opacity="0.6"
            />
            <path
              d="M48,2 L35,2 L40,7 L48,15 Z"
              fill={player.teamColor}
              opacity="0.4"
            />
          </svg>

          <svg
            className="absolute bottom-2 left-2 w-12 h-12"
            viewBox="0 0 50 50"
          >
            <path
              d="M0,50 L20,50 L10,40 L0,30 Z"
              fill={player.teamColor}
              opacity="0.6"
            />
            <path
              d="M2,48 L15,48 L10,43 L2,35 Z"
              fill={player.teamColor}
              opacity="0.4"
            />
          </svg>

          <svg
            className="absolute bottom-2 right-2 w-12 h-12"
            viewBox="0 0 50 50"
          >
            <path
              d="M50,50 L30,50 L40,40 L50,30 Z"
              fill={player.teamColor}
              opacity="0.6"
            />
            <path
              d="M48,48 L35,48 L40,43 L48,35 Z"
              fill={player.teamColor}
              opacity="0.4"
            />
          </svg>

          {/* Side decorative lines */}
          <div className="absolute top-20 bottom-20 left-0 w-2">
            <div
              className="h-full"
              style={{
                background: `linear-gradient(180deg, transparent, ${player.teamColor}60 50%, transparent)`,
              }}
            />
          </div>
          <div className="absolute top-20 bottom-20 right-0 w-2">
            <div
              className="h-full"
              style={{
                background: `linear-gradient(180deg, transparent, ${player.teamColor}60 50%, transparent)`,
              }}
            />
          </div>
        </div>

        {/* WORLDS CHAMPION EXCLUSIVE EFFECTS */}
        {isWorldsChampion && (
          <>
            {/* Subtle golden aura */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(
                  circle at 50% 50%,
                  rgba(212, 175, 55, 0.15) 0%,
                  rgba(201, 168, 80, 0.08) 30%,
                  transparent 60%
                )`,
              }}
            />

            {/* Elegant floating particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`gold-particle-${i}`}
                className="absolute w-0.5 h-0.5 rounded-full pointer-events-none"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: "rgba(212, 175, 55, 0.6)",
                  boxShadow: "0 0 8px rgba(212, 175, 55, 0.4)",
                }}
                animate={{
                  y: ["-20%", "20%"],
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </>
        )}

        {/* Animated border glow */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `conic-gradient(from ${glareX * 3.6}deg at 50% 50%, 
              ${player.teamColor}00 0deg,
              ${player.teamColor}${isWorldsChampion ? "60" : "80"} 90deg,
              ${player.teamColor}00 180deg,
              ${player.teamColor}${isWorldsChampion ? "60" : "80"} 270deg,
              ${player.teamColor}00 360deg
            )`,
            opacity: isHovered ? (isWorldsChampion ? 0.7 : 0.6) : 0,
            transition: "opacity 0.3s ease",
            filter: "blur(8px)",
          }}
        />

        {/* Subtle energy particles - only on hover */}
        {isHovered &&
          sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              layoutId={`sparkle-${player.id}-${sparkle.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                backgroundColor: player.teamColor || "white",
                boxShadow: `0 0 ${sparkle.size * 4}px ${player.teamColor || "rgba(255, 255, 255, 0.6)"}`,
                willChange: "opacity, transform",
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        {/* Holographic glare effect */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            background: `
              radial-gradient(
                circle at ${glareX}% ${glareY}%,
                rgba(255, 255, 255, 0.6) 0%,
                rgba(255, 255, 255, 0.3) 15%,
                transparent 40%
              )
            `,
            mixBlendMode: "overlay",
            opacity: isHovered ? 1 : 0,
            willChange: isHovered ? "opacity" : "auto",
          }}
        />

        {/* Subtle iridescent effect */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `
              repeating-linear-gradient(
                ${(glareX - 50) * 2}deg,
                rgba(255, 255, 255, 0.05) 0px,
                rgba(255, 255, 255, 0.1) 20%,
                rgba(255, 255, 255, 0.05) 40%,
                transparent 60%
              )
            `,
            mixBlendMode: "overlay",
            opacity: isHovered ? 0.3 : 0,
            filter: "blur(2px)",
            willChange: isHovered ? "opacity" : "auto",
          }}
        />

        {/* Diamond shine sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                110deg,
                transparent 0%,
                transparent 40%,
                rgba(255, 255, 255, 0.8) 50%,
                transparent 60%,
                transparent 100%
              )
            `,
            mixBlendMode: "overlay",
            willChange: isHovered ? "transform" : "auto",
          }}
          animate={
            isHovered
              ? {
                  x: ["-100%", "200%"],
                }
              : { x: "-100%" }
          }
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 0.5,
          }}
        />

        {/* Player Info */}
        <div
          className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* Top Section */}
          <div>
            <motion.div
              className="text-lol-gold font-bold text-[10px] sm:text-xs tracking-wider mb-1"
              style={{
                textShadow: `
                  0 0 10px ${player.teamColor},
                  0 2px 4px rgba(0,0,0,0.8),
                  0 0 20px ${player.teamColor}80
                `,
              }}
              animate={
                isHovered
                  ? {
                      textShadow: [
                        `0 0 10px ${player.teamColor}, 0 2px 4px rgba(0,0,0,0.8)`,
                        `0 0 20px ${player.teamColor}, 0 2px 4px rgba(0,0,0,0.8)`,
                        `0 0 10px ${player.teamColor}, 0 2px 4px rgba(0,0,0,0.8)`,
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {player.position}
            </motion.div>
            <div
              className="text-white font-bold text-xl sm:text-2xl mb-1 truncate"
              style={{
                textShadow: `
                  0 4px 8px rgba(0,0,0,0.9),
                  0 0 15px ${player.teamColor}60,
                  0 0 30px ${player.teamColor}40
                `,
              }}
            >
              {player.name}
            </div>
            {player.realName && (
              <div className="text-lol-light text-[10px] sm:text-xs truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {player.realName}
              </div>
            )}
            {(player.championshipLeague === "WORLDS" ||
              player.championshipLeague === "MSI" ||
              (player.isWinner &&
                (player.region === "LCK" ||
                  player.region === "LPL" ||
                  player.region === "LEC"))) && (
              <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-1 w-full p-1.5 sm:p-[10px] bg-[#3a3636] opacity-50 rounded-lg items-center">
                {player.championshipLeague === "WORLDS" && (
                  <div>
                    <img
                      src="/worlds.svg"
                      alt="Worlds Championship winner badge - global tournament champion icon"
                      className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2"
                    />
                  </div>
                )}
                {player.region === "LCK" && player.isWinner && (
                  <div>
                    <img
                      src="/lck.svg"
                      alt="LCK League of Legends Champions Korea trophy icon - Korean league winner badge"
                      className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2"
                    />
                  </div>
                )}
                {player.region === "LPL" && player.isWinner && (
                  <div>
                    <img
                      src="/lpl.svg"
                      alt="LPL League of Legends Pro League China trophy icon - Chinese league winner badge"
                      className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2"
                    />
                  </div>
                )}
                {player.region === "LEC" && player.isWinner && (
                  <div>
                    <img
                      src="/lec.webp"
                      alt="LEC League of Legends European Championship trophy icon - European league winner badge"
                      className="h-6 w-5 sm:h-10 sm:w-8 mb-1 sm:mb-2"
                    />
                  </div>
                )}

                {player.championshipLeague === "MSI" && (
                  <div>
                    <img
                      src="/msi.svg"
                      alt="MSI Mid-Season Invitational trophy icon - international tournament winner badge"
                      className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <motion.span
                className="text-xl sm:text-2xl"
                style={{
                  filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 0 10px ${player.teamColor}60)`,
                }}
                animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {getFlagEmoji(player.iso)}
              </motion.span>
              <span
                className="text-lol-light text-xs sm:text-sm truncate"
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                {player.nationality}
              </span>
            </div>
            <motion.div
              className="px-2 sm:px-3 py-1 rounded-lg text-white text-xs sm:text-sm font-bold truncate relative overflow-hidden"
              style={{
                backgroundColor: isWorldsChampion
                  ? "#FFD700"
                  : player.teamColor,
                color: isWorldsChampion ? "#000" : "#fff",
                boxShadow: isWorldsChampion
                  ? `
                    0 4px 12px rgba(0, 0, 0, 0.6),
                    0 0 30px rgba(255, 215, 0, 0.9),
                    inset 0 1px 0 rgba(255, 255, 255, 0.5),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.3)
                  `
                  : `
                    0 4px 12px rgba(0, 0, 0, 0.6),
                    0 0 20px ${player.teamColor}70,
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `,
              }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Team badge shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: isWorldsChampion
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: isWorldsChampion ? 1.5 : 2,
                  repeat: Infinity,
                  repeatDelay: isWorldsChampion ? 0.5 : 1,
                }}
              />
              <span className="relative z-10">{player.teamShort}</span>
            </motion.div>
            <div
              className="text-lol-gold text-base sm:text-lg font-bold"
              style={{
                textShadow: `
                  0 2px 4px rgba(0,0,0,0.8),
                  0 0 10px ${player.teamColor}60
                `,
              }}
            >
              {player.year}
            </div>
          </div>
        </div>

        {/* Hexagon pattern overlay */}
        <div className="absolute inset-0 hexagon-pattern opacity-15 pointer-events-none"></div>

        {/* Enhanced gradient overlay with dynamic glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: `
              linear-gradient(180deg, transparent 0%, ${player.teamColor}${isHovered ? "70" : "50"} 100%),
              radial-gradient(circle at ${glareX}% ${glareY}%, ${player.teamColor}40 0%, transparent 50%)
            `,
            opacity: isHovered ? 0.5 : 0.35,
          }}
        ></div>

        {/* Metallic edge highlight with animation */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `
              inset 0 0 30px rgba(255, 255, 255, ${isHovered ? "0.15" : "0.08"}),
              inset 0 -2px 15px ${player.teamColor}${isHovered ? "80" : "60"},
              inset 0 2px 15px ${player.teamColor}40
            `,
          }}
          animate={
            isHovered
              ? {
                  boxShadow: [
                    `inset 0 0 30px rgba(255, 255, 255, 0.15), inset 0 -2px 15px ${player.teamColor}80`,
                    `inset 0 0 40px rgba(255, 255, 255, 0.2), inset 0 -2px 20px ${player.teamColor}`,
                    `inset 0 0 30px rgba(255, 255, 255, 0.15), inset 0 -2px 15px ${player.teamColor}80`,
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Floating light orbs */}
        {isHovered &&
          [1, 2, 3].map((i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: player.teamColor,
                boxShadow: `0 0 20px ${player.teamColor}, 0 0 40px ${player.teamColor}80`,
                left: `${20 * i}%`,
                top: "50%",
                willChange: "transform, opacity",
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
      </motion.div>{" "}
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
