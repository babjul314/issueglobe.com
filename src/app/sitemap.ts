import { MetadataRoute } from "next";
import { countries } from "@/data/countries";
import { fetchTrendsForCountry } from "@/lib/google-trends";

// 사이트맵 자동 갱신: 1시간마다 재생성
export const revalidate = 3600;

/**
 * 트래픽에 따라 우선순위 계산
 * "100K+" -> 0.9, "50K+" -> 0.8, "10K+" -> 0.75, 기타 -> 0.7
 */
function calculatePriorityByTraffic(traffic: string): number {
  const trafficStr = traffic?.toLowerCase() || "";
  if (trafficStr.includes("100k") || trafficStr.includes("1m")) return 0.9;
  if (trafficStr.includes("50k")) return 0.8;
  if (trafficStr.includes("10k")) return 0.75;
  return 0.7;
}

/**
 * 트렌드 날짜 파싱 (YYYY-MM-DD 형식 -> Date 객체)
 */
function parseTrafficDate(dateStr: string): Date {
  try {
    return new Date(`${dateStr}T00:00:00Z`);
  } catch {
    return new Date();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://issueglobe.com";
  // 오늘 자정 기준 (요청마다 now가 달라지면 Googlebot이 매번 변경으로 인식해 크롤 낭비됨)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 홈페이지
  const home = {
    url: baseUrl,
    lastModified: todayStart,
    changeFrequency: "hourly" as const,
    priority: 1,
  };

  // 국가별 페이지 (매시간 갱신)
  const countryPages = countries.map((country) => ({
    url: `${baseUrl}/country/${country.code.toLowerCase()}`,
    lastModified: todayStart,
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

  // 트렌드 개별 페이지 (병렬 처리로 속도 개선)
  const trendPages: MetadataRoute.Sitemap = [];
  const fetchPromises = countries.map(async (country) => {
    try {
      const trends = await fetchTrendsForCountry(country.code);
      return trends.map((trend) => ({
        url: `${baseUrl}/trend/${encodeURIComponent(trend.slug)}`,
        lastModified: trend.date
          ? parseTrafficDate(trend.date)
          : todayStart,
        changeFrequency: "daily" as const,
        priority: calculatePriorityByTraffic(trend.traffic),
      }));
    } catch (error) {
      console.error(`Sitemap error for ${country.code}:`, error);
      return [];
    }
  });

  // 모든 국가의 트렌드 병렬 수집
  const results = await Promise.allSettled(fetchPromises);
  for (const result of results) {
    if (result.status === "fulfilled") {
      trendPages.push(...result.value);
    }
  }

  return [home, ...countryPages, ...trendPages];
}
