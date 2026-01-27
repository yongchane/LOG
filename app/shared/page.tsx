import { Metadata } from "next";
import { Suspense } from "react";
import SharedRosterClient from "./SharedRosterClient";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const roster = searchParams.roster as string;

  // Fallback if no roster param
  const imageUrl = roster
    ? `https://leagueofgacha.com/api/og?roster=${roster}`
    : "https://leagueofgacha.com/api/og";

  return {
    title: "My Legendary Roster | League of Gacha",
    description: "Check out the legendary League of Legends roster I built!",
    openGraph: {
      title: "My Legendary Roster | League of Gacha",
      description: "Check out the legendary League of Legends roster I built!",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "League of Gacha Roster Preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "My Legendary Roster | League of Gacha",
      description: "Check out the legendary League of Legends roster I built!",
      images: [imageUrl],
    },
  };
}

export default function SharedRosterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen hextech-bg hexagon-pattern flex items-center justify-center">
          <div className="text-lol-gold text-2xl">Loading...</div>
        </div>
      }
    >
      <SharedRosterClient />
    </Suspense>
  );
}
