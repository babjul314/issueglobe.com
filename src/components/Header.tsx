import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200" translate="no">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">IG</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              Issue<span className="text-blue-600">Globe</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#regions"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Regions
            </Link>
            <Link
              href="/#trending"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Trending
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
