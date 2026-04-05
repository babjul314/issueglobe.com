import { TrendItem } from "./google-trends";

/**
 * 트렌드별 동적 메타 태그 최적화
 * SEO와 소셜 공유를 위한 키워드 강화
 */

interface EnhancedMetaTags {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogKeywords: string[];
  twitterTitle: string;
  twitterDescription: string;
  articleKeywords: string[];
}

/**
 * 트렌드의 컨텍스트에 따라 최적화된 메타 타이틀 생성
 */
export function generateOptimizedTitle(
  trend: TrendItem,
  countryName: string,
  position?: number
): string {
  // 순위가 높을수록 더 강한 표현 사용
  const isTopTrend = position && position <= 5;

  if (isTopTrend) {
    return `🔥 ${trend.title} - Trending #${position} in ${countryName} | Real-Time Trends`;
  }

  const variants = [
    `${trend.title} - Trending in ${countryName} | Real-Time Updates`,
    `Why is ${trend.title} Trending in ${countryName}?`,
    `${trend.title} - What's Happening in ${countryName}`,
    `${trend.title} - Viral Topic in ${countryName}`,
  ];

  return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * 트렌드에 대한 최적화된 메타 설명 생성
 * 검색 결과에서 클릭을 유도하는 설명
 */
export function generateOptimizedDescription(
  trend: TrendItem,
  countryName: string,
  trafficInfo?: string
): string {
  const baseDescription =
    trend.summary ||
    `${trend.title} is trending in ${countryName}. Get real-time insights, related searches, and trending context.`;

  const withTraffic = trafficInfo
    ? `${baseDescription} Search volume: ${trafficInfo}.`
    : baseDescription;

  // 최대 160자로 제한
  if (withTraffic.length <= 160) {
    return withTraffic;
  }

  return withTraffic.substring(0, 157) + "...";
}

/**
 * 트렌드의 의도별 키워드 세트 생성
 * 다양한 검색 의도를 커버
 */
export function generateSearchIntentKeywords(
  trend: TrendItem,
  countryName: string
): string[] {
  const keywords = new Set<string>();

  // 기본 키워드
  keywords.add(trend.title.toLowerCase());
  keywords.add(`${trend.title} trending`);
  keywords.add(`why is ${trend.title} trending`);
  keywords.add(`${trend.title} news`);

  // 지역별 키워드
  keywords.add(`${trend.title} ${countryName}`);
  keywords.add(`trending ${countryName}`);
  keywords.add(`${trend.title} ${countryName.toUpperCase()} trends`);

  // 시간 기반 키워드
  const date = new Date(trend.date);
  const todayDate = new Date();

  if (
    date.toDateString() === todayDate.toDateString()
  ) {
    keywords.add(`${trend.title} today`);
    keywords.add(`trending today ${trend.title}`);
  }

  // 관련 쿼리 포함 (상위 3개)
  trend.relatedQueries.slice(0, 3).forEach((query) => {
    keywords.add(query.toLowerCase());
    keywords.add(`${trend.title} ${query.toLowerCase()}`);
  });

  // 일반 검색 의도 카버리지
  keywords.add("what is trending");
  keywords.add("google trends");
  keywords.add("real-time trends");

  return Array.from(keywords).slice(0, 12);
}

/**
 * Twitter/X 최적화 메타 태그 생성
 */
export function generateTwitterMeta(
  trend: TrendItem,
  countryName: string
): { title: string; description: string } {
  const trafficMatch = trend.traffic.match(/\d+/);
  const traffic = trafficMatch ? trafficMatch[0] : "trending";

  return {
    title: `🔥 ${trend.title} - Trending in ${countryName}`,
    description: `${trend.title} is now trending with ${traffic}+ searches. ${trend.summary || "Discover what's happening."}`,
  };
}

/**
 * LinkedIn 최적화 메타 태그 생성
 */
export function generateLinkedInMeta(
  trend: TrendItem,
  countryName: string
): { title: string; description: string } {
  return {
    title: `Trending: ${trend.title} - ${countryName} Market Insights`,
    description: `${trend.title} is trending in ${countryName}. Understand the market dynamics and search behavior. Real-time data from Google Trends.`,
  };
}

/**
 * 뉴스 피드 최적화 메타 태그 생성
 */
export function generateNewsMeta(
  trend: TrendItem,
  countryName: string
): { title: string; description: string; keywords: string[] } {
  return {
    title: `Breaking: ${trend.title} Trends Across ${countryName}`,
    description: trend.summary || `What you need to know about ${trend.title} trending in ${countryName}.`,
    keywords: [
      trend.title,
      countryName,
      "trending",
      "news",
      ...trend.relatedQueries.slice(0, 2),
    ],
  };
}

/**
 * 종합 메타 태그 최적화
 */
export function generateEnhancedMetaTags(
  trend: TrendItem,
  countryName: string,
  position?: number
): EnhancedMetaTags {
  const title = generateOptimizedTitle(trend, countryName, position);
  const description = generateOptimizedDescription(
    trend,
    countryName,
    trend.traffic
  );
  const keywords = generateSearchIntentKeywords(trend, countryName);
  const twitterMeta = generateTwitterMeta(trend, countryName);
  const newsMeta = generateNewsMeta(trend, countryName);

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogKeywords: keywords.slice(0, 5),
    twitterTitle: twitterMeta.title,
    twitterDescription: twitterMeta.description,
    articleKeywords: newsMeta.keywords,
  };
}

/**
 * 카테고리별 트렌드 메타 생성
 * 여러 트렌드의 컨텍스트를 통합
 */
export function generateCategoryMeta(
  trends: TrendItem[],
  category: string,
  countryName: string
) {
  const topTrends = trends.slice(0, 5).map((t) => t.title).join(", ");
  const allKeywords = new Set<string>();

  trends.forEach((trend) => {
    const keywords = generateSearchIntentKeywords(trend, countryName);
    keywords.forEach((kw) => allKeywords.add(kw));
  });

  return {
    title: `Top ${trends.length} Trending Topics in ${countryName} - Real-Time ${category}`,
    description: `Discover the latest trending topics in ${countryName}: ${topTrends}. Updated hourly with real-time Google Trends data.`,
    keywords: Array.from(allKeywords).slice(0, 15),
  };
}

/**
 * 트렌드 페이지별 캐노니컬 URL 최적화
 */
export function generateCanonicalUrl(
  trendSlug: string,
  baseUrl: string = "https://issueglobe.com"
): string {
  return `${baseUrl}/trend/${encodeURIComponent(trendSlug)}`;
}

/**
 * 알트 텍스트 최적화
 * 이미지 검색 엔진 최적화
 */
export function generateOptimizedAltText(
  trend: TrendItem,
  countryName: string,
  context: "hero" | "thumbnail" | "related" = "hero"
): string {
  const baseAlt = `${trend.title} - Trending in ${countryName}`;

  switch (context) {
    case "hero":
      return `${baseAlt} with ${trend.traffic} searches - Real-time trend visualization`;
    case "thumbnail":
      return `${baseAlt} trending topic thumbnail`;
    case "related":
      return `${baseAlt} related topic`;
    default:
      return baseAlt;
  }
}
