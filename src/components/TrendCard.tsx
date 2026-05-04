import { TrendItem } from "@/lib/google-trends";
import { getCountryByCode } from "@/data/countries";
import { decodeHtml } from "@/lib/utils";
import { getGoogleSearchUrl } from "@/lib/search";

interface TrendCardProps {
  trend: TrendItem;
  rank: number;
}

export default function TrendCard({ trend, rank }: TrendCardProps) {
  const country = getCountryByCode(trend.country);
  const title = decodeHtml(trend.title);

  return (
    <a
      href={getGoogleSearchUrl(trend)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-gray-300 hover:-translate-y-0.5"
      aria-label={`Search ${title} on Google`}
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

          <h3 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors text-xl leading-tight break-words">
            {title}
          </h3>

          <span className="mt-3 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
            Google Search
          </span>
        </div>
      </div>
    </a>
  );
}
