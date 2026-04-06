"use client";

import { useState } from "react";
import Link from "next/link";
import { countries } from "@/data/countries";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [showRegions, setShowRegions] = useState(false);

  function goHome() {
    const match = document.cookie.match(/initial-country=([^;]+)/);
    const initialCountry = match ? match[1] : null;
    window.location.href = initialCountry ? `/country/${initialCountry.toLowerCase()}` : "/";
  }

  function selectCountry(code: string) {
    if (!document.cookie.includes("initial-country=")) {
      document.cookie = `initial-country=${code};path=/;max-age=${60 * 60 * 24 * 365}`;
    }
    document.cookie = `preferred-country=${code};path=/;max-age=${60 * 60 * 24 * 365}`;
    setShowRegions(false);
    window.location.href = `/country/${code.toLowerCase()}`;
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200" translate="no">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* 로고 */}
            <button onClick={goHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">IG</span>
              </div>
              <span className="font-bold text-lg text-gray-900">
                Issue<span className="text-blue-600">Globe</span>
              </span>
            </button>

            {/* 우측 메뉴 */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* 데스크탑 Home, Regions 링크 */}
              <nav className="hidden md:flex items-center gap-4 mr-2">
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

              {/* 모바일 Regions 버튼 */}
              <button
                onClick={() => setShowRegions(true)}
                className="md:hidden text-xl hover:opacity-70 transition-opacity"
                aria-label="Select region"
              >
                🌍
              </button>

              {/* 번역 버튼 (LanguageSwitcher - 한 번만 렌더링) */}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Regions Modal */}
      {showRegions && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/80"
            onClick={() => setShowRegions(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Select Region</h2>
                <button
                  onClick={() => setShowRegions(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span className="text-3xl shrink-0">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">{c.name}</p>
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
