import googleTrends from "google-trends-api";

export interface TrendItem {
  title: string;
  slug: string;
  traffic: string;
  description: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  country: string;
  date: string;
  relatedQueries: string[];
}

// 인메모리 캐시 (Vercel 서버리스 환경 호환)
const memoryCache = new Map<string, { data: TrendItem[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1시간

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ぁ-んァ-ヶ亜-熙\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getCacheKey(countryCode: string): string {
  return `${countryCode}_${getToday()}`;
}

export async function fetchTrendsForCountry(
  countryCode: string
): Promise<TrendItem[]> {
  const cacheKey = getCacheKey(countryCode);
  const cached = memoryCache.get(cacheKey);

  // 캐시가 유효하면 반환 (중복 방지)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const today = getToday();

  try {
    const results = await googleTrends.dailyTrends({
      geo: countryCode,
      trendDate: new Date(),
    });

    const parsed = JSON.parse(results);
    const trendingSearches =
      parsed.default?.trendingSearchesDays?.[0]?.trendingSearches || [];

    const trends: TrendItem[] = trendingSearches.map(
      (item: {
        title: { query: string };
        formattedTraffic: string;
        articles?: {
          title: string;
          source: string;
          url: string;
          image?: { newsUrl: string };
        }[];
        relatedQueries?: { query: string }[];
      }) => {
        const article = item.articles?.[0];
        return {
          title: item.title.query,
          slug: `${countryCode.toLowerCase()}-${slugify(item.title.query)}-${today}`,
          traffic: item.formattedTraffic || "N/A",
          description: article?.title || "",
          source: article?.source || "",
          sourceUrl: article?.url || "",
          imageUrl: article?.image?.newsUrl || "",
          country: countryCode,
          date: today,
          relatedQueries:
            item.relatedQueries?.map((q: { query: string }) => q.query) || [],
        };
      }
    );

    // 인메모리 캐시 저장
    memoryCache.set(cacheKey, { data: trends, timestamp: Date.now() });

    return trends;
  } catch (error) {
    console.error(`Failed to fetch trends for ${countryCode}:`, error);
    return [];
  }
}
