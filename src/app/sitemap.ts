import { MetadataRoute } from "next";
import { countries } from "@/data/countries";

// 사이트맵 자동 갱신: 1시간마다 재생성
export const revalidate = 3600;

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

  return [home, ...countryPages];
}
