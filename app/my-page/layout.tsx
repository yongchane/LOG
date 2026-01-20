import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Page - League of Gacha",
  description:
    "View your League of Gacha game history, track your championship wins, and see your legendary roster combinations.",
  openGraph: {
    title: "My Page - League of Gacha",
    description: "Track your game history and championship wins",
    url: "https://leagueofgacha.com/my-page",
  },
};

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
