import { Metadata } from "next";
import { notFound } from "next/navigation";
import { countries, getCountryByCode } from "@/data/countries";
import { fetchTrendsForCountry } from "@/lib/google-trends";
import TrendCard from "@/components/TrendCard";
import Link from "next/link";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return countries.map((c) => ({ code: c.code.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const country = getCountryByCode(code);
  if (!country) return {};

  const title = `${country.flag} ${country.name} Trending Topics Today`;
  const description = `Discover what's trending in ${country.name} (${country.nameLocal}) right now. Real-time Google Trends data for ${country.name}, updated daily.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://issueglobe.com/country/${code.toLowerCase()}`,
    },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params;
  const country = getCountryByCode(code);

  if (!country) notFound();

  const trends = await fetchTrendsForCountry(country.code);

  return (
    <>
      {/* Country Hero */}
      <section
        className="relative text-white"
        style={{
          background: `linear-gradient(135deg, ${country.color}dd, ${country.color}88)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>{country.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-6xl md:text-8xl">{country.flag}</span>
            <div>
              <h1 className="text-3xl md:text-5xl font-black">
                {country.name}
              </h1>
              <p className="text-lg text-white/80 mt-1">{country.nameLocal}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm">
                  {country.region}
                </span>
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm">
                  {trends.length} trending topics
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trends List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Trending in {country.name} Today
        </h2>

        <div className="grid gap-4">
          {trends.length > 0 ? (
            trends.map((trend, i) => (
              <TrendCard key={trend.slug} trend={trend} rank={i + 1} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-4">{country.flag}</p>
              <p className="text-lg">No trends available yet for {country.name}</p>
              <p className="text-sm mt-2">
                Trends are updated daily. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related Countries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          More from {country.region}
        </h2>
        <div className="flex flex-wrap gap-3">
          {countries
            .filter(
              (c) =>
                c.region === country.region && c.code !== country.code
            )
            .map((c) => (
              <Link
                key={c.code}
                href={`/country/${c.code.toLowerCase()}`}
                className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {c.flag} {c.name}
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
            "@type": "CollectionPage",
            name: `${country.name} Trending Topics`,
            description: `Real-time trending topics in ${country.name}`,
            url: `https://issueglobe.com/country/${code.toLowerCase()}`,
            isPartOf: {
              "@type": "WebSite",
              name: "IssueGlobe",
              url: "https://issueglobe.com",
            },
          }),
        }}
      />
    </>
  );
}
