import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers, cookies } from "next/headers";
import { countries, getCountryByCode } from "@/data/countries";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { fetchTrendsForCountry, TrendItem } from "@/lib/google-trends";
import Comments from "@/components/Comments";
import AutoTranslate from "@/components/AutoTranslate";
import YouTubeVideos from "@/components/YouTubeVideos";

export const revalidate = 300; // 5분 캐시

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
  const title = `${trend.title} - Trending in ${country?.name || trend.country}`;
  const description =
    trend.summary ||
    trend.description ||
    `"${trend.title}" is trending in ${country?.name} with ${trend.traffic} searches.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: trend.date,
      images: trend.imageUrl ? [{ url: trend.imageUrl }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
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
  const detected = headersList.get("x-vercel-ip-country") || "US";
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
            <img
              src={trend.imageUrl}
              alt={trend.title}
              className="w-full h-full object-cover opacity-20"
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

            {/* YouTube Videos */}
            <section className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <YouTubeVideos query={trend.title} />
            </section>

            {/* Source Link */}
            {trend.sourceUrl && (
              <a
                href={trend.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl bg-white border border-gray-200 p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Read Original Article</p>
                    <p className="text-sm text-gray-500">{trend.source}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
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
                {trend.source && (
                  <>
                    <div className="h-px bg-gray-100" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Source</span>
                      <span className="font-medium text-gray-900">{trend.source}</span>
                    </div>
                  </>
                )}
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
                >
                  View all {country?.name} trends →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Comments</h2>
          <Comments term={trend.title} />
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: trend.title,
            description: trend.summary || trend.description,
            datePublished: trend.date,
            image: trend.imageUrl || undefined,
            author: { "@type": "Organization", name: "IssueGlobe" },
            publisher: { "@type": "Organization", name: "IssueGlobe", url: "https://issueglobe.com" },
          }),
        }}
      />
    </>
  );
}
