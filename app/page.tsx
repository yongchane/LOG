"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Player, Position, UserRoster } from "@/types";
import { getRandomPlayer } from "@/data/players";
import { checkChampionship } from "@/data/championships";
import PlayerCard from "@/components/PlayerCard";
import {
  LazyMotion,
  domAnimation,
  m as motion,
  AnimatePresence,
} from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import WorldsLinkEffect from "@/components/WorldsLinkEffect";

// 동적 import로 초기 번들 크기 감소
const GachaModal = dynamic(() => import("@/components/GachaModal"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});

const GachaMultiModal = dynamic(() => import("@/components/GachaMultiModal"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  ),
});

const ChampionshipCelebration = dynamic(
  () => import("@/components/ChampionshipCelebration"),
  {
    loading: () => null,
  },
);
import { generateShareURL, copyToClipboard } from "@/lib/roster-share";
import {
  saveToCommunity,
  getUserName,
  saveUserName,
} from "@/lib/community-storage";
import {
  recordGameResult,
  getBgmMuted,
  setBgmMuted,
} from "@/lib/my-page-storage";
import Footer from "@/components/Footer";
import UpdateHistory from "@/components/UpdateHistory";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export default function Home() {
  const { language, t, showWorldsAnimation, setShowWorldsAnimation } =
    useLanguage();
  const [roster, setRoster] = useState<UserRoster>({
    id: "",
    createdAt: 0,
  });

  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isChampionshipOpen, setIsChampionshipOpen] = useState(false);
  const [isMultiGachaOpen, setIsMultiGachaOpen] = useState(false);
  const [multiPlayers, setMultiPlayers] = useState<Map<Position, Player>>(
    new Map(),
  );
  const [shareMessage, setShareMessage] = useState("");
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [communityUserName, setCommunityUserName] = useState("");
  const [communityMessage, setCommunityMessage] = useState("");
  const [gameResultMessage, setGameResultMessage] = useState("");
  const [isBgmMuted, setIsBgmMuted] = useState(false);

  // Background music refs
  const mainBgmRef = useRef<HTMLAudioElement | null>(null);
  const pickBgmRef = useRef<HTMLAudioElement | null>(null);
  const cardBgmRef = useRef<HTMLAudioElement | null>(null);

  // Load settings on mount
  useEffect(() => {
    const savedMuted = getBgmMuted();
    setIsBgmMuted(savedMuted);

    // Initialize roster timestamp once on client
    setRoster((prev) => ({
      ...prev,
      createdAt: prev.createdAt || Date.now(),
    }));
  }, []);

  // Toggle BGM mute
  const toggleBgmMute = () => {
    const newMuted = !isBgmMuted;
    setIsBgmMuted(newMuted);
    setBgmMuted(newMuted);

    // Mute/unmute all audio
    if (mainBgmRef.current) {
      mainBgmRef.current.muted = newMuted;
      if (newMuted) {
        mainBgmRef.current.pause();
      } else if (!isGachaOpen && !isMultiGachaOpen) {
        mainBgmRef.current.play().catch(console.log);
      }
    }
    if (pickBgmRef.current) {
      pickBgmRef.current.muted = newMuted;
    }
    if (cardBgmRef.current) {
      cardBgmRef.current.muted = newMuted;
    }
  };

  // Initialize background music
  useEffect(() => {
    // Main BGM - preload metadata only for faster initial load
    const mainAudio = new Audio();
    mainAudio.src = "/log_bgm.mp3";
    mainAudio.preload = "metadata"; // Only preload metadata, not full file
    mainAudio.loop = true;
    mainAudio.volume = 0.3;
    mainAudio.muted = isBgmMuted;
    mainBgmRef.current = mainAudio;

    // Pick BGM - preload auto for immediate playback when needed
    const pickAudio = new Audio();
    pickAudio.src = "/pick_bgm.mp3";
    pickAudio.preload = "auto"; // Preload fully for instant playback
    pickAudio.loop = false;
    pickAudio.volume = 0.3;
    pickAudio.muted = isBgmMuted;
    pickBgmRef.current = pickAudio;

    // Card BGM - preload auto for seamless transition
    const cardAudio = new Audio();
    cardAudio.src = "/card_bgm.mp3";
    cardAudio.preload = "auto"; // Preload fully for instant playback
    cardAudio.loop = false;
    cardAudio.volume = 0.3;
    cardAudio.muted = isBgmMuted;
    cardBgmRef.current = cardAudio;

    let audioInitialized = false;

    // Play main BGM on first user interaction (only if not muted)
    const handleInteraction = () => {
      if (!audioInitialized && mainBgmRef.current && !isBgmMuted) {
        mainBgmRef.current.play().catch((error) => {
          console.log("Audio autoplay prevented:", error);
        });
        audioInitialized = true;
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("keydown", handleInteraction);
      }
    };

    // Try to play immediately (may be blocked by browser)
    if (!isBgmMuted) {
      mainBgmRef.current
        .play()
        .then(() => {
          audioInitialized = true;
          document.removeEventListener("click", handleInteraction);
          document.removeEventListener("keydown", handleInteraction);
        })
        .catch(() => {
          // If autoplay is blocked, wait for user interaction
          console.log("Autoplay blocked, waiting for user interaction");
          document.addEventListener("click", handleInteraction);
          document.addEventListener("keydown", handleInteraction);
        });
    }

    return () => {
      if (mainBgmRef.current) {
        mainBgmRef.current.pause();
        mainBgmRef.current.currentTime = 0;
      }
      if (pickBgmRef.current) {
        pickBgmRef.current.pause();
        pickBgmRef.current.currentTime = 0;
      }
      if (cardBgmRef.current) {
        cardBgmRef.current.pause();
        cardBgmRef.current.currentTime = 0;
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

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
      (pos) => roster[pos.toLowerCase() as keyof UserRoster],
    );

    if (isComplete) {
      // Check if this is a championship roster
      const players = positions.map(
        (pos) => roster[pos.toLowerCase() as keyof UserRoster],
      ) as Player[];
      const playerNames = players.map((p) => p.name);
      const team = players[0].teamShort;
      const year = players[0].year;

      // Check if all players are from same team and year
      const sameTeamYear = players.every(
        (p) => p.teamShort === team && p.year === year,
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
    // Stop main BGM and play pick BGM
    if (mainBgmRef.current && !mainBgmRef.current.paused) {
      mainBgmRef.current.pause();
      console.log("Main BGM stopped");
    }
    if (pickBgmRef.current) {
      pickBgmRef.current.currentTime = 0;
      pickBgmRef.current.play().catch((error) => {
        console.log("Pick BGM play failed:", error);
      });
      console.log("Pick BGM started");
    }

    setSelectedPosition(position);

    // Get excluded player IDs (already in roster)
    const excludeIds = POSITIONS.map(
      (pos) =>
        roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined,
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

    // Stop pick/card BGMs and resume main BGM
    if (pickBgmRef.current) {
      pickBgmRef.current.pause();
      pickBgmRef.current.currentTime = 0;
    }
    if (cardBgmRef.current) {
      cardBgmRef.current.pause();
      cardBgmRef.current.currentTime = 0;
    }
    if (mainBgmRef.current) {
      mainBgmRef.current.play().catch((error) => {
        console.log("Main BGM resume failed:", error);
      });
      console.log("Main BGM resumed");
    }

    setIsGachaOpen(false);
    setCurrentPlayer(null);
    setSelectedPosition(null);
  };

  const handleCancel = () => {
    // Reroll - get another player
    if (selectedPosition) {
      // Stop card BGM and restart pick BGM for reroll
      if (cardBgmRef.current && !cardBgmRef.current.paused) {
        cardBgmRef.current.pause();
        cardBgmRef.current.currentTime = 0;
      }
      if (pickBgmRef.current) {
        pickBgmRef.current.currentTime = 0;
        pickBgmRef.current.play().catch((error) => {
          console.log("Pick BGM play failed:", error);
        });
      }

      const excludeIds = POSITIONS.map(
        (pos) =>
          roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined,
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
    // Stop main BGM and play pick BGM
    if (mainBgmRef.current && !mainBgmRef.current.paused) {
      mainBgmRef.current.pause();
      console.log("Main BGM stopped");
    }
    if (pickBgmRef.current) {
      pickBgmRef.current.currentTime = 0;
      pickBgmRef.current.play().catch((error) => {
        console.log("Pick BGM play failed:", error);
      });
      console.log("Pick BGM started");
    }

    // 빈 포지션들 찾기
    const emptyPositions = POSITIONS.filter(
      (pos) => !roster[pos.toLowerCase() as keyof UserRoster],
    );

    if (emptyPositions.length === 0) return;

    // Get excluded player IDs
    const excludeIds = POSITIONS.map(
      (pos) =>
        roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined,
    )
      .filter((p): p is Player => p !== undefined)
      .map((p) => p.id);

    // Get all players at once
    const newPlayers = new Map<Position, Player>();
    const usedIds = new Set(excludeIds);

    emptyPositions.forEach((position) => {
      const player = getRandomPlayer(position, Array.from(usedIds));
      newPlayers.set(position, player);
      usedIds.add(player.id);
    });

    setMultiPlayers(newPlayers);
    setIsMultiGachaOpen(true);
  };

  const handleMultiConfirm = () => {
    // Add all players to roster
    const updates: Partial<UserRoster> = {};
    multiPlayers.forEach((player, position) => {
      (updates as any)[position.toLowerCase()] = player;
    });

    setRoster((prev) => ({ ...prev, ...updates }));
    setIsMultiGachaOpen(false);
    setMultiPlayers(new Map());

    // Stop pick/card BGMs and resume main BGM
    if (pickBgmRef.current) {
      pickBgmRef.current.pause();
      pickBgmRef.current.currentTime = 0;
    }
    if (cardBgmRef.current) {
      cardBgmRef.current.pause();
      cardBgmRef.current.currentTime = 0;
    }
    if (mainBgmRef.current) {
      mainBgmRef.current.play().catch((error) => {
        console.log("Main BGM resume failed:", error);
      });
      console.log("Main BGM resumed");
    }
  };

  const handleMultiReroll = () => {
    // Stop card BGM and restart pick BGM for reroll
    if (cardBgmRef.current && !cardBgmRef.current.paused) {
      cardBgmRef.current.pause();
      cardBgmRef.current.currentTime = 0;
    }
    if (pickBgmRef.current) {
      pickBgmRef.current.currentTime = 0;
      pickBgmRef.current.play().catch((error) => {
        console.log("Pick BGM play failed:", error);
      });
    }

    // Reroll all positions
    const positions = Array.from(multiPlayers.keys());
    const excludeIds = POSITIONS.map(
      (pos) =>
        roster[pos.toLowerCase() as keyof UserRoster] as Player | undefined,
    )
      .filter((p): p is Player => p !== undefined)
      .map((p) => p.id);

    const newPlayers = new Map<Position, Player>();
    const usedIds = new Set(excludeIds);

    positions.forEach((position) => {
      const player = getRandomPlayer(position, Array.from(usedIds));
      newPlayers.set(position, player);
      usedIds.add(player.id);
    });

    setMultiPlayers(newPlayers);
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

    const rosterWithId = roster.id
      ? roster
      : { ...roster, id: Date.now().toString() };

    // Generate unique ID for roster if not exists
    if (!roster.id) {
      setRoster(rosterWithId);
    }

    // Save to community
    await saveToCommunity(rosterWithId, communityUserName);
    saveUserName(communityUserName);

    setCommunityMessage("✓ Posted to community!");
    setTimeout(() => {
      setIsCommunityModalOpen(false);
      setCommunityMessage("");
    }, 1500);
  };

  const handleRecordGameResult = (result: "win" | "loss") => {
    const rosterWithId = roster.id
      ? roster
      : { ...roster, id: Date.now().toString() };
    if (!roster.id) {
      setRoster(rosterWithId);
    }

    recordGameResult(rosterWithId, result);

    const message =
      result === "win" ? "✓ Victory recorded!" : "✓ Defeat recorded!";
    setGameResultMessage(message);
    setTimeout(() => setGameResultMessage(""), 3000);
  };

  const isRosterComplete = POSITIONS.every(
    (pos) => roster[pos.toLowerCase() as keyof UserRoster],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="h-auto hextech-bg hexagon-pattern mb-20 md:mb-0">

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              {t("mainTitle")}
            </h1>
            <p className="text-lol-light text-lg max-w-2xl mx-auto">
              {t("mainDescription")}
            </p>

            {/* Integrated Controls Group */}
            <motion.div 
              className="mt-8 flex items-center justify-center gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* BGM Toggle */}
              <button
                onClick={toggleBgmMute}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-lol-dark-lighter/40 border border-lol-gold/20 hover:border-lol-gold/50 hover:bg-lol-dark-lighter/60 transition-all group"
              >
                <div className="p-1.5 rounded-md bg-lol-gold/10 group-hover:bg-lol-gold/20 transition-colors">
                  {isBgmMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lol-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lol-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-white font-bold text-xs uppercase tracking-wider">{isBgmMuted ? "Muted" : "Playing"}</span>
                  <span className="text-lol-light text-[10px] opacity-70">BACKGROUND BGM</span>
                </div>
              </button>

              {/* Worlds Motion Toggle */}
              <label className="flex items-center gap-3 px-4 py-2 rounded-lg bg-lol-dark-lighter/40 border border-lol-gold/20 hover:border-lol-gold/50 hover:bg-lol-dark-lighter/60 transition-all cursor-pointer group">
                <div className="p-1.5 rounded-md bg-lol-gold/10 group-hover:bg-lol-gold/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lol-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-white font-bold text-xs uppercase tracking-wider">월즈 모션</span>
                  <span className="text-lol-light text-[10px] opacity-70">PREMIUM EFFECTS</span>
                </div>
                <div className="relative ml-1">
                  <input
                    type="checkbox"
                    checked={showWorldsAnimation}
                    onChange={(e) => setShowWorldsAnimation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-600 rounded-full peer peer-checked:bg-lol-gold transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
              </label>
            </motion.div>
            {isRosterComplete && (
              <motion.button
                onClick={handleReset}
                className="mt-4 px-6 py-2 rounded-lg bg-[#1e1e1e]/80 border border-red-500/50 text-white hover:bg-red-500 hover:border-red-400 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                Reset Roster
              </motion.button>
            )}
          </motion.div>

          <section aria-label="Player Roster" className="py-6 relative">
            <h2 className="sr-only">League of Legends Player Roster</h2>
            
            {/* Worlds Link Effect Layer */}
            <WorldsLinkEffect roster={roster} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 px-4 relative z-10">
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
          </section>

        
          {/* Summon Actions Section */}
          {!isRosterComplete && (
            <section aria-label="Summon Actions" className="pb-8">
              <h2 className="sr-only">Summon Players</h2>
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
                      (pos) => !roster[pos.toLowerCase() as keyof UserRoster],
                    );
                    if (emptyPosition) {
                      handleSummon(emptyPosition);
                    }
                  }}
                  className="px-8 py-3 rounded-lg font-bold text-lg text-white bg-lol-blue hover:bg-lol-blue-dark transition-all transform hover:scale-105"
                >
                  <img
                    src="/select.svg"
                    alt="Summon single League of Legends pro player icon for random gacha selection"
                    className="inline h-6 w-6 mr-2"
                  />{" "}
                  {t("selectOne")}
                </button>

                <button
                  onClick={handleSummonAll}
                  className="px-12 py-4 rounded-lg font-bold text-xl text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow transform hover:scale-105"
                >
                  <img
                    src="/select.svg"
                    alt="Summon all five League of Legends pro players icon to complete roster instantly"
                    className="inline h-6 w-6 mr-2"
                  />
                  {t("selectAll")}
                </button>
              </motion.div>
            </section>
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
                    ? t("champions")
                    : t("runnersUp")}
                  !
                </div>
                <div className="text-lol-light">
                  {t("championshipComplete").replace(
                    "{team}",
                    roster.championship.team,
                  )}
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
                  className="px-8 py-3 rounded-lg font-bold text-white bg-[#008000] hover:bg-green-700 transition-all transform hover:scale-105"
                >
                 승리 전적 기록
                </button>

                <button
                  onClick={() => handleRecordGameResult("loss")}
                  className="px-8 py-3 rounded-lg font-bold text-white bg-[#800000] hover:bg-red-700 transition-all transform hover:scale-105"
                >
                 패배 전적 기록
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
                   {t("shareLink")}
                </button>

                <button
                  onClick={handleOpenCommunityModal}
                  className="px-8 py-3 rounded-lg font-bold text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow"
                >
                   {t("shareCommunity")}
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
          {/* Update History Section - Repositioned below summon area */}
          <UpdateHistory />
        </main>

        {/* Modals */}
        <GachaModal
          player={currentPlayer}
          isOpen={isGachaOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          pickBgmRef={pickBgmRef}
          cardBgmRef={cardBgmRef}
        />

        <GachaMultiModal
          players={multiPlayers}
          isOpen={isMultiGachaOpen}
          onConfirm={handleMultiConfirm}
          onRerollAll={handleMultiReroll}
          pickBgmRef={pickBgmRef}
          cardBgmRef={cardBgmRef}
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

        {/* Footer */}
        <Footer />
      </div>
    </LazyMotion>
  );
}
