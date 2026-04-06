import Link from "next/link";
import { countries } from "@/data/countries";

const popularCountries = [
  { code: "us", flag: "🇺🇸", name: "United States" },
  { code: "gb", flag: "🇬🇧", name: "United Kingdom" },
  { code: "jp", flag: "🇯🇵", name: "Japan" },
  { code: "kr", flag: "🇰🇷", name: "South Korea" },
  { code: "de", flag: "🇩🇪", name: "Germany" },
  { code: "fr", flag: "🇫🇷", name: "France" },
  { code: "in", flag: "🇮🇳", name: "India" },
  { code: "br", flag: "🇧🇷", name: "Brazil" },
  { code: "au", flag: "🇦🇺", name: "Australia" },
  { code: "ca", flag: "🇨🇦", name: "Canada" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 mt-20" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="IssueGlobe home">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" aria-hidden="true">
                <span className="text-white text-sm font-bold">IG</span>
              </div>
              <span className="font-bold text-xl text-white">
                Issue<span className="text-blue-400">Globe</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              Real-time trending topics from 30 countries. Discover what the world is searching for, updated every hour.
            </p>
            <div className="flex items-center gap-4" aria-label="Social media links">
              <a
                href="https://twitter.com/issueglobe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-lg font-bold"
                aria-label="Follow IssueGlobe on X (Twitter)"
              >
                𝕏
              </a>
              <a
                href="https://linkedin.com/company/issueglobe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-sm font-bold border border-gray-600 rounded px-1.5 py-0.5 hover:border-white"
                aria-label="Follow IssueGlobe on LinkedIn"
              >
                in
              </a>
              <a
                href="https://www.youtube.com/@issueglobe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Subscribe to IssueGlobe on YouTube"
              >
                ▶
              </a>
            </div>
          </div>

          {/* Top Countries */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Top Countries</h3>
            <ul className="space-y-2 text-sm" role="list">
              {popularCountries.map((c) => (
                <li key={c.code}>
                  <Link
                    href={`/country/${c.code}`}
                    className="hover:text-white transition-colors flex items-center gap-2"
                    title={`Trending topics in ${c.name}`}
                  >
                    <span aria-hidden="true">{c.flag}</span>
                    <span>{c.name} Trends</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* All Countries */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">All Countries</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {countries.map((c) => (
                <Link
                  key={c.code}
                  href={`/country/${c.code.toLowerCase()}`}
                  className="hover:text-white transition-colors truncate"
                  title={`Trending in ${c.name}`}
                >
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* About & Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Global Trends
                </Link>
              </li>
              <li>
                <Link href="/country/us" className="hover:text-white transition-colors">
                  USA Trending Now
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                  Sitemap
                </Link>
              </li>
              <li>
                <a
                  href="https://trends.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Google Trends
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Updated</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Trend data refreshes hourly from Google Trends across 30 countries. Data sourced from publicly available search trend signals.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-500">
              &copy; {currentYear} IssueGlobe. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs text-center md:text-right">
              Real-time trending topics from 30 countries &mdash; powered by Google Trends data
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
