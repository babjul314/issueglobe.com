import Link from "next/link";
import { Country } from "@/data/countries";

interface CountryCardProps {
  country: Country;
  trendCount: number;
  topTrend?: string;
}

export default function CountryCard({
  country,
  trendCount,
  topTrend,
}: CountryCardProps) {
  return (
    <Link
      href={`/country/${country.code.toLowerCase()}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{country.flag}</span>
        <div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {country.name}
          </h3>
          <p className="text-sm text-gray-500">{country.nameLocal}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: country.color }}
        >
          {trendCount} trends
        </span>
        <span className="text-xs text-gray-400">{country.region}</span>
      </div>

      {topTrend && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 truncate">
            🔥 {topTrend}
          </p>
        </div>
      )}
    </Link>
  );
}
