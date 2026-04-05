import { TrendItem } from "./google-trends";

/**
 * 의미론적 관계 기반 내부 링크 최적화
 * 검색 엔진의 크롤 효율성과 링크 에쿼티 분배 개선
 */

interface InternalLink {
  source: string; // 출발점 trend slug
  targets: {
    slug: string;
    title: string;
    relevance: number;
    linkText: string;
  }[];
}

/**
 * 트렌드 간의 내부 링크 추천 생성
 * 의미론적 유사도를 기반으로 최적의 링크 대상 선택
 */
export function generateInternalLinks(
  trends: TrendItem[],
  maxLinksPerTrend: number = 3
): InternalLink[] {
  if (trends.length < 2) return [];

  const links: InternalLink[] = [];

  for (const sourceTrend of trends) {
    const relevantTargets = trends
      .filter((t) => t.slug !== sourceTrend.slug)
      .map((target) => {
        const relevance = calculateLinkRelevance(sourceTrend, target);
        return { target, relevance };
      })
      .filter(({ relevance }) => relevance > 0.3)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxLinksPerTrend);

    if (relevantTargets.length > 0) {
      links.push({
        source: sourceTrend.slug,
        targets: relevantTargets.map(({ target, relevance }) => ({
          slug: target.slug,
          title: target.title,
          relevance,
          linkText: generateLinkText(sourceTrend, target, relevance),
        })),
      });
    }
  }

  return links;
}

/**
 * 두 트렌드 간의 링크 관련성 계산
 * 컨텍스트와 의미론적 유사도 기반
 */
function calculateLinkRelevance(source: TrendItem, target: TrendItem): number {
  let score = 0;

  // 1. 제목 유사도 (40%)
  const titleSimilarity = calculateTitleSimilarity(source.title, target.title);
  score += titleSimilarity * 0.4;

  // 2. 관련 쿼리 겹침 (35%)
  const queryOverlap = calculateQueryOverlap(
    source.relatedQueries,
    target.relatedQueries
  );
  score += queryOverlap * 0.35;

  // 3. 시간 근접성 (15%)
  const timeSimilarity = calculateTimeSimilarity(source.date, target.date);
  score += timeSimilarity * 0.15;

  // 4. 트래픽 선호도 (10%)
  // 더 높은 트래픽의 트렌드로 링크하는 것을 선호
  const sourceTraffic = parseInt(source.traffic.replace(/[^\d]/g, "")) || 0;
  const targetTraffic = parseInt(target.traffic.replace(/[^\d]/g, "")) || 0;

  if (sourceTraffic > 0 && targetTraffic > 0) {
    const trafficRatio = Math.min(targetTraffic, sourceTraffic) / Math.max(targetTraffic, sourceTraffic);
    score += trafficRatio * 0.1;
  }

  return Math.min(score, 1);
}

/**
 * 제목 유사도 계산
 */
function calculateTitleSimilarity(title1: string, title2: string): number {
  const t1 = title1.toLowerCase();
  const t2 = title2.toLowerCase();

  // 정확한 일치
  if (t1 === t2) return 1.0;

  // 부분 일치
  if (t1.includes(t2) || t2.includes(t1)) return 0.8;

  // 단어 겹침
  const words1 = new Set(t1.split(/\s+/));
  const words2 = new Set(t2.split(/\s+/));

  const intersection = [...words1].filter((w) => words2.has(w) && w.length > 3);
  const union = new Set([...words1, ...words2]);

  return intersection.length > 0 ? intersection.length / union.size : 0;
}

/**
 * 관련 쿼리 겹침 계산
 */
function calculateQueryOverlap(queries1: string[], queries2: string[]): number {
  if (queries1.length === 0 || queries2.length === 0) return 0;

  const q1 = new Set(queries1.map((q) => q.toLowerCase()));
  const q2 = new Set(queries2.map((q) => q.toLowerCase()));

  const intersection = [...q1].filter((q) => q2.has(q));
  const union = new Set([...q1, ...q2]);

  return intersection.length > 0 ? intersection.length / union.size : 0;
}

/**
 * 시간 근접성 계산 (같은 날에 트렌딩된 것들을 선호)
 */
function calculateTimeSimilarity(date1: string, date2: string): number {
  try {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();

    // 같은 날이면 높은 점수
    if (Math.abs(d1 - d2) < 86400000) {
      return 1.0;
    }

    // 며칠 차이
    const daysDiff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - daysDiff / 7); // 7일 이상이면 0
  } catch {
    return 0;
  }
}

/**
 * 링크 앵커 텍스트 생성
 * 자연스럽고 관련성 높은 텍스트
 */
function generateLinkText(
  source: TrendItem,
  target: TrendItem,
  relevance: number
): string {
  if (relevance > 0.8) {
    // 매우 관련성 높음
    return `"${target.title}" is also trending`;
  } else if (relevance > 0.6) {
    // 관련성 높음
    return `Related topic: ${target.title}`;
  } else if (relevance > 0.4) {
    // 관련성 중간
    return `See also: ${target.title}`;
  } else {
    // 관련성 낮음
    return target.title;
  }
}

/**
 * 트렌드 페이지에서 사용할 수 있는 내부 링크 목록 생성
 */
export function getRelatedTrendsForLinking(
  currentTrend: TrendItem,
  allTrends: TrendItem[],
  limit: number = 5
) {
  return allTrends
    .filter((t) => t.slug !== currentTrend.slug)
    .map((trend) => ({
      ...trend,
      relevance: calculateLinkRelevance(currentTrend, trend),
      linkText: generateLinkText(currentTrend, trend, calculateLinkRelevance(currentTrend, trend)),
    }))
    .filter((t) => t.relevance > 0.25)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

/**
 * 사이트맵 대안 링크 (XML sitemap 보완)
 * 검색 엔진이 발견할 수 없는 페이지를 위한 내부 링크 맵
 */
export function generateLinkGraph(trends: TrendItem[]) {
  const graph: Record<string, string[]> = {};

  for (const trend of trends) {
    const relatedLinks = getRelatedTrendsForLinking(trend, trends, 3);
    graph[trend.slug] = relatedLinks.map((t) => t.slug);
  }

  return graph;
}

/**
 * 고아 페이지 감지
 * 어떤 내부 링크도 가지지 않은 트렌드 페이지 찾기
 */
export function findOrphanedPages(trends: TrendItem[]): string[] {
  const linkGraph = generateLinkGraph(trends);
  const incoming = new Set<string>();

  // 모든 링크의 대상 수집
  Object.values(linkGraph).forEach((targets) => {
    targets.forEach((target) => incoming.add(target));
  });

  // 들어오는 링크가 없는 페이지 찾기
  return Object.keys(linkGraph).filter((slug) => !incoming.has(slug));
}

/**
 * 링크 깊이 분석
 * 홈페이지에서 각 페이지까지의 클릭 거리
 */
export function calculateLinkDepth(linkGraph: Record<string, string[]>, startNode: string): Record<string, number> {
  const depth: Record<string, number> = { [startNode]: 0 };
  const queue = [startNode];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const targets = linkGraph[current] || [];

    for (const target of targets) {
      if (!(target in depth)) {
        depth[target] = depth[current] + 1;
        queue.push(target);
      }
    }
  }

  return depth;
}
