import googleTrends from "google-trends-api";
import { countries } from "@/data/countries";
import fs from "fs";
import path from "path";

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

const CACHE_DIR = path.join(process.cwd(), "cache");

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCacheKey(countryCode: string, date: string): string {
  return `trends_${countryCode}_${date}.json`;
}

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

export async function fetchTrendsForCountry(
  countryCode: string
): Promise<TrendItem[]> {
  const today = getToday();
  const cacheKey = getCacheKey(countryCode, today);
  const cachePath = path.join(CACHE_DIR, cacheKey);

  ensureCacheDir();

  // 중복 방지: 오늘 이미 가져온 데이터가 있으면 캐시에서 반환
  if (fs.existsSync(cachePath)) {
    const cached = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    return cached;
  }

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

    // 캐시 저장
    fs.writeFileSync(cachePath, JSON.stringify(trends, null, 2));

    return trends;
  } catch (error) {
    console.error(`Failed to fetch trends for ${countryCode}:`, error);
    return [];
  }
}

export async function fetchAllTrends(): Promise<Record<string, TrendItem[]>> {
  const allTrends: Record<string, TrendItem[]> = {};

  // 순차적으로 요청 (rate limiting 방지)
  for (const country of countries) {
    allTrends[country.code] = await fetchTrendsForCountry(country.code);
    // Google Trends rate limit 방지를 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  return allTrends;
}

export function getCachedTrends(countryCode: string): TrendItem[] | null {
  const today = getToday();
  const cachePath = path.join(CACHE_DIR, getCacheKey(countryCode, today));

  if (fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  }
  return null;
}

export function getAllCachedTrends(): Record<string, TrendItem[]> {
  const today = getToday();
  const result: Record<string, TrendItem[]> = {};

  ensureCacheDir();

  for (const country of countries) {
    const cachePath = path.join(
      CACHE_DIR,
      getCacheKey(country.code, today)
    );
    if (fs.existsSync(cachePath)) {
      result[country.code] = JSON.parse(
        fs.readFileSync(cachePath, "utf-8")
      );
    }
  }

  return result;
}
