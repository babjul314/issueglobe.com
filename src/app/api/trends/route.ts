import { NextRequest, NextResponse } from "next/server";
import { getCountryByCode } from "@/data/countries";
import { getTrendsFromSources } from "@/lib/trend-source";

export const revalidate = 300; // 5분 캐시

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const countryParam = searchParams.get("country");
  const searchQuery = searchParams.get("q");
  const limitParam = parseInt(searchParams.get("limit") || "20");

  const today = new Date().toISOString().split("T")[0];

  // 검색 쿼리 처리: 오늘 날짜 기준으로 모든 국가에서 검색
  if (searchQuery && searchQuery.trim().length >= 2) {
    const lowerQuery = searchQuery.toLowerCase();
    const allTrends: {
      title: string;
      slug: string;
      country: string;
      traffic: string;
      date: string;
    }[] = [];

    // 주요 국가들만 병렬 검색 (성능 최적화)
    const topCountries = ["US", "KR", "JP", "GB", "DE", "FR", "IN", "BR", "AU", "CA", "IT", "ES"];

    await Promise.all(
      topCountries.map(async (code) => {
        try {
          const trends = await getTrendsFromSources(code, 20, today);
          trends.forEach((data) => {
            if (
              data.title?.toLowerCase().includes(lowerQuery) ||
              data.relatedQueries?.some((q: string) => q.toLowerCase().includes(lowerQuery))
            ) {
              allTrends.push({
                title: data.title,
                slug: data.slug,
                country: data.country,
                traffic: data.traffic,
                date: data.date,
              });
            }
          });
        } catch {
          // 해당 국가 데이터 없으면 스킵
        }
      })
    );

    return NextResponse.json(
      { trends: allTrends.slice(0, limitParam) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  }

  // 국가별 트렌드 조회
  if (!countryParam) {
    return NextResponse.json(
      { error: "country or q parameter is required" },
      { status: 400 }
    );
  }

  const countryData = getCountryByCode(countryParam);
  if (!countryData) {
    return NextResponse.json({ error: "Invalid country code" }, { status: 400 });
  }

  try {
    const trends = await getTrendsFromSources(countryParam, limitParam, today);

    return NextResponse.json(
      { country: countryData, trends },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Firebase error:", error);
    return NextResponse.json(
      { error: `Failed to fetch trends: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
