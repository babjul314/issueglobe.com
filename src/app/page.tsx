import { headers, cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { countries, getCountryByCode } from "@/data/countries";
import { TrendItem } from "@/lib/google-trends";
import { getTrendsFromSources } from "@/lib/trend-source";
import TrendCard from "@/components/TrendCard";
import CountrySelector from "@/components/CountrySelector";

export const revalidate = 30; // 30초 캐시 (매우 빠른 새로고침)

// Multi-language SEO descriptions for homepage
const seoDescriptions: Record<string, { title: string; description: string }> = {
  US: { title: "IssueGlobe - Trending Topics in the United States", description: "Discover what Americans are searching for right now. See real-time trending topics and Google Trends data updated every hour. Find the most searched keywords across the USA." },
  KR: { title: "이슈글로브 - 대한민국 실시간 이슈 · 검색어 순위", description: "지금 대한민국 실시간 이슈를 한눈에 확인하세요. 오늘의 이슈 순위, 지금 뜨는 이슈, 실시간 검색어 1위를 매시간 업데이트합니다. 구글 트렌드 기반 한국 실시간 이슈 모음." },
  JP: { title: "イシューグローブ - 日本のトレンド検索ランキング", description: "日本で今最も検索されているキーワードをリアルタイムで確認。Googleトレンドデータを毎時更新。最新の日本トレンドと人気検索ワードをすぐに把握できます。" },
  GB: { title: "IssueGlobe - Trending Topics in the UK", description: "See what the British are searching for right now. Access real-time trending topics and UK Google Trends data updated hourly. Discover the most searched keywords in Britain." },
  DE: { title: "IssueGlobe - Aktuelle Trends in Deutschland", description: "Entdecken Sie, wonach Deutsche suchen. Echtzeit Google Trends, stündlich aktualisiert. Sehen Sie die beliebtesten Suchanfragen und Trends in Deutschland in Echtzeit." },
  FR: { title: "IssueGlobe - Tendances en France", description: "Découvrez les sujets les plus recherchés en France en temps réel. Données Google Trends mises à jour toutes les heures. Consultez les tendances françaises et les mots-clés populaires." },
  ES: { title: "IssueGlobe - Tendencias en España", description: "Descubre qué buscan los españoles en tiempo real. Google Trends actualizado cada hora. Accede a las tendencias españolas más recientes y palabras clave más populares." },
  IT: { title: "IssueGlobe - Tendenze in Italia", description: "Scopri cosa cercano gli italiani in tempo reale. Dati Google Trends aggiornati ogni ora. Visualizza le tendenze italiane più recenti e le parole chiave più ricercate." },
  BR: { title: "IssueGlobe - Assuntos do Momento no Brasil", description: "Descubra o que os brasileiros estão pesquisando agora. Dados do Google Trends atualizados a cada hora. Acesse as tendências brasileiras mais recentes e palavras-chave populares." },
  CA: { title: "IssueGlobe - Trending Topics in Canada", description: "See what Canadians are searching for right now. Real-time trending topics and Google Trends data updated hourly. Explore Canadian trends and popular search keywords." },
  AU: { title: "IssueGlobe - Trending Topics in Australia", description: "See what Australians are searching for right now. Real-time trending topics and Google Trends data updated hourly. Discover Australian trends and popular search terms." },
  IN: { title: "IssueGlobe - भारत में ट्रेंडिंग", description: "भारत में अभी सबसे ज्यादा खोजे जाने वाले विषय देखें। प्रतिघंटा अपडेट होने वाला रीयल-टाइम डेटा। भारत के सबसे लोकप्रिय ट्रेंड और खोज शब्द जानें।" },
  NL: { title: "IssueGlobe - Trending in Nederland", description: "Ontdek waar Nederlanders nu naar zoeken. Realtime Google Trends data, elk uur bijgewerkt. Zie de Nederlandse trends en populaire zoekwoorden op dit moment." },
  TW: { title: "IssueGlobe - 台灣熱門搜尋", description: "查看台灣最熱門的搜尋關鍵字。Google Trends資料每小時更新。即時掌握台灣最新趨勢和最受歡迎的搜尋主題。" },
  HK: { title: "IssueGlobe - 香港熱門搜尋", description: "查看香港最熱門的搜尋關鍵字。Google Trends資料每小時更新。即時掌握香港最新趨勢和最受歡迎的搜尋主題。" },
};

export async function generateMetadata(): Promise<Metadata> {
  const userCountry = await getUserCountry();
  const seo = seoDescriptions[userCountry] || seoDescriptions.US;
  const country = getCountryByCode(userCountry);

  // 홈페이지도 동적 description - 현재 실검 1~2위 + 검색량 노출
  const trends = await getTrendsFromFirebase(userCountry);
  const top = trends.slice(0, 2);
  const topTitles = top.map(t => t.title);
  const topTraffic = top[0]?.traffic ? ` ${top[0].traffic} 검색.` : "";
  const dynamicDesc: Record<string, string> = {
    KR: topTitles.length >= 2
      ? `실검 1위 '${topTitles[0]}'.${topTraffic} 2위 '${topTitles[1]}' 급상승. 30개국 이슈 매시간 업데이트`
      : seo.description,
    US: topTitles.length >= 2
      ? `Trending now: '${topTitles[0]}' & '${topTitles[1]}'. Live trends from 30 countries, updated every hour.`
      : seo.description,
    JP: topTitles.length >= 2
      ? `今のトレンド「${topTitles[0]}」「${topTitles[1]}」など30カ国リアルタイム更新`
      : seo.description,
  };
  const finalDesc = dynamicDesc[userCountry] || (
    topTitles.length >= 2
      ? `Trending now: '${topTitles[0]}' & '${topTitles[1]}'. Live trends from 30 countries, updated every hour.`
      : seo.description
  );

  // 홈 타이틀도 실검 1위 키워드 포함 (KR만)
  const dynamicTitle = userCountry === "KR" && topTitles[0]
    ? `'${topTitles[0].length > 15 ? topTitles[0].substring(0, 13) + "…" : topTitles[0]}' 실검 1위 | 한국 실시간 이슈`
    : seo.title;

  return {
    title: dynamicTitle,
    description: finalDesc,
    openGraph: {
      title: dynamicTitle,
      description: finalDesc,
      locale: country?.locale || "en_US",
      type: "website",
      url: "https://issueglobe.com",
      siteName: "IssueGlobe",
      images: [
        {
          url: "https://issueglobe.com/og-image.png",
          width: 1200,
          height: 630,
          alt: "IssueGlobe - Real-Time Global Trending Topics",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: finalDesc,
      images: ["https://issueglobe.com/og-image.png"],
    },
  };
}

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

  // 브라우저 언어 설정 확인 (Accept-Language 헤더)
  const acceptLanguage = headersList.get("accept-language") || "";
  const langMap: Record<string, string> = {
    "ko": "KR",
    "ja": "JP",
    "de": "DE",
    "fr": "FR",
    "es": "ES",
    "it": "IT",
    "pt": "BR",
    "nl": "NL",
    "sv": "SE",
    "no": "NO",
    "da": "DK",
    "fi": "FI",
    "pl": "PL",
    "zh": "TW",
    "ar": "SA",
  };

  const primaryLang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
  if (primaryLang && langMap[primaryLang]) {
    return langMap[primaryLang];
  }

  // 기본값: US
  return "US";
}

async function getTrendsFromFirebase(countryCode: string): Promise<TrendItem[]> {
  return getTrendsFromSources(countryCode, 20);
}

async function getUserLang(): Promise<string> {
  // IP 기반 언어 감지 (쿠키 무시)
  const headersList = await headers();
  const detected = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || "KR";
  const c = countries.find((c) => c.code === detected);
  return c?.lang || "en";
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
        id="regions"
        className="relative text-white"
        style={{
          background: `linear-gradient(135deg, ${country.color}, ${country.color}cc, #0f172a)`,
          minHeight: "140px",
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
                title={`See trending topics and popular searches in ${c.name}`}
                prefetch={true}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="truncate">{c.name} Trends</span>
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
            mainEntity: {
              "@type": "Thing",
              name: "Trending Topics",
              description: "Most searched topics and keywords globally"
            }
          }),
        }}
      />

      {/* Service/Product Schema for Trust */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Real-Time Trends Discovery",
            description: "Discover what the world is searching for right now. Real-time trending topics updated hourly.",
            provider: {
              "@type": "Organization",
              name: "IssueGlobe",
              url: "https://issueglobe.com"
            },
            areaServed: [
              "US", "KR", "JP", "GB", "DE", "FR", "BR", "IN", "AU", "CA",
              "NL", "IT", "ES", "CH", "SE", "NO", "DK", "BE", "AT", "IE",
              "NZ", "SG", "FI", "PL", "TW", "SA", "AE", "HK", "IL"
            ],
            availableLanguage: [country.lang, "en"],
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock"
            }
          }),
        }}
      />
    </>
  );
}
