import { NextRequest, NextResponse } from "next/server";
import { countries } from "@/data/countries";

const supportedCodes = new Set(countries.map((c) => c.code));

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Vercel이 자동으로 제공하는 접속 국가 헤더
  const detectedCountry =
    request.headers.get("x-vercel-ip-country") || "US";

  // 지원하는 30개국이면 그대로, 아니면 US 기본
  const country = supportedCodes.has(detectedCountry)
    ? detectedCountry
    : "US";

  // 쿠키로 사용자가 수동 선택한 국가가 있으면 우선
  const override = request.cookies.get("preferred-country")?.value;
  const finalCountry =
    override && supportedCodes.has(override) ? override : country;

  response.headers.set("x-user-country", finalCountry);

  return response;
}

export const config = {
  matcher: ["/"],
};
