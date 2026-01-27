"use client";

import { useEffect, useState } from "react";
import { Player, Position, UserRoster } from "@/types";
import { getAllPlayers } from "@/data/players";
import { checkChampionship } from "@/data/championships";
import PlayerCard from "@/components/PlayerCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export default function SharedRosterClient() {
  const searchParams = useSearchParams();
  const [roster, setRoster] = useState<UserRoster | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rosterParam = searchParams.get("roster");
    if (rosterParam) {
      const playerIds = rosterParam.split(",");
      const allPlayers = getAllPlayers();

      const loadedRoster: Partial<UserRoster> & {
        id: string;
        createdAt: number;
      } = {
        id: "shared",
        createdAt: Date.now(),
      };

      POSITIONS.forEach((position, index) => {
        const playerId = playerIds[index];
        if (playerId && playerId !== "empty") {
          const player = allPlayers.find((p) => p.id === playerId);
          if (player) {
            (loadedRoster as any)[position.toLowerCase()] = player;
          }
        }
      });

      // Check for championship
      const players = POSITIONS.map(
        (pos) => (loadedRoster as any)[pos.toLowerCase()] as Player | undefined
      ).filter((p): p is Player => p !== undefined);

      if (players.length === 5) {
        const playerNames = players.map((p) => p.name);
        const team = players[0].teamShort;
        const year = players[0].year;

        const sameTeamYear = players.every(
          (p) => p.teamShort === team && p.year === year
        );
        if (sameTeamYear) {
          const championship = checkChampionship(playerNames, team, year);
          if (championship) {
            loadedRoster.championship = championship;
          }
        }
      }

      setRoster(loadedRoster as UserRoster);
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen hextech-bg hexagon-pattern flex items-center justify-center">
        <div className="text-lol-gold text-2xl">Loading...</div>
      </div>
    );
  }

  if (!roster) {
    return (
      <div className="min-h-screen hextech-bg hexagon-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="text-lol-light text-2xl mb-4">
            Invalid roster link
          </div>
          <Link href="/">
            <button className="px-6 py-3 rounded-lg bg-lol-gold text-black font-bold hover:bg-lol-gold-dark">
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hextech-bg hexagon-pattern">
      {/* Header */}
      <header className="border-b border-lol-gold/30 bg-lol-dark-accent/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="text-3xl">⚡</div>
            <div>
              <h1 className="text-2xl font-bold text-lol-gold">
                Shared Roster
              </h1>
              <p className="text-lol-light text-sm">
                Check out this legendary team!
              </p>
            </div>
          </motion.div>

          <Link href="/">
            <button className="px-4 py-2 rounded-lg bg-lol-dark-lighter border border-lol-gold/30 text-lol-light hover:text-lol-gold hover:border-lol-gold/60 transition-all">
              Create Your Own
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Championship Badge */}
        {roster.championship && (
          <motion.div
            className="mb-12 p-6 rounded-lg bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border-2 border-yellow-500 champion-glow"
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
                This is the legendary {roster.championship.team} championship
                roster!
              </div>
            </div>
          </motion.div>
        )}

        {/* Roster Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {POSITIONS.map((position, index) => (
            <motion.div
              key={position}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PlayerCard
                player={
                  (roster[
                    position.toLowerCase() as keyof UserRoster
                  ] as Player) || null
                }
                position={position}
              />
            </motion.div>
          ))}
        </div>

        {/* Share Again Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/">
            <button className="px-12 py-4 rounded-lg font-bold text-xl text-black bg-gradient-to-r from-lol-gold to-lol-gold-dark hover:from-lol-gold-dark hover:to-lol-gold transition-all gold-glow">
              ⚡ Create Your Own Team ⚡
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
