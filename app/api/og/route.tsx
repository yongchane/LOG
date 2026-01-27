import { ImageResponse } from "@vercel/og";
import { getAllPlayers } from "@/data/players";
import { Position } from "@/types";
import { checkChampionship } from "@/data/championships";
import { Player } from "@/types";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rosterParam = searchParams.get("roster");

    if (!rosterParam) {
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#091428",
              backgroundImage:
                "linear-gradient(to bottom right, #091428, #0a0a0c)",
              color: "#C8AA6E",
            }}
          >
            <div style={{ fontSize: 60, fontWeight: "bold", marginBottom: 20 }}>
              LEAGUE OF GACHA
            </div>
            <div style={{ fontSize: 30, color: "#F0E6D2" }}>
              Create your own legendary roster
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    const playerIds = rosterParam.split(",");
    const allPlayers = getAllPlayers();
    const rosterPlayers: Partial<Record<Position, Player>> = {};

    POSITIONS.forEach((position, index) => {
      const playerId = playerIds[index];
      if (playerId && playerId !== "empty") {
        const player = allPlayers.find((p) => p.id === playerId);
        if (player) {
          rosterPlayers[position] = player;
        }
      }
    });

    const players = Object.values(rosterPlayers) as Player[];

    // Check for championship
    let championship = null;
    if (players.length === 5) {
      const playerNames = players.map((p) => p.name);
      const team = players[0].teamShort;
      const year = players[0].year;
      const sameTeamYear = players.every(
        (p) => p.teamShort === team && p.year === year
      );
      if (sameTeamYear) {
        championship = checkChampionship(playerNames, team, year);
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#091428",
            backgroundImage:
              "radial-gradient(circle at center, #1a2c4e 0%, #091428 100%)",
            color: "white",
            padding: "40px",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage:
                "linear-gradient(#C8AA6E 1px, transparent 1px), linear-gradient(90deg, #C8AA6E 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#C8AA6E",
                letterSpacing: "0.1em",
              }}
            >
              LEAGUE OF GACHA
            </div>
          </div>

          {/* Championship Badge */}
          {championship && (
            <div
              style={{
                position: "absolute",
                top: "30px",
                right: "40px",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(to right, #7a5c29, #C8AA6E)",
                padding: "10px 20px",
                borderRadius: "30px",
                border: "2px solid #F0E6D2",
                boxShadow: "0 4px 20px rgba(200, 170, 110, 0.4)",
              }}
            >
              <div style={{ fontSize: 24, marginRight: "10px" }}>
                {championship.type === "winner" ? "🏆" : "🥈"}
              </div>
              <div
                style={{ fontSize: 20, fontWeight: "bold", color: "#091428" }}
              >
                {championship.year} {championship.team}
              </div>
            </div>
          )}

          {/* Cards Container */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              width: "100%",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            {POSITIONS.map((pos) => {
              const player = rosterPlayers[pos];
              if (!player) {
                // Empty Slot
                return (
                  <div
                    key={pos}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "200px",
                      height: "300px",
                      backgroundColor: "rgba(10, 20, 40, 0.6)",
                      border: "2px dashed #485363",
                      borderRadius: "15px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ color: "#485363", fontSize: "20px" }}>?</div>
                    <div
                      style={{
                        color: "#485363",
                        fontSize: "14px",
                        marginTop: "5px",
                      }}
                    >
                      {pos}
                    </div>
                  </div>
                );
              }

              // Player Card
              const isWinner =
                player.isWinner && player.championshipLeague === "WORLDS";
              const borderColor = isWinner
                ? "#FFD700"
                : player.teamColor || "#C8AA6E";

              return (
                <div
                  key={pos}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                    height: "300px",
                    backgroundColor: "#1e2328",
                    borderRadius: "15px",
                    overflow: "hidden",
                    border: `3px solid ${borderColor}`,
                    position: "relative",
                    boxShadow: isWinner
                      ? "0 0 30px rgba(255, 215, 0, 0.3)"
                      : "0 4px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Card Background Gradient */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(to bottom, transparent 40%, ${
                        player.teamColor || "#091428"
                      } 120%)`,
                      opacity: 0.8,
                    }}
                  />

                  {/* Position Top Left */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "15px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: isWinner ? "#FFD700" : "#C8AA6E",
                    }}
                  >
                    {player.position}
                  </div>

                  {/* Name Center */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                      marginTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "900",
                        color: "white",
                        textAlign: "center",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      {player.name}
                    </div>
                    {/* Nationality Flag Emoji (Simulated) */}
                    <div
                      style={{
                        fontSize: "14px",
                        opacity: 0.7,
                        marginTop: "5px",
                        color: "#F0E6D2",
                      }}
                    >
                      {getFlagEmoji(player.iso)} {player.nationality}
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      background: "rgba(0,0,0,0.4)",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: player.teamColor || "#333",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {player.teamShort}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: isWinner ? "#FFD700" : "#C8AA6E",
                      }}
                    >
                      {player.year}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            leagueofgacha.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

function getFlagEmoji(isoCode: string): string {
  if (!isoCode) return "";
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}
