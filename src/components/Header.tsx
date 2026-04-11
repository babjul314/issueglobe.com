"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { countries, getCountryByCode } from "@/data/countries";

export default function Header() {
  const pathname = usePathname();
  const [showRegions, setShowRegions] = useState(false);
  const [ui, setUi] = useState({
    home: "Home",
    regions: "Regions",
    selectRegion: "Select Region",
  });
  const [userCountryCode, setUserCountryCode] = useState<string>("");
  const [localizedNames, setLocalizedNames] = useState<Record<string, string>>({});

  // 현재 선택된(보고 있는) 나라 코드
  const currentPageCountry = (() => {
    const m = pathname.match(/^\/country\/([a-z]{2,3})/i);
    return m?.[1]?.toUpperCase() || "";
  })();

  useEffect(() => {
    const match = document.cookie.match(/initial-country=([^;]+)/);
    const code = match?.[1]?.toUpperCase();
    const country = code ? getCountryByCode(code) : null;

    if (country) {
      setUserCountryCode(country.code);
      setUi({
        home: country.ui.home,
        regions: country.ui.regions,
        selectRegion: country.ui.regions,
      });

      // Intl.DisplayNames으로 사용자 언어에 맞는 나라명 생성
      try {
        const dn = new Intl.DisplayNames([country.lang], { type: "region" });
        const names: Record<string, string> = {};
        countries.forEach((c) => {
          names[c.code] = dn.of(c.code) || c.name;
        });
        setLocalizedNames(names);
      } catch {
        // 미지원 브라우저 fallback
      }
    }
  }, []);

  function goHome() {
    const match = document.cookie.match(/initial-country=([^;]+)/);
    const initialCountry = match?.[1];
    window.location.href = initialCountry ? `/country/${initialCountry.toLowerCase()}` : "/";
  }

  const selectCountry = useCallback((code: string) => {
    if (!document.cookie.includes("initial-country=")) {
      document.cookie = `initial-country=${code};path=/;max-age=${60 * 60 * 24 * 365}`;
    }
    document.cookie = `preferred-country=${code};path=/;max-age=${60 * 60 * 24 * 365}`;
    setShowRegions(false);
    window.location.href = `/country/${code.toLowerCase()}`;
  }, []);

  const sortedCountries = [...countries].sort((a, b) => {
    if (a.code === userCountryCode) return -1;
    if (b.code === userCountryCode) return 1;
    return 0;
  });

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
            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-4">
                <button onClick={goHome} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  {ui.home}
                </button>
                <button
                  onClick={() => setShowRegions(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  🌍 {ui.regions}
                </button>
              </nav>

              {/* 모바일 Regions 버튼 */}
              <button
                onClick={() => setShowRegions(true)}
                className="md:hidden flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                aria-label={ui.selectRegion}
              >
                🌍 <span className="text-xs">{ui.regions}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Regions Modal */}
      {showRegions && (
        <>
          <div className="fixed inset-0 z-40 bg-black/80" onClick={() => setShowRegions(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" translate="no">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">{ui.selectRegion}</h2>
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
                {sortedCountries.map((c) => {
                  const isSelected = c.code === currentPageCountry;
                  const isHome = c.code === userCountryCode;
                  const displayName = localizedNames[c.code] || c.nameLocal;
                  return (
                    <button
                      key={c.code}
                      onClick={() => selectCountry(c.code)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group border ${
                        isSelected
                          ? "bg-blue-50 border-blue-300"
                          : "hover:bg-blue-50 border-transparent hover:border-blue-200"
                      }`}
                    >
                      <span className="text-3xl shrink-0">{c.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${isSelected ? "text-blue-600" : "text-gray-900 group-hover:text-blue-600"}`}>
                          {displayName}
                        </p>
                        {!isHome && (
                          <p className="text-xs text-gray-400">{c.nameLocal}</p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="text-blue-600 shrink-0 text-base">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
