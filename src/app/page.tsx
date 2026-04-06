import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { countries, getCountryByCode } from "@/data/countries";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { TrendItem } from "@/lib/google-trends";
import TrendCard from "@/components/TrendCard";
import CountrySelector from "@/components/CountrySelector";

export const revalidate = 30; // 30초 캐시 (매우 빠른 새로고침)

// Multi-language SEO descriptions for homepage
const seoDescriptions: Record<string, { title: string; description: string }> = {
  US: { title: "IssueGlobe - Trending Topics in the United States", description: "Discover what Americans are searching for right now. See real-time trending topics and Google Trends data updated every hour. Find the most searched keywords across the USA." },
  KR: { title: "이슈글로브 - 대한민국 실시간 검색어 순위", description: "한국에서 지금 가장 많이 검색하는 키워드를 실시간으로 확인하세요. 매시간 업데이트되는 구글 트렌드 데이터로 한국 트렌드를 파악하세요. 최신 검색어 순위와 인기 주제를 한눈에 볼 수 있습니다." },
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

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
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
      description: seo.description,
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
  try {
    // 홈페이지: 오늘 데이터만 (최신 트렌드만 표시)
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

async function getUserLang(): Promise<string> {
  // IP 기반 언어 감지 (쿠키 무시)
  const headersList = await headers();
  const detected = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || "KR";
  const c = countries.find((c) => c.code === detected);
  return c?.lang || "en";
}

export default async function HomePage() {
  // IP 기반으로 올바른 국가 페이지로 리다이렉트
  const headersList = await headers();
  const ipCountry = headersList.get("x-vercel-ip-country") ||
                    headersList.get("cf-ipcountry");
  const xVercelIp = headersList.get("x-vercel-ip-country");
  const cfIp = headersList.get("cf-ipcountry");

  console.log(`[HomePage] 루트(/) 페이지 접속`);
  console.log(`[HomePage] x-vercel-ip-country: ${xVercelIp}`);
  console.log(`[HomePage] cf-ipcountry: ${cfIp}`);
  console.log(`[HomePage] ipCountry 최종값: ${ipCountry}`);
  console.log(`[HomePage] IP 유효성 검사: ${ipCountry && /^[A-Z]{2}$/.test(ipCountry)}`);
  console.log(`[HomePage] 미국 아님: ${ipCountry !== "US"}`);

  if (ipCountry && /^[A-Z]{2}$/.test(ipCountry) && ipCountry !== "US") {
    // 미국이 아니면 해당 국가 페이지로 리다이렉트
    const validCountry = countries.find((c) => c.code === ipCountry);
    console.log(`[HomePage] 리다이렉트 실행: IP=${ipCountry}, 대상=/country/${validCountry?.code.toLowerCase()}`);
    if (validCountry) {
      redirect(`/country/${validCountry.code.toLowerCase()}`);
    }
  }

  console.log(`[HomePage] 리다이렉트 스킵 - 홈페이지 렌더링 중`);
  const countryCode = await getUserCountry();
  const country = getCountryByCode(countryCode)!;
  console.log(`[HomePage] getUserCountry 반환값: ${countryCode}`);
  console.log(`[HomePage] 렌더링 국가: ${country.name} (${country.code})`);

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
