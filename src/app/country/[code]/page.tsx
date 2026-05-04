import { Metadata } from "next";
import { notFound } from "next/navigation";
import { countries, getCountryByCode } from "@/data/countries";
import { TrendItem } from "@/lib/google-trends";
import { getTrendsFromSources } from "@/lib/trend-source";
import TrendCard from "@/components/TrendCard";
import Link from "next/link";

export const revalidate = 60; // ISR: 60초마다 재검증

interface PageProps {
  params: Promise<{ code: string }>;
}

// 나라별 현지어 SEO 메타 생성
function getLocalizedMeta(country: NonNullable<ReturnType<typeof getCountryByCode>>) {
  const ui = country.ui;
  const seoMap: Record<string, { title: string; description: string; keywords: string[] }> = {
    US: { title: "Trending Topics in the United States Today", description: "Discover the hottest trending searches in America right now. See real-time Google Trends data updated hourly. Find what Americans are searching for, trending topics, and viral keywords in the USA.", keywords: ["trending US", "what is trending in America", "US trends today", "Google Trends USA"] },
    KR: { title: "실시간 이슈 순위 | 대한민국 트렌드 검색어 - IssueGlobe", description: "지금 한국에서 가장 많이 검색되는 실시간 이슈를 확인하세요. 오늘의 이슈 순위, 지금 뜨는 이슈, 실시간 검색어 1위를 매시간 업데이트합니다. 구글 트렌드 기반 한국 실시간 이슈.", keywords: ["실시간 이슈", "오늘의 이슈", "이슈 순위", "지금 이슈", "실시간 이슈 순위", "한국 실시간 이슈", "실시간 검색어", "인기 검색어 순위", "오늘 이슈", "구글 트렌드 한국"] },
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

  // 실시간 트렌드 데이터 가져오기
  const trends = await getTrendsFromFirebase(country.code);
  const topTrends = trends.slice(0, 3);
  const topKeyword = topTrends[0]?.title || "";
  const topTraffic = topTrends[0]?.traffic || "";

  // 동적 제목 생성 — 60자 이하 유지로 SERP 잘림 방지
  let dynamicTitle = "";
  if (topKeyword) {
    // 키워드가 길면 잘라서 제목 전체가 60자 넘지 않도록
    const shortKey = topKeyword.length > 20 ? topKeyword.substring(0, 18) + "…" : topKeyword;
    const titleTemplates: Record<string, string> = {
      KR: `'${shortKey}' 실검 1위 | 한국 실시간 이슈`,
      JP: `日本1位: ${shortKey} | リアルタイムトレンド`,
      US: `#1 in USA: ${shortKey} | Trending Now`,
      GB: `#1 in UK: ${shortKey} | Trending Now`,
      DE: `#1 in DE: ${shortKey} | Aktuelle Trends`,
      FR: `N°1 en France: ${shortKey} | Tendances`,
      IT: `#1 in Italia: ${shortKey} | Tendenze`,
      ES: `#1 en España: ${shortKey} | Tendencias`,
      BR: `#1 no Brasil: ${shortKey} | Trending`,
      IN: `#1 in India: ${shortKey} | Trending Now`,
      AU: `#1 in AU: ${shortKey} | Trending Now`,
      CA: `#1 in CA: ${shortKey} | Trending Now`,
      NL: `#1 in NL: ${shortKey} | Trending`,
      CH: `#1 in CH: ${shortKey} | Trending`,
      SE: `#1 in SE: ${shortKey} | Trending`,
      MX: `#1 en MX: ${shortKey} | Tendencias`,
      NO: `#1 in NO: ${shortKey} | Trending`,
      DK: `#1 in DK: ${shortKey} | Trending`,
      BE: `#1 in BE: ${shortKey} | Trending`,
      AT: `#1 in AT: ${shortKey} | Trending`,
      IE: `#1 in IE: ${shortKey} | Trending Now`,
      SG: `#1 in SG: ${shortKey} | Trending Now`,
      IL: `#1 בישראל: ${shortKey}`,
      AE: `#1 الإمارات: ${shortKey}`,
      NZ: `#1 in NZ: ${shortKey} | Trending Now`,
      FI: `#1 in FI: ${shortKey} | Trending`,
      PL: `#1 w PL: ${shortKey} | Trending`,
      TW: `台灣1位: ${shortKey} | 即時熱搜`,
      SA: `#1 السعودية: ${shortKey}`,
      HK: `香港1位: ${shortKey} | 即時熱搜`,
    };
    dynamicTitle = titleTemplates[country.code] || `#1 in ${country.name}: ${shortKey} | Trending`;
  }

  // 폴백: 동적 제목이 없으면 기존 정적 제목 사용
  const seo = getLocalizedMeta(country);
  const finalTitle = dynamicTitle || seo.title;

  // 동적 설명 생성 - 검색량 수치 포함으로 클릭 유인 강화
  const t0 = topTrends[0]?.title ?? "";
  const t1 = topTrends[1]?.title ?? "";
  const has2 = topTrends.length >= 2;
  const trafficStr = topTraffic ? ` ${topTraffic} 검색 중.` : "";
  const dynamicDescMap: Record<string, string> = {
    // 아시아
    KR: has2
      ? `지금 실검 1위 '${t0}'.${trafficStr} 2위 '${t1}' 급상승 중 → 전체 TOP10 실시간 확인`
      : seo.description,
    JP: has2 ? `今のトレンド1位「${t0}」2位「${t1}」など TOP10公開中。毎時自動更新` : seo.description,
    TW: has2 ? `現在熱搜第1名「${t0}」第2名「${t1}」等 TOP10即時公開。每小時自動更新` : seo.description,
    HK: has2 ? `現在熱搜第1名「${t0}」第2名「${t1}」等 TOP10即時公開。每小時自動更新` : seo.description,
    IN: has2 ? `Right now: #1 '${t0}', #2 '${t1}' trending in India. Live TOP 10, updated every hour.` : seo.description,
    SG: has2 ? `Right now: #1 '${t0}', #2 '${t1}' trending in Singapore. Live TOP 10, updated hourly.` : seo.description,
    // 영어권
    US: has2 ? `Trending now: #1 '${t0}', #2 '${t1}' in USA. Live TOP 10 updated every hour.` : seo.description,
    GB: has2 ? `Trending now: #1 '${t0}', #2 '${t1}' in UK. Live TOP 10, updated hourly.` : seo.description,
    AU: has2 ? `Trending now: #1 '${t0}', #2 '${t1}' in Australia. Live TOP 10, updated hourly.` : seo.description,
    CA: has2 ? `Trending now: #1 '${t0}', #2 '${t1}' in Canada. Live TOP 10, updated hourly.` : seo.description,
    IE: has2 ? `Trending now: #1 '${t0}', #2 '${t1}' in Ireland. Live TOP 10, updated hourly.` : seo.description,
    NZ: has2 ? `Trending now: #1 '${t0}', #2 '${t1}' in New Zealand. Live TOP 10, updated hourly.` : seo.description,
    // 독일어권
    DE: has2 ? `Jetzt: Platz 1 '${t0}', Platz 2 '${t1}' in Deutschland. Live TOP 10, stündlich aktualisiert.` : seo.description,
    CH: has2 ? `Jetzt: Platz 1 '${t0}', Platz 2 '${t1}' in der Schweiz. Live TOP 10, stündlich aktualisiert.` : seo.description,
    AT: has2 ? `Jetzt: Platz 1 '${t0}', Platz 2 '${t1}' in Österreich. Live TOP 10, stündlich aktualisiert.` : seo.description,
    // 프랑스어권
    FR: has2 ? `En ce moment: N°1 '${t0}', N°2 '${t1}' en France. TOP 10 en direct, mis à jour chaque heure.` : seo.description,
    BE: has2 ? `En ce moment: N°1 '${t0}', N°2 '${t1}' en Belgique. TOP 10 en direct, mis à jour chaque heure.` : seo.description,
    // 포르투갈어
    BR: has2 ? `Agora: 1° '${t0}', 2° '${t1}' no Brasil. TOP 10 ao vivo, atualizado a cada hora.` : seo.description,
    // 스페인어
    ES: has2 ? `Ahora: N°1 '${t0}', N°2 '${t1}' en España. TOP 10 en directo, actualizado cada hora.` : seo.description,
    MX: has2 ? `Ahora: N°1 '${t0}', N°2 '${t1}' en México. TOP 10 en vivo, actualizado cada hora.` : seo.description,
    // 이탈리아어
    IT: has2 ? `Adesso: 1° '${t0}', 2° '${t1}' in Italia. TOP 10 in diretta, aggiornato ogni ora.` : seo.description,
    // 네덜란드어
    NL: has2 ? `Nu: #1 '${t0}', #2 '${t1}' in Nederland. Live TOP 10, elk uur bijgewerkt.` : seo.description,
    // 스칸디나비아
    SE: has2 ? `Nu: #1 '${t0}', #2 '${t1}' i Sverige. Live TOP 10, uppdateras varje timme.` : seo.description,
    NO: has2 ? `Nå: #1 '${t0}', #2 '${t1}' i Norge. Live TOP 10, oppdateres hver time.` : seo.description,
    DK: has2 ? `Nu: #1 '${t0}', #2 '${t1}' i Danmark. Live TOP 10, opdateres hver time.` : seo.description,
    FI: has2 ? `Nyt: #1 '${t0}', #2 '${t1}' Suomessa. Live TOP 10, päivitetään joka tunti.` : seo.description,
    // 폴란드어
    PL: has2 ? `Teraz: #1 '${t0}', #2 '${t1}' w Polsce. TOP 10 na żywo, aktualizowane co godzinę.` : seo.description,
    // 중동
    SA: has2 ? `الآن: الأول '${t0}'، الثاني '${t1}' في السعودية. أفضل 10 مباشر، يُحدَّث كل ساعة` : seo.description,
    AE: has2 ? `الآن: الأول '${t0}'، الثاني '${t1}' في الإمارات. أفضل 10 مباشر، يُحدَّث كل ساعة` : seo.description,
    IL: has2 ? `עכשיו: #1 '${t0}', #2 '${t1}' בישראל. TOP 10 חי, מתעדכן כל שעה` : seo.description,
  };
  const finalDescription = dynamicDescMap[country.code] ?? (
    has2
      ? `Trending now: #1 '${t0}', #2 '${t1}' in ${country.name}. Live TOP 10, updated hourly.`
      : seo.description
  );

  const ogImageUrl = "https://issueglobe.com/opengraph-image";

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: topKeyword
      ? [topKeyword, ...seo.keywords].slice(0, 10)
      : seo.keywords,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      type: "website",
      locale: country.locale,
      siteName: "IssueGlobe",
      url: `https://issueglobe.com/country/${code.toLowerCase()}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `IssueGlobe - ${country.name} 실시간 트렌드`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImageUrl],
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
  return getTrendsFromSources(countryCode, 10);
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params;
  const country = getCountryByCode(code);

  if (!country) notFound();

  const trends = await getTrendsFromFirebase(country.code);
  const ui = country.ui;
  const countryPageUrl = `https://issueglobe.com/country/${country.code.toLowerCase()}`;

  return (
    <>

      {/* Country Hero - Compact */}
      <section
        className="relative text-white"
        style={{
          background: `linear-gradient(135deg, ${country.color}, ${country.color}cc, #0f172a)`,
          minHeight: "140px",
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

      {/* ItemList JSON-LD: SERP에 트렌드 목록 리치 결과 표시 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: country.code === "KR"
              ? `${country.flag} 한국 실시간 이슈 TOP ${Math.min(trends.length, 10)}`
              : `${country.flag} Trending in ${country.name} – TOP ${Math.min(trends.length, 10)}`,
            description: country.code === "KR"
              ? "지금 한국에서 가장 많이 검색되는 실시간 이슈 순위입니다. 매시간 자동 업데이트."
              : `Real-time trending topics in ${country.name}. Updated every hour.`,
            url: countryPageUrl,
            numberOfItems: Math.min(trends.length, 10),
            dateModified: new Date().toISOString(),
            itemListElement: trends.slice(0, 10).map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.title,
              item: {
                "@type": "Thing",
                "@id": `${countryPageUrl}#trend-${i + 1}`,
                name: t.title,
              },
            })),
          }),
        }}
      />

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
            url: countryPageUrl,
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
                item: {
                  "@type": "Thing",
                  "@id": `${countryPageUrl}#trend-${i + 1}`,
                  name: t.title,
                  keywords: [t.title],
                },
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
                  item: countryPageUrl,
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
