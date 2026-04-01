import { headers, cookies } from "next/headers";
import Link from "next/link";
import { countries, getCountryByCode } from "@/data/countries";
import { fetchTrendsForCountry } from "@/lib/google-trends";
import TrendCard from "@/components/TrendCard";
import CountrySelector from "@/components/CountrySelector";

export const dynamic = "force-dynamic"; // 접속 국가에 따라 동적 렌더링

async function getUserCountry(): Promise<string> {
  const cookieStore = await cookies();
  const override = cookieStore.get("preferred-country")?.value;
  if (override) {
    const valid = countries.find((c) => c.code === override);
    if (valid) return override;
  }

  const headersList = await headers();
  const detected = headersList.get("x-user-country") || headersList.get("x-vercel-ip-country") || "US";
  const valid = countries.find((c) => c.code === detected);
  return valid ? detected : "US";
}

export default async function HomePage() {
  const countryCode = await getUserCountry();
  const country = getCountryByCode(countryCode)!;
  const trends = await fetchTrendsForCountry(country.code);

  const ui = country.ui;

  return (
    <>
      {/* Hero - 접속 국가 맞춤 */}
      <section
        className="relative text-white"
        style={{
          background: `linear-gradient(135deg, ${country.color}ee, ${country.color}88, #1e1b4b)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex justify-end mb-6">
            <CountrySelector currentCode={country.code} />
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <span className="text-7xl md:text-9xl mb-6 block">{country.flag}</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              {ui.hero}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl mx-auto">
              {ui.heroSub}
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/70">{ui.live}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 해당 국가 트렌드 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900">
            {ui.trendingIn}
          </h2>
          <p className="text-gray-500 mt-2">
            {new Date().toLocaleDateString(country.locale, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid gap-4">
          {trends.length > 0 ? (
            trends.map((trend, i) => (
              <TrendCard key={trend.slug} trend={trend} rank={i + 1} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-4">{country.flag}</p>
              <p className="text-lg">{ui.noTrends}</p>
            </div>
          )}
        </div>
      </section>

      {/* 다른 나라 탐색 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {ui.exploreOther}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {countries
            .filter((c) => c.code !== country.code)
            .map((c) => (
              <Link
                key={c.code}
                href={`/country/${c.code.toLowerCase()}`}
                className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <span className="text-xl">{c.flag}</span>
                <span className="truncate">{c.name}</span>
              </Link>
            ))}
        </div>
      </section>

      {/* SEO: JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "IssueGlobe",
            url: "https://issueglobe.com",
            description: `Real-time trending topics in ${country.name} and 30 countries around the world.`,
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
