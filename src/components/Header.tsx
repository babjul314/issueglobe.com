"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { countries } from "@/data/countries";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export default function Header() {
  const [showRegions, setShowRegions] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

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

  function selectLanguage(langCode: string) {
    setCurrentLang(langCode);
    document.cookie = `preferred-language=${langCode};path=/;max-age=${60 * 60 * 24 * 365}`;
    setShowLanguages(false);

    // Google Translate 드롭다운 찾기 및 변경 시도
    const tryChangeLanguage = () => {
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (select && select.value !== langCode) {
        select.value = langCode;

        // 여러 이벤트 방식 시도
        select.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
        select.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        select.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

        return true;
      }
      return false;
    };

    // 즉시 시도하고, 실패하면 재시도
    if (!tryChangeLanguage()) {
      let attempts = 0;
      const interval = setInterval(() => {
        if (tryChangeLanguage() || attempts >= 30) {
          clearInterval(interval);
        }
        attempts++;
      }, 150);
    }
  }

  // 처음 로드 시 IP 기반 언어 또는 저장된 언어 로드
  useEffect(() => {
    const savedLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("preferred-language="))
      ?.split("=")[1];

    if (savedLang) {
      setCurrentLang(savedLang);
      // Google Translate이 로드되면 자동으로 언어 변경
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (select) {
          select.value = savedLang;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, 1000);
    } else {
      // HTML lang 속성 기반으로 언어 감지
      const htmlLang = document.documentElement.lang || "en";
      const langCode = htmlLang.split("-")[0];
      if (LANGUAGES.some((l) => l.code === langCode) && langCode !== "en") {
        setCurrentLang(langCode);
        // Google Translate 로드 후 언어 변경
        setTimeout(() => selectLanguage(langCode), 1500);
      }
    }
  }, []);

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
              {/* 언어 선택 드롭다운 */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowLanguages(!showLanguages)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  title="Change language"
                >
                  <span className="text-lg">🌐</span>
                  <span className="text-xs uppercase">{currentLang}</span>
                </button>

                {showLanguages && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLanguages(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm transition-colors border-b border-gray-100 last:border-b-0 ${
                            currentLang === lang.code
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                          {currentLang === lang.code && (
                            <span className="ml-auto text-blue-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

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
