import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { headers, cookies } from "next/headers";
import { countries, getCountryByCode } from "@/data/countries";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { fetchTrendsForCountry, TrendItem } from "@/lib/google-trends";
import { findLiveTrendBySlug, getTodayDate, getTrendsFromSources } from "@/lib/trend-source";
import Comments from "@/components/Comments";
import YouTubeVideos from "@/components/YouTubeVideos";
import RelatedArticles from "@/components/RelatedArticles";
import { getRelatedTrendsForLinking } from "@/lib/internal-linking";
import { generateEnhancedMetaTags, generateOptimizedAltText } from "@/lib/dynamic-meta-optimization";
import { injectFAQToPage } from "@/lib/faq-schema-generator";
import { decodeHtml } from "@/lib/utils";
import { NewsItem } from "@/lib/google-trends";

export const revalidate = 300; // 5분 캐시 (트렌드는 덜 자주 변경됨)

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getTrendsFromFirebase(countryCode: string, dateStr?: string): Promise<TrendItem[]> {
  return getTrendsFromSources(countryCode, 100, dateStr);
}

async function findTrendBySlug(slug: string): Promise<TrendItem | null> {
  try {
    const decoded = decodeURIComponent(slug);
    const countryCode = decoded.split("-")[0]?.toUpperCase();
    if (!countryCode) return null;

    const country = getCountryByCode(countryCode);
    if (!country) return null;

    // slug에서 날짜 추출 (예: "KR-keyword-2026-04-06" → "2026-04-06")
    const dateMatch = decoded.match(/-(\d{4}-\d{2}-\d{2})$/);
    if (!dateMatch) return null;

    const dateStr = dateMatch[1];

    // Document ID로 직접 조회 (가장 빠른 방법)
    const docRef = doc(db, "trends", country.code, dateStr, decoded);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as TrendItem;
    }

    // 폴백: 컬렉션 쿼리 (Document 없으면 조회)
    const trendsRef = collection(db, "trends", country.code, dateStr);
    const q = query(trendsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const trends = snapshot.docs.map((docSnap) => docSnap.data() as TrendItem);

    const exact = trends.find((t) => t.slug === decoded || t.slug === slug);
    if (exact) return exact;

    if (dateStr === getTodayDate()) {
      return findLiveTrendBySlug(country.code, decoded);
    }

    return null;
  } catch (error) {
    console.error("Error finding trend:", error);
    return null;
  }
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trend = await findTrendBySlug(slug);
  if (!trend) return { robots: { index: false, follow: false } };

  const country = getCountryByCode(trend.country);

  // 향상된 메타 태그 생성
  const enhanced = generateEnhancedMetaTags(
    trend,
    country?.name || trend.country,
    undefined // position을 모르므로 undefined로 설정
  );

  const ogImageAlt = generateOptimizedAltText(trend, country?.name || trend.country, "hero");

  return {
    title: enhanced.title,
    description: enhanced.description,
    keywords: enhanced.keywords,
    openGraph: {
      title: enhanced.ogTitle,
      description: enhanced.ogDescription,
      type: "article",
      publishedTime: trend.date,
      modifiedTime: trend.date,
      authors: ["IssueGlobe"],
      section: "Trending",
      tags: enhanced.articleKeywords,
      images: [
        {
          url: `https://issueglobe.com/api/og-image?title=${encodeURIComponent(trend.title)}&description=${encodeURIComponent(enhanced.ogDescription)}&country=${encodeURIComponent(country?.name || "Global")}`,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: "image/png",
        },
        ...(trend.imageUrl ? [
          {
            url: trend.imageUrl,
            width: 1200,
            height: 630,
            alt: ogImageAlt,
            type: "image/jpeg",
          }
        ] : []),
      ],
      url: `https://issueglobe.com/trend/${slug}`,
      locale: country?.locale || "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: enhanced.twitterTitle,
      description: enhanced.twitterDescription,
      images: [
        `https://issueglobe.com/api/og-image?title=${encodeURIComponent(trend.title)}&description=${encodeURIComponent(enhanced.twitterDescription)}&country=${encodeURIComponent(country?.name || "Global")}`,
        ...(trend.imageUrl ? [trend.imageUrl] : []),
      ],
      creator: "@issueglobe",
    },
    alternates: { canonical: `https://issueglobe.com/trend/${slug}` },
  };
}

async function getUserLang(): Promise<string> {
  // IP 기반 언어 감지 (쿠키 무시)
  const headersList = await headers();
  const detected = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || "KR";
  const c = countries.find((c) => c.code === detected);
  return c?.lang || "en";
}

