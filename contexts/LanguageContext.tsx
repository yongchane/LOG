"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Language } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  showWorldsAnimation: boolean;
  setShowWorldsAnimation: (show: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations = {
  en: {
    // Navigation
    home: "Home",
    myPage: "My Stats",
    community: "Community",
    about: "About",

    // Main Page
    mainTitle: "Build Your Dream LoL Team",
    mainDescription:
      "Perfect for LOL esports fans aged 18-35! Summon legendary League of Legends pro players from 2013-2026 and create your ultimate championship roster in just 5 minutes. Enjoy during your break or after work with this free gacha-style team builder featuring Faker, Deft, Rookie, and 200+ professional players from LCK, LPL, LEC, Worlds, and MSI tournaments.",

    // Buttons
    selectOne: "Select One Player",
    selectAll: "Select All Players",
    reset: "Reset Roster",
    recordWin: "Record Win",
    recordLoss: "Record Loss",
    shareCommunity: "Share to Community",
    shareLink: "Share Link",
    confirm: "Confirm",
    reroll: "Reroll",
    findingPlayers: "Found your player!",

    // Settings
    worldsAnimation: "Worlds Winner Animation",
    worldsAnimationDesc: "Show special animation for Worlds champions",

    // Community
    enterName: "Enter your name",
    addComment: "Add a comment",
    postRoster: "Post Roster",
    sharedRosters: "Shared Rosters",
    noRosters: "No rosters shared yet",

    // Championship
    congratulations: "Congratulations!",
    championshipRoster: "You've assembled a championship roster!",

    // My Page
    weeklyStats: "Weekly Stats",
    wins: "Wins",
    losses: "Losses",
    winRate: "Win Rate",
    mostPicked: "Most Picked Players",
    noStats: "No statistics yet. Start playing!",

    // Championship
    champions: "CHAMPIONS",
    runnersUp: "RUNNERS-UP",
    championshipComplete: "You've assembled the legendary {team} roster!",

    // Messages
    linkCopied: "Link copied to clipboard!",
    rosterShared: "Roster shared to community!",
    winRecorded: "Win recorded!",
    lossRecorded: "Loss recorded!",
  },
  ko: {
    // Navigation
    home: "홈",
    myPage: "내 전적",
    community: "로스터 자랑",
    about: "소개",

    // Main Page
    mainTitle: "롤 프로게이머 가챠 게임 - 드림팀 만들기",
    mainDescription:
      "롤 프로게이머 랜덤 가챠로 나만의 드림팀을 구성하세요! 페이커, 데프트, 루키 등 2013-2026년 LCK, LPL, 월즈 챔피언 200명 이상의 선수를 뽑아 최강 로스터를 만들 수 있습니다. 무료 롤 가챠 게임으로 5분 만에 리그오브레전드 올스타 팀을 완성하세요. 18-35세 롤 e스포츠 팬들에게 완벽한 게임입니다.",

    // Buttons
    selectOne: "선수 한 명 뽑기",
    selectAll: "전체 뽑기",
    reset: "로스터 초기화",
    recordWin: "승리 기록",
    recordLoss: "패배 기록",
    shareCommunity: "커뮤니티에 공유",
    shareLink: "링크 공유",
    confirm: "확인",
    reroll: "다시 뽑기",
    findingPlayers: "당신의 선수를 찾았습니다!",

    // Settings
    worldsAnimation: "월즈 우승자 애니메이션",
    worldsAnimationDesc: "월즈 우승자의 특별한 애니메이션 보기",

    // Community
    enterName: "이름을 입력하세요",
    addComment: "댓글 추가",
    postRoster: "로스터 게시",
    sharedRosters: "공유된 로스터",
    noRosters: "아직 공유된 로스터가 없습니다",

    // Championship
    congratulations: "축하합니다!",
    championshipRoster: "우승 로스터를 완성했습니다!",

    // Championship
    champions: "챔피언",
    runnersUp: "준우승",
    championshipComplete: "전설적인 {team} 로스터를 완성했습니다!",

    // My Page
    weeklyStats: "주간 통계",
    wins: "승",
    losses: "패",
    winRate: "승률",
    mostPicked: "가장 많이 뽑은 선수",
    noStats: "아직 통계가 없습니다. 게임을 시작하세요!",

    // Messages
    linkCopied: "링크가 복사되었습니다!",
    rosterShared: "로스터가 커뮤니티에 공유되었습니다!",
    winRecorded: "승리가 기록되었습니다!",
    lossRecorded: "패배가 기록되었습니다!",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [showWorldsAnimation, setShowWorldsAnimationState] =
    useState<boolean>(true);

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "ko" || saved === "en") {
      setLanguageState(saved);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language;
      setLanguageState(browserLang.startsWith("ko") ? "ko" : "en");
    }

    // Load Worlds animation setting
    const worldsAnimSaved = localStorage.getItem("showWorldsAnimation");
    if (worldsAnimSaved !== null) {
      setShowWorldsAnimationState(worldsAnimSaved === "true");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const setShowWorldsAnimation = (show: boolean) => {
    setShowWorldsAnimationState(show);
    localStorage.setItem("showWorldsAnimation", show.toString());
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        showWorldsAnimation,
        setShowWorldsAnimation,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
