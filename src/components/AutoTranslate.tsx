"use client";

import { useEffect } from "react";

interface AutoTranslateProps {
  userLang: string;
  pageLang: string;
}

export default function AutoTranslate({ userLang, pageLang }: AutoTranslateProps) {
  useEffect(() => {
    if (userLang === pageLang) return;

    // 번역 URL을 직접 사용하는 방법
    const langMap: { [key: string]: string } = {
      ko: "ko",
      ja: "ja",
      zh: "zh-CN",
      de: "de",
      fr: "fr",
      es: "es",
      it: "it",
      pt: "pt",
      nl: "nl",
      sv: "sv",
      pl: "pl",
      ar: "ar",
      he: "he",
      hi: "hi",
      en: "en",
    };

    const targetLang = langMap[userLang] || userLang;
    const sourceLang = langMap[pageLang] || pageLang;

    // 방법 1: Google Translate Element 시도
    const initTranslate = () => {
      if (typeof window === "undefined") return;

      // @ts-expect-error google translate global
      if (window.google?.translate?.TranslateElement) {
        try {
          // @ts-expect-error google translate global
          new window.google.translate.TranslateElement(
            {
              pageLanguage: sourceLang,
              includedLanguages: targetLang,
              autoDisplay: false,
            },
            "google_translate_element"
          );

          // 여러 번 시도로 언어 변경
          let attempts = 0;
          const tryTranslate = () => {
            const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
            if (select && select.value !== targetLang) {
              select.value = targetLang;
              select.dispatchEvent(new Event("change", { bubbles: true }));

              const evt = document.createEvent("HTMLEvents");
              evt.initEvent("change", true, true);
              select.dispatchEvent(evt);
            } else if (attempts < 15) {
              attempts++;
              setTimeout(tryTranslate, 300);
            }
          };
          tryTranslate();
        } catch (e) {
          console.error("Translation error:", e);
        }
      }
    };

    // @ts-expect-error google translate callback
    window.googleTranslateElementInit = initTranslate;

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onload = initTranslate;
      document.head.appendChild(script);
    } else {
      initTranslate();
    }
  }, [userLang, pageLang]);

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame, .goog-te-gadget, #goog-gt-tt, .goog-te-balloon-frame,
            .goog-te-menu-frame, .goog-te-combo, .skiptranslate {
              display: none !important;
            }
            body { top: 0 !important; margin-top: 0 !important; }
          `,
        }}
      />
    </>
  );
}
