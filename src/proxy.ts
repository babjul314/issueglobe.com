import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 루트 경로(/)일 때만 처리
  if (pathname === "/") {
    const cookie = request.cookies.get("preferred-country")?.value;
    if (cookie) {
      return NextResponse.redirect(new URL(`/country/${cookie.toLowerCase()}`, request.url));
    }

    // IP 기반 국가 감지
    const ipCountry = request.headers.get("x-vercel-ip-country") ||
                      request.headers.get("cf-ipcountry");
    if (ipCountry) {
      return NextResponse.redirect(new URL(`/country/${ipCountry.toLowerCase()}`, request.url));
    }

    // 브라우저 언어 기반 감지
    const acceptLanguage = request.headers.get("accept-language") || "";
    const langMap: Record<string, string> = {
      ko: "KR",
      ja: "JP",
      de: "DE",
      fr: "FR",
      es: "ES",
      it: "IT",
      pt: "BR",
      nl: "NL",
      sv: "SE",
      no: "NO",
      da: "DK",
      fi: "FI",
      pl: "PL",
      zh: "TW",
      ar: "SA",
    };

    const primaryLang = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase();
    if (primaryLang && langMap[primaryLang]) {
      return NextResponse.redirect(new URL(`/country/${langMap[primaryLang].toLowerCase()}`, request.url));
    }

    // 기본값: US
    return NextResponse.redirect(new URL("/country/us", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
