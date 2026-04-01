import Link from "next/link";
import { TrendItem } from "@/lib/google-trends";
import { getCountryByCode } from "@/data/countries";

interface TrendCardProps {
  trend: TrendItem;
  rank: number;
}

export default function TrendCard({ trend, rank }: TrendCardProps) {
  const country = getCountryByCode(trend.country);

  return (
    <Link
      href={`/trend/${trend.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
    >
      <div className="flex">
        {/* Rank */}
        <div
          className="flex items-center justify-center w-16 shrink-0 text-2xl font-black text-white"
          style={{ backgroundColor: country?.color || "#3B82F6" }}
        >
          {rank}
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{country?.flag}</span>
            <span className="text-xs text-gray-400 uppercase font-medium">
              {trend.country}
            </span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-400">{trend.traffic}</span>
          </div>

          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
            {trend.title}
          </h3>

          {trend.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {trend.description}
            </p>
          )}

          {trend.relatedQueries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {trend.relatedQueries.slice(0, 3).map((q) => (
                <span
                  key={q}
                  className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                >
                  {q}
                </span>
              ))}
            </div>
          )}

          {trend.source && (
            <p className="text-xs text-gray-400 mt-2">
              via {trend.source}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
