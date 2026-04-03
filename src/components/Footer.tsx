import Link from "next/link";
import { countries } from "@/data/countries";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">IG</span>
              </div>
              <span className="font-bold text-xl text-white">
                Issue<span className="text-blue-400">Globe</span>
              </span>
            </Link>
            <p className="text-sm">
              Real-time trending topics from 30 countries around the world.
              Stay informed with what the world is searching for.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Regions</h4>
            <ul className="space-y-2 text-sm">
              {["North America", "Europe", "Asia", "Middle East", "South America", "Oceania"].map(
                (region) => (
                  <li key={region}>
                    <Link
                      href={`/#${region.toLowerCase().replace(/\s/g, "-")}`}
                      className="hover:text-white transition-colors"
                    >
                      {region}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Top Countries</h4>
            <ul className="space-y-2 text-sm">
              {countries.slice(0, 8).map((c) => (
                <li key={c.code}>
                  <Link
                    href={`/country/${c.code.toLowerCase()}`}
                    className="hover:text-white transition-colors"
                  >
                    {c.flag} {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  About IssueGlobe
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Data Sources
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </span>
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
