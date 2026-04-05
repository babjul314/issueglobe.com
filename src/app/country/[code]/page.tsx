import { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import { countries, getCountryByCode } from "@/data/countries";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { TrendItem } from "@/lib/google-trends";
import TrendCard from "@/components/TrendCard";
import AutoTranslate from "@/components/AutoTranslate";
import Link from "next/link";
import { clusterTrendsBySemantic, buildSemanticRelations, generateEntitySchema } from "@/lib/semantic-clustering";

export const revalidate = 60; // ISR: 60초마다 재검증

interface PageProps {
  params: Promise<{ code: string }>;
}

// 나라별 현지어 SEO 메타 생성
function getLocalizedMeta(country: NonNullable<ReturnType<typeof getCountryByCode>>) {
  const ui = country.ui;
  const seoMap: Record<string, { title: string; description: string; keywords: string[] }> = {
    US: { title: "Trending Topics in the United States Today", description: "Discover the hottest trending searches in America right now. See real-time Google Trends data updated hourly. Find what Americans are searching for, trending topics, and viral keywords in the USA.", keywords: ["trending US", "what is trending in America", "US trends today", "Google Trends USA"] },
    KR: { title: "오늘의 실시간 검색어 순위 | 대한민국 트렌드", description: "대한민국에서 지금 가장 많이 검색하는 키워드를 실시간으로 확인하세요. 구글 트렌드 기반 매시간 업데이트.", keywords: ["실시간 검색어", "인기 검색어 순위", "오늘의 트렌드", "구글 트렌드 한국", "실시간 트렌드"] },
    JP: { title: "今日のトレンド検索ランキング | 日本", description: "日本で今最も検索されているキーワードをリアルタイムで確認。Googleトレンドデータを毎時更新。", keywords: ["トレンド検索", "リアルタイム検索ランキング", "日本のトレンド", "Googleトレンド日本", "今日の検索ワード"] },
    GB: { title: "Trending Searches in the UK Today", description: "See what's trending in the United Kingdom right now. Real-time Google Trends data updated hourly.", keywords: ["UK trends", "trending UK", "what is trending in Britain", "Google Trends UK"] },
    DE: { title: "Aktuelle Trends und Suchanfragen in Deutschland", description: "Entdecken Sie die beliebtesten Suchanfragen in Deutschland in Echtzeit. Stündlich aktualisiert mit Google Trends.", keywords: ["Trends Deutschland", "Suchtrends", "Google Trends Deutschland", "aktuelle Suchanfragen"] },
    FR: { title: "Tendances de recherche en France aujourd'hui", description: "Découvrez les sujets les plus recherchés en France en temps réel. Données Google Trends mises à jour toutes les heures.", keywords: ["tendances France", "recherches populaires", "Google Trends France", "sujets tendance"] },
    IT: { title: "Tendenze di ricerca in Italia oggi", description: "Scopri cosa cercano gli italiani in tempo reale. Dati Google Trends aggiornati ogni ora.", keywords: ["tendenze Italia", "ricerche popolari", "Google Trends Italia", "trend di oggi"] },
    ES: { title: "Tendencias de búsqueda en España hoy", description: "Descubre qué buscan los españoles en tiempo real. Datos de Google Trends actualizados cada hora.", keywords: ["tendencias España", "búsquedas populares", "Google Trends España", "trending España"] },
    BR: { title: "Assuntos do momento no Brasil hoje", description: "Descubra o que os brasileiros estão pesquisando agora. Dados do Google Trends atualizados a cada hora.", keywords: ["trending Brasil", "assuntos do momento", "Google Trends Brasil", "pesquisas populares"] },
    IN: { title: "Trending Searches in India Today | भारत में ट्रेंडिंग", description: "Discover the most searched topics in India right now. Real-time Google Trends data updated hourly.", keywords: ["trending India", "India trends today", "Google Trends India", "ट्रेंडिंग इंडिया"] },
    AU: { title: "Trending Searches in Australia Today", description: "See what Australians are searching for right now. Real-time Google Trends data updated hourly.", keywords: ["trending Australia", "Australia trends", "Google Trends Australia"] },
    CA: { title: "Trending Searches in Canada Today", description: "See what Canadians are searching for right now. Real-time Google Trends data updated hourly.", keywords: ["trending Canada", "Canada trends", "Google Trends Canada"] },
    NL: { title: "Trending zoekopdrachten in Nederland vandaag", description: "Ontdek waar Nederlanders nu naar zoeken. Realtime Google Trends data, elk uur bijgewerkt.", keywords: ["trending Nederland", "populaire zoekopdrachten", "Google Trends Nederland"] },
    CH: { title: "Aktuelle Suchtrends in der Schweiz", description: "Sehen Sie, wonach die Schweiz gerade sucht. Echtzeit Google Trends, stündlich aktualisiert.", keywords: ["Trends Schweiz", "Suchtrends Schweiz", "Google Trends Schweiz"] },
    SE: { title: "Trendande sökningar i Sverige idag", description: "Se vad Sverige söker efter just nu. Google Trends-data uppdateras varje timme.", keywords: ["trender Sverige", "populära sökningar", "Google Trends Sverige"] },
    MX: { title: "Tendencias de búsqueda en México hoy", description: "Descubre qué buscan los mexicanos en tiempo real. Google Trends actualizado cada hora.", keywords: ["tendencias México", "búsquedas México", "Google Trends México"] },
    NO: { title: "Trendende søk i Norge i dag", description: "Se hva Norge søker etter akkurat nå. Google Trends-data oppdateres hver time.", keywords: ["trender Norge", "populære søk", "Google Trends Norge"] },
    DK: { title: "Trending søgninger i Danmark i dag", description: "Se hvad Danmark søger efter lige nu. Google Trends opdateres hver time.", keywords: ["trends Danmark", "populære søgninger", "Google Trends Danmark"] },
    BE: { title: "Trending zoekopdrachten in België vandaag", description: "Ontdek waar België nu naar zoekt. Realtime Google Trends, elk uur bijgewerkt.", keywords: ["trending België", "populaire zoekopdrachten België", "Google Trends België"] },
    AT: { title: "Aktuelle Suchtrends in Österreich", description: "Sehen Sie, wonach Österreich gerade sucht. Echtzeit Google Trends, stündlich aktualisiert.", keywords: ["Trends Österreich", "Suchtrends Österreich", "Google Trends Österreich"] },
    IE: { title: "Trending Searches in Ireland Today", description: "See what Ireland is searching for right now. Real-time Google Trends data updated hourly.", keywords: ["trending Ireland", "Ireland trends", "Google Trends Ireland"] },
    SG: { title: "Trending Searches in Singapore Today", description: "See what Singaporeans are searching for right now. Real-time Google Trends data updated hourly.", keywords: ["trending Singapore", "Singapore trends", "Google Trends Singapore"] },
    IL: { title: "חיפושים פופולריים בישראל היום", description: "גלו מה ישראל מחפשת עכשיו. נתוני Google Trends מתעדכנים כל שעה.", keywords: ["טרנדים ישראל", "חיפושים פופולריים", "Google Trends Israel"] },
    AE: { title: "عمليات البحث الرائجة في الإمارات اليوم", description: "اكتشف ما يبحث عنه سكان الإمارات الآن. بيانات Google Trends محدثة كل ساعة.", keywords: ["ترندات الإمارات", "بحث رائج", "Google Trends UAE"] },
    NZ: { title: "Trending Searches in New Zealand Today", description: "See what New Zealanders are searching for right now. Real-time Google Trends data updated hourly.", keywords: ["trending NZ", "New Zealand trends", "Google Trends NZ"] },
    FI: { title: "Suositut haut Suomessa tänään", description: "Katso mitä Suomessa haetaan juuri nyt. Google Trends -data päivittyy joka tunti.", keywords: ["trendit Suomi", "suositut haut", "Google Trends Suomi"] },
    PL: { title: "Popularne wyszukiwania w Polsce dzisiaj", description: "Sprawdź, czego Polacy szukają w tej chwili. Dane Google Trends aktualizowane co godzinę.", keywords: ["trendy Polska", "popularne wyszukiwania", "Google Trends Polska"] },
    TW: { title: "台灣今日熱門搜尋排行", description: "即時查看台灣最熱門的搜尋關鍵字。Google Trends資料每小時更新。", keywords: ["台灣熱搜", "熱門關鍵字", "Google Trends台灣", "即時搜尋排行"] },
    SA: { title: "عمليات البحث الرائجة في السعودية اليوم", description: "اكتشف ما يبحث عنه السعوديون الآن. بيانات Google Trends محدثة كل ساعة.", keywords: ["ترندات السعودية", "بحث رائج السعودية", "Google Trends Saudi"] },
    HK: { title: "香港今日熱門搜尋排行", description: "即時查看香港最熱門的搜尋關鍵字。Google Trends資料每小時更新。", keywords: ["香港熱搜", "熱門關鍵字", "Google Trends香港"] },
  };

  return seoMap[country.code] || {
    title: `${ui.trendingIn} - ${country.name}`,
    description: `Real-time trending topics in ${country.name}. Updated hourly.`,
    keywords: [`trending ${country.name}`, `Google Trends ${country.name}`],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const country = getCountryByCode(code);
  if (!country) return {};

  const seo = getLocalizedMeta(country);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: country.locale,
      siteName: "IssueGlobe",
      url: `https://issueglobe.com/country/${code.toLowerCase()}`,
      images: [
        {
          url: `https://issueglobe.com/api/og-image?title=${encodeURIComponent(`Trending in ${country.name}`)}&description=${encodeURIComponent(seo.description)}&country=${encodeURIComponent(country.name)}`,
          width: 1200,
          height: 630,
          alt: `IssueGlobe - Trending in ${country.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`https://issueglobe.com/api/og-image?title=${encodeURIComponent(`Trending in ${country.name}`)}&description=${encodeURIComponent(seo.description)}&country=${encodeURIComponent(country.name)}`],
    },
    alternates: {
      canonical: `https://issueglobe.com/country/${code.toLowerCase()}`,
      languages: Object.fromEntries(
        countries.map((c) => [c.locale, `https://issueglobe.com/country/${c.code.toLowerCase()}`])
      ),
    },
  };
}

async function getTrendsFromFirebase(countryCode: string): Promise<TrendItem[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const trendsRef = collection(db, "trends", countryCode, today);
    const q = query(trendsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as TrendItem);
  } catch (error) {
    console.error("Firebase error:", error);
    return [];
  }
}

async function getUserLang(): Promise<string> {
  const cookieStore = await cookies();
  const override = cookieStore.get("preferred-country")?.value;
  if (override) {
    const c = countries.find((c) => c.code === override);
    if (c) return c.lang;
  }

  const headersList = await headers();
  const detected = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || "US";
  const c = countries.find((c) => c.code === detected);
  return c?.lang || "en";
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params;
  const country = getCountryByCode(code);

  if (!country) notFound();

  const trends = await getTrendsFromFirebase(country.code);
  const ui = country.ui;
  const userLang = await getUserLang();

  return (
    <>
      {/* 자동 번역: 유저 언어 ≠ 페이지 언어일 때 */}
      <AutoTranslate userLang={userLang} pageLang={country.lang} />

      {/* Country Hero - Compact */}
      <section
        className="relative text-white"
        style={{
          background: `linear-gradient(135deg, ${country.color}dd, ${country.color}88, #1e1b4b)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
            <Link href="/" className="hover:text-white transition-colors">
              {ui.home}
            </Link>
            <span>/</span>
            <span className="text-white/80">{country.nameLocal}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl md:text-5xl">{country.flag}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-black">
                  {ui.trendingIn}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-white/70">{country.nameLocal}</span>
                  <span className="text-white/30">|</span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {trends.length} topics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trends List - 바로 랭킹 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Semantic Insights - Topic Clustering */}
      {trends.length > 3 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Trending Themes</h2>
            <p className="text-sm text-gray-600 mb-4">
              Topics grouped by semantic relevance to help you discover related trends.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clusterTrendsBySemantic(trends)
                .slice(0, 4)
                .map((cluster) => (
                  <div
                    key={cluster.id}
                    className="rounded-lg bg-white border border-blue-100 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {cluster.theme}
                      </h3>
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {cluster.trends.length} topic{cluster.trends.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {cluster.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cluster.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Countries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {ui.exploreOther}
        </h2>
        <div className="flex flex-wrap gap-3">
          {countries
            .filter((c) => c.region === country.region && c.code !== country.code)
            .map((c) => (
              <Link
                key={c.code}
                href={`/country/${c.code.toLowerCase()}`}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                title={`Trending topics in ${c.name}`}
                prefetch={true}
              >
                {c.flag} {c.name} Trends
              </Link>
            ))}
        </div>
      </section>

      {/* JSON-LD: 나라별 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${country.name} Trending Topics`,
            description: `Real-time trending topics in ${country.name} (${country.nameLocal}) updated hourly.`,
            url: `https://issueglobe.com/country/${code.toLowerCase()}`,
            inLanguage: country.lang,
            isAccessibleForFree: true,
            isPartOf: {
              "@type": "WebSite",
              name: "IssueGlobe",
              url: "https://issueglobe.com",
            },
            about: {
              "@type": "Country",
              name: country.name,
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: trends.length,
              itemListElement: trends.slice(0, 10).map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: t.title,
                url: `https://issueglobe.com/trend/${t.slug}`,
                image: t.imageUrl || undefined,
                datePublished: t.date,
                keywords: [t.title],
              })),
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://issueglobe.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: country.name,
                  item: `https://issueglobe.com/country/${code.toLowerCase()}`,
                },
              ],
            },
          }),
        }}
      />

      {/* Semantic Relationships Schema - Knowledge Graph Optimization */}
      {trends.length > 1 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Thing",
              "@id": `https://issueglobe.com/country/${code.toLowerCase()}`,
              name: `Trending in ${country.name}`,
              description: `Real-time trending topics in ${country.name}`,
              hasPart: trends.slice(0, 15).map((t) => ({
                "@type": "Thing",
                "@id": `https://issueglobe.com/trend/${t.slug}`,
                name: t.title,
                url: `https://issueglobe.com/trend/${t.slug}`,
              })),
            }),
          }}
        />
      )}

      {/* Entity-based Schema for top trends */}
      {trends.slice(0, 5).map((trend) => (
        <script
          key={`entity-${trend.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateEntitySchema(trend, country.code, trends.slice(0, 5).filter((t) => t.slug !== trend.slug), country.lang)
            ),
          }}
        />
      ))}
    </>
  );
}
