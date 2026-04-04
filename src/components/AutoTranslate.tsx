"use client";

import { useEffect } from "react";

interface AutoTranslateProps {
  userLang: string;
  pageLang: string;
}

export default function AutoTranslate({ userLang, pageLang }: AutoTranslateProps) {
  useEffect(() => {
    if (userLang === pageLang) return;

    const initTranslate = () => {
      if (typeof window === "undefined") return;

      // @ts-expect-error google translate global
      if (window.google?.translate?.TranslateElement) {
        // @ts-expect-error google translate global
        new window.google.translate.TranslateElement(
          {
            pageLanguage: pageLang,
            includedLanguages: userLang,
            autoDisplay: false,
          },
          "google_translate_element"
        );

        // 여러 번 시도로 언어 변경
        let attempts = 0;
        const tryTranslate = () => {
          const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
          if (select) {
            select.value = userLang;
            select.dispatchEvent(new Event("change", { bubbles: true }));

            // 추가 트리거 방법들
            const evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", true, true);
            select.dispatchEvent(evt);
          } else if (attempts < 10) {
            attempts++;
            setTimeout(tryTranslate, 500);
          }
        };
        tryTranslate();
      }
    };

    // @ts-expect-error google translate callback
    window.googleTranslateElementInit = initTranslate;

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
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