export default async function TrendPage({ params }: PageProps) {
  const { slug } = await params;
  const trend = await findTrendBySlug(slug);

  if (!trend) {
    // 트렌드 데이터 없음 → 404 대신 만료 안내 페이지
    const slugCountryCode = (await params).slug.split("-")[0]?.toUpperCase();
    const slugCountry = slugCountryCode ? countries.find(c => c.code === slugCountryCode) : null;
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">📰</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            이 이슈는 더 이상 제공되지 않습니다
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            오래된 실시간 검색어는 일정 기간 후 만료됩니다.<br />
            현재 실시간 검색어를 확인해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {slugCountry && (
              <Link
                href={`/country/${slugCountry.code.toLowerCase()}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                {slugCountry.flag} {slugCountry.name} 실시간 검색어 보기
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              🌍 전체 트렌드 보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const country = getCountryByCode(trend.country);
  const userLang = await getUserLang();

  // Firebase에서 해당 트렌드의 날짜 데이터에서 관련 트렌드 가져오기
  let relatedTrends = country
    ? (await getTrendsFromFirebase(country.code, trend.date)).filter((t) => t.slug !== slug)
    : [];

  // Firebase에 없으면 RSS에서 가져오기
  if (relatedTrends.length === 0 && country) {
    relatedTrends = (await fetchTrendsForCountry(country.code)).filter((t) => t.slug !== slug);
  }

  // Phase 76: 동적 FAQ 생성
  const { faqs, schema: faqSchema } = injectFAQToPage({
    title: trend.title,
    summary: trend.summary,
    detail: trend.detail,
    relatedQueries: trend.relatedQueries,
    country: country?.name || trend.country,
  });

  return (
    <>

      {/* Hero Banner */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(135deg, ${country?.color || "#3B82F6"}, ${country?.color || "#3B82F6"}cc, #0f172a)`,
          minHeight: "200px",
        }}
      >
        {trend.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={trend.imageUrl}
              alt={generateOptimizedAltText(trend, country?.name || trend.country, "hero")}
              title={`${trend.title} - ${trend.traffic} searches`}
              fill
              className="w-full h-full object-cover opacity-20"
              loading="lazy"
              quality={50}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link
              href={`/country/${trend.country.toLowerCase()}`}
              className="hover:text-white transition-colors"
            >
              {country?.flag} {country?.name}
            </Link>
            <span>/</span>
            <span className="text-white/80 truncate max-w-[200px]">{trend.title}</span>
          </nav>

          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href={`/country/${trend.country.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/50 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white hover:bg-white/70 transition-colors"
            >
              {country?.flag} {country?.name}
            </Link>
            <span className="inline-flex items-center rounded-full bg-red-500/90 px-3 py-1 text-sm font-bold text-white">
              {trend.traffic} searches
            </span>
            <span className="text-sm text-white/60">{trend.date}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-white/60">LIVE</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {decodeHtml(trend.title)}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content - 2/3 */}
          <div className="lg:col-span-2 space-y-8">

            {/* Summary & Details */}
            {(trend.summary || trend.detail) && (
              <article className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  <strong>{decodeHtml(trend.title)}</strong> — 지금 무슨 일이?
                </h2>
                {trend.summary && (
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    {decodeHtml(trend.summary)}
                  </p>
                )}
                {trend.detail && (
                  <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                    <p>{decodeHtml(trend.detail)}</p>
                  </div>
                )}
              </article>
            )}

            {/* 뉴스 아이템 카드 (RSS 스니펫) */}
            {trend.newsItems && trend.newsItems.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-gray-900">관련 뉴스</h2>
                {(trend.newsItems as NewsItem[]).map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 rounded-2xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-16 object-cover rounded-lg shrink-0 bg-gray-100"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                        {decodeHtml(item.title)}
                      </p>
                      {item.snippet && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                          {decodeHtml(item.snippet)}
                        </p>
                      )}
                      <span className="text-xs text-gray-400 font-medium">{item.source}</span>
                    </div>
                  </a>
                ))}
              </section>
            )}

            {/* YouTube Videos */}
            <section className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <YouTubeVideos query={trend.title} />
            </section>

            {/* Related Articles (including original) */}
            <RelatedArticles articles={
              trend.sourceUrl && trend.source
                ? [
                    { url: trend.sourceUrl, title: trend.title, source: trend.source, image: trend.imageUrl },
                    ...(trend.relatedArticles || [])
                  ]
                : (trend.relatedArticles || [])
            } />
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-6">

            {/* Trend Stats */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Trend Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Searches</span>
                  <span className="font-bold text-gray-900">{trend.traffic}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Country</span>
                  <span className="font-medium text-gray-900">{country?.flag} {country?.name}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Region</span>
                  <span className="font-medium text-gray-900">{country?.region}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{trend.date}</span>
                </div>
              </div>
            </div>

            {/* Related Queries */}
            {trend.relatedQueries.length > 0 && (
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">Related Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {trend.relatedQueries.map((q) => (
                    <span
                      key={q}
                      className="inline-block rounded-full bg-gray-100 border border-gray-200 px-3 py-1.5 text-sm text-gray-700 font-medium"
                    >
                      {decodeHtml(q)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* More from this country */}
            {relatedTrends.length > 0 && (
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">
                  Also Trending in {country?.name}
                </h3>
                <div className="space-y-3">
                  {relatedTrends.slice(0, 8).map((t, i) => (
                    <Link
                      key={t.slug}
                      href={`/trend/${t.slug}`}
                      className="flex items-center gap-3 group"
                      prefetch={true}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: country?.color || "#3B82F6" }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {t.title}
                        </p>
                        <p className="text-xs text-gray-400">{t.traffic}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/country/${trend.country.toLowerCase()}`}
                  className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 mt-4 pt-3 border-t border-gray-100"
                  title={`See all trending topics in ${country?.name}`}
                >
                  View all trending searches in {country?.name} →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reference Links & Learn More */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Learn More</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Find out more about this trending topic:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.title)}&geo=${trend.country}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                📊 Google Trends
              </a>
              {trend.sourceUrl && (
                <a
                  href={trend.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  🔗 Original Source
                </a>
              )}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(trend.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                🔍 Google Search
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Global Awareness - Show if trending in other countries */}
      {trend.title && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🌍 Global Context</h2>
            <p className="text-sm text-gray-700 mb-4">
              <strong>"{trend.title}"</strong> is a trending topic in {country?.name}. This type of information helps us understand global search patterns and regional interests.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {countries
                .filter((c) => c.code !== trend.country)
                .slice(0, 6)
                .map((c) => (
                  <Link
                    key={c.code}
                    href={`/country/${c.code.toLowerCase()}`}
                    className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                    title={`View trending topics in ${c.name}`}
                  >
                    <span>{c.flag}</span>
                    <span className="font-medium text-gray-700">{c.name}</span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Semantically Related Trends - Internal Linking */}
      {relatedTrends.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🔗 Related Trending Topics</h2>
            <p className="text-sm text-gray-600 mb-4">
              Discover other trending topics that are semantically related to {trend.title}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getRelatedTrendsForLinking(trend, relatedTrends, 4).map((relatedTrend) => (
                <Link
                  key={relatedTrend.slug}
                  href={`/trend/${relatedTrend.slug}`}
                  className="group rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-4 hover:border-blue-300 hover:from-blue-50 hover:to-blue-100 transition-all"
                  title={relatedTrend.title}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedTrend.title}
                    </h3>
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap ml-2 flex-shrink-0">
                      {Math.round(relatedTrend.relevance * 100)}% match
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{relatedTrend.traffic} searches</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section - Phase 76 */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group border border-gray-200 rounded-lg transition-all hover:border-blue-300"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-blue-50 transition-colors">
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comments */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>
          <Comments term={trend.title} />
        </div>
      </section>

      {/* JSON-LD - Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: trend.title,
            description: trend.description || trend.summary,
            datePublished: trend.date,
            dateModified: new Date().toISOString(), // 항상 현재 시간 → SERP에서 "방금"/"1시간 전" 표시
            image: trend.imageUrl ? [trend.imageUrl] : undefined,
            author: [
              {
                "@type": "Organization",
                name: "IssueGlobe",
                url: "https://issueglobe.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://issueglobe.com/logo.png",
                  width: 250,
                  height: 60
                }
              }
            ],
            publisher: {
              "@type": "Organization",
              name: "IssueGlobe",
              url: "https://issueglobe.com",
              logo: {
                "@type": "ImageObject",
                url: "https://issueglobe.com/logo.png",
                width: 250,
                height: 60
              },
              contact: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                url: "https://issueglobe.com"
              }
            },
            keywords: [trend.title, ...trend.relatedQueries],
            articleBody: trend.detail || trend.summary,
            inLanguage: country?.lang || "en",
            isAccessibleForFree: true,
            articleSection: "Trending",
            sourceOrganization: {
              "@type": "Organization",
              name: "IssueGlobe",
              url: "https://issueglobe.com"
            }
          }),
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://issueglobe.com"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: country?.name || "Trends",
                item: `https://issueglobe.com/country/${trend.country.toLowerCase()}`
              },
              {
                "@type": "ListItem",
                position: 3,
                name: trend.title,
                item: `https://issueglobe.com/trend/${slug}`
              }
            ]
          }),
        }}
      />

      {/* TrendingTopic Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Thing",
            name: trend.title,
            description: trend.summary || trend.description,
            url: `https://issueglobe.com/trend/${slug}`,
            inLanguage: country?.lang || "en",
            isPartOf: {
              "@type": "WebSite",
              name: "IssueGlobe",
              url: "https://issueglobe.com"
            },
            aggregateRating: trend.traffic ? {
              "@type": "AggregateRating",
              ratingValue: Math.min(5, Math.ceil(parseInt(trend.traffic.replace(/[^\d]/g, '')) / 1000)),
              ratingCount: 1,
              bestRating: 5,
              worstRating: 1
            } : undefined
          }),
        }}
      />

      {/* UpdateAction Schema - Mark content as fresh */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "UpdateAction",
            agent: {
              "@type": "Organization",
              name: "IssueGlobe",
              url: "https://issueglobe.com"
            },
            object: {
              "@type": "NewsArticle",
              url: `https://issueglobe.com/trend/${slug}`,
              headline: trend.title
            },
            startTime: new Date(trend.date).toISOString(),
            endTime: new Date().toISOString()
          }),
        }}
      />

      {/* FAQ Schema - Phase 76: Dynamically generated from relatedQueries */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: faqSchema,
        }}
      />
    </>
  );
}
