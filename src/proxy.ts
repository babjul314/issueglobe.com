import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 루트 경로(/)일 때만 처리
  if (pathname === "/") {
    const xVercelIp = request.headers.get("x-vercel-ip-country");
    const cfIp = request.headers.get("cf-ipcountry");

    console.log(`[PROXY] 루트(/) 요청 감지`);
    console.log(`[PROXY] x-vercel-ip-country: ${xVercelIp}`);
    console.log(`[PROXY] cf-ipcountry: ${cfIp}`);

    // IP 기반 국가 감지 (최우선)
    let ipCountry = xVercelIp || cfIp;

    if (ipCountry && /^[A-Z]{2}$/.test(ipCountry)) {
      console.log(`[PROXY] IP로 리다이렉트: ${ipCountry} -> /country/${ipCountry.toLowerCase()}`);
      const response = NextResponse.redirect(new URL(`/country/${ipCountry.toLowerCase()}`, request.url));
      response.cookies.set("initial-country", ipCountry, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
      return response;
    }

    console.log(`[PROXY] IP 유효하지 않음: ${ipCountry}`);

    // IP 감지 실패 시: Accept-Language에서 감지
    const acceptLanguage = request.headers.get("accept-language") || "";
    console.log(`[IP-Routing] IP not detected. Accept-Language: ${acceptLanguage}`);

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
      const countryCode = langMap[primaryLang];
      const response = NextResponse.redirect(new URL(`/country/${countryCode.toLowerCase()}`, request.url));
      response.cookies.set("initial-country", countryCode, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
      return response;
    }

    // 기본값: KR (한국)
    console.log(`[IP-Routing] Using default: KR`);
    const response = NextResponse.redirect(new URL("/country/kr", request.url));
    response.cookies.set("initial-country", "KR", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
