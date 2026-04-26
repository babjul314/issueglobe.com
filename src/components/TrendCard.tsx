import Link from "next/link";
import { TrendItem } from "@/lib/google-trends";
import { getCountryByCode } from "@/data/countries";
import { decodeHtml } from "@/lib/utils";

interface TrendCardProps {
  trend: TrendItem;
  rank: number;
}

export default function TrendCard({ trend, rank }: TrendCardProps) {
  const country = getCountryByCode(trend.country);

  return (
    <Link
      href={`/trend/${trend.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-gray-300 hover:-translate-y-0.5"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Left: Rank only. Remote RSS images are intentionally not shown in ranking lists. */}
        <div
          className="relative sm:w-28 shrink-0 min-h-[96px] sm:min-h-[160px] flex items-center justify-center"
          style={{ backgroundColor: `${country?.color || "#3B82F6"}12` }}
        >
          <span className="text-4xl opacity-20" aria-hidden="true">
            {country?.flag}
          </span>
          <div
            className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-lg font-black text-white shadow-lg border-2 border-white"
            style={{ backgroundColor: country?.color || "#3B82F6" }}
          >
            {rank}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-5 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-base">{country?.flag}</span>
            <span className="text-xs text-gray-500 font-medium">
              {country?.name}
            </span>
            <span className="text-xs text-gray-300">|</span>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold text-white"
              style={{ backgroundColor: country?.color || "#3B82F6" }}
            >
              {trend.traffic}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors text-xl mb-2 leading-tight break-words">
            {decodeHtml(trend.title)}
          </h3>

          {/* Summary or Description */}
          {(trend.summary || trend.description) && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
              {decodeHtml(trend.summary || trend.description)}
            </p>
          )}

          {/* Reactions preview */}
          {trend.reactions && (
            <div className="flex items-start gap-2 bg-amber-50 rounded-lg px-3 py-2 mb-3">
              <span className="text-sm shrink-0">💬</span>
              <p className="text-xs text-amber-800 line-clamp-1">
                {decodeHtml(trend.reactions)}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {trend.relatedQueries.slice(0, 3).map((q) => (
              <span
                key={q}
                className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 font-medium max-w-[160px] truncate"
              >
                {decodeHtml(q)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
