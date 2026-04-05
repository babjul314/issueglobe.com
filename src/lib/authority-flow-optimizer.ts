/**
 * 내부 링크 권한 흐름 최적화 (Link Juice Distribution)
 * PageRank 기반 권한 흐름 분석 및 최적화
 */

export interface PageAuthority {
  url: string;
  pageRank: number; // 0-100 스코어
  internalLinks: string[]; // 들어오는 링크
  outboundLinks: string[]; // 나가는 링크
  linkJuice: number;
  priority: "high" | "medium" | "low";
}

export interface AuthorityFlowReport {
  totalPages: number;
  averagePageRank: number;
  highAuthorityPages: PageAuthority[];
  lowAuthorityPages: PageAuthority[];
  orphanedPages: string[];
  recommendations: string[];
}

/**
 * 단순 PageRank 알고리즘 구현
 * 내부 링크 구조로부터 페이지 중요도 계산
 */
export function calculatePageRank(
  pages: Map<string, { outboundLinks: string[] }>,
  dampeningFactor: number = 0.85,
  iterations: number = 20
): Map<string, number> {
  const pageRanks = new Map<string, number>();
  const initialRank = 1 / pages.size;

  // 초기화
  pages.forEach((_, url) => {
    pageRanks.set(url, initialRank);
  });

  // PageRank 계산 (반복)
  for (let iter = 0; iter < iterations; iter++) {
    const newRanks = new Map<string, number>();

    pages.forEach((page, url) => {
      let rank = (1 - dampeningFactor) / pages.size;

      // 이 페이지로 들어오는 모든 링크 찾기
      pages.forEach((sourcePage, sourceUrl) => {
        if (sourcePage.outboundLinks.includes(url)) {
          const sourceRank = pageRanks.get(sourceUrl) || 0;
          const numLinks = sourcePage.outboundLinks.length;
          rank += (dampeningFactor * sourceRank) / numLinks;
        }
      });

      newRanks.set(url, rank);
    });

    // PageRank 업데이트
    newRanks.forEach((rank, url) => {
      pageRanks.set(url, rank);
    });
  }

  // 0-100 점수로 정규화
  let maxRank = 0;
  pageRanks.forEach((rank) => {
    maxRank = Math.max(maxRank, rank);
  });

  const normalizedRanks = new Map<string, number>();
  pageRanks.forEach((rank, url) => {
    normalizedRanks.set(url, Math.round((rank / maxRank) * 100));
  });

  return normalizedRanks;
}

/**
 * 링크 깊이 분석
 * 홈페이지에서 각 페이지까지의 최소 클릭 거리
 */
