import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AdBanner from "@/components/AdBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";

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
    default: "League of Gacha - Build Your Dream LoL Team",
    template: "%s | League of Gacha",
  },
  description:
    "롤 프로게이머 드림팀을 만드세요! 리그오브레전드 가챠 게임. LCK, LPL, 월즈 챔피언들을 뽑고 랜덤 로스터를 구성하세요. Create your ultimate League of Legends roster with legendary players from 2013-2025.",
  keywords: [
    "League of Legends",
    "LoL",
    "Gacha",
    "Roster Builder",
    "Pro Players",
    "Esports",
    "T1",
    "Gen.G",
    "Faker",
    "LCK",
    "LPL",
    "LEC",
    "Worlds",
    "MSI",
    "Dream Team",
    "리그오브레전드",
    "리그오브 레전드",
    "롤",
    "로스터",
    "프로게이머",
    "롤 프로게이머",
    "롤 가챠",
    "롤 랜덤",
    "월즈",
    "월즈드래프트",
    "드림팀",
    "LCK 선수",
    "LPL 선수",
  ],
  authors: [{ name: "League of Gacha Team" }],
  creator: "League of Gacha",
  publisher: "League of Gacha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://league-of-gacha.pages.dev/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://league-of-gacha.pages.dev/",
    title: "League of Gacha - Build Your Dream LoL Team",
    description:
      "롤 프로게이머 가챠 게임! LCK, LPL 선수들로 드림팀을 구성하고 월즈 챔피언 로스터를 만드세요. Create your ultimate League of Legends roster with legendary players from 2013-2025.",
    siteName: "League of Gacha",
    images: [
      {
        url: "https://league-of-gacha.pages.dev/opengraph_IMG.jpg",
        width: 1200,
        height: 630,
        alt: "League of Gacha - Build Your Dream Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "League of Gacha - Build Your Dream LoL Team",
    description:
      "롤 프로게이머 가챠 게임! LCK, LPL 선수들로 드림팀을 구성하고 월즈 챔피언 로스터를 만드세요. Create your ultimate League of Legends roster with legendary players from 2013-2025.",
    images: ["https://league-of-gacha.pages.dev/opengraph_IMG.jpg"],
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
    google: "8vf3whLt3aqJawoiSkCtfju1tLZxJX3WLrrO3LQWEbQ",
    other: {
      "naver-site-verification": "f3039f0f5df4f43034c0f6719a3b67fd79584a68",
    },
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
        <link rel="icon" href="/lol.webp" />
        <link rel="apple-touch-icon" href="/lol.webp" />
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
        <Navigation />
        <main>{children}</main>
        {/* <AdBanner /> */}
      </body>
    </html>
  );
}
