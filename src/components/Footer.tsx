import Link from "next/link";
import { countries } from "@/data/countries";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">IG</span>
              </div>
              <span className="font-bold text-xl text-white">
                Issue<span className="text-blue-400">Globe</span>
              </span>
            </Link>
            <p className="text-sm mb-4">
              Real-time trending topics from 30 countries around the world.
              Stay informed with what the world is searching for.
            </p>
            {/* 소셜 링크 */}
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/issueglobe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Follow IssueGlobe on Twitter"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="https://linkedin.com/company/issueglobe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Follow IssueGlobe on LinkedIn"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://www.youtube.com/@issueglobe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Subscribe to IssueGlobe on YouTube"
                aria-label="YouTube"
              >
                ▶
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Popular Regions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/country/us" className="hover:text-white transition-colors">
                  🇺🇸 United States
                </Link>
              </li>
              <li>
                <Link href="/country/kr" className="hover:text-white transition-colors">
                  🇰🇷 South Korea
                </Link>
              </li>
              <li>
                <Link href="/country/jp" className="hover:text-white transition-colors">
                  🇯🇵 Japan
                </Link>
              </li>
              <li>
                <Link href="/country/gb" className="hover:text-white transition-colors">
                  🇬🇧 United Kingdom
                </Link>
              </li>
              <li>
                <Link href="/country/de" className="hover:text-white transition-colors">
                  🇩🇪 Germany
                </Link>
              </li>
              <li>
                <Link href="/country/fr" className="hover:text-white transition-colors">
                  🇫🇷 France
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-semibold text-white mb-4">All 30 Countries</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {countries.map((c) => (
                <Link
                  key={c.code}
                  href={`/country/${c.code.toLowerCase()}`}
                  className="hover:text-white transition-colors"
                  title={`Trending topics in ${c.name}`}
                  prefetch={true}
                >
                  {c.flag} {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">About & Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Trending Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/country/us"
                  className="hover:text-white transition-colors"
                >
                  Google Trends
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  What is Trending
                </Link>
              </li>
              <li>
                <a
                  href="https://support.google.com/trends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Trends API Info
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} IssueGlobe. All rights reserved.</p>
          <p className="mt-1 text-gray-500">
            Real-time trending data updated hourly from 30 countries.
          </p>
        </div>
      </div>
    </footer>
  );
}
