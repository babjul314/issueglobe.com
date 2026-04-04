"use client";

import { useEffect } from "react";

interface AutoTranslateProps {
  userLang: string;
  pageLang: string;
}

export default function AutoTranslate({ userLang, pageLang }: AutoTranslateProps) {
  useEffect(() => {
    // Google Translate 스크립트 로드
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
        } catch (e) {
          console.error("Translation init error:", e);
        }
      }
    };

    // 스크립트 로드
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
  }, [pageLang]);

  return (
    <>
      <div id="google_translate_element" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame {
              display: none !important;
            }
            body { top: 0 !important; margin-top: 0 !important; }
            .goog-te-gadget {
              color: transparent;
            }
            .goog-te-gadget .goog-te-combo {
              display: none;
            }
          `,
        }}
      />
    </>
  );
}
