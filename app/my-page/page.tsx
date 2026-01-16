"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  getMyPageStats,
  calculateWinRate,
  calculateOverallWinRate,
  getRecentGames,
  resetStats,
  MyPageStats,
  GameRecord,
  PlayerPickStats,
} from "@/lib/my-page-storage";
import { Position } from "@/types";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

const POSITION_COLORS: Record<Position, string> = {
  TOP: "from-red-600 to-red-800",
  JUNGLE: "from-green-600 to-green-800",
  MID: "from-blue-600 to-blue-800",
  ADC: "from-yellow-600 to-yellow-800",
  SUPPORT: "from-purple-600 to-purple-800",
};

export default function MyPage() {
  const [stats, setStats] = useState<MyPageStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameRecord[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const myStats = getMyPageStats();
    const games = getRecentGames(10);
    setStats(myStats);
    setRecentGames(games);
  };

  const handleReset = () => {
    resetStats();
    loadStats();
    setShowResetConfirm(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;

    // 24시간 이내면 상대 시간 표시
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      if (hours > 0) return `${hours}h ago`;
      if (minutes > 0) return `${minutes}m ago`;
      return "Just now";
    }

    // 그 외에는 날짜 표시
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!stats) {
    return (
      <div className="min-h-screen hextech-bg hexagon-pattern flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const winRate = calculateOverallWinRate(stats);

  return (
    <div className="min-h-screen hextech-bg hexagon-pattern">
      {/* Header */}
      <header className="border-b border-lol-gold/30 bg-lol-dark-accent/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img src="/lol.webp" alt="LOL Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold text-lol-gold">
                  League of Gacha
                </h1>
                <p className="text-lol-light text-sm">My Stats</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/">
            <button className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all">
              ← Back to Home
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Weekly Statistics
          </h2>
          <p className="text-lol-light text-lg">
            Week {stats.weekNumber} - Stats reset every Monday
          </p>
        </motion.div>

        {/* Overall Stats Card */}
        <motion.div
          className="bg-lol-dark-accent/60 border-2 border-lol-gold/30 rounded-lg p-8 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-2xl font-bold text-lol-gold mb-6 text-center">
            This Week&apos;s Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Games */}
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.totalGames}
              </div>
              <div className="text-lol-light text-sm">Total Games</div>
            </div>

            {/* Wins */}
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {stats.wins}
              </div>
              <div className="text-lol-light text-sm">Wins</div>
            </div>

            {/* Losses */}
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">
                {stats.losses}
              </div>
              <div className="text-lol-light text-sm">Losses</div>
            </div>

            {/* Win Rate */}
            <div className="text-center">
              <div className="text-4xl font-bold text-lol-gold mb-2">
                {winRate}%
              </div>
              <div className="text-lol-light text-sm">Win Rate</div>
            </div>
          </div>

          {/* Progress Bar */}
          {stats.totalGames > 0 && (
            <div className="mt-6">
              <div className="h-4 bg-lol-dark-lighter rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="mt-6 text-center">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 transition-all text-sm"
              >
                Reset Stats
              </button>
            ) : (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all text-sm"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:border-lol-gold transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Position Stats */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Most Picked Champions by Position
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {POSITIONS.map((position) => {
              const topPlayers = stats.positionStats[position].slice(0, 5);

              return (
                <div
                  key={position}
                  className="bg-lol-dark-accent/60 border-2 border-lol-gold/30 rounded-lg p-4"
                >
                  <div
                    className={`text-center mb-4 py-2 rounded-lg bg-gradient-to-r ${POSITION_COLORS[position]}`}
                  >
                    <h4 className="text-white font-bold text-lg">{position}</h4>
                  </div>

                  {topPlayers.length === 0 ? (
                    <div className="text-center text-lol-light text-sm py-8">
                      No data yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {topPlayers.map((player, idx) => (
                        <div
                          key={player.playerId}
                          className="bg-lol-dark-lighter p-2 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lol-gold font-bold text-xs">
                                #{idx + 1}
                              </span>
                              <span className="text-white text-sm font-bold">
                                {player.playerName}
                              </span>
                            </div>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: player.teamColor + "40",
                                color: player.teamColor,
                              }}
                            >
                              {player.team}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-lol-light">
                              {player.pickCount} picks
                            </span>
                            <span
                              className={`font-bold ${
                                calculateWinRate(player) >= 50
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {calculateWinRate(player)}% WR
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Match History</h3>

          {recentGames.length === 0 ? (
            <div className="bg-lol-dark-accent/60 border-2 border-lol-gold/30 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-lol-light text-lg">No games played yet</p>
              <p className="text-lol-light/60 text-sm mt-2">
                Play some games to see your history!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div
                  key={game.id}
                  className={`bg-lol-dark-accent/60 border-2 rounded-lg p-4 ${
                    game.result === "win"
                      ? "border-green-500/50"
                      : "border-red-500/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-4 py-1 rounded-lg font-bold ${
                          game.result === "win"
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {game.result === "win" ? "Victory" : "Defeat"}
                      </div>
                      <span className="text-lol-light text-sm">
                        {formatDate(game.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Roster */}
                  <div className="grid grid-cols-5 gap-2">
                    {POSITIONS.map((pos) => {
                      const player = game.roster[
                        pos.toLowerCase() as keyof typeof game.roster
                      ];
                      return (
                        <div
                          key={pos}
                          className="bg-lol-dark-lighter border border-lol-gold/20 rounded p-2 text-center"
                        >
                          <div className="text-xs text-lol-gold font-bold mb-1">
                            {pos}
                          </div>
                          {player && typeof player === "object" ? (
                            <>
                              <div className="text-white text-xs font-bold">
                                {player.name}
                              </div>
                              <div className="text-lol-light text-xs">
                                {player.teamShort}
                              </div>
                            </>
                          ) : (
                            <div className="text-lol-light text-xs">Empty</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-lol-gold/30 bg-lol-dark-accent/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-lol-light text-sm">
          <p>
            Made with ⚡ by League of Legends fans | Stats reset every Monday
            00:00
          </p>
        </div>
      </footer>
    </div>
  );
}
