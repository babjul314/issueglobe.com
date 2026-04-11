import { NextRequest, NextResponse } from "next/server";

// 소셜/검색 크롤러 봇 감지
function isBot(userAgent: string): boolean {
  return /kakaotalk|facebookexternalhit|twitterbot|linkedinbot|whatsapp|slackbot|discordbot|telegrambot|googlebot|bingbot|yandex|duckduckbot|applebot|pinterestbot|embedly|outbrain|quora|vkshare|w3c_validator|curl|python-requests|wget|scrapy/i.test(userAgent);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 루트 경로(/)일 때만 처리
  if (pathname === "/") {
    const userAgent = request.headers.get("user-agent") || "";
    if (isBot(userAgent)) {
      return NextResponse.next();
    }

    // IP 기반 국가 감지 → 쿠키만 설정 (리다이렉트 없음)
    const ipCountry =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry");

    if (ipCountry && /^[A-Z]{2}$/.test(ipCountry)) {
      const response = NextResponse.next();
      // initial-country 쿠키가 없을 때만 설정
      if (!request.cookies.get("initial-country")) {
        response.cookies.set("initial-country", ipCountry, {
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
        });
      }
      return response;
    }

    // Accept-Language로 감지
    const acceptLanguage = request.headers.get("accept-language") || "";
    const langMap: Record<string, string> = {
      ko: "KR", ja: "JP", de: "DE", fr: "FR", es: "ES",
      it: "IT", pt: "BR", nl: "NL", sv: "SE", no: "NO",
      da: "DK", fi: "FI", pl: "PL", zh: "TW", ar: "SA",
    };
    const primaryLang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
    if (primaryLang && langMap[primaryLang]) {
      const response = NextResponse.next();
      if (!request.cookies.get("initial-country")) {
        response.cookies.set("initial-country", langMap[primaryLang], {
          maxAge: 60 * 60 * 24 * 365,
          path: "/",
        });
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
