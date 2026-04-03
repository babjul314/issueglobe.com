import { headers, cookies } from "next/headers";
import Link from "next/link";
import { countries, getCountryByCode } from "@/data/countries";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { TrendItem } from "@/lib/google-trends";
import TrendCard from "@/components/TrendCard";
import CountrySelector from "@/components/CountrySelector";

export const revalidate = 60; // 1분 캐시 (더 자주 새로고침)

async function getUserCountry(): Promise<string> {
  const cookieStore = await cookies();
  const override = cookieStore.get("preferred-country")?.value;
  if (override) {
    const valid = countries.find((c) => c.code === override);
    if (valid) return override;
  }

  const headersList = await headers();
  // Vercel IP 헤더 확인
  const detected = headersList.get("x-vercel-ip-country");
  if (detected) {
    const valid = countries.find((c) => c.code === detected);
    if (valid) return detected;
  }

  // CloudFlare IP 헤더 확인 (대체 옵션)
  const cfCountry = headersList.get("cf-ipcountry");
  if (cfCountry) {
    const valid = countries.find((c) => c.code === cfCountry);
    if (valid) return cfCountry;
  }

  // 기본값: US
  return "US";
}

async function getTrendsFromFirebase(countryCode: string): Promise<TrendItem[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const trendsRef = collection(db, "trends", countryCode, today);
    const q = query(trendsRef, orderBy("createdAt", "desc"), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as TrendItem);
  } catch (error) {
    console.error("Firebase error:", error);
    return [];
  }
}

export default async function HomePage() {
  const countryCode = await getUserCountry();
  const country = getCountryByCode(countryCode)!;
  const trends = await getTrendsFromFirebase(country.code);
  const ui = country.ui;

  return (
    <>
      {/* Compact Hero - 스크롤 없이 바로 랭킹 보이도록 */}
      <section
        className="relative text-white"
        style={{
          background: `linear-gradient(135deg, ${country.color}ee, ${country.color}88, #1e1b4b)`,
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl md:text-5xl">{country.flag}</span>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight">
                  {ui.hero}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white/70">{ui.live}</span>
                  </div>
                  <span className="text-xs text-white/50">
                    {new Date().toLocaleDateString(country.locale, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <CountrySelector currentCode={country.code} />
          </div>
        </div>
      </section>

      {/* 트렌드 랭킹 - 바로 보이는 영역 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-gray-900">
            {ui.trendingIn}
          </h2>
          <span className="text-sm text-gray-400">
            {trends.length} topics
          </span>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "IssueGlobe",
            url: "https://issueglobe.com",
            description: "Real-time trending topics from 30 countries. Updated hourly with live Google Trends data.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://issueglobe.com/country/{country}"
              }
            },
            inLanguage: [country.lang, "en"],
            isAccessibleForFree: true,
          }),
        }}
      />
    </>
  );
}
