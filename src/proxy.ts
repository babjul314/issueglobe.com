import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 루트 경로(/)일 때만 처리
  if (pathname === "/") {
    // 쿠키 확인 (사용자가 선택한 국가)
    const cookie = request.cookies.get("preferred-country")?.value;
    if (cookie && /^[A-Z]{2}$/.test(cookie)) {
      console.log(`[IP-Routing] Using cookie: ${cookie}`);
      return NextResponse.redirect(new URL(`/country/${cookie.toLowerCase()}`, request.url));
    }

    // IP 기반 국가 감지 (정확도 높음)
    let ipCountry = request.headers.get("x-vercel-ip-country") ||
                    request.headers.get("cf-ipcountry");

    if (ipCountry && /^[A-Z]{2}$/.test(ipCountry)) {
      console.log(`[IP-Routing] Using IP geolocation: ${ipCountry}`);
      return NextResponse.redirect(new URL(`/country/${ipCountry.toLowerCase()}`, request.url));
    }

    // 로컬 개발: Accept-Language에서 감지
    const acceptLanguage = request.headers.get("accept-language") || "";
    console.log(`[IP-Routing] Accept-Language: ${acceptLanguage}`);

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
      console.log(`[IP-Routing] Using language: ${primaryLang} -> ${langMap[primaryLang]}`);
      return NextResponse.redirect(new URL(`/country/${langMap[primaryLang].toLowerCase()}`, request.url));
    }

    // 기본값: KR (한국)
    console.log(`[IP-Routing] Using default: KR`);
    return NextResponse.redirect(new URL("/country/kr", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
