import { MetadataRoute } from "next";
import { countries } from "@/data/countries";
import { fetchTrendsForCountry } from "@/lib/google-trends";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://issueglobe.com";

  // 홈페이지
  const home = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 1,
  };

  // 국가별 페이지
  const countryPages = countries.map((country) => ({
    url: `${baseUrl}/country/${country.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

  // 트렌드 개별 페이지 (주요 국가만 빌드 타임에)
  const trendPages: MetadataRoute.Sitemap = [];
  const priorityCountries = ["US", "KR", "JP", "GB", "DE", "FR", "BR", "IN", "AU", "CA"];

  for (const code of priorityCountries) {
    try {
      const trends = await fetchTrendsForCountry(code);
      for (const trend of trends) {
        trendPages.push({
          url: `${baseUrl}/trend/${encodeURIComponent(trend.slug)}`,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.7,
        });
      }
    } catch {
      // skip
    }
  }

  return [home, ...countryPages, ...trendPages];
}
