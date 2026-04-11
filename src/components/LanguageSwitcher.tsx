"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { countries } from "@/data/countries";

const LANG_MAP: Record<string, string> = {
  ko: "ko", ja: "ja", de: "de", fr: "fr", es: "es",
  it: "it", pt: "pt", nl: "nl", sv: "sv", no: "no",
  da: "da", pl: "pl", fi: "fi", ar: "ar", hi: "hi", en: "en",
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

// 비공식 Google Translate API (무료, 키 불필요)
async function gtxFetch(text: string, from: string, to: string): Promise<string> {
  const res = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
  );
  const data = await res.json();
  return (data[0] as Array<[string]>).map((x) => x[0]).join("");
}

// 일본어 페이지 전용: ja → en → userLang 2단계 번역
async function applyJaDoubleTrans(userLang: string) {
  const hasJa = (t: string) =>
    /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(t);

  const elements = Array.from(
    document.querySelectorAll<HTMLElement>("h1, h2, h3, p, span, li")
  ).filter(
    (el) =>
      !el.closest('[translate="no"]') &&
      !el.dataset.jaTrans &&
      el.childElementCount === 0 &&
      hasJa(el.textContent ?? "")
  );


  // 5개씩 병렬 처리
  const chunkSize = 5;
  for (let i = 0; i < elements.length; i += chunkSize) {
    const chunk = elements.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (el) => {
        const text = el.textContent!.trim();
        el.dataset.jaTrans = "1"; // 중복 방지
        try {
          const en = await gtxFetch(text, "ja", "en"); // 1단계: ja→en
          const final = userLang === "en"
            ? en
            : await gtxFetch(en, "en", userLang);   // 2단계: en→userLang
          el.textContent = final;
        } catch (e) {
          console.warn("[JA번역 실패]", e);
        }
      })
    );
    // 배치 간 딜레이 (rate limit 방지)
    if (i + chunkSize < elements.length) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
}

export default function AutoTranslator() {
  const pathname = usePathname();

  useEffect(() => {
    const pageMatch =
      pathname.match(/^\/country\/([a-z]{2,3})/i) ||
      pathname.match(/^\/trend\/([a-z]{2,3})-/i);
    const pageCountryCode = pageMatch?.[1]?.toUpperCase() ?? null;
    const userCountryCode = getCookie("initial-country")?.toUpperCase() ?? null;
    if (!userCountryCode) return;

    const userLang = countries.find((c) => c.code === userCountryCode)?.lang ?? "en";
    const googleLang = LANG_MAP[userLang] ?? "en";
    const isSameCountry = pageCountryCode === userCountryCode;
    const isEnglishUser = googleLang === "en";
    const isJaPage = pageCountryCode === "JP";


    // 일본어 페이지 + 한국어 사용자: 2단계 번역
    if (isJaPage && !isSameCountry && !isEnglishUser) {
      // googtrans 쿠키 제거 (Google Translate 위젯 비활성화)
      deleteCookie("googtrans");
      // 페이지 렌더링 완료 후 번역 실행
      setTimeout(() => applyJaDoubleTrans(googleLang), 600);
      return;
    }

    // 그 외 언어: 기존 googtrans 쿠키 방식
    const currentTarget = getCookie("googtrans")?.split("/")?.[2] ?? null;

    if (isSameCountry || isEnglishUser) {
      if (getCookie("googtrans")) {
        deleteCookie("googtrans");
        window.location.reload();
      }
    } else {
      if (currentTarget !== googleLang) {
        setCookie("googtrans", `/auto/${googleLang}`);
        window.location.reload();
      }
    }
  }, [pathname]);

  // Google Translate 스크립트 로드 (일본어 외 페이지용)
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
        } catch { /* silent */ }
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
