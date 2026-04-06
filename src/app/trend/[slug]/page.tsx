import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { headers, cookies } from "next/headers";
import { countries, getCountryByCode } from "@/data/countries";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { fetchTrendsForCountry, TrendItem } from "@/lib/google-trends";
import Comments from "@/components/Comments";
import AutoTranslate from "@/components/AutoTranslate";
import YouTubeVideos from "@/components/YouTubeVideos";
import RelatedArticles from "@/components/RelatedArticles";
import { getRelatedTrendsForLinking } from "@/lib/internal-linking";
import { generateEnhancedMetaTags, generateOptimizedAltText } from "@/lib/dynamic-meta-optimization";
import { injectFAQToPage } from "@/lib/faq-schema-generator";

export const revalidate = 300; // 5분 캐시 (트렌드는 덜 자주 변경됨)

interface PageProps {
  params: Promise<{ slug: string }>;
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

async function findTrendBySlug(slug: string): Promise<TrendItem | null> {
  const decoded = decodeURIComponent(slug);
  const countryCode = decoded.split("-")[0]?.toUpperCase();
  if (!countryCode) return null;

  const country = getCountryByCode(countryCode);
  if (!country) return null;

  // Firebase에서 먼저 찾기
  let trends = await getTrendsFromFirebase(country.code);

  // Firebase에 없으면 RSS에서 찾기 (fallback)
  if (trends.length === 0) {
    trends = await fetchTrendsForCountry(country.code);
  }

  // 정확한 매칭
  const exact = trends.find((t) => t.slug === decoded || t.slug === slug);
  if (exact) return exact;

  // 날짜 제외 부분 매칭 (slug 날짜가 변경되어도 찾을 수 있도록)
  const slugWithoutDate = decoded.replace(/-\d{4}-\d{2}-\d{2}$/, "");
  return trends.find((t) => t.slug.replace(/-\d{4}-\d{2}-\d{2}$/, "") === slugWithoutDate) || null;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trend = await findTrendBySlug(slug);
  if (!trend) return {};

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

export default async function TrendPage({ params }: PageProps) {
  const { slug } = await params;
  const trend = await findTrendBySlug(slug);

  if (!trend) notFound();

  const country = getCountryByCode(trend.country);
  const userLang = await getUserLang();

  // Firebase에서 관련 트렌드 가져오기
  let relatedTrends = country
    ? (await getTrendsFromFirebase(country.code)).filter((t) => t.slug !== slug)
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
      {/* 자동 번역 */}
      <AutoTranslate userLang={userLang} pageLang={country?.lang || "en"} />

      {/* Hero Banner */}
      <div
        className="relative"
        style={{
          background: `linear-gradient(135deg, ${country?.color || "#3B82F6"}dd, ${country?.color || "#3B82F6"}88, #0f172a)`,
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
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
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white hover:bg-white/30 transition-colors"
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
            {trend.title}
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
                  What is <strong>{trend.title}</strong>?
                </h2>
                {trend.summary && (
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    {trend.summary}
                  </p>
                )}
                {trend.detail && (
                  <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                    <p>{trend.detail}</p>
                  </div>
                )}
              </article>
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
                      {q}
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
            <h2 className="text-xl font-bold text-gray-900 mb-6">자주 묻는 질문 (FAQ)</h2>
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
            dateModified: trend.date,
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
            endTime: new Date(trend.date).toISOString()
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
