"use client";

import { useState, useEffect } from "react";
import { Player, Position, UserRoster } from "@/types";
import { getRandomPlayer } from "@/data/players";
import { checkChampionship } from "@/data/championships";
import PlayerCard from "@/components/PlayerCard";
import GachaModal from "@/components/GachaModal";
import ChampionshipCelebration from "@/components/ChampionshipCelebration";
import { motion, AnimatePresence } from "framer-motion";
import { generateShareURL, copyToClipboard } from "@/lib/roster-share";
import {
  saveToCommunity,
  getUserName,
  saveUserName,
} from "@/lib/community-storage";
import { recordGameResult } from "@/lib/my-page-storage";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export default function Home() {
  const [roster, setRoster] = useState<UserRoster>({
    id: "",
    createdAt: Date.now(),
  });

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isChampionshipOpen, setIsChampionshipOpen] = useState(false);
  const [isSummoningAll, setIsSummoningAll] = useState(false);
  const [pendingPositions, setPendingPositions] = useState<Position[]>([]);
  const [shareMessage, setShareMessage] = useState("");
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [communityUserName, setCommunityUserName] = useState("");
  const [communityMessage, setCommunityMessage] = useState("");
  const [gameResultMessage, setGameResultMessage] = useState("");

  // Load saved username on mount
  useEffect(() => {
    const savedName = getUserName();
    if (savedName) {
      setCommunityUserName(savedName);
    }
  }, []);

  // Check for championship when roster is complete
  useEffect(() => {
    const positions: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];
    const isComplete = positions.every(
      (pos) => roster[pos.toLowerCase() as keyof UserRoster]
    );

    if (isComplete) {
      // Check if this is a championship roster
      const players = positions.map(
        (pos) => roster[pos.toLowerCase() as keyof UserRoster]
      ) as Player[];
      const playerNames = players.map((p) => p.name);
      const team = players[0].teamShort;
      const year = players[0].year;

      // Check if all players are from same team and year
      const sameTeamYear = players.every(
        (p) => p.teamShort === team && p.year === year
      );

      if (sameTeamYear) {
        const championship = checkChampionship(playerNames, team, year);
        if (championship) {
          setRoster((prev) => ({ ...prev, championship }));
          // Show championship celebration after a short delay
          setTimeout(() => {
            setIsChampionshipOpen(true);
          }, 1000);
        }
      }
    }
  }, [roster]);

  const handleSummon = (position: Position) => {
    setSelectedPosition(position);

    // Get excluded player IDs (already in roster)
    const excludeIds = POSITIONS.map(
      (pos) =>
        roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined
    )
      .filter((p): p is Player => p !== undefined)
      .map((p) => p.id);

    // Get random player
    const player = getRandomPlayer(position, excludeIds);
    setCurrentPlayer(player);
    setIsGachaOpen(true);
  };

  const handleConfirm = () => {
    if (currentPlayer && selectedPosition) {
      setRoster((prev) => ({
        ...prev,
        [selectedPosition.toLowerCase()]: currentPlayer,
      }));
    }
    setIsGachaOpen(false);
    setCurrentPlayer(null);
    setSelectedPosition(null);

    // If summoning all, continue with next position
    if (isSummoningAll && pendingPositions.length > 0) {
      setTimeout(() => {
        const [nextPosition, ...remaining] = pendingPositions;
        setPendingPositions(remaining);
        handleSummon(nextPosition);
      }, 500);
    } else {
      setIsSummoningAll(false);
      setPendingPositions([]);
    }
  };

  const handleCancel = () => {
    // Reroll - get another player
    if (selectedPosition) {
      const excludeIds = POSITIONS.map(
        (pos) =>
          roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined
      )
        .filter((p): p is Player => p !== undefined)
        .map((p) => p.id);

      const player = getRandomPlayer(selectedPosition, excludeIds);
      setCurrentPlayer(player);
    }
  };

  const handleReset = () => {
    setRoster({
      id: "",
      createdAt: Date.now(),
    });
  };

  const handleSummonAll = () => {
    // 빈 포지션들 찾기
    const emptyPositions = POSITIONS.filter(
      (pos) => !roster[pos.toLowerCase() as keyof UserRoster]
    );

    if (emptyPositions.length === 0) return;

    // Set state for continuous summoning
    setIsSummoningAll(true);
    const [firstPosition, ...remaining] = emptyPositions;
    setPendingPositions(remaining);
    handleSummon(firstPosition);
  };

  const handleShareRoster = async () => {
    const shareURL = generateShareURL(roster);
    const success = await copyToClipboard(shareURL);

    if (success) {
      setShareMessage("✓ Link copied to clipboard!");
      setTimeout(() => setShareMessage(""), 3000);
    } else {
      setShareMessage("✗ Failed to copy link");
      setTimeout(() => setShareMessage(""), 3000);
    }
  };

  const handleOpenCommunityModal = () => {
    setIsCommunityModalOpen(true);
    setCommunityMessage("");
  };

  const handlePostToCommunity = async () => {
    if (!communityUserName.trim()) {
      setCommunityMessage("✗ Please enter your name");
      return;
    }

    // Generate unique ID for roster if not exists
    if (!roster.id) {
      setRoster((prev) => ({ ...prev, id: Date.now().toString() }));
    }

    // Save to community
    await saveToCommunity(roster, communityUserName);
    saveUserName(communityUserName);

    setCommunityMessage("✓ Posted to community!");
    setTimeout(() => {
      setIsCommunityModalOpen(false);
      setCommunityMessage("");
    }, 1500);
  };

  const handleRecordGameResult = (result: "win" | "loss") => {
    if (!roster.id) {
      setRoster((prev) => ({ ...prev, id: Date.now().toString() }));
    }

    recordGameResult(roster, result);

    const message =
      result === "win" ? "✓ Victory recorded!" : "✓ Defeat recorded!";
    setGameResultMessage(message);
    setTimeout(() => setGameResultMessage(""), 3000);
  };

  const isRosterComplete = POSITIONS.every(
    (pos) => roster[pos.toLowerCase() as keyof UserRoster]
  );

  return (
    <div className="h-auto hextech-bg hexagon-pattern mb-20 md:mb-0">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Title Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Build Your Dream Team
          </h2>
          {isRosterComplete && (
            <motion.button
              onClick={handleReset}
              className="mt-4 px-6 py-2 rounded-lg bg-red-600/80 border border-red-500/50 text-white hover:bg-red-500 hover:border-red-400 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Reset Roster
            </motion.button>
          )}
        </motion.div>

        {/* Roster Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 px-4 py-6">
          {POSITIONS.map((position, index) => (
            <motion.div
              key={position}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="overflow-visible"
            >
              <PlayerCard
                player={
                  (roster[
                    position.toLowerCase() as keyof UserRoster
                  ] as Player) || null
                }
                position={position}
                onClick={() => handleSummon(position)}
              />
            </motion.div>
          ))}
        </div>

        {/* Global Summon Buttons */}
        {!isRosterComplete && (
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => {
                // Find first empty position
                const emptyPosition = POSITIONS.find(
                  (pos) => !roster[pos.toLowerCase() as keyof UserRoster]
                );
                if (emptyPosition) {
                  handleSummon(emptyPosition);
                }
              }}
              className="px-8 py-3 rounded-lg font-bold text-lg text-white bg-lol-blue hover:bg-lol-blue-dark transition-all transform hover:scale-105"
            >
              <img
                src="/select.svg"
                alt="Select All"
                className="inline h-6 w-6 mr-2"
              />{" "}
              Select One Player
            </button>

            <button
              onClick={handleSummonAll}
              className="px-12 py-4 rounded-lg font-bold text-xl text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow transform hover:scale-105"
            >
              <img
                src="/select.svg"
                alt="Select All"
                className="inline h-6 w-6 mr-2"
              />
              Select All Players
            </button>
          </motion.div>
        )}

        {/* Championship Badge */}
        {roster.championship && (
          <motion.div
            className="mt-12 p-6 rounded-lg bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border-2 border-yellow-500 champion-glow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">
                {roster.championship.type === "winner" ? "🏆" : "🥈"}
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {roster.championship.year} {roster.championship.season || ""}{" "}
                {roster.championship.league}{" "}
                {roster.championship.type === "winner"
                  ? "CHAMPIONS"
                  : "RUNNERS-UP"}
                !
              </div>
              <div className="text-lol-light">
                You've assembled the legendary {roster.championship.team}{" "}
                roster!
              </div>
            </div>
          </motion.div>
        )}

        {/* Share and Community Buttons */}
        {isRosterComplete && (
          <motion.div
            className="mt-8 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Game Result Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-2">
              <button
                onClick={() => handleRecordGameResult("win")}
                className="px-8 py-3 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105"
              >
                ✓ Record Victory
              </button>

              <button
                onClick={() => handleRecordGameResult("loss")}
                className="px-8 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105"
              >
                ✗ Record Defeat
              </button>
            </div>

            {gameResultMessage && (
              <motion.div
                className="text-sm font-bold text-green-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {gameResultMessage}
              </motion.div>
            )}

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleShareRoster}
                className="px-8 py-3 rounded-lg font-bold text-white bg-lol-blue hover:bg-lol-blue-dark transition-all"
              >
                📤 Share Your Roster
              </button>

              <button
                onClick={handleOpenCommunityModal}
                className="px-8 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow"
              >
                🌟 Post to Community
              </button>
            </div>

            {shareMessage && (
              <motion.div
                className={`text-sm font-bold ${
                  shareMessage.startsWith("✓")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {shareMessage}
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <GachaModal
        player={currentPlayer}
        isOpen={isGachaOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <ChampionshipCelebration
        championship={roster.championship || null}
        isOpen={isChampionshipOpen}
        onClose={() => setIsChampionshipOpen(false)}
      />

      {/* Community Post Modal */}
      <AnimatePresence>
        {isCommunityModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommunityModalOpen(false)}
          >
            <motion.div
              className="bg-lol-dark-accent border-2 border-lol-gold/50 rounded-lg p-8 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-lol-gold mb-4 text-center">
                Post to Community
              </h3>

              <p className="text-lol-light text-sm mb-6 text-center">
                Share your roster with the community!
              </p>

              <div className="mb-6">
                <label className="block text-white font-bold mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={communityUserName}
                  onChange={(e) => setCommunityUserName(e.target.value)}
                  placeholder="Enter your summoner name..."
                  className="w-full px-4 py-3 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-white placeholder-lol-light/50 focus:outline-none focus:border-lol-gold transition-all"
                  maxLength={30}
                />
              </div>

              {communityMessage && (
                <motion.div
                  className={`mb-4 text-center font-bold ${
                    communityMessage.startsWith("✓")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {communityMessage}
                </motion.div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setIsCommunityModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-white hover:border-lol-gold/60 transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostToCommunity}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold text-black font-bold transition-all gold-glow"
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
