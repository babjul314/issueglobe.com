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
            /* Google Translate 위젯 완전 숨김 */
            .goog-te-banner-frame { display: none !important; visibility: hidden !important; }
            .goog-te-gadget { display: none !important; visibility: hidden !important; }
            .goog-te-gadget-simple { display: none !important; visibility: hidden !important; }
            .goog-te-bubble-frame { display: none !important; visibility: hidden !important; }
            .goog-te-tooltip { display: none !important; visibility: hidden !important; }
            .goog-te-toolbar-frame { display: none !important; visibility: hidden !important; }

            /* 모든 번역 UI 요소 숨김 */
            div.skiptranslate { display: none !important; }
            .goog-te-spinner { display: none !important; }

            /* Body 기본값 복원 */
            body {
              top: 0 !important;
              margin-top: 0 !important;
              padding-top: 0 !important;
            }

            /* 번역 후 텍스트 스타일 유지 */
            body, * {
              background-color: initial !important;
            }
          `,
        }}
      />
    </>
  );
}
