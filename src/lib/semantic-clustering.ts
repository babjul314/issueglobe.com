import { TrendItem } from "./google-trends";

/**
 * 트렌드 간의 의미론적 관계 분석
 * 검색 엔진이 관련 개념을 이해하도록 돕기
 */

interface SemanticCluster {
  id: string;
  theme: string;
  description: string;
  trends: TrendItem[];
  keywords: string[];
  confidence: number;
}

interface SemanticRelation {
  source: string;
  target: string;
  relationType: "similar" | "related" | "opposite" | "subtype" | "supertype";
  score: number;
}

/**
 * 트렌드의 주제 키워드 추출
 * 자동으로 카테고리 분류
 */
function extractThemeKeywords(trend: TrendItem): string[] {
  const keywords: string[] = [];

  // 제목에서 주요 키워드 추출
  const titleWords = trend.title.toLowerCase().split(/\s+/);
  keywords.push(...titleWords.filter((w) => w.length > 3));

  // 관련 쿼리 추가
  if (trend.relatedQueries) {
    trend.relatedQueries.forEach((q) => {
      const words = q.toLowerCase().split(/\s+/);
      keywords.push(...words.filter((w) => w.length > 3));
    });
  }

  // 설명에서 주요 단어 추출
  if (trend.summary) {
    const summaryWords = trend.summary.toLowerCase().split(/\s+/);
    keywords.push(...summaryWords.filter((w) => w.length > 4).slice(0, 5));
  }

  return [...new Set(keywords)].slice(0, 10);
}

/**
 * 두 트렌드 간의 의미론적 유사도 계산
 * 0 ~ 1 점수 반환
 */
function calculateSimilarityScore(trend1: TrendItem, trend2: TrendItem): number {
  let score = 0;

  // 제목 유사도
  const title1 = trend1.title.toLowerCase();
  const title2 = trend2.title.toLowerCase();

  if (title1 === title2) return 1.0;

  // 단어 겹침 체크
  const words1 = new Set(title1.split(/\s+/));
  const words2 = new Set(title2.split(/\s+/));

  const intersection = [...words1].filter((w) => words2.has(w)).length;
  const union = new Set([...words1, ...words2]).size;

  if (union > 0) {
    score += (intersection / union) * 0.4; // 40% 가중치
  }

  // 관련 쿼리 겹침
  const queries1 = new Set(trend1.relatedQueries.map((q) => q.toLowerCase()));
  const queries2 = new Set(trend2.relatedQueries.map((q) => q.toLowerCase()));

  const queryIntersection = [...queries1].filter((q) => queries2.has(q)).length;
  if (queryIntersection > 0) {
    score += (queryIntersection / Math.max(queries1.size, queries2.size)) * 0.3; // 30% 가중치
  }

  // 검색 트래픽 근접도
  const traffic1 = parseInt(trend1.traffic.replace(/[^\d]/g, "")) || 0;
  const traffic2 = parseInt(trend2.traffic.replace(/[^\d]/g, "")) || 0;

  if (traffic1 > 0 && traffic2 > 0) {
    const trafficRatio = Math.min(traffic1, traffic2) / Math.max(traffic1, traffic2);
    score += trafficRatio * 0.3; // 30% 가중치
  }

  return Math.min(score, 1);
}

/**
 * 트렌드를 의미론적 클러스터로 그룹화
 * 관련 트렌드끼리 묶기
 */
