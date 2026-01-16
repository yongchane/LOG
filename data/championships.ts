import { ChampionshipRoster } from "@/types";

// 2013-2025 주요 대회 우승 및 준우승 로스터
const CHAMPIONSHIPS: ChampionshipRoster[] = [
  // ========== WORLDS ==========
  {
    id: "worlds_2013_winner",
    league: "WORLDS",
    year: 2013,
    type: "winner",
    team: "SKT",
    players: ["Impact", "bengi", "Faker", "Piglet", "PoohManDu"],
  },
  {
    id: "worlds_2014_winner",
    league: "WORLDS",
    year: 2014,
    type: "winner",
    team: "SSW",
    players: ["Looper", "DanDy", "dade", "imp", "Mata"],
  },
  {
    id: "worlds_2015_winner",
    league: "WORLDS",
    year: 2015,
    type: "winner",
    team: "SKT",
    players: ["MaRin", "bengi", "Faker", "Bang", "Wolf"],
  },
  {
    id: "worlds_2016_winner",
    league: "WORLDS",
    year: 2016,
    type: "winner",
    team: "SKT",
    players: ["Duke", "bengi", "Faker", "Bang", "Wolf"],
  },
  {
    id: "worlds_2017_winner",
    league: "WORLDS",
    year: 2017,
    type: "winner",
    team: "SSG",
    players: ["CuVee", "Ambition", "Crown", "Ruler", "CoreJJ"],
  },
  {
    id: "worlds_2017_runnerup",
    league: "WORLDS",
    year: 2017,
    type: "runnerUp",
    team: "SKT",
    players: ["Huni", "Peanut", "Faker", "Bang", "Wolf"],
  },
  {
    id: "worlds_2018_winner",
    league: "WORLDS",
    year: 2018,
    type: "winner",
    team: "IG",
    players: ["TheShy", "Ning", "Rookie", "JackeyLove", "Baolan"],
  },
  {
    id: "worlds_2019_winner",
    league: "WORLDS",
    year: 2019,
    type: "winner",
    team: "FPX",
    players: ["GimGoon", "Tian", "Doinb", "Lwx", "Crisp"],
  },
  {
    id: "worlds_2020_winner",
    league: "WORLDS",
    year: 2020,
    type: "winner",
    team: "DWG",
    players: ["Nuguri", "Canyon", "ShowMaker", "Ghost", "BeryL"],
  },
  {
    id: "worlds_2021_winner",
    league: "WORLDS",
    year: 2021,
    type: "winner",
    team: "EDG",
    players: ["Flandre", "Jiejie", "Scout", "Viper", "Meiko"],
  },
  {
    id: "worlds_2021_runnerup",
    league: "WORLDS",
    year: 2021,
    type: "runnerUp",
    team: "DWG",
    players: ["Khan", "Canyon", "ShowMaker", "Ghost", "BeryL"],
  },
  {
    id: "worlds_2022_winner",
    league: "WORLDS",
    year: 2022,
    type: "winner",
    team: "DRX",
    players: ["Kingen", "Pyosik", "Zeka", "Deft", "BeryL"],
  },
  {
    id: "worlds_2022_runnerup",
    league: "WORLDS",
    year: 2022,
    type: "runnerUp",
    team: "T1",
    players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"],
  },
  {
    id: "worlds_2023_winner",
    league: "WORLDS",
    year: 2023,
    type: "winner",
    team: "T1",
    players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"],
  },
  {
    id: "worlds_2023_runnerup",
    league: "WORLDS",
    year: 2023,
    type: "runnerUp",
    team: "WBG",
    players: ["TheShy", "Weiwei", "Xiaohu", "Light", "Crisp"],
  },
  {
    id: "worlds_2024_winner",
    league: "WORLDS",
    year: 2024,
    type: "winner",
    team: "T1",
    players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"],
  },
  {
    id: "worlds_2024_runnerup",
    league: "WORLDS",
    year: 2024,
    type: "runnerUp",
    team: "BLG",
    players: ["Bin", "Xun", "knight", "Elk", "ON"],
  },

  // ========== MSI ==========
  {
    id: "msi_2020_winner",
    league: "MSI",
    year: 2020,
    type: "winner",
    team: "T1",
    players: ["Canna", "Cuzz", "Faker", "Teddy", "Effort"],
  },
  {
    id: "msi_2021_winner",
    league: "MSI",
    year: 2021,
    type: "winner",
    team: "DWG",
    players: ["Khan", "Canyon", "ShowMaker", "Ghost", "BeryL"],
  },
  {
    id: "msi_2021_runnerup",
    league: "MSI",
    year: 2021,
    type: "runnerUp",
    team: "RNG",
    players: ["Xiaohu", "Wei", "Cryin", "GALA", "Ming"],
  },
  {
    id: "msi_2022_winner",
    league: "MSI",
    year: 2022,
    type: "winner",
    team: "RNG",
    players: ["Bin", "Wei", "Xiaohu", "GALA", "Ming"],
  },
  {
    id: "msi_2023_winner",
    league: "MSI",
    year: 2023,
    type: "winner",
    team: "JDG",
    players: ["369", "Kanavi", "knight", "Ruler", "MISSING"],
  },
  {
    id: "msi_2023_runnerup",
    league: "MSI",
    year: 2023,
    type: "runnerUp",
    team: "BLG",
    players: ["Bin", "Xun", "Yagao", "Elk", "ON"],
  },
  {
    id: "msi_2024_winner",
    league: "MSI",
    year: 2024,
    type: "winner",
    team: "GEN",
    players: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"],
  },
  {
    id: "msi_2024_runnerup",
    league: "MSI",
    year: 2024,
    type: "runnerUp",
    team: "BLG",
    players: ["Bin", "Xun", "knight", "Elk", "ON"],
  },

  // ========== LCK ==========
  // 2013-2016 (SKT Dynasty)
  {
    id: "lck_2013_summer_winner",
    league: "LCK",
    year: 2013,
    season: "Summer",
    type: "winner",
    team: "SKT",
    players: ["Impact", "bengi", "Faker", "Piglet", "PoohManDu"],
  },
  {
    id: "lck_2015_spring_winner",
    league: "LCK",
    year: 2015,
    season: "Spring",
    type: "winner",
    team: "SKT",
    players: ["MaRin", "bengi", "Faker", "Bang", "Wolf"],
  },
  {
    id: "lck_2015_summer_winner",
    league: "LCK",
    year: 2015,
    season: "Summer",
    type: "winner",
    team: "SKT",
    players: ["MaRin", "bengi", "Faker", "Bang", "Wolf"],
  },
  {
    id: "lck_2016_spring_winner",
    league: "LCK",
    year: 2016,
    season: "Spring",
    type: "winner",
    team: "SKT",
    players: ["Duke", "Blank", "Faker", "Bang", "Wolf"],
  },
  {
    id: "lck_2016_summer_winner",
    league: "LCK",
    year: 2016,
    season: "Summer",
    type: "winner",
    team: "ROX",
    players: ["Smeb", "Peanut", "Kuro", "PraY", "GorillA"],
  },
  // 2017-2019
  {
    id: "lck_2017_spring_winner",
    league: "LCK",
    year: 2017,
    season: "Spring",
    type: "winner",
    team: "SKT",
    players: ["Huni", "Peanut", "Faker", "Bang", "Wolf"],
  },
  {
    id: "lck_2017_summer_winner",
    league: "LCK",
    year: 2017,
    season: "Summer",
    type: "winner",
    team: "LZ",
    players: ["Khan", "Cuzz", "BDD", "PraY", "GorillA"],
  },
  {
    id: "lck_2018_spring_winner",
    league: "LCK",
    year: 2018,
    season: "Spring",
    type: "winner",
    team: "KZ",
    players: ["Khan", "Peanut", "BDD", "PraY", "GorillA"],
  },
  {
    id: "lck_2018_summer_winner",
    league: "LCK",
    year: 2018,
    season: "Summer",
    type: "winner",
    team: "KT",
    players: ["Smeb", "Score", "Ucal", "Deft", "Mata"],
  },
  {
    id: "lck_2019_spring_winner",
    league: "LCK",
    year: 2019,
    season: "Spring",
    type: "winner",
    team: "SKT",
    players: ["Khan", "Clid", "Faker", "Teddy", "Mata"],
  },
  {
    id: "lck_2019_summer_winner",
    league: "LCK",
    year: 2019,
    season: "Summer",
    type: "winner",
    team: "SKT",
    players: ["Khan", "Clid", "Faker", "Teddy", "Effort"],
  },
  // 2020-2022
  {
    id: "lck_2020_spring_winner",
    league: "LCK",
    year: 2020,
    season: "Spring",
    type: "winner",
    team: "T1",
    players: ["Canna", "Cuzz", "Faker", "Teddy", "Effort"],
  },
  {
    id: "lck_2020_summer_winner",
    league: "LCK",
    year: 2020,
    season: "Summer",
    type: "winner",
    team: "DWG",
    players: ["Nuguri", "Canyon", "ShowMaker", "Ghost", "BeryL"],
  },
  {
    id: "lck_2021_spring_winner",
    league: "LCK",
    year: 2021,
    season: "Spring",
    type: "winner",
    team: "DWG",
    players: ["Khan", "Canyon", "ShowMaker", "Ghost", "BeryL"],
  },
  {
    id: "lck_2021_summer_winner",
    league: "LCK",
    year: 2021,
    season: "Summer",
    type: "winner",
    team: "T1",
    players: ["Canna", "Oner", "Faker", "Gumayusi", "Keria"],
  },
  {
    id: "lck_2022_spring_winner",
    league: "LCK",
    year: 2022,
    season: "Spring",
    type: "winner",
    team: "T1",
    players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"],
  },
  {
    id: "lck_2022_summer_winner",
    league: "LCK",
    year: 2022,
    season: "Summer",
    type: "winner",
    team: "GEN",
    players: ["Doran", "Peanut", "Chovy", "Ruler", "Lehends"],
  },
  // 2023
  {
    id: "lck_2023_spring_winner",
    league: "LCK",
    year: 2023,
    season: "Spring",
    type: "winner",
    team: "GEN",
    players: ["Doran", "Peanut", "Chovy", "Peyz", "Delight"],
  },
  {
    id: "lck_2023_spring_runnerup",
    league: "LCK",
    year: 2023,
    season: "Spring",
    type: "runnerUp",
    team: "T1",
    players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"],
  },
  {
    id: "lck_2023_summer_winner",
    league: "LCK",
    year: 2023,
    season: "Summer",
    type: "winner",
    team: "GEN",
    players: ["Doran", "Peanut", "Chovy", "Peyz", "Delight"],
  },
  {
    id: "lck_2023_summer_runnerup",
    league: "LCK",
    year: 2023,
    season: "Summer",
    type: "runnerUp",
    team: "T1",
    players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"],
  },
  // 2024
  {
    id: "lck_2024_spring_winner",
    league: "LCK",
    year: 2024,
    season: "Spring",
    type: "winner",
    team: "GEN",
    players: ["Kiin", "Canyon", "Chovy", "Peyz", "Lehends"],
  },
  {
    id: "lck_2024_spring_runnerup",
    league: "LCK",
    year: 2024,
    season: "Spring",
    type: "runnerUp",
    team: "T1",
    players: ["Zeus", "Oner", "Faker", "Gumayusi", "Keria"],
  },

  // ========== LPL ==========
  // 2020-2022
  {
    id: "lpl_2020_spring_winner",
    league: "LPL",
    year: 2020,
    season: "Spring",
    type: "winner",
    team: "JDG",
    players: ["Zoom", "Kanavi", "Yagao", "LokeN", "LvMao"],
  },
  {
    id: "lpl_2020_summer_winner",
    league: "LPL",
    year: 2020,
    season: "Summer",
    type: "winner",
    team: "TES",
    players: ["369", "Karsa", "knight", "JackeyLove", "yuyanjia"],
  },
  {
    id: "lpl_2021_spring_winner",
    league: "LPL",
    year: 2021,
    season: "Spring",
    type: "winner",
    team: "RNG",
    players: ["Xiaohu", "Wei", "Cryin", "GALA", "Ming"],
  },
  {
    id: "lpl_2021_summer_winner",
    league: "LPL",
    year: 2021,
    season: "Summer",
    type: "winner",
    team: "EDG",
    players: ["Flandre", "Jiejie", "Scout", "Viper", "Meiko"],
  },
  {
    id: "lpl_2022_spring_winner",
    league: "LPL",
    year: 2022,
    season: "Spring",
    type: "winner",
    team: "RNG",
    players: ["Bin", "Wei", "Xiaohu", "GALA", "Ming"],
  },
  {
    id: "lpl_2022_summer_winner",
    league: "LPL",
    year: 2022,
    season: "Summer",
    type: "winner",
    team: "JDG",
    players: ["369", "Kanavi", "Yagao", "Hope", "MISSING"],
  },
  // 2023
  {
    id: "lpl_2023_spring_winner",
    league: "LPL",
    year: 2023,
    season: "Spring",
    type: "winner",
    team: "JDG",
    players: ["369", "Kanavi", "knight", "Ruler", "MISSING"],
  },
  {
    id: "lpl_2023_summer_winner",
    league: "LPL",
    year: 2023,
    season: "Summer",
    type: "winner",
    team: "JDG",
    players: ["369", "Kanavi", "knight", "Ruler", "MISSING"],
  },
  // 2024
  {
    id: "lpl_2024_spring_winner",
    league: "LPL",
    year: 2024,
    season: "Spring",
    type: "winner",
    team: "BLG",
    players: ["Bin", "Xun", "knight", "Elk", "ON"],
  },
  {
    id: "lpl_2024_summer_winner",
    league: "LPL",
    year: 2024,
    season: "Summer",
    type: "winner",
    team: "BLG",
    players: ["Bin", "Xun", "knight", "Elk", "ON"],
  },

  // ========== LEC ==========
  // 2023
  {
    id: "lec_2023_spring_winner",
    league: "LEC",
    year: 2023,
    season: "Spring",
    type: "winner",
    team: "MAD",
    players: ["Chasy", "Elyoya", "Nisqy", "Carzzy", "Hylissang"],
  },
  {
    id: "lec_2023_summer_winner",
    league: "LEC",
    year: 2023,
    season: "Summer",
    type: "winner",
    team: "G2",
    players: ["BrokenBlade", "Yike", "Caps", "Hans Sama", "Mikyx"],
  },
  // 2024
  {
    id: "lec_2024_spring_winner",
    league: "LEC",
    year: 2024,
    season: "Spring",
    type: "winner",
    team: "G2",
    players: ["BrokenBlade", "Yike", "Caps", "Hans Sama", "Mikyx"],
  },
  {
    id: "lec_2024_summer_winner",
    league: "LEC",
    year: 2024,
    season: "Summer",
    type: "winner",
    team: "G2",
    players: ["BrokenBlade", "Yike", "Caps", "Hans Sama", "Mikyx"],
  },
];

export default CHAMPIONSHIPS;

// 로스터 매칭 함수
export const checkChampionship = (
  playerNames: string[],
  team: string,
  year: number
): ChampionshipRoster | null => {
  // 5명의 선수 이름을 정렬해서 비교
  const sortedNames = [...playerNames].sort();

  for (const championship of CHAMPIONSHIPS) {
    // 팀과 년도가 일치하는지 확인
    if (championship.team === team && championship.year === year) {
      const sortedChampionPlayers = [...championship.players].sort();

      // 모든 선수 이름이 일치하는지 확인
      if (
        JSON.stringify(sortedNames) === JSON.stringify(sortedChampionPlayers)
      ) {
        return championship;
      }
    }
  }

  return null;
};

// 특정 리그의 우승팀 가져오기
export const getChampionshipsByLeague = (league: string) => {
  return CHAMPIONSHIPS.filter((c) => c.league === league);
};

// 우승/준우승 구분해서 가져오기
export const getWinners = () => {
  return CHAMPIONSHIPS.filter((c) => c.type === "winner");
};

export const getRunnersUp = () => {
  return CHAMPIONSHIPS.filter((c) => c.type === "runnerUp");
};
