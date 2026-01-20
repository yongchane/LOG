import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import StructuredData from "@/components/StructuredData";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "리그오브가챠(Loga/로가) - 롤 프로게이머 가챠 게임 | League of Gacha",
    template: "%s | Loga 롤 가챠 - League of Gacha",
  },
  description:
    "리그오브가챠(Loga/로가) - 롤 프로게이머 가챠 게임! 페이커, 데프트, 루키 등 200명 이상의 선수로 드림팀 구성. Build your dream LoL team with Faker, Deft, Rookie! Free League of Legends gacha game featuring 200+ pro players from LCK, LPL, LEC, Worlds, MSI 2013-2025.",
  keywords: [
    // 서비스 브랜드명
    "Loga",
    "로가",
    "로그",
    "League of Gacha",
    "리그오브가챠",
    "리그 오브 가챠",

    // 한국어 핵심 키워드 (국내 SEO 우선)
    "롤 가챠",
    "롤 가챠 게임",
    "롤 프로게이머 가챠",
    "롤 프로게이머",
    "롤 선수 뽑기",
    "롤 드림팀",
    "롤 랜덤 게임",
    "롤 로스터",
    "리그오브레전드 가챠",
    "리그오브레전드 게임",
    "롤 게임",
    "프로게이머 가챠",
    "프로게이머 뽑기",
    "페이커 가챠",
    "롤 올스타",
    "롤 선수",
    "LCK 가챠",
    "LCK 선수",
    "LPL 선수",
    "월즈 챔피언",
    "월즈 우승",
    "롤 월즈",
    "롤 MSI",
    "T1 가챠",
    "Gen.G 가챠",
    "롤 팀 만들기",
    "페이커",
    "데프트",
    "루키",
    "쇼메이커",

    // English keywords (international SEO)
    "League of Legends gacha",
    "LoL gacha game",
    "LoL roster builder",
    "League of Legends roster",
    "LoL pro players",
    "LoL dream team",
    "League of Legends team builder",
    "LoL random game",
    "esports gacha",
    "pro player gacha",
    "Faker gacha",
    "LCK players",
    "LPL players",
    "LEC players",
    "Worlds champions",
    "MSI champions",
    "T1 roster",
    "Gen.G roster",
    "League of Legends game",
    "LoL esports game",
    "free LoL game",
    "League roster game",
    "LoL team simulator",
    "esports roster builder",

    // Player names (international search)
    "Faker",
    "Deft",
    "Rookie",
    "Chovy",
    "Showmaker",
    "Uzi",
    "Perkz",
    "Caps",
    "Rekkles",
    "Doublelift",

    // Teams
    "T1",
    "Gen.G",
    "DRX",
    "JDG",
    "EDG",
    "G2",
    "Fnatic",
    "Cloud9",

    // General terms
    "League of Legends",
    "LoL",
    "Gacha",
    "Roster Builder",
    "Pro Players",
    "Esports",
    "LCK",
    "LPL",
    "LEC",
    "LCS",
    "Worlds",
    "MSI",
    "Dream Team",
  ],
  authors: [{ name: "League of Gacha Team" }],
  creator: "League of Gacha",
  publisher: "League of Gacha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://leagueofgacha.com/"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "ko-KR": "/",
      "en-GB": "/",
      "zh-CN": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US", "en_GB", "zh_CN"],
    url: "https://leagueofgacha.com/",
    title: "리그오브가챠(Loga/로가) - 롤 프로게이머 가챠 게임 | League of Gacha",
    description:
      "리그오브가챠(Loga/로가) - 롤 프로게이머 가챠 게임! 페이커, 데프트, 루키 등 200명 이상의 LCK, LPL, LEC, LCS 프로게이머로 나만의 드림팀을 만들어보세요. 월즈 우승자와 MSI 챔피언 포함! Create your ultimate League of Legends roster with 200+ pro players!",
    siteName: "리그오브가챠 - League of Gacha (Loga)",
    images: [
      {
        url: "https://leagueofgacha.com/opengraph_IMG.jpg",
        width: 1200,
        height: 630,
        alt: "롤 가챠 게임 - LoL Roster Gacha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "리그오브가챠(Loga/로가) - 롤 프로게이머 가챠 게임 | League of Gacha",
    description:
      "리그오브가챠(Loga/로가) - 롤 프로게이머 가챠 게임! 페이커, 데프트, 루키 등 200명 이상의 LCK, LPL, LEC, LCS 프로게이머로 나만의 드림팀을 만들어보세요. 월즈 우승자와 MSI 챔피언 포함!",
    images: ["https://leagueofgacha.com/opengraph_IMG.jpg"],
    creator: "@leagueofgacha",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "VGKmHiudNwz3Aceo0E9IhnNkoBU_CpfdvD0awITg7CA",
    other: {
      "naver-site-verification": "ca719484484805b173e7bee61e3ad53dfbcc50ac",
    },
  },
  other: {
    "google-site-verification": "VGKmHiudNwz3Aceo0E9IhnNkoBU_CpfdvD0awITg7CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-6192776695660842" />
        <link rel="icon" href="/log.png" />
        <link rel="apple-touch-icon" href="/lol.webp" />
        {/* hreflang tags for international SEO */}
        <link
          rel="alternate"
          hrefLang="ko"
          href="https://leagueofgacha.com/"
        />
        <link
          rel="alternate"
          hrefLang="ko-KR"
          href="https://leagueofgacha.com/"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://leagueofgacha.com/"
        />
        <link
          rel="alternate"
          hrefLang="en-US"
          href="https://leagueofgacha.com/"
        />
        <link
          rel="alternate"
          hrefLang="en-GB"
          href="https://leagueofgacha.com/"
        />
        <link
          rel="alternate"
          hrefLang="zh"
          href="https://leagueofgacha.com/"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://leagueofgacha.com/"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6192776695660842"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <MicrosoftClarity clarityId="v2pzezyev8" />
        <StructuredData
          type="WebApplication"
          data={{
            name: "League of Gacha",
            description:
              "Build your dream LoL roster with pro players from LCK, LPL, LEC",
            url: "https://leagueofgacha.com",
          }}
        />
        <StructuredData
          type="VideoGame"
          data={{
            name: "League of Gacha - LOL Pro Player Gacha Game",
            description:
              "Free online gacha game where you summon real League of Legends pro players from 2013-2025 to build your dream esports team",
            url: "https://leagueofgacha.com",
          }}
        />
        <StructuredData type="WebSite" data={{}} />
        <StructuredData type="Organization" data={{}} />
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          {/* <AdBanner /> */}
        </LanguageProvider>
      </body>
    </html>
  );
}
