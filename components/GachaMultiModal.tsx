"use client";

import { Player, Position } from "@/types";
import { m as motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, RefObject } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PlayerCard from "./PlayerCard";

interface GachaMultiModalProps {
  players: Map<Position, Player>;
  isOpen: boolean;
  onConfirm: () => void;
  onRerollAll: () => void;
  pickBgmRef: RefObject<HTMLAudioElement | null>;
  cardBgmRef: RefObject<HTMLAudioElement | null>;
}

export default function GachaMultiModal({
  players,
  isOpen,
  onConfirm,
  onRerollAll,
  pickBgmRef,
  cardBgmRef,
}: GachaMultiModalProps) {
  const [stage, setStage] = useState<"loading" | "reveal">("loading");
  const [displayPlayers, setDisplayPlayers] = useState<Map<Position, Player>>(
    new Map(),
  );
  const prevPlayersKeyRef = useRef<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen && players.size > 0) {
      // Create a unique key for current players set
      const currentKey = Array.from(players.values())
        .map((p) => p.id)
        .sort()
        .join("-");

      const playersChanged = prevPlayersKeyRef.current !== currentKey;

      if (playersChanged) {
        // Immediately set to loading to prevent showing previous players
        setStage("loading");
        setDisplayPlayers(new Map()); // Clear previous players immediately
        prevPlayersKeyRef.current = currentKey;
      }

      const timer = setTimeout(() => {
        if (prevPlayersKeyRef.current === currentKey) {
          setStage("reveal");
          setDisplayPlayers(new Map(players));

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

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, players, pickBgmRef, cardBgmRef]);

  if (!isOpen || players.size === 0) return null;

  const positionOrder: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop - no onClick to prevent accidental reroll */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal Content */}
        <div className="relative z-10 w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {/* Loading Stage */}
            {stage === "loading" && (
              <motion.div
                key="loading"
                className="flex flex-col items-center justify-center gap-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
              >
                <div className="relative w-80 h-80 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 opacity-80" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-600/20 to-blue-500/20 blur-2xl" />

                  <svg
                    className="absolute inset-0 w-full h-full rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(30, 35, 40, 0.5)"
                      strokeWidth="2"
                    />
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
                      transition={{ duration: 1.6, ease: "easeInOut" }}
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

                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <motion.div
                      className="relative"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-lg blur-xl opacity-60" />
                      <img
                        src="/loading.webp"
                        alt="LOL Logo"
                        className="h-20 w-20"
                      />
                    </motion.div>

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

                  <motion.div
                    className="absolute inset-2 rounded-full border border-yellow-500/30"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ borderStyle: "dashed" }}
                  />
                </div>
              </motion.div>
            )}

            {stage === "reveal" && displayPlayers.size > 0 && (
              <motion.div
                key={`reveal-${prevPlayersKeyRef.current}`}
                className="flex flex-col items-center max-h-[85vh] overflow-y-auto w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {/* Cards Grid */}
                <div className={`grid gap-3 md:gap-4 mb-8 w-full px-2 sm:px-0 auto-rows-fr ${
                  displayPlayers.size === 1 ? 'grid-cols-1 max-w-[300px]' :
                  displayPlayers.size === 2 ? 'grid-cols-2 max-w-[600px]' :
                  displayPlayers.size === 3 ? 'grid-cols-2 sm:grid-cols-3 max-w-[900px]' :
                  displayPlayers.size === 4 ? 'grid-cols-2 sm:grid-cols-4 max-w-[1000px]' :
                  'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
                }`}>
                  {positionOrder
                    .filter(pos => displayPlayers.has(pos))
                    .map((pos, index) => {
                      const player = displayPlayers.get(pos);
                      return (
                        <motion.div
                          key={pos}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          }}
                        >
                          <PlayerCard player={player || null} position={pos} />
                        </motion.div>
                      );
                    })}
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-4 w-full max-w-md pb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={onRerollAll}
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
