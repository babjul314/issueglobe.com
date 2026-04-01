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
  summary: string;
  detail: string;
  reactions: string;
}

// 인메모리 캐시 (Vercel 서버리스 환경 호환)
const memoryCache = new Map<string, { data: TrendItem[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1시간

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ぁ-んァ-ヶ亜-熙\u0600-\u06FF\u0590-\u05FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getCacheKey(countryCode: string): string {
  return `${countryCode}_${getToday()}`;
}

// Google Trends RSS 피드에서 트렌드 가져오기
async function fetchTrendsFromRSS(countryCode: string): Promise<TrendItem[]> {
  const today = getToday();
  const url = `https://trends.google.com/trending/rss?geo=${countryCode}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; IssueGlobe/1.0)",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`RSS fetch failed for ${countryCode}: ${res.status}`);
    return [];
  }

  const xml = await res.text();

  // RSS XML 파싱
  const items: TrendItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title") || "";
    const traffic = extractTag(itemXml, "ht:approx_traffic") || "N/A";
    const newsUrl = extractTag(itemXml, "ht:news_item_url") || "";
    const newsTitle = extractTag(itemXml, "ht:news_item_title") || "";
    const newsSource = extractTag(itemXml, "ht:news_item_source") || "";
    const pictureUrl = extractTag(itemXml, "ht:picture") || "";

    if (title) {
      items.push({
        title,
        slug: `${countryCode.toLowerCase()}-${slugify(title)}-${today}`,
        traffic,
        description: newsTitle,
        source: newsSource,
        sourceUrl: newsUrl,
        imageUrl: pictureUrl,
        country: countryCode,
        date: today,
        relatedQueries: [],
        summary: "",
        detail: "",
        reactions: "",
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string | null {
  // CDATA 지원
  const cdataRegex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`);
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const m = regex.exec(xml);
  return m ? m[1].trim() : null;
}

export async function fetchTrendsForCountry(
  countryCode: string
): Promise<TrendItem[]> {
  const cacheKey = getCacheKey(countryCode);
  const cached = memoryCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // 미리 작성된 콘텐츠 가져오기 (동적 import로 순환 참조 방지)
  let preloaded: TrendItem[] = [];
  try {
    const { getPreloadedTrends } = await import("@/data/trending-content");
    preloaded = getPreloadedTrends(countryCode);
  } catch {
    // preloaded 없으면 무시
  }

  try {
    const rssItems = await fetchTrendsFromRSS(countryCode);

    // RSS 데이터와 미리 작성된 콘텐츠 병합
    const merged = rssItems.map((rssItem) => {
      const enriched = preloaded.find(
        (p) => p.title.toLowerCase() === rssItem.title.toLowerCase()
      );
      if (enriched) {
        return {
          ...rssItem,
          summary: enriched.summary,
          detail: enriched.detail,
          reactions: enriched.reactions,
          relatedQueries: enriched.relatedQueries.length > 0 ? enriched.relatedQueries : rssItem.relatedQueries,
          description: enriched.description || rssItem.description,
        };
      }
      return rssItem;
    });

    const result = merged.length > 0 ? merged : preloaded;
    if (result.length > 0) {
      memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
    }
    return result;
  } catch (error) {
    console.error(`Failed to fetch trends for ${countryCode}:`, error);
    return preloaded;
  }
}