export function calculateLinkDepth(
  pages: Map<string, { outboundLinks: string[] }>,
  startUrl: string
): Map<string, number> {
  const depth = new Map<string, number>();
  const queue: { url: string; depth: number }[] = [{ url: startUrl, depth: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (visited.has(current.url)) continue;
    visited.add(current.url);

    depth.set(current.url, current.depth);

    const page = pages.get(current.url);
    if (page) {
      page.outboundLinks.forEach((link) => {
        if (!visited.has(link)) {
          queue.push({ url: link, depth: current.depth + 1 });
        }
      });
    }
  }

  return depth;
}

/**
 * 권한 흐름 최적화 권장사항
 */
export function getAuthorityOptimizationRecommendations(
  pageRanks: Map<string, number>,
  linkDepth: Map<string, number>,
  threshold: number = 30
): string[] {
  const recommendations: string[] = [];

  // 낮은 권한 페이지 식별
  const lowAuthorityPages = Array.from(pageRanks.entries())
    .filter(([_, rank]) => rank < threshold)
    .map(([url]) => url);

  if (lowAuthorityPages.length > 0) {
    recommendations.push(
      `🎯 ${lowAuthorityPages.length}개의 낮은 권한 페이지 발견`
    );
    recommendations.push(
      "💡 해결책: 홈페이지 또는 높은 권한 페이지에서 직접 링크하기"
    );
  }

  // 깊은 페이지 식별 (3+클릭)
  const deepPages = Array.from(linkDepth.entries())
    .filter(([_, depth]) => depth > 2)
    .map(([url, depth]) => ({ url, depth }));

  if (deepPages.length > 0) {
    recommendations.push(
      `⚠️ ${deepPages.length}개의 깊은 페이지 발견 (3+클릭)`
    );
    recommendations.push(
      "💡 해결책: 상위 레벨 페이지에서 관련 페이지로 직접 링크 추가"
    );
  }

  // 내부 링크 분산 제안
  const totalPages = pageRanks.size;
  const highAuthorityPages = Array.from(pageRanks.entries())
    .filter(([_, rank]) => rank > 70)
    .length;

  if (highAuthorityPages < totalPages * 0.2) {
    recommendations.push(
      `📊 높은 권한 페이지 부족 (${Math.round((highAuthorityPages / totalPages) * 100)}%)`
    );
    recommendations.push(
      "💡 해결책: 중요 페이지로 더 많은 내부 링크를 집중시키기"
    );
  }

  return recommendations;
}

/**
 * 고아(Orphaned) 페이지 감지
 * 들어오는 링크가 없는 페이지
 */
export function findOrphanedPages(
  allPages: Set<string>,
  linkGraph: Map<string, string[]>
): string[] {
  const linkedPages = new Set<string>();

  // 모든 outbound 링크 대상 수집
  linkGraph.forEach((targets) => {
    targets.forEach((target) => {
      linkedPages.add(target);
    });
  });

  // 연결된 적 없는 페이지 찾기
  const orphaned: string[] = [];
  allPages.forEach((page) => {
    if (!linkedPages.has(page)) {
      orphaned.push(page);
    }
  });

  return orphaned;
}

/**
 * 권한 흐름 시각화 데이터 생성
 */
export function generateAuthorityFlowVisualization(
  pageRanks: Map<string, number>,
  linkDepth: Map<string, number>
): Array<{
  page: string;
  rank: number;
  depth: number;
  thickness: number; // 링크 두께
}> {
  const visualization: Array<{
    page: string;
    rank: number;
    depth: number;
    thickness: number;
  }> = [];

  pageRanks.forEach((rank, url) => {
    const depth = linkDepth.get(url) || 0;
    const thickness = Math.ceil((rank / 100) * 5); // 1-5 두께

    visualization.push({
      page: url,
      rank,
      depth,
      thickness,
    });
  });

  // 권한으로 정렬 (내림차순)
  return visualization.sort((a, b) => b.rank - a.rank);
}

/**
 * 최적 내부 링크 구조 제안
 */
export function suggestOptimalLinkingStrategy(
  totalPages: number
): {
  homepageLinks: number;
  categoryLinks: number;
  relatedLinks: number;
  guidelines: string[];
} {
  let homepageLinks = 0;
  let categoryLinks = 0;
  let relatedLinks = 0;

  if (totalPages <= 10) {
    homepageLinks = 5;
    categoryLinks = 2;
    relatedLinks = 1;
  } else if (totalPages <= 50) {
    homepageLinks = 8;
    categoryLinks = 3;
    relatedLinks = 2;
  } else if (totalPages <= 100) {
    homepageLinks = 10;
    categoryLinks = 4;
    relatedLinks = 3;
  } else {
    homepageLinks = 15;
    categoryLinks = 5;
    relatedLinks = 4;
  }

  return {
    homepageLinks,
    categoryLinks,
    relatedLinks,
    guidelines: [
      "✅ 홈페이지는 가장 중요한 페이지로 가장 많은 링크 포함",
      "✅ 카테고리 페이지는 관련된 아이템 페이지로 링크",
      "✅ 각 페이지는 최소 1개, 최대 5개의 관련 페이지로 링크",
      "✅ 앵커 텍스트는 대상 페이지의 핵심 키워드 포함",
      "✅ nofollow 속성은 광고나 신뢰할 수 없는 페이지에만 사용",
    ],
  };
}

/**
 * 권한 흐름 리포트 생성
 */
export function generateAuthorityFlowReport(
  pageRanks: Map<string, number>,
  linkDepth: Map<string, number>,
  orphanedPages: string[]
): AuthorityFlowReport {
  const pages = Array.from(pageRanks.entries())
    .map(([url, rank]) => ({
      url,
      rank,
      depth: linkDepth.get(url) || 0,
    }));

  const averagePageRank =
    Array.from(pageRanks.values()).reduce((a, b) => a + b, 0) /
    pageRanks.size;

  const highAuthorityPages = pages
    .filter((p) => p.rank > 70)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 10);

  const lowAuthorityPages = pages
    .filter((p) => p.rank < 30)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);

  const recommendations = getAuthorityOptimizationRecommendations(
    pageRanks,
    linkDepth
  );

  return {
    totalPages: pageRanks.size,
    averagePageRank: Math.round(averagePageRank),
    highAuthorityPages: highAuthorityPages.map((p) => ({
      url: p.url,
      pageRank: p.rank,
      internalLinks: [],
      outboundLinks: [],
      linkJuice: p.rank,
      priority: "high",
    })),
    lowAuthorityPages: lowAuthorityPages.map((p) => ({
      url: p.url,
      pageRank: p.rank,
      internalLinks: [],
      outboundLinks: [],
      linkJuice: p.rank,
      priority: "low",
    })),
    orphanedPages,
    recommendations,
  };
}
