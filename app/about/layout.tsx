import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - League of Gacha",
  description:
    "Learn about League of Gacha - the ultimate LoL pro player roster builder. Create dream teams with legendary players from LCK, LPL, LEC, and Worlds.",
  openGraph: {
    title: "About League of Gacha",
    description:
      "Learn about League of Gacha - the ultimate LoL pro player roster builder",
    url: "https://leagueofgacha.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
