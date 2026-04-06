"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const pathname = usePathname();

  // 현재 페이지의 국가 추출
  const currentPageCountry = (() => {
    const match = pathname.match(/^\/country\/([a-z]{2})/i);
    return match ? match[1].toUpperCase() : null;
  })();

  // IP 기반 국가 감지 (쿠키에서)
  useEffect(() => {
    const match = document.cookie.match(/initial-country=([^;]+)/);
    if (match) setUserCountry(match[1].toUpperCase());
  }, []);

  useEffect(() => {
    // Google Translate 초기화 (항상 실행 - 번역 기능 보장)
    // @ts-expect-error google translate callback
    window.googleTranslateElementInit = () => {
      // @ts-expect-error google translate global
      if (window.google?.translate?.TranslateElement) {
        try {
          // @ts-expect-error google translate global
          new window.google.translate.TranslateElement(
            { pageLanguage: "en", autoDisplay: false },
            "google_translate_element"
          );
        } catch (e) {
          console.error("Translation init error:", e);
        }
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    } else {
      // @ts-expect-error google translate callback
      window.googleTranslateElementInit?.();
    }
  }, []);

  const handleLanguageSelect = (lang: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const select = document.querySelector(".goog-te-combo") as any;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      setIsOpen(false);
    }
  };

  const languageMap: Record<string, { name: string; flag: string }> = {
    ko: { name: "한국어", flag: "🇰🇷" },
    ja: { name: "日本語", flag: "🇯🇵" },
    en: { name: "English", flag: "🇬🇧" },
    de: { name: "Deutsch", flag: "🇩🇪" },
    fr: { name: "Français", flag: "🇫🇷" },
    es: { name: "Español", flag: "🇪🇸" },
    it: { name: "Italiano", flag: "🇮🇹" },
    pt: { name: "Português", flag: "🇧🇷" },
    nl: { name: "Nederlands", flag: "🇳🇱" },
    sv: { name: "Svenska", flag: "🇸🇪" },
    zh: { name: "中文", flag: "🇹🇼" },
    ar: { name: "العربية", flag: "🇸🇦" },
  };

  // 자국 사용자가 자국 페이지 볼 때: 버튼만 숨기고 스크립트는 유지
  const hideButton = currentPageCountry && userCountry && currentPageCountry === userCountry;

  return (
    <>
      {/* Google Translate Element (항상 존재해야 함) */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* 버튼: 자국 사용자가 자국 페이지 볼 때만 숨김 */}
      {!hideButton && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-lg bg-blue-50 hover:bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition-colors border border-blue-200"
            title="Translate this page"
          >
            <span className="text-lg">🌐</span>
            <span className="hidden sm:inline">Translate</span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <div className="absolute top-full mt-2 right-0 z-50 w-56 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Translate To</div>
                  {Object.entries(languageMap).map(([lang, { name, flag }]) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-left hover:bg-blue-50 transition-colors text-sm"
                    >
                      <span className="text-lg">{flag}</span>
                      <span className="text-gray-700 font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame { display: none !important; visibility: hidden !important; }
            .goog-te-gadget { display: none !important; visibility: hidden !important; }
            .goog-te-gadget-simple { display: none !important; visibility: hidden !important; }
            .goog-te-bubble-frame { display: none !important; visibility: hidden !important; }
            .goog-te-tooltip { display: none !important; visibility: hidden !important; }
            .goog-te-toolbar-frame { display: none !important; visibility: hidden !important; }
            div.skiptranslate { display: none !important; }
            .goog-te-spinner { display: none !important; }
            body { top: 0 !important; margin-top: 0 !important; padding-top: 0 !important; }
          `,
        }}
      />
    </>
  );
}
