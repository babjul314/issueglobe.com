"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { countries } from "@/data/countries";

// Google Translate 언어 코드 매핑 (countries.lang → Google Translate 코드)
const LANG_MAP: Record<string, string> = {
  ko: "ko",
  ja: "ja",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  pt: "pt",
  nl: "nl",
  sv: "sv",
  no: "no",
  da: "da",
  pl: "pl",
  fi: "fi",
  ar: "ar",
  hi: "hi",
  en: "en",
};

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/`;
  document.cookie = `${name}=${value}; path=/; domain=${window.location.hostname}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
}

export default function AutoTranslator() {
  const pathname = usePathname();

  useEffect(() => {
    // 현재 페이지의 국가 코드
    const pageMatch = pathname.match(/^\/country\/([a-z]{2})/i);
    const pageCountryCode = pageMatch ? pageMatch[1].toUpperCase() : null;

    // 사용자 IP 기반 국가 (쿠키에서)
    const userCountryCode = getCookie("initial-country")?.toUpperCase() ?? null;

    if (!userCountryCode) return;

    // 사용자 모국어
    const userCountry = countries.find((c) => c.code === userCountryCode);
    const userLang = userCountry?.lang ?? "en";
    const googleLang = LANG_MAP[userLang] ?? "en";

    const isSameCountry = pageCountryCode === userCountryCode;
    const isEnglishUser = googleLang === "en";

    const currentCookie = getCookie("googtrans");

    if (isSameCountry || isEnglishUser) {
      // 자국 페이지 또는 영어권 사용자 → 번역 해제
      if (currentCookie) {
        deleteCookie("googtrans");
        window.location.reload();
      }
    } else {
      // 타국 페이지 → 자국 언어로 자동 번역
      const targetCookie = `/en/${googleLang}`;
      if (currentCookie !== targetCookie) {
        setCookie("googtrans", targetCookie);
        window.location.reload();
      }
    }
  }, [pathname]);

  // Google Translate 스크립트 로드 (항상)
  useEffect(() => {
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
        } catch {
          // silent
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

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <style dangerouslySetInnerHTML={{
        __html: `
          .goog-te-banner-frame { display: none !important; }
          .goog-te-gadget { display: none !important; }
          .goog-te-gadget-simple { display: none !important; }
          .goog-te-bubble-frame { display: none !important; }
          .goog-te-tooltip { display: none !important; }
          .goog-te-toolbar-frame { display: none !important; }
          div.skiptranslate { display: none !important; }
          .goog-te-spinner { display: none !important; }
          body { top: 0 !important; margin-top: 0 !important; padding-top: 0 !important; }
        `,
      }} />
    </>
  );
}
