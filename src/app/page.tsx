import { countries, getCountriesByRegion } from "@/data/countries";
import { fetchTrendsForCountry, TrendItem } from "@/lib/google-trends";
import CountryCard from "@/components/CountryCard";
import TrendCard from "@/components/TrendCard";

export const revalidate = 3600; // ISR: 1시간마다 재생성

async function getTopTrends(): Promise<{
  trendsByCountry: Record<string, TrendItem[]>;
  globalTop: TrendItem[];
}> {
  const trendsByCountry: Record<string, TrendItem[]> = {};
  const allTrends: TrendItem[] = [];

  // 주요 5개국만 서버에서 프리로드 (빌드 시간 절약)
  const priorityCountries = ["US", "GB", "JP", "KR", "DE"];

  for (const code of priorityCountries) {
    try {
      const trends = await fetchTrendsForCountry(code);
      trendsByCountry[code] = trends;
      allTrends.push(...trends);
    } catch {
      trendsByCountry[code] = [];
    }
  }

  // 트래픽 기준 상위 20개 글로벌 트렌드
  const globalTop = allTrends
    .sort((a, b) => {
      const aNum = parseInt(a.traffic.replace(/[^0-9]/g, "")) || 0;
      const bNum = parseInt(b.traffic.replace(/[^0-9]/g, "")) || 0;
      return bNum - aNum;
    })
    .slice(0, 20);

  return { trendsByCountry, globalTop };
}

export default async function HomePage() {
  const { trendsByCountry, globalTop } = await getTopTrends();
  const regions = getCountriesByRegion();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              What the World is
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Searching For
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Real-time trending topics from 30 countries. Discover global
              issues, viral stories, and what matters most around the world
              — updated daily.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {countries.slice(0, 15).map((c) => (
                <span
                  key={c.code}
                  className="text-2xl hover:scale-125 transition-transform cursor-default"
                  title={c.name}
                >
                  {c.flag}
                </span>
              ))}
              <span className="text-2xl text-blue-200">+15</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Top Trends */}
      <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900">
            Global Top Trends
          </h2>
          <p className="text-gray-500 mt-2">
            The most searched topics across the world right now
          </p>
        </div>

        <div className="grid gap-4">
          {globalTop.length > 0 ? (
            globalTop.map((trend, i) => (
              <TrendCard key={trend.slug} trend={trend} rank={i + 1} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Loading trends...</p>
              <p className="text-sm mt-2">
                Trends will appear once data is fetched from Google Trends.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Countries by Region */}
      <section id="regions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900">
            Explore by Region
          </h2>
          <p className="text-gray-500 mt-2">
            Browse trending topics by country and region
          </p>
        </div>

        {Object.entries(regions).map(([region, regionCountries]) => (
          <div key={region} id={region.toLowerCase().replace(/\s/g, "-")} className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full" />
              {region}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {regionCountries.map((country) => (
                <CountryCard
                  key={country.code}
                  country={country}
                  trendCount={trendsByCountry[country.code]?.length || 0}
                  topTrend={trendsByCountry[country.code]?.[0]?.title}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* SEO: JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "IssueGlobe",
            url: "https://issueglobe.com",
            description:
              "Real-time trending topics from 30 countries around the world.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://issueglobe.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
