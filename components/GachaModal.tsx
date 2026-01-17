"use client";

import { Player } from "@/types";
import { m as motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { getTranslations, getLanguage } from "@/lib/i18n";

interface GachaModalProps {
  player: Player | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function GachaModal({
  player,
  isOpen,
  onConfirm,
  onCancel,
}: GachaModalProps) {
  const [stage, setStage] = useState<
    "loading" | "nationality" | "league" | "reveal" | "show"
  >("loading");
  const [displayPlayer, setDisplayPlayer] = useState<Player | null>(null);
  const prevPlayerIdRef = useRef<string | null>(null);
  const t = getTranslations(getLanguage());
  const isWorldsWinner =
    player?.isWinner && player?.championshipLeague === "WORLDS";

  useEffect(() => {
    if (isOpen && player) {
      // Check if player changed (for reroll case)
      const playerChanged = prevPlayerIdRef.current !== player.id;

      if (playerChanged) {
        // Immediately set to loading to prevent showing new player info
        setStage("loading");
        prevPlayerIdRef.current = player.id;
      }

      // Special FIFA-style reveal sequence for Worlds winners (1.6x slower for better viewing)
      if (isWorldsWinner) {
        const timer1 = setTimeout(() => setStage("nationality"), 2560);
        const timer2 = setTimeout(() => setStage("league"), 3840);
        const timer3 = setTimeout(() => setStage("reveal"), 5120);
        const timer4 = setTimeout(() => {
          setStage("show");
          setDisplayPlayer(player);
        }, 6720);  

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
        };
      } else {
        // Normal reveal sequence
        const timer1 = setTimeout(() => setStage("reveal"), 1600);
        const timer2 = setTimeout(() => {
          setStage("show");
          setDisplayPlayer(player);
        }, 2600);  // 2600 → 3200 (600ms 증가)

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    }
  }, [isOpen, player, isWorldsWinner]);

  if (!isOpen || !player) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onCancel}
        />

        {/* Modal Content */}
        <div className="relative z-10 w-full max-w-md mx-4">
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
                      당신의 선수를 찾았습니다!
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
            {stage === "reveal" && (
              <motion.div
                key="reveal"
                className="perspective-1000 preserve-3d"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
              <div
                className="w-full aspect-[3/4] rounded-lg flex items-center justify-center backface-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #C89B3C 0%, #937341 100%)",
                  boxShadow: "0 0 40px rgba(200, 155, 60, 0.6)",
                }}
              >
                {/* League icon on card back */}
                {player.region && (
                  <motion.img
                    src={`/${player.region.toLowerCase()}.${
                      player.region === "LEC" ? "webp" : "svg"
                    }`}
                    alt={`${player.region} Logo`}
                    className="w-32 h-32 opacity-80"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </motion.div>
            )}

            {/* Show Stage - Full card reveal */}
            {stage === "show" && displayPlayer && (
              <motion.div
                key="show"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
              {/* Golden rays removed - was causing visual bug */}

              {/* Sparkle effects layer (in front of card) */}
              <div className="absolute inset-0 pointer-events-none">
                {isWorldsWinner ? (
                  <>
                    {/* More particles for Worlds winners */}
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={`sparkle-${i}`}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      />
                    ))}
                  </>
                ) : (
                  /* Normal sparkles for regular players */
                  [...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-lol-gold rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  ))
                )}
              </div>

              {/* Player Card Container with overflow visible for badge */}
              <div className="relative w-full aspect-[3/4]">
                {/* Championship badge - positioned to overlap card edge */}
                {displayPlayer.isWinner && displayPlayer.championshipLeague && (
                  <motion.div
                    className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 md:-top-8 md:-right-8 z-30"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse" />

                      {/* Trophy badge */}
                      {displayPlayer.championshipLeague === "WORLDS" && (
                        <div
                          className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 p-2 sm:p-3 md:p-4 rounded-full shadow-2xl"
                          style={{
                            boxShadow:
                              "0 0 30px rgba(250, 204, 21, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)",
                          }}
                        >
                          {/* <div className="text-5xl">🏆</div> */}
                          <img
                            src="/worlds.svg"
                            alt="Champion Trophy"
                            className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10"
                          />
                        </div>
                      )}

                      {/* Championship info tooltip */}
                      <motion.div
                        className="absolute top-full mt-1 sm:mt-2 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 bg-black/90 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-bold text-center shadow-xl max-w-[120px] md:max-w-[180px] md:whitespace-nowrap"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{
                          border: "2px solid #facc15",
                        }}
                      >
                        {t.championshipWinner(
                          displayPlayer.championshipYear || displayPlayer.year,
                          displayPlayer.championshipLeague
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Player Card */}
                <div
                  className="w-full aspect-[3/4] rounded-lg overflow-hidden relative"
                  style={{
                    background: `linear-gradient(135deg, ${displayPlayer.teamColor}60 0%, rgba(30, 35, 40, 0.95) 100%)`,
                    border: `3px solid ${displayPlayer.teamColor}`,
                    boxShadow: `0 0 40px ${displayPlayer.teamColor}80`,
                  }}
                >
                  {/* Card content */}

                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top section */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="text-lol-gold font-bold text-sm tracking-widest mb-2">
                        {displayPlayer.position}
                      </div>
                      <div className="text-white font-bold text-4xl mb-2 drop-shadow-lg">
                        {displayPlayer.name}
                      </div>

                      {displayPlayer.realName && (
                        <div className="text-lol-light text-base">
                          {displayPlayer.realName}
                        </div>
                      )}
                      {(displayPlayer.championshipLeague === "WORLDS" ||
                        displayPlayer.championshipLeague === "MSI" ||
                        (displayPlayer.isWinner &&
                          (displayPlayer.region === "LCK" ||
                            displayPlayer.region === "LPL" ||
                            displayPlayer.region === "LEC"))) && (
                        <div className="flex gap-2 mt-4 w-full p-[10px] bg-[#3a3636] opacity-50 rounded-lg items-center">
                          {displayPlayer.championshipLeague === "WORLDS" && (
                            <div>
                              <img
                                src="/worlds.svg"
                                alt="Champion Banner"
                                className="h-10 w-10 mb-2"
                              />
                            </div>
                          )}
                          {displayPlayer.region === "LCK" &&
                            displayPlayer.isWinner && (
                              <div>
                                <img
                                  src="/lck.svg"
                                  alt="Champion Banner"
                                  className="h-10 w-10 mb-2"
                                />
                              </div>
                            )}
                          {displayPlayer.region === "LPL" &&
                            displayPlayer.isWinner && (
                              <div>
                                <img
                                  src="/lpl.svg"
                                  alt="Champion Banner"
                                  className="h-10 w-10 mb-2"
                                />
                              </div>
                            )}
                          {displayPlayer.region === "LEC" &&
                            displayPlayer.isWinner && (
                              <div>
                                <img
                                  src="/lec.webp"
                                  alt="Champion Banner"
                                  className="h-10 w-8 mb-2"
                                />
                              </div>
                            )}

                          {displayPlayer.championshipLeague === "MSI" && (
                            <div>
                              <img
                                src="/msi.svg"
                                alt="Champion Banner"
                                className="h-10 w-10 mb-2"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>

                    {/* Middle - Large team logo area (placeholder) */}
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div
                        className="text-6xl font-bold opacity-20"
                        style={{ color: displayPlayer.teamColor }}
                      >
                        {displayPlayer.teamShort}
                      </div>
                    </motion.div>

                    {/* Bottom section */}
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">
                          {getFlagEmoji(displayPlayer.iso)}
                        </span>
                        <span className="text-lol-light text-base">
                          {displayPlayer.nationality}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div
                          className="px-4 py-2 rounded text-white text-base font-bold"
                          style={{ backgroundColor: displayPlayer.teamColor }}
                        >
                          {displayPlayer.teamFull}
                        </div>
                        <div className="text-lol-gold text-2xl font-bold">
                          {displayPlayer.year}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Hexagon pattern */}
                  <div className="absolute inset-0 hexagon-pattern opacity-20 pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 rounded-lg font-bold text-white bg-lol-grey hover:bg-lol-grey/80 transition-colors"
                >
                  {t.reroll}
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow"
                >
                  {t.confirm}
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
