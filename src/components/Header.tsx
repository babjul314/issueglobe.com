"use client";

import { useState } from "react";
import Link from "next/link";
import { countries } from "@/data/countries";

export default function Header() {
  const [showRegions, setShowRegions] = useState(false);

  function goHome() {
    const match = document.cookie.match(/initial-country=([^;]+)/);
    const initialCountry = match ? match[1] : null;

    if (initialCountry) {
      window.location.href = `/country/${initialCountry.toLowerCase()}`;
    } else {
      window.location.href = "/";
    }
  }

  function selectCountry(code: string) {
    if (!document.cookie.includes("initial-country=")) {
      document.cookie = `initial-country=${code};path=/;max-age=${60 * 60 * 24 * 365}`;
    }

    document.cookie = `preferred-country=${code};path=/;max-age=${60 * 60 * 24 * 365}`;
    setShowRegions(false);
    window.location.href = `/country/${code.toLowerCase()}`;
  }

  // 초기 나라 저장 (페이지 로드 시)
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    let currentCountry: string | null = null;

    if (pathname.startsWith("/country/")) {
      currentCountry = pathname.split("/")[2]?.toUpperCase() || null;
    }

    const existingInitial = document.cookie
      .split("; ")
      .find((row) => row.startsWith("initial-country="))
      ?.split("=")[1];

    if (!existingInitial && currentCountry) {
      document.cookie = `initial-country=${currentCountry};path=/;max-age=${60 * 60 * 24 * 365}`;
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200" translate="no">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <button onClick={goHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">IG</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                Issue<span className="text-blue-600">Globe</span>
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={goHome}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => setShowRegions(true)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Regions
              </button>
            </nav>

            {/* 모바일 메뉴 */}
            <nav className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setShowRegions(true)}
                className="text-2xl hover:opacity-70 transition-opacity"
              >
                🌍
              </button>
            </nav>

            <div className="flex items-center gap-4">

              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Regions Modal */}
      {showRegions && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowRegions(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select Region</h2>
                <button
                  onClick={() => setShowRegions(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => selectCountry(c.code)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200"
                  >
                    <span className="text-3xl sm:text-4xl flex-shrink-0">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm sm:text-base">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.nameLocal}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
