"use client";

import { Player } from "@/types";
import { m as motion } from "framer-motion";
import { getTranslations, getLanguage } from "@/lib/i18n";

interface PlayerCardProps {
  player: Player | null;
  position: string;
  onClick?: () => void;
  isRevealing?: boolean;
}

export default function PlayerCard({
  player,
  position,
  onClick,
  isRevealing = false,
}: PlayerCardProps) {
  const t = getTranslations(getLanguage());
  if (!player) {
    // Empty slot
    return (
      <motion.button
        onClick={onClick}
        className="relative w-full aspect-[3/5] sm:aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
        style={{
          background:
            "linear-gradient(135deg, rgba(10, 200, 185, 0.1) 0%, rgba(30, 35, 40, 0.8) 100%)",
          border: "2px solid rgba(200, 155, 60, 0.3)",
        }}
        whileHover={{ scale: 1.05, borderColor: "rgba(200, 155, 60, 0.8)" }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-4xl mb-2 opacity-50">?</div>
          <div className="text-lol-gold font-bold text-lg tracking-wider">
            {position}
          </div>
          <div className="text-lol-light text-sm mt-2 opacity-70">
            Click to Summon
          </div>
        </div>

        {/* Hexagon pattern overlay */}
        <div className="absolute inset-0 hexagon-pattern opacity-30"></div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-lol-gold/0 via-lol-gold/0 to-lol-gold/0 group-hover:from-lol-gold/10 group-hover:via-lol-gold/5 transition-all duration-300"></div>
      </motion.button>
    );
  }

  return (
    <div className="relative w-full aspect-[3/5] sm:aspect-[3/4]">
      {/* Championship indicator - outside card for no clipping */}
      {player.isWinner && player.championshipLeague === "WORLDS" && (
        <div className="absolute -top-3 -right-3 z-20">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50" />

            {/* Trophy badge */}
            <div
              className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 p-2 rounded-full shadow-lg"
              style={{
                boxShadow: "0 0 15px rgba(250, 204, 21, 0.5)",
              }}
            >
              {/* <div className="text-2xl">🏆</div> */}
              <img
                src="/worlds.svg"
                alt="League of Legends Worlds Championship trophy icon - golden cup symbolizing world champion title"
                className="w-6 h-6"
              />
            </div>

            {/* Tooltip on hover */}
            <div
              className="absolute top-full mt-1 right-0 bg-black/90 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                border: "1px solid #facc15",
              }}
            >
              {t.championshipWinner(
                player.championshipYear || player.year,
                player.championshipLeague,
              )}
            </div>
          </div>
        </div>
      )}
      <motion.div
        className="relative w-full aspect-[3/5] sm:aspect-[3/4] rounded-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${player.teamColor}40 0%, rgba(30, 35, 40, 0.9) 100%)`,
          border: `2px solid ${player.teamColor}`,
        }}
        initial={
          isRevealing
            ? { rotateY: 180, opacity: 0 }
            : { rotateY: 0, opacity: 1 }
        }
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        {/* Player Info */}
        <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between">
          {/* Top Section */}
          <div>
            <div className="text-lol-gold font-bold text-[10px] sm:text-xs tracking-wider mb-1">
              {player.position}
            </div>
            <div className="text-white font-bold text-xl sm:text-2xl mb-1 drop-shadow-lg truncate">
              {player.name}
            </div>
            {player.realName && (
              <div className="text-lol-light text-[10px] sm:text-xs mb-2 truncate">
                {player.realName}
              </div>
            )}
            {(player.championshipLeague === "WORLDS" ||
              player.championshipLeague === "MSI" ||
              (player.isWinner &&
                (player.region === "LCK" ||
                  player.region === "LPL" ||
                  player.region === "LEC"))) && (
              <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-4 w-full p-1.5 sm:p-[10px] bg-[#3a3636] opacity-50 rounded-lg items-center">
                {player.championshipLeague === "WORLDS" && (
                  <div>
                    <img
                      src="/worlds.svg"
                      alt="Worlds Championship winner badge - global tournament champion icon"
                      className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2"
                    />
                  </div>
                )}
                {player.region === "LCK" && player.isWinner && (
                  <div>
                    <img
                      src="/lck.svg"
                      alt="LCK League of Legends Champions Korea trophy icon - Korean league winner badge"
                      className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2"
                    />
                  </div>
                )}
                {player.region === "LPL" && player.isWinner && (
                  <div>
                    <img
                      src="/lpl.svg"
                      alt="LPL League of Legends Pro League China trophy icon - Chinese league winner badge"
                      className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2"
                    />
                  </div>
                )}
                {player.region === "LEC" && player.isWinner && (
                  <div>
                    <img
                      src="/lec.webp"
                      alt="LEC League of Legends European Championship trophy icon - European league winner badge"
                      className="h-6 w-5 sm:h-10 sm:w-8 mb-1 sm:mb-2"
                    />
                  </div>
                )}

                {player.championshipLeague === "MSI" && (
                  <div>
                    <img
                      src="/msi.svg"
                      alt="MSI Mid-Season Invitational trophy icon - international tournament winner badge"
                      className="h-6 w-6 sm:h-10 sm:w-10 mb-1 sm:mb-2"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">
                {getFlagEmoji(player.iso)}
              </span>
              <span className="text-lol-light text-xs sm:text-sm truncate">
                {player.nationality}
              </span>
            </div>
            <div
              className="px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm font-bold truncate"
              style={{ backgroundColor: player.teamColor }}
            >
              {player.teamShort}
            </div>
            <div className="text-lol-gold text-base sm:text-lg font-bold">
              {player.year}
            </div>
          </div>
        </div>

        {/* Hexagon pattern overlay */}
        <div className="absolute inset-0 hexagon-pattern opacity-20 pointer-events-none"></div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${player.teamColor}80 100%)`,
          }}
        ></div>
      </motion.div>{" "}
    </div>
  );
}

// Helper function to get flag emoji from ISO code
function getFlagEmoji(isoCode: string): string {
  const codePoints = isoCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
