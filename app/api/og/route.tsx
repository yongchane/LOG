import { ImageResponse } from "next/og";
import { getAllPlayers } from "@/data/players";
import { Position } from "@/types";
import { checkChampionship } from "@/data/championships";
import { Player } from "@/types";

const POSITIONS: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    // Disabled font loading to ensure stability
    // const fontData = await fetch(...);

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
            <div style={{ fontSize: 60, fontWeight: 700, marginBottom: 20 }}>
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
            backgroundColor: "navy",
            padding: "40px",
          }}
        >
          {/* Championship Badge (if exists) */}
          {championship && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: "bold",
                color: "gold",
                marginBottom: 20,
                padding: "10px 20px",
                border: "3px solid gold",
                borderRadius: 10,
              }}
            >
              🏆 {String(championship)} CHAMPION
            </div>
          )}

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: "bold",
              color: "gold",
              marginBottom: 40,
            }}
          >
            MY LEGENDARY ROSTER
          </div>

          {/* Cards Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 16,
            }}
          >
            {POSITIONS.map((pos) => {
              const player = rosterPlayers[pos];

              return (
                <div
                  key={pos}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: 180,
                    height: 280,
                    backgroundColor: player ? "darkslateblue" : "dimgray",
                    border: player ? "4px solid gold" : "4px solid silver",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  {/* Position Badge */}
                  <div
                    style={{
                      display: "flex",
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: player ? "gold" : "gray",
                      padding: "6px 12px",
                      borderRadius: 6,
                      marginBottom: 16,
                      justifyContent: "center",
                    }}
                  >
                    {pos}
                  </div>

                  {player ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      {/* Player Name */}
                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: "bold",
                          color: "white",
                          marginBottom: 12,
                          textAlign: "center",
                        }}
                      >
                        {player.name}
                      </div>

                      {/* Nationality */}
                      <div
                        style={{
                          fontSize: 18,
                          color: "lightgray",
                          marginBottom: 16,
                        }}
                      >
                        {player.nationality}
                      </div>

                      {/* Team & Year */}
                      <div
                        style={{
                          display: "flex",
                          fontSize: 16,
                          color: "gold",
                          fontWeight: "bold",
                        }}
                      >
                        {player.teamShort} • {player.year}
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 60,
                        color: "silver",
                      }}
                    >
                      ?
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "lightgray",
              marginTop: 40,
            }}
          >
            leagueofgacha.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
