"use client";

import { useEffect } from "react";

interface AutoTranslateProps {
  userLang: string;
  pageLang: string;
}

export default function AutoTranslate({ userLang, pageLang }: AutoTranslateProps) {
  useEffect(() => {
    // Google Translate 초기화 콜백
    // @ts-expect-error google translate callback
    window.googleTranslateElementInit = () => {
      // @ts-expect-error google translate global
      if (window.google?.translate?.TranslateElement) {
        try {
          // @ts-expect-error google translate global
          new window.google.translate.TranslateElement(
            {
              pageLanguage: pageLang,
              autoDisplay: false,
            },
            "google_translate_element"
          );

          // IP 기반 언어로 자동 번역 설정
          setTimeout(() => {
            const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
            if (select && userLang && userLang !== "en") {
              select.value = userLang;
              select.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }, 500);
        } catch (e) {
          console.error("Translation init error:", e);
        }
      }
    };

    // Google Translate 스크립트 로드
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    } else {
      // @ts-expect-error google translate callback
      window.googleTranslateElementInit();
    }
  }, [userLang, pageLang]);

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame { display: none !important; }
            .goog-te-gadget { display: none !important; }
            body { top: 0 !important; margin-top: 0 !important; padding-top: 0 !important; }
          `,
        }}
      />
    </>
  );
}
