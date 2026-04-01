import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { countries, getCountryByCode } from "@/data/countries";
import { fetchTrendsForCountry, TrendItem } from "@/lib/google-trends";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function findTrendBySlug(slug: string): Promise<TrendItem | null> {
  // slug format: {countryCode}-{title}-{date}
  const countryCode = slug.split("-")[0]?.toUpperCase();
  if (!countryCode) return null;

  const country = getCountryByCode(countryCode);
  if (!country) return null;

  const trends = await fetchTrendsForCountry(country.code);
  return trends.find((t) => t.slug === slug) || null;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  const priorityCountries = ["US", "GB", "JP", "KR", "DE"];

  for (const code of priorityCountries) {
    try {
      const trends = await fetchTrendsForCountry(code);
      trends.forEach((t) => params.push({ slug: t.slug }));
    } catch {
      // skip on error
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trend = await findTrendBySlug(slug);
  if (!trend) return {};

  const country = getCountryByCode(trend.country);
  const title = `${trend.title} - Trending in ${country?.name || trend.country}`;
  const description =
    trend.description ||
    `"${trend.title}" is trending in ${country?.name} with ${trend.traffic} searches. Find out why this topic is going viral.`;

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://issueglobe.com/trend/${slug}`,
    },
  };
}

export default async function TrendPage({ params }: PageProps) {
  const { slug } = await params;
  const trend = await findTrendBySlug(slug);

  if (!trend) notFound();

  const country = getCountryByCode(trend.country);
  const relatedTrends = country
    ? (await fetchTrendsForCountry(country.code)).filter(
        (t) => t.slug !== slug
      )
    : [];

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/country/${trend.country.toLowerCase()}`}
            className="hover:text-gray-700 transition-colors"
          >
            {country?.flag} {country?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{trend.title}</span>
        </nav>

        {/* Main Content */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/country/${trend.country.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {country?.flag} {country?.name}
            </Link>
            <span className="text-sm text-gray-400">{trend.date}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            {trend.title}
          </h1>

          <div className="flex items-center gap-4">
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold text-white"
              style={{ backgroundColor: country?.color || "#3B82F6" }}
            >
              {trend.traffic} searches
            </span>
            {trend.source && (
              <span className="text-sm text-gray-500">
                Source: {trend.source}
              </span>
            )}
          </div>
        </header>

        {/* Image */}
        {trend.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <img
              src={trend.imageUrl}
              alt={trend.title}
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        )}

        {/* Summary */}
        {trend.summary && (
          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6 mb-8">
            <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2">Summary</h2>
            <p className="text-lg text-blue-900 leading-relaxed font-medium">
              {trend.summary}
            </p>
          </div>
        )}

        {/* Detail */}
        {trend.detail && (
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Detail</h2>
            <p className="text-gray-700 leading-relaxed">
              {trend.detail}
            </p>
          </div>
        )}

        {/* Reactions */}
        {trend.reactions && (
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6 mb-8">
            <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-2">Real-time Reactions</h2>
            <p className="text-amber-900 leading-relaxed">
              {trend.reactions}
            </p>
          </div>
        )}

        {/* Description (fallback if no summary) */}
        {!trend.summary && trend.description && (
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              {trend.description}
            </p>
          </div>
        )}

        {/* Source Link */}
        {trend.sourceUrl && (
          <div className="mb-8">
            <a
              href={trend.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-5 py-3 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
            >
              Read full article on {trend.source}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Related Queries */}
        {trend.relatedQueries.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Related Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {trend.relatedQueries.map((q) => (
                <span
                  key={q}
                  className="inline-block rounded-full bg-gray-100 border border-gray-200 px-4 py-2 text-sm text-gray-700"
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Trends */}
      {relatedTrends.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            More Trending in {country?.name}
          </h2>
          <div className="grid gap-3">
            {relatedTrends.slice(0, 5).map((t, i) => (
              <Link
                key={t.slug}
                href={`/trend/${t.slug}`}
                className="flex items-center gap-4 rounded-xl bg-white border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: country?.color || "#3B82F6" }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">{t.title}</p>
                  <p className="text-sm text-gray-500">{t.traffic}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: trend.title,
            description: trend.description,
            datePublished: trend.date,
            image: trend.imageUrl || undefined,
            author: {
              "@type": "Organization",
              name: "IssueGlobe",
            },
            publisher: {
              "@type": "Organization",
              name: "IssueGlobe",
              url: "https://issueglobe.com",
            },
          }),
        }}
      />
    </>
  );
}
