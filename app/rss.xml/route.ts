// RSS Feed for Naver Search
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const baseUrl = "https://leagueofgacha.com";
  const buildDate = new Date().toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>League of Gacha - 리그오브가챠</title>
    <link>${baseUrl}</link>
    <description>롤 프로게이머 드림팀을 만드세요! LCK, LPL, LEC 선수들로 나만의 우승 로스터를 구성하는 가챠 게임</description>
    <language>ko</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    
    <item>
      <title>League of Gacha - Build Your Dream LoL Team</title>
      <link>${baseUrl}</link>
      <description>리그오브레전드 프로 선수 랜덤 가챠 게임! 당신만의 드림팀을 소환하고, 우승 로스터를 완성하세요! Faker, Chovy, Deft 등 300+ 선수 포함.</description>
      <pubDate>${buildDate}</pubDate>
      <guid>${baseUrl}</guid>
    </item>
    
    <item>
      <title>Community - Share Your Dream Roster</title>
      <link>${baseUrl}/community</link>
      <description>다른 유저들과 로스터를 공유하고, 좋아요와 댓글로 소통하세요. 최고의 드림팀을 만들어보세요!</description>
      <pubDate>${buildDate}</pubDate>
      <guid>${baseUrl}/community</guid>
    </item>
    
    <item>
      <title>My Page - Track Your Game History</title>
      <link>${baseUrl}/my-page</link>
      <description>나의 가챠 기록과 우승 로스터 완성 내역을 확인하세요. 주간 통계와 성과를 추적할 수 있습니다.</description>
      <pubDate>${buildDate}</pubDate>
      <guid>${baseUrl}/my-page</guid>
    </item>
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate",
    },
  });
}
