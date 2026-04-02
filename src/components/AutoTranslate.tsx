"use client";

import { useEffect } from "react";

interface AutoTranslateProps {
  userLang: string; // 유저의 언어 (ko, en, ja 등)
  pageLang: string; // 현재 페이지 콘텐츠 언어
}

// Google Translate 자동 번역 - 유저 언어와 페이지 언어가 다르면 자동 실행
export default function AutoTranslate({ userLang, pageLang }: AutoTranslateProps) {
  useEffect(() => {
    // 같은 언어면 번역 불필요
    if (userLang === pageLang) return;

    // Google Translate Element 초기화
    const initTranslate = () => {
      if (typeof window === "undefined") return;

      // @ts-expect-error google translate global
      if (window.google?.translate?.TranslateElement) {
        // @ts-expect-error google translate global
        new window.google.translate.TranslateElement(
          {
            pageLanguage: pageLang,
            includedLanguages: userLang,
            autoDisplay: true,
            layout: 0, // SIMPLE layout
          },
          "google_translate_element"
        );

        // 자동으로 유저 언어로 번역 트리거
        setTimeout(() => {
          const select = document.querySelector(
            ".goog-te-combo"
          ) as HTMLSelectElement;
          if (select) {
            select.value = userLang;
            select.dispatchEvent(new Event("change"));
          }
        }, 1000);
      }
    };

    // Google Translate 스크립트 로드
    // @ts-expect-error google translate callback
    window.googleTranslateElementInit = initTranslate;

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    } else {
      initTranslate();
    }
  }, [userLang, pageLang]);

  // 번역 위젯 숨기기 (자동 번역만 사용)
  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame, .goog-te-gadget, #goog-gt-tt, .goog-te-balloon-frame {
              display: none !important;
            }
            body { top: 0 !important; }
            .skiptranslate { display: none !important; }
          `,
        }}
      />
    </>
  );
}
