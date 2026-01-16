import { UserRoster, Player, Position } from "@/types";

// 마이페이지 데이터 타입 정의
export interface PlayerPickStats {
  playerId: string;
  playerName: string;
  team: string;
  teamColor: string;
  pickCount: number;
  wins: number;
  losses: number;
}

export interface GameRecord {
  id: string;
  timestamp: number;
  roster: UserRoster;
  result: "win" | "loss";
  weekNumber: number;
}

export interface PositionStats {
  TOP: PlayerPickStats[];
  JUNGLE: PlayerPickStats[];
  MID: PlayerPickStats[];
  ADC: PlayerPickStats[];
  SUPPORT: PlayerPickStats[];
}

export interface MyPageStats {
  userId: string;
  weekStart: number;
  weekNumber: number;
  totalGames: number;
  wins: number;
  losses: number;
  positionStats: PositionStats;
  gameHistory: GameRecord[];
}

// 로컬 스토리지 키
const STATS_KEY = "lol-roster-my-page-stats";
const USER_ID_KEY = "lol-roster-userid";

// 사용자 ID 가져오기 (없으면 생성)
function getUserId(): string {
  if (typeof window === "undefined") return "";

  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

// 현재 주차 계산 (ISO 8601 기준)
function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// 이번 주 월요일 00:00 타임스탬프 가져오기
function getWeekStart(date: Date = new Date()): number {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// 초기 통계 생성
function createEmptyStats(): MyPageStats {
  return {
    userId: getUserId(),
    weekStart: getWeekStart(),
    weekNumber: getWeekNumber(),
    totalGames: 0,
    wins: 0,
    losses: 0,
    positionStats: {
      TOP: [],
      JUNGLE: [],
      MID: [],
      ADC: [],
      SUPPORT: [],
    },
    gameHistory: [],
  };
}

// 통계 불러오기
export function getMyPageStats(): MyPageStats {
  if (typeof window === "undefined") return createEmptyStats();

  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return createEmptyStats();

    const stats: MyPageStats = JSON.parse(stored);

    // 주차가 바뀌었는지 확인
    const currentWeekStart = getWeekStart();
    if (stats.weekStart !== currentWeekStart) {
      // 새로운 주차이면 통계 초기화
      return createEmptyStats();
    }

    return stats;
  } catch (error) {
    console.error("Failed to load my page stats:", error);
    return createEmptyStats();
  }
}

// 통계 저장
function saveStats(stats: MyPageStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// 게임 결과 기록
export function recordGameResult(roster: UserRoster, result: "win" | "loss"): void {
  const stats = getMyPageStats();

  // 게임 기록 추가
  const gameRecord: GameRecord = {
    id: `game_${Date.now()}`,
    timestamp: Date.now(),
    roster,
    result,
    weekNumber: stats.weekNumber,
  };

  stats.gameHistory.unshift(gameRecord);
  stats.totalGames += 1;

  if (result === "win") {
    stats.wins += 1;
  } else {
    stats.losses += 1;
  }

  // 라인별 선수 통계 업데이트
  const positions: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

  positions.forEach((position) => {
    const player = roster[position.toLowerCase() as keyof UserRoster] as
      | Player
      | undefined;

    if (player) {
      const posStats = stats.positionStats[position];
      let playerStat = posStats.find((p) => p.playerId === player.id);

      if (!playerStat) {
        // 새로운 선수 추가
        playerStat = {
          playerId: player.id,
          playerName: player.name,
          team: player.teamShort,
          teamColor: player.teamColor,
          pickCount: 0,
          wins: 0,
          losses: 0,
        };
        posStats.push(playerStat);
      }

      playerStat.pickCount += 1;
      if (result === "win") {
        playerStat.wins += 1;
      } else {
        playerStat.losses += 1;
      }

      // 픽 횟수 기준으로 정렬
      posStats.sort((a, b) => b.pickCount - a.pickCount);
    }
  });

  // 게임 히스토리는 최대 50개까지만 저장
  if (stats.gameHistory.length > 50) {
    stats.gameHistory = stats.gameHistory.slice(0, 50);
  }

  saveStats(stats);
}

// 선수별 승률 계산
export function calculateWinRate(player: PlayerPickStats): number {
  if (player.pickCount === 0) return 0;
  return Math.round((player.wins / player.pickCount) * 100);
}

// 전체 승률 계산
export function calculateOverallWinRate(stats: MyPageStats): number {
  if (stats.totalGames === 0) return 0;
  return Math.round((stats.wins / stats.totalGames) * 100);
}

// 포지션별 TOP 5 선수 가져오기
export function getTopPlayersByPosition(
  position: Position,
  limit: number = 5
): PlayerPickStats[] {
  const stats = getMyPageStats();
  return stats.positionStats[position].slice(0, limit);
}

// 통계 초기화 (수동)
export function resetStats(): void {
  const emptyStats = createEmptyStats();
  saveStats(emptyStats);
}

// 최근 게임 기록 가져오기
export function getRecentGames(limit: number = 10): GameRecord[] {
  const stats = getMyPageStats();
  return stats.gameHistory.slice(0, limit);
}
