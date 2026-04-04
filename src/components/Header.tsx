"use client";

import { useState } from "react";
import Link from "next/link";
import { countries } from "@/data/countries";

export default function Header() {
  const [showRegions, setShowRegions] = useState(false);

  function getPreferredCountry() {
    const match = document.cookie.match(/preferred-country=([^;]+)/);
    return match ? match[1] : null;
  }

  function goHome() {
    const preferred = getPreferredCountry();
    if (preferred) {
      window.location.href = `/country/${preferred.toLowerCase()}`;
    } else {
      window.location.href = "/";
    }
  }

  function selectCountry(code: string) {
    document.cookie = `preferred-country=${code};path=/;max-age=${60 * 60 * 24 * 365}`;
    setShowRegions(false);
    window.location.href = `/country/${code.toLowerCase()}`;
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200" translate="no">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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

            <div className="flex items-center gap-3">
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
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Select Region</h2>
                <button
                  onClick={() => setShowRegions(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => selectCountry(c.code)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-blue-50 transition-colors group"
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600">{c.name}</p>
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
