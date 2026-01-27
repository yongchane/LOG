"use client";

import { Player } from "@/types";
import { m as motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, RefObject } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PlayerCard from "./PlayerCard";

interface GachaModalProps {
  player: Player | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  pickBgmRef: RefObject<HTMLAudioElement | null>;
  cardBgmRef: RefObject<HTMLAudioElement | null>;
}

export default function GachaModal({
  player,
  isOpen,
  onConfirm,
  onCancel,
  pickBgmRef,
  cardBgmRef,
}: GachaModalProps) {
  const [stage, setStage] = useState<
    "loading" | "nationality" | "league" | "reveal" | "show"
  >("loading");
  const [displayPlayer, setDisplayPlayer] = useState<Player | null>(null);
  const prevPlayerIdRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t, showWorldsAnimation } = useLanguage();
  const isWorldsWinner =
    player?.isWinner && player?.championshipLeague === "WORLDS";
  const isFaker = player?.name === "Faker" && player?.position === "MID";
  // Use FIFA-style animation only if enabled
  const useFifaAnimation = showWorldsAnimation && isWorldsWinner;

  useEffect(() => {
    if (isOpen && player) {
      // Check if player changed (for reroll case)
      const playerChanged = prevPlayerIdRef.current !== player.id;

      if (playerChanged) {
        // Immediately set to loading to prevent showing new player info
        setStage("loading");
        setDisplayPlayer(null); // Clear previous player immediately
        prevPlayerIdRef.current = player.id;
      }

      // Special FIFA-style reveal sequence for Worlds winners (1.6x slower for better viewing)
      if (useFifaAnimation) {
        const timer1 = setTimeout(() => {
          if (prevPlayerIdRef.current === player.id) {
            setStage("nationality");

            // Stop pick BGM and start card BGM when loading ends (no gap)
            if (pickBgmRef.current && !pickBgmRef.current.paused) {
              pickBgmRef.current.pause();
              pickBgmRef.current.currentTime = 0;
            }
            if (cardBgmRef.current) {
              cardBgmRef.current.currentTime = 0;
              cardBgmRef.current.play().catch((error) => {
                console.log("Card BGM play failed:", error);
              });
            }
          }
        }, 2560);
        const timer2 = setTimeout(() => {
          if (prevPlayerIdRef.current === player.id) {
            setStage("league");
          }
        }, 3840);
        const timer3 = setTimeout(() => {
          if (prevPlayerIdRef.current === player.id) {
            setStage("reveal");
          }
        }, 5120);
        const timer4 = setTimeout(() => {
          if (prevPlayerIdRef.current === player.id) {
            setStage("show");
            setDisplayPlayer(player);

            // Play Faker audio when Faker is revealed
            if (isFaker) {
              if (!audioRef.current) {
                audioRef.current = new Audio("/faker.mp3");
                audioRef.current.volume = 0.3;
              }
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch((error) => {
                console.log("Audio play failed:", error);
              });
            }
          }
        }, 6720);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
        };
      } else {
        // Normal reveal sequence
        const timer1 = setTimeout(() => {
          if (prevPlayerIdRef.current === player.id) {
            setStage("reveal");

            // Stop pick BGM and start card BGM when reveal animation starts
            if (pickBgmRef.current && !pickBgmRef.current.paused) {
              pickBgmRef.current.pause();
              pickBgmRef.current.currentTime = 0;
            }
            if (cardBgmRef.current) {
              cardBgmRef.current.currentTime = 0;
              cardBgmRef.current.play().catch((error) => {
                console.log("Card BGM play failed:", error);
              });
            }
          }
        }, 1600);
        const timer2 = setTimeout(() => {
          if (prevPlayerIdRef.current === player.id) {
            setStage("show");
            setDisplayPlayer(player);

            // Play Faker audio when Faker is revealed
            if (isFaker) {
              if (!audioRef.current) {
                audioRef.current = new Audio("/faker.mp3");
                audioRef.current.volume = 0.3;
              }
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch((error) => {
                console.log("Audio play failed:", error);
              });
            }
          }
        }, 2650); // 1600 + 950(animation) + 100(buffer) = 2650ms

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    }
  }, [isOpen, player, useFifaAnimation, isFaker, pickBgmRef, cardBgmRef]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!isOpen || !player) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Faker special background image */}
          {isFaker && stage === "show" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 1.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.3,
                duration: 1.5,
                ease: "easeOut",
              }}
            >
              <img
                src="/faker.png"
                alt="Faker"
                className="w-full h-full object-cover opacity-30"
                style={{
                  mixBlendMode: "screen",
                }}
              />
              {/* Golden glow overlay for Faker */}
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 via-transparent to-yellow-400/10" />
            </motion.div>
          )}
        </motion.div>

        {/* Modal Content */}
        <div className="relative z-10 w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* Loading Stage - LOL Queue style */}
            {stage === "loading" && (
              <motion.div
                key="loading"
                className="flex flex-col items-center justify-center gap-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
              >
                {/* Circular Loading Container */}
                <div className="relative w-80 h-80 flex items-center justify-center">
                  {/* Outer golden frame */}
                  <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 opacity-80" />

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-600/20 to-blue-500/20 blur-2xl" />

                  {/* Animated circular progress */}
                  <svg
                    className="absolute inset-0 w-full h-full rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(30, 35, 40, 0.5)"
                      strokeWidth="2"
                    />

                    {/* Animated progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#blueGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 283" }}
                      animate={{ strokeDasharray: "283 283" }}
                      transition={{
                        duration: 1.6,
                        ease: "easeInOut",
                      }}
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))",
                      }}
                    />

                    <defs>
                      <linearGradient
                        id="blueGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Inner content */}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    {/* Icon container with glow */}
                    <motion.div
                      className="relative"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {/* Icon glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-lg blur-xl opacity-60" />

                      {/* Icon */}
                      {/* <div className="relative bg-gradient-to-br from-yellow-600/30 to-blue-600/30 p-8 rounded-lg backdrop-blur-sm border-2 border-yellow-500/50"> */}
                      <img
                        src="/loading.webp"
                        alt="LOL Logo"
                        className="h-20 w-20"
                      />
                    </motion.div>

                    {/* Text */}
                    <motion.div
                      className="mt-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-2xl font-bold text-white mb-2">
                        {t("findingPlayers")}
                      </div>
                    </motion.div>
                  </div>

                  {/* Rotating outer ring effect */}
                  <motion.div
                    className="absolute inset-2 rounded-full border border-yellow-500/30"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      borderStyle: "dashed",
                    }}
                  />
                </div>

                {/* Bottom action hint (optional) */}
                {/* <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30">
                  <span className="text-yellow-400 font-bold">수락</span>
                </div>
              </motion.div> */}
              </motion.div>
            )}

            {/* Nationality Stage - FIFA style (Worlds winners only) */}
            {stage === "nationality" && (
              <motion.div
                key="nationality"
                className="flex flex-col items-center justify-center gap-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
              >
                {/* Golden particle effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        y: [0, -100],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.05,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                {/* Giant flag */}
                <motion.div
                  className="text-[200px] leading-none"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  {getFlagEmoji(player.iso)}
                </motion.div>

                {/* Nationality text */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-4xl font-bold text-white mb-2">
                    {player.nationality}
                  </div>
                  <div className="text-lol-gold text-xl">국적</div>
                </motion.div>

                {/* Golden glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-transparent to-transparent blur-3xl pointer-events-none" />
              </motion.div>
            )}

            {/* League Stage - FIFA style (Worlds winners only) */}
            {stage === "league" && (
              <motion.div
                key="league"
                className="flex flex-col items-center justify-center gap-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
              >
                {/* Golden rays removed - was causing visual bug */}

                {/* Worlds Trophy */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-60 animate-pulse" />

                  {/* Trophy */}
                  <img
                    src="/worlds.svg"
                    alt="Worlds Trophy"
                    className="relative h-40 w-40"
                  />
                </motion.div>

                {/* Championship text */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-2">
                    WORLDS
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {player.championshipYear || player.year} Champion
                  </div>
                </motion.div>

                {/* Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-3xl"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ scale: 0, opacity: 0, rotate: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reveal Stage - Card flip */}
            {stage === "reveal" && player && (
              <motion.div
                key="reveal"
                className="relative w-full aspect-[3/4]"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 0.95, ease: "easeInOut" }}
                >
                  {/* Card Back */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      backfaceVisibility: "hidden",
                      background: "linear-gradient(135deg, #1a140d 0%, #000 100%)",
                      border: "3px solid #C89B3C",
                    }}
                  >
                    {/* Golden Inner Frame */}
                    <div className="absolute inset-2 border border-[#C89B3C]/30 rounded-xl pointer-events-none" />
                    
                    {/* Filigree Patterns */}
                    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 300 400">
                      <circle cx="150" cy="200" r="120" fill="none" stroke="#C89B3C" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="0" y1="200" x2="300" y2="200" stroke="#C89B3C" strokeWidth="0.5" />
                      <line x1="150" y1="0" x2="150" y2="400" stroke="#C89B3C" strokeWidth="0.5" />
                    </svg>

                    {/* Central Elements */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {/* League Logo (Restored) */}
                      {player.region && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0.8, scale: 1 }}
                          className="relative z-10"
                        >
                          <img
                            src={`/${player.region.toLowerCase()}.${player.region === "LEC" ? "webp" : "svg"}`}
                            alt={`${player.region} Logo`}
                            className="w-32 h-32 opacity-90 brightness-110 drop-shadow-[0_0_15px_rgba(200,155,60,0.5)]"
                          />
                        </motion.div>
                      )}

                      {/* Top Crown Ornament */}
                      <div className="absolute top-6 text-lol-gold opacity-60">
                        <svg width="40" height="25" viewBox="0 0 60 40" fill="currentColor">
                          <path d="M30,5 L40,20 L55,10 L50,35 L10,35 L5,10 L20,20 Z" />
                        </svg>
                      </div>
                    </div>

                    {/* Corner Symbols */}
                    <div className="absolute top-4 left-4 text-lol-gold/40 text-xs">✦</div>
                    <div className="absolute top-4 right-4 text-lol-gold/40 text-xs">✦</div>
                    <div className="absolute bottom-4 left-4 text-lol-gold/40 text-xs">✦</div>
                    <div className="absolute bottom-4 right-4 text-lol-gold/40 text-xs">✦</div>
                  </div>

                  {/* Card Front (Generic Reveal) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-lg flex items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "rgba(10, 15, 20, 0.95)",
                      border: `3px solid ${player.teamColor || '#3b82f6'}`,
                    }}
                  >
                    <div 
                      className="text-7xl font-black opacity-10"
                      style={{ color: player.teamColor || '#3b82f6' }}
                    >
                      {player.position}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Show Stage - Full card reveal */}
            {stage === "show" &&
              displayPlayer &&
              displayPlayer.id === player.id && (
                <motion.div
                  key={`show-${player.id}`}
                  className="flex flex-col items-center w-full"
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <div className="relative w-full max-w-sm mx-auto">
                    {/* Sparkle effects layer (in front of card) */}
                    <div className="absolute inset-0 pointer-events-none z-50">
                      {(displayPlayer.isWinner && displayPlayer.championshipLeague === 'WORLDS') ? (
                        <>
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={`sparkle-${i}`}
                              className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                              }}
                              animate={{
                                scale: [0, 1.2, 0],
                                opacity: [0, 1, 0],
                                y: [0, -40],
                              }}
                              transition={{
                                duration: 2,
                                delay: i * 0.1,
                                repeat: Infinity,
                              }}
                            />
                          ))}
                        </>
                      ) : (
                        [...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-lol-gold rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 0.8, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))
                      )}
                    </div>

                    {/* USE UNIFIED PLAYERCARD COMPONENT */}
                    <div className="relative z-10 scale-100 sm:scale-125 mb-24 sm:mb-32">
                      <PlayerCard player={displayPlayer} position={displayPlayer.position} />
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <motion.div
                    className="flex gap-4 mt-4 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <button
                      onClick={onCancel}
                      className="flex-1 px-6 py-3 rounded-lg font-bold text-white bg-lol-grey hover:bg-lol-grey/80 transition-colors uppercase tracking-wider text-sm"
                    >
                      {t("reroll")}
                    </button>
                    <button
                      onClick={onConfirm}
                      className="flex-1 px-6 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(200,155,60,0.4)]"
                    >
                      {t("confirm")}
                    </button>
                  </motion.div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getFlagEmoji(isoCode: string): string {
  const codePoints = isoCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
