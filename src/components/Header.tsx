"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { countries } from "@/data/countries";

export default function Header() {
  const [showRegions, setShowRegions] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

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

  // 언어 선택 로직
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language") || "en";
    setCurrentLanguage(savedLang);

    // Google Translate 언어 변경
    setTimeout(() => {
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (select) {
        select.value = savedLang;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 100);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem("preferred-language", langCode);

    // Google Translate 언어 변경
    setTimeout(() => {
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, 100);

    setShowLanguages(false);
  };

  const languageFlags: Record<string, { name: string; flag: string }> = {
    en: { name: "English", flag: "🇺🇸" },
    ko: { name: "한국어", flag: "🇰🇷" },
    ja: { name: "日本語", flag: "🇯🇵" },
    de: { name: "Deutsch", flag: "🇩🇪" },
    fr: { name: "Français", flag: "🇫🇷" },
    pt: { name: "Português", flag: "🇧🇷" },
    es: { name: "Español", flag: "🇪🇸" },
    hi: { name: "हिन्दी", flag: "🇮🇳" },
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200" translate="no">
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

            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              >
                <span className="text-lg">{languageFlags[currentLanguage]?.flag || "🌐"}</span>
                <span className="hidden sm:inline">{languageFlags[currentLanguage]?.name.split(" ")[0] || "Language"}</span>
              </button>

              {/* Language Dropdown */}
              {showLanguages && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowLanguages(false)}
                  />
                  <div className="absolute right-0 top-12 z-40 bg-white rounded-lg shadow-lg border border-gray-200 w-48">
                    {Object.entries(languageFlags).map(([code, { name, flag }]) => (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                          currentLanguage === code
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        } ${code === "en" ? "border-b border-gray-100" : ""}`}
                      >
                        <span className="text-lg">{flag}</span>
                        <span>{name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Language Button */}
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="sm:hidden text-2xl hover:opacity-70 transition-opacity"
              title="Change Language"
            >
              {languageFlags[currentLanguage]?.flag || "🌐"}
            </button>
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
