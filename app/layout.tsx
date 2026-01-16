import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

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
    "Create your ultimate League of Legends roster with legendary players from 2013-2025. Collect champions, build dream teams, and share with the community.",
  keywords: [
    "League of Legends",
    "LoL",
    "Gacha",
    "Roster Builder",
    "Pro Players",
    "Esports",
    "T1",
    "Faker",
    "LCK",
    "LPL",
    "Worlds",
    "MSI",
    "Dream Team",
    "리그오브레전드",
    "롤",
    "로스터",
    "프로게이머",
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
      "Create your ultimate League of Legends roster with legendary players from 2013-2025. Collect champions, build dream teams, and share with the community.",
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
      "Create your ultimate League of Legends roster with legendary players from 2013-2025.",
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
        <link rel="icon" href="/lol.webp" />
        <link rel="apple-touch-icon" href="/lol.webp" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
