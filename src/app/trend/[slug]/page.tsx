import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { countries, getCountryByCode } from "@/data/countries";
import { fetchTrendsForCountry, TrendItem } from "@/lib/google-trends";
import Comments from "@/components/Comments";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function findTrendBySlug(slug: string): Promise<TrendItem | null> {
  const decoded = decodeURIComponent(slug);
  const countryCode = decoded.split("-")[0]?.toUpperCase();
  if (!countryCode) return null;

  const country = getCountryByCode(countryCode);
  if (!country) return null;

  const trends = await fetchTrendsForCountry(country.code);
  return trends.find((t) => t.slug === decoded || t.slug === slug) || null;
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

export default async function TrendPage({ params }: PageProps) {
  const { slug } = await params;
  const trend = await findTrendBySlug(slug);

  if (!trend) notFound();

  const country = getCountryByCode(trend.country);
  const relatedTrends = country
    ? (await fetchTrendsForCountry(country.code)).filter((t) => t.slug !== slug)
    : [];

  return (
    <>
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

          {/* Description */}
          {trend.description && (
            <p className="text-lg text-white/80 max-w-2xl">
              {trend.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content - 2/3 */}
          <div className="lg:col-span-2 space-y-8">

            {/* Summary Card */}
            {trend.summary && (
              <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <h2 className="text-lg font-bold text-blue-900">Summary</h2>
                </div>
                <p className="text-blue-800 leading-relaxed text-lg">
                  {trend.summary}
                </p>
              </section>
            )}

            {/* Detail Card */}
            {trend.detail && (
              <section className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">In-Depth Analysis</h2>
                </div>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {trend.detail.split('. ').reduce((acc: string[][], sentence, i) => {
                    const groupIndex = Math.floor(i / 2);
                    if (!acc[groupIndex]) acc[groupIndex] = [];
                    acc[groupIndex].push(sentence);
                    return acc;
                  }, []).map((group, i) => (
                    <p key={i}>{group.join('. ')}{!group[group.length - 1].endsWith('.') ? '.' : ''}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Reactions / Comments Card */}
            {trend.reactions && (
              <section className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <h2 className="text-lg font-bold text-white">Public Reactions & Opinions</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {/* Simulated comment-style reactions */}
                  {trend.reactions.split(/[.!?]+\s*/).filter(Boolean).map((reaction, i) => (
                    <div key={i} className="flex gap-3">
                      <div
                        className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor: [
                            "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
                            "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"
                          ][i % 8],
                        }}
                      >
                        {String.fromCodePoint(0x1F464)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-800">
                            User {i + 1}
                          </span>
                          <span className="text-xs text-gray-400">
                            {Math.floor(Math.random() * 59) + 1}m ago
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl rounded-tl-none px-4 py-2.5">
                          {reaction.trim()}
                          {!reaction.trim().endsWith('.') && !reaction.trim().endsWith('!') ? '.' : ''}
                        </p>
                        <div className="flex items-center gap-4 mt-1.5">
                          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                            ❤️ {Math.floor(Math.random() * 200) + 10}
                          </button>
                          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                            💬 {Math.floor(Math.random() * 30) + 1}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No detailed content fallback */}
            {!trend.summary && !trend.detail && trend.description && (
              <section className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {trend.description}
                </p>
              </section>
            )}

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
