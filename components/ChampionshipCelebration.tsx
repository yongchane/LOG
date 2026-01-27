'use client';

import { ChampionshipRoster } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ChampionshipCelebrationProps {
  championship: ChampionshipRoster | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChampionshipCelebration({
  championship,
  isOpen,
  onClose,
}: ChampionshipCelebrationProps) {
  const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen && championship) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setConfetti(particles);
    }
  }, [isOpen, championship]);

  if (!championship) return null;

  const getTrophyEmoji = () => {
    switch (championship.type) {
      case 'winner':
        return '🏆';
      case 'runnerUp':
        return '🥈';
      default:
        return '🏅';
    }
  };

  const getTitle = () => {
    const type = championship.type === 'winner' ? 'CHAMPIONS' : 'RUNNERS-UP';
    const season = championship.season ? ` ${championship.season}` : '';
    return `${championship.year}${season} ${championship.league} ${type}!`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: '-10%',
                  background:
                    championship.type === 'winner'
                      ? 'linear-gradient(135deg, #FFD700, #FFA000)'
                      : 'linear-gradient(135deg, #C0C0C0, #808080)',
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                  opacity: [1, 1, 0],
                  rotate: 360 * 3,
                }}
                transition={{
                  duration: mounted ? 3 + Math.random() * 2 : 3,
                  delay: particle.delay,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>

          {/* Content */}
          <motion.div
            className="relative z-10 max-w-2xl mx-4 text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Trophy */}
            <motion.div
              className="text-9xl mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              {getTrophyEmoji()}
            </motion.div>

            {/* Title */}
            <motion.div
              className={`text-5xl font-bold mb-4 ${
                championship.type === 'winner' ? 'champion-glow' : ''
              }`}
              style={{
                background:
                  championship.type === 'winner'
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)'
                    : 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              LEGENDARY!
            </motion.div>

            {/* Championship details */}
            <motion.div
              className="text-2xl text-white font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {getTitle()}
            </motion.div>

            {/* Team name */}
            <motion.div
              className="text-4xl font-bold text-lol-gold mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {championship.team}
            </motion.div>

            {/* Roster list */}
            <motion.div
              className="bg-lol-dark-accent/80 rounded-lg p-6 mb-8 backdrop-blur-sm border-2 border-lol-gold/50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-lol-light text-sm mb-3">ROSTER</div>
              <div className="flex flex-wrap justify-center gap-3">
                {championship.players.map((player, index) => (
                  <motion.div
                    key={player}
                    className="px-4 py-2 bg-lol-dark-lighter rounded-lg border border-lol-gold/30"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <span className="text-white font-bold">{player}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Victory message */}
            <motion.div
              className="text-lol-light text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {championship.type === 'winner'
                ? "You've assembled a championship-winning roster!"
                : "You've assembled a runner-up roster! So close to glory!"}
            </motion.div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="px-8 py-4 rounded-lg font-bold text-black text-lg bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