export function clusterTrendsBySemantic(trends: TrendItem[]): SemanticCluster[] {
  if (trends.length === 0) return [];

  const clusters: SemanticCluster[] = [];
  const processed = new Set<string>();

  for (const trend of trends) {
    if (processed.has(trend.slug)) continue;

    const cluster: SemanticCluster = {
      id: `cluster-${trend.slug}`,
      theme: extractPrimaryTheme(trend.title),
      description: trend.summary || trend.title,
      trends: [trend],
      keywords: extractThemeKeywords(trend),
      confidence: 1.0,
    };

    processed.add(trend.slug);

    // 유사한 트렌드 찾기
    for (const candidate of trends) {
      if (processed.has(candidate.slug)) continue;

      const similarity = calculateSimilarityScore(trend, candidate);
      if (similarity > 0.4) {
        // 40% 이상 유사도
        cluster.trends.push(candidate);
        cluster.keywords.push(...extractThemeKeywords(candidate));
        processed.add(candidate.slug);
      }
    }

    // 클러스터 키워드 정제
    cluster.keywords = [...new Set(cluster.keywords)].slice(0, 8);
    cluster.confidence = Math.min(
      1,
      cluster.trends.length > 1 ? 0.95 : 0.7
    );

    clusters.push(cluster);
  }

  return clusters.sort((a, b) => b.confidence - a.confidence);
}

/**
 * 제목에서 주요 테마 추출
 */
function extractPrimaryTheme(title: string): string {
  // 괄호 제거
  const cleaned = title.replace(/\([^)]*\)/, "").trim();

  // 첫 번째 단어 또는 주요 명사 추출
  const words = cleaned.split(/\s+/);
  return words[0] || cleaned;
}

/**
 * 트렌드 간의 의미론적 관계 생성
 * 검색 엔진의 엔티티 연결을 위해
 */
export function buildSemanticRelations(trends: TrendItem[]): SemanticRelation[] {
  const relations: SemanticRelation[] = [];

  for (let i = 0; i < trends.length; i++) {
    for (let j = i + 1; j < Math.min(i + 5, trends.length); j++) {
      const similarity = calculateSimilarityScore(trends[i], trends[j]);

      if (similarity > 0.3) {
        relations.push({
          source: trends[i].slug,
          target: trends[j].slug,
          relationType: similarity > 0.7 ? "similar" : "related",
          score: similarity,
        });
      }
    }
  }

  return relations.sort((a, b) => b.score - a.score).slice(0, 15); // 상위 15개만
}

/**
 * 트렌드 엔티티 마크업 생성
 * Knowledge Graph 최적화용
 */
export function generateEntitySchema(
  trend: TrendItem,
  countryCode: string,
  relatedTrends: TrendItem[] = [],
  lang: string = "en"
) {
  return {
    "@context": "https://schema.org",
    "@type": "Thing",
    "@id": `https://issueglobe.com/trend/${trend.slug}`,
    name: trend.title,
    description: trend.summary || trend.description,
    url: `https://issueglobe.com/trend/${trend.slug}`,
    keywords: [trend.title, ...trend.relatedQueries.slice(0, 3)],

    // 시간적 컨텍스트
    temporalCoverage: trend.date,

    // 지역 컨텍스트
    inLanguage: lang,
    spatialCoverage: {
      "@type": "Place",
      name: countryCode,
    },

    // 인기도 신호
    popularity: {
      "@type": "QuantitativeValue",
      value: trend.traffic,
      unitText: "searches",
    },

    // 관련 개념
    ...(relatedTrends.length > 0 && {
      relatedLink: relatedTrends.slice(0, 5).map((rt) => ({
        "@type": "Thing",
        name: rt.title,
        url: `https://issueglobe.com/trend/${rt.slug}`,
      })),
    }),

    // 출처
    isBasedOn: {
      "@type": "Service",
      name: "Google Trends",
      url: "https://trends.google.com",
    },

    // 커버리지 영역
    areaServed: countryCode,
  };
}

/**
 * 시간대별 트렌드 변화 추적
 * 트렌드의 수명 신호
 */
export function analyzeTrendLifecycle(trends: TrendItem[]) {
  const now = new Date();

  return trends.map((trend) => {
    const trendDate = new Date(trend.date);
    const ageHours = (now.getTime() - trendDate.getTime()) / (1000 * 60 * 60);

    return {
      slug: trend.slug,
      stage:
        ageHours < 6
          ? "emerging"
          : ageHours < 24
            ? "peak"
            : ageHours < 72
              ? "declining"
              : "legacy",
      ageHours: Math.round(ageHours),
    };
  });
}
