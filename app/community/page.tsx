"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  getCommunityRosters,
  addLike,
  addComment,
  getUserName,
  saveUserName,
  CommunityRoster,
} from "@/lib/community-storage";
import { Player, Position } from "@/types";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export default function CommunityPage() {
  const [rosters, setRosters] = useState<CommunityRoster[]>([]);
  const [userName, setUserName] = useState("");
  const [selectedRoster, setSelectedRoster] = useState<CommunityRoster | null>(
    null
  );
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    loadData();
    const stored = getUserName();
    if (stored) setUserName(stored);
  }, []);

  const loadData = async () => {
    const data = await getCommunityRosters();
    setRosters(data);
  };

  const handleLike = async (rosterId: string) => {
    await addLike(rosterId);
    loadData();
  };

  const handleComment = async (rosterId: string) => {
    if (!commentInput.trim() || !userName.trim()) return;

    await addComment(rosterId, userName, commentInput);
    setCommentInput("");
    loadData();

    // Update selected roster if viewing
    if (selectedRoster?.id === rosterId) {
      const updated = rosters.find((r) => r.id === rosterId);
      if (updated) setSelectedRoster({ ...updated });
    }
  };

  const handleSaveUserName = () => {
    if (userName.trim()) {
      saveUserName(userName);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

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
                <p className="text-lol-light text-sm">Community Page</p>
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
      <main className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Community Rosters
          </h2>
          <p className="text-lol-light text-lg">
            Share your legendary rosters and see what others have created!
          </p>
        </motion.div>

        {/* Rosters Grid */}
        {rosters.length === 0 ? (
          <motion.div
            className="bg-lol-dark-accent/60 border-2 border-lol-gold/30 rounded-lg p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-lol-gold mb-4">
              No Rosters Yet
            </h3>
            <p className="text-lol-light mb-6">
              Be the first to share your legendary team!
            </p>
            <Link href="/">
              <button className="px-8 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow">
                Create Your Roster
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {rosters.map((roster, index) => {
              const players = POSITIONS.map(
                (pos) =>
                  roster[pos.toLowerCase() as keyof typeof roster] as
                    | Player
                    | undefined
              ).filter(Boolean) as Player[];

              return (
                <motion.div
                  key={roster.id}
                  className="bg-lol-dark-accent/60 border-2 border-lol-gold/30 rounded-lg p-6 hover:border-lol-gold/60 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {roster.authorName}
                      </h3>
                      <p className="text-lol-light text-sm">
                        {formatTimeAgo(roster.sharedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLike(roster.id)}
                      className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold transition-all"
                    >
                      ❤️ {roster.likes}
                    </button>
                  </div>

                  {/* Championship Badge */}
                  {roster.championship && (
                    <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border border-yellow-500/50">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {roster.championship.type === "winner" ? "🏆" : "🥈"}
                        </span>
                        <span className="text-yellow-400 font-bold">
                          {roster.championship.year}{" "}
                          {roster.championship.season || ""}{" "}
                          {roster.championship.league}{" "}
                          {roster.championship.type === "winner"
                            ? "Champions"
                            : "Runners-up"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Players Grid */}
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {POSITIONS.map((pos) => {
                      const player = roster[
                        pos.toLowerCase() as keyof typeof roster
                      ] as Player | undefined;
                      return (
                        <div
                          key={pos}
                          className="bg-lol-dark-lighter border border-lol-gold/20 rounded-lg p-3 text-center"
                        >
                          <div className="text-xs text-lol-gold font-bold mb-1">
                            {pos}
                          </div>
                          {player ? (
                            <>
                              <div className="text-white font-bold text-sm mb-1">
                                {player.name}
                              </div>
                              <div className="text-lol-light text-xs">
                                {player.teamShort}
                              </div>
                              <div className="text-lol-light text-xs">
                                {player.year}
                              </div>
                            </>
                          ) : (
                            <div className="text-lol-light text-xs">Empty</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-lol-gold/20 pt-4">
                    <div className="text-sm font-bold text-lol-light mb-2">
                      💬 Comments ({roster.comments.length})
                    </div>

                    {roster.comments.length > 0 && (
                      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                        {roster.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-lol-dark-lighter p-2 rounded"
                          >
                            <span className="text-lol-gold text-sm font-bold">
                              {comment.author}:{" "}
                            </span>
                            <span className="text-white text-sm">
                              {comment.content}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={
                          selectedRoster?.id === roster.id ? commentInput : ""
                        }
                        onChange={(e) => {
                          setCommentInput(e.target.value);
                          setSelectedRoster(roster);
                        }}
                        onFocus={() => setSelectedRoster(roster)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 rounded bg-lol-dark-lighter border border-lol-gold/30 text-white text-sm placeholder-lol-light/50 focus:outline-none focus:border-lol-gold"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleComment(roster.id);
                        }}
                      />
                      <button
                        onClick={() => handleComment(roster.id)}
                        className="px-4 py-2 rounded bg-lol-gold hover:bg-lol-gold-dark text-black font-bold text-sm transition-all"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-lol-gold/30 bg-lol-dark-accent/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-lol-light text-sm">
          <p>
            Made with ⚡ by League of Legends fans | Data includes LCK, LPL,
            LEC, Worlds, and MSI (2020-2024)
          </p>
        </div>
      </footer>
    </div>
  );
}
