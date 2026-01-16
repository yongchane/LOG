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
  hasUserLiked,
  CommunityRoster,
} from "@/lib/community-storage";
import { Player, Position } from "@/types";
import AdSidebar from "@/components/AdSidebar";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export default function CommunityPage() {
  const [rosters, setRosters] = useState<CommunityRoster[]>([]);
  const [userName, setUserName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    loadData();
    const stored = getUserName();
    if (stored) setUserName(stored);

    // 실시간 업데이트: 5초마다 데이터 새로고침
    const interval = setInterval(() => {
      console.log("Auto-refreshing community data...");
      loadData();
    }, 5000); // 5초

    return () => clearInterval(interval);
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
    const comment = commentInputs[rosterId] || "";
    if (!comment.trim() || !userName.trim()) {
      alert("Please enter your name and comment");
      return;
    }

    await addComment(rosterId, userName, comment);

    // Clear only this roster's comment input
    setCommentInputs((prev) => ({
      ...prev,
      [rosterId]: "",
    }));

    loadData();
  };

  const handleSaveUserName = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName);
      saveUserName(tempUserName);
      setIsEditingName(false);
      setTempUserName("");
    }
  };

  const handleStartEditingName = () => {
    setTempUserName(userName);
    setIsEditingName(true);
  };

  const handleCancelEditingName = () => {
    setTempUserName("");
    setIsEditingName(false);
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
      {/* Sidebar Ad */}
      {/* <AdSidebar /> */}

      {/* Header */}
      <header className="border-b border-lol-gold/30 bg-lol-dark-accent/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img src="/log.png" alt="LOL Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-lol-gold">
                  League of Gacha
                </h1>
                <p className="text-lol-light text-sm">Community Page</p>
              </div>
            </motion.div>
          </Link>

          <div className="flex gap-3">
            <Link href="/">
              <button className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all">
                ← Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 mb-20">
        <div className="flex justify-end mb-4">
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all cursor-pointer"
          >
            🔄 새로고침
          </button>
        </div>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Community Rosters
          </h2>

          {/* Username Input */}
          {(!userName || isEditingName) && (
            <div className="max-w-md mx-auto bg-lol-dark-accent/60 border-2 border-lol-gold/50 rounded-lg p-6">
              <p className="text-white font-bold mb-3">
                {isEditingName
                  ? "Change your name"
                  : "Set your name to comment on rosters"}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  placeholder="Enter your summoner name..."
                  className="flex-1 px-4 py-2 rounded bg-lol-dark-lighter border border-lol-gold/30 text-white placeholder-lol-light/50 focus:outline-none focus:border-lol-gold"
                  maxLength={30}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSaveUserName();
                  }}
                />
                <button
                  onClick={handleSaveUserName}
                  className="px-6 py-2 rounded bg-lol-gold hover:bg-lol-gold-dark text-black font-bold transition-all"
                >
                  Save
                </button>
                {isEditingName && (
                  <button
                    onClick={handleCancelEditingName}
                    className="px-6 py-2 rounded bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {userName && !isEditingName && (
            <motion.div
              className="max-w-md mx-auto bg-gradient-to-r from-lol-dark-accent/80 to-lol-dark-accent/60 border-2 border-lol-gold/50 rounded-lg p-4 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lol-gold to-lol-gold-dark flex items-center justify-center">
                    <span className="text-black font-bold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-lol-light text-sm">Commenting as</p>
                    <p className="text-lol-gold font-bold text-lg">
                      {userName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStartEditingName}
                  className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all text-sm font-medium"
                >
                  ✏️ Change
                </button>
              </div>
            </motion.div>
          )}
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
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        hasUserLiked(roster)
                          ? "bg-red-600/20 border-red-500/50 text-red-400"
                          : "bg-lol-dark-lighter border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold"
                      }`}
                    >
                      {hasUserLiked(roster) ? "❤️" : "🤍"} {roster.likes}
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
                          className="bg-lol-dark-lighter border border-lol-gold/20 rounded-lg p-2 sm:p-3 text-center"
                        >
                          <div className="text-[10px] sm:text-xs text-lol-gold font-bold mb-1 truncate">
                            {pos}
                          </div>
                          {player ? (
                            <>
                              <div className="text-white font-bold text-xs sm:text-sm mb-1 truncate">
                                {player.name}
                              </div>
                              <div className="text-lol-light text-[10px] sm:text-xs truncate">
                                {player.teamShort}
                              </div>
                              <div className="text-lol-light text-[10px] sm:text-xs">
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
                        value={commentInputs[roster.id] || ""}
                        onChange={(e) => {
                          setCommentInputs((prev) => ({
                            ...prev,
                            [roster.id]: e.target.value,
                          }));
                        }}
                        placeholder={
                          userName
                            ? "Add a comment..."
                            : "Please enter your name above first..."
                        }
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
    </div>
  );
}
