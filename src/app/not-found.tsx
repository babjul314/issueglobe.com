import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-500 mb-8">Page not found</p>
      <Link
        href="/"
        className="rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
