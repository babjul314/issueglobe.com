/**
 * Phase 60: Crawl Budget Optimizer
 * Google의 크롤 예산을 최대한 효율적으로 사용해 중요한 페이지를 더 자주 크롤링하도록 유도
 */

export interface CrawlBudgetMetrics {
  pageUrl: string;
  crawlFrequency: number; // times per week
  priority: "critical" | "high" | "medium" | "low";
  estimatedCrawlBudget: number; // % of total budget
  recommendedActions: string[];
}

export interface CrawlOptimizationStrategy {
  criticalPages: CrawlBudgetMetrics[];
  orphanedPages: CrawlBudgetMetrics[];
  redirectChains: Array<{ chain: string[]; depth: number }>;
  recommendations: string[];
}

export interface EntityExpansionData {
  entityName: string;
  entityType: "trend" | "location" | "person" | "organization" | "event";
  relatedEntities: string[];
  semanticCluster: string[];
  confidenceScore: number; // 0-100
  schemaMarkupRequired: string[];
}

/**
 * 크롤 빈도 최적화
 * 페이지의 중요도, 변경 빈도, 트래픽에 따라 크롤 빈도 예측
 */
export function optimizeCrawlFrequency(pageData: {
  url: string;
  lastModified: string;
  traffic: number;
  backlinks: number;
  updateFrequency: "hourly" | "daily" | "weekly" | "monthly";
}): CrawlBudgetMetrics {
  const now = new Date();
  const lastMod = new Date(pageData.lastModified);
  const daysSinceUpdate = (now.getTime() - lastMod.getTime()) / (1000 * 60 * 60 * 24);

  // Priority 결정
  let priority: "critical" | "high" | "medium" | "low" = "medium";

  if (pageData.traffic > 10000 || pageData.backlinks > 20 || daysSinceUpdate < 1) {
    priority = "critical";
  } else if (pageData.traffic > 1000 || pageData.backlinks > 10) {
    priority = "high";
  } else if (pageData.traffic > 100) {
    priority = "medium";
  } else {
    priority = "low";
  }

  // 크롤 빈도 계산 (주당 몇 번)
  const updateFrequencyScore = {
    hourly: 7,
    daily: 5,
    weekly: 2,
    monthly: 0.5,
  };

  const trafficBoost = Math.min(14, pageData.traffic / 1000); // 최대 +14
  const backlinkBoost = Math.min(7, pageData.backlinks / 5); // 최대 +7

  const crawlFrequency =
    updateFrequencyScore[pageData.updateFrequency] + trafficBoost + backlinkBoost;

  // 예상 크롤 예산 (%)
  const estimatedCrawlBudget = priority === "critical" ? 15 : priority === "high" ? 8 : priority === "medium" ? 4 : 1;

  // 권장 액션
  const recommendedActions: string[] = [];

  if (daysSinceUpdate > 30) {
    recommendedActions.push("📝 콘텐츠 업데이트 필요 (30일 이상 미수정)");
  }
  if (pageData.traffic < 10) {
    recommendedActions.push("🔗 내부 링크 강화 (트래픽 부족)");
  }
  if (pageData.backlinks < 2 && priority !== "low") {
    recommendedActions.push("⛓️ 백링크 구축 필요");
  }
  if (crawlFrequency < 1) {
    recommendedActions.push("🚨 크롤 빈도 매우 낮음: 홈페이지에서 링크 추가");
  }

  return {
    pageUrl: pageData.url,
    crawlFrequency: Math.round(crawlFrequency * 10) / 10,
    priority,
    estimatedCrawlBudget,
    recommendedActions,
  };
}

/**
 * 리다이렉트 체인 감지 및 최적화
 * 리다이렉트 체인이 깊을수록 크롤 비용 증가 → 평탄화 필요
 */
export function detectRedirectChains(
  redirectMap: Array<{ from: string; to: string }>
): Array<{ chain: string[]; depth: number; recommendation: string }> {
  const chains: Array<{ chain: string[]; depth: number; recommendation: string }> = [];

  // 체인 감지 (최대 5단계)
  redirectMap.forEach((redirect) => {
    const chain: string[] = [redirect.from];
    let current = redirect.to;
    let depth = 1;

    while (depth < 5) {
      chain.push(current);
      const next = redirectMap.find((r) => r.from === current)?.to;
      if (!next || next === current) break;
      current = next;
      depth++;
    }

    if (depth > 1) {
      chains.push({
        chain,
        depth,
        recommendation:
          depth > 2
            ? `🚨 Critical: ${depth}단계 리다이렉트. 직접 ${chain[0]} → ${chain[chain.length - 1]}로 수정`
            : `⚠️ ${depth}단계 리다이렉트 감지. 평탄화 권장`,
      });
    }
  });

  return chains;
}

/**
 * 고아 페이지 감지 및 크롤 예산 할당
 * 내부 링크가 거의 없는 페이지는 크롤봇이 찾기 어려움
 */
export function identifyOrphanedPages(
  allPages: Array<{
    url: string;
    incomingInternalLinks: number;
    traffic: number;
    priority: "critical" | "high" | "medium" | "low";
  }>
): Array<{
  url: string;
  orphanRisk: "critical" | "high" | "medium";
  suggestedLinks: number;
  expectedCrawlImpact: string;
}> {
  return allPages
    .filter((page) => page.incomingInternalLinks < 2)
    .map((page) => {
      let orphanRisk: "critical" | "high" | "medium" = "medium";

      if (page.traffic > 100 && page.incomingInternalLinks === 0) {
        orphanRisk = "critical";
      } else if (page.incomingInternalLinks === 0 || (page.traffic > 50 && page.incomingInternalLinks < 1)) {
        orphanRisk = "high";
      }

      const suggestedLinks = orphanRisk === "critical" ? 3 : orphanRisk === "high" ? 2 : 1;

      return {
        url: page.url,
        orphanRisk,
        suggestedLinks,
        expectedCrawlImpact:
          orphanRisk === "critical"
            ? "📈 +50-100% 크롤 빈도 증가"
            : orphanRisk === "high"
              ? "📈 +20-50% 크롤 빈도 증가"
              : "📈 +10-20% 크롤 빈도 증가",
      };
    })
    .sort((a, b) => {
      const riskOrder = { critical: 3, high: 2, medium: 1 };
      return riskOrder[b.orphanRisk] - riskOrder[a.orphanRisk];
    });
}

/**
 * 엔티티 확장 (Entity Expansion)
 * 트렌드를 더 큰 의미의 엔티티와 연결해 의미론적 범위 확대
 */
export function expandEntitySemantics(
  trendKeyword: string,
  countryCode: string
): EntityExpansionData {
  // 예시: "AI" → ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Neural Networks", "LLM"]
  const semanticExpansions: Record<string, string[]> = {
    AI: ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Neural Networks", "LLM", "AI Safety"],
    crypto: [
      "Cryptocurrency",
      "Blockchain",
      "Bitcoin",
      "Ethereum",
      "DeFi",
      "Web3",
      "Digital Currency",
    ],
    election: ["Politics", "Government", "Voting", "Campaign", "Democracy", "Political Party"],
    sports: ["Athletics", "Competition", "Tournament", "Championship", "Team", "League"],
    tech: [
      "Technology",
      "Software",
      "Hardware",
      "Innovation",
      "Digital",
      "Startup",
      "Gadget",
    ],
    health: ["Healthcare", "Medicine", "Wellness", "Disease", "Treatment", "Medical Research"],
  };

  // 키워드 매칭
  let semanticCluster: string[] = [];
  const lowerKeyword = trendKeyword.toLowerCase();

  for (const [key, expansions] of Object.entries(semanticExpansions)) {
    if (lowerKeyword.includes(key)) {
      semanticCluster = expansions;
      break;
    }
  }

  // Confidence score 계산 (매칭 정확도)
  const confidenceScore = semanticCluster.length > 0 ? 85 : 50;

  // 필요한 Schema markup
  const schemaMarkupRequired = [
    "Thing", // Base
    "CreativeWork", // Content
    "Article", // Article type
    "NewsArticle", // Timely content
  ];

  if (countryCode) {
    schemaMarkupRequired.push("LocalBusiness");
  }

  return {
    entityName: trendKeyword,
    entityType: "trend",
    relatedEntities: semanticCluster,
    semanticCluster,
    confidenceScore,
    schemaMarkupRequired,
  };
}

/**
 * 크롤 예산 할당 전략
 */
export function generateCrawlBudgetStrategy(pages: Array<{
  url: string;
  lastModified: string;
  traffic: number;
  backlinks: number;
  updateFrequency: "hourly" | "daily" | "weekly" | "monthly";
  incomingInternalLinks: number;
}>): CrawlOptimizationStrategy {
  // 크롤 빈도 최적화
  const optimizedPages = pages.map((p) =>
    optimizeCrawlFrequency({
      url: p.url,
      lastModified: p.lastModified,
      traffic: p.traffic,
      backlinks: p.backlinks,
      updateFrequency: p.updateFrequency,
    })
  );

  // Critical & High priority pages
  const criticalPages = optimizedPages.filter((p) =>
    ["critical", "high"].includes(p.priority)
  );

  // Orphaned pages
  const orphanedPages = optimizedPages.filter(
    (p) => pages.find((orig) => orig.url === p.pageUrl)?.incomingInternalLinks === 0
  );

  // 권장사항 생성
  const recommendations: string[] = [];

  if (orphanedPages.length > 0) {
    recommendations.push(
      `🚨 고아 페이지 ${orphanedPages.length}개 감지: 내부 링크 추가로 크롤 가능성 향상`
    );
  }

  recommendations.push(
    "✅ Critical/High 페이지: robots.txt에서 crawl-delay 최소화 (또는 제거)"
  );
  recommendations.push(
    "✅ 자주 변경되는 페이지 (hourly/daily): sitemap.xml에서 priority=0.9, changefreq=daily"
  );
  recommendations.push(
    "✅ Medium/Low 페이지: priority=0.5, changefreq=monthly로 설정해 봇 비용 절감"
  );
  recommendations.push(
    "✅ 홈페이지 → Critical 페이지 (상위 5-10개) → Medium 페이지 계층적 링크 구조"
  );
  recommendations.push(
    "✅ 월 1회 크롤 예산 리포트 생성: Google Search Console 'Crawl stats' 확인"
  );

  return {
    criticalPages,
    orphanedPages,
    redirectChains: detectRedirectChains([]), // 실제로는 redirect map이 필요
    recommendations,
  };
}

/**
 * 크롤 예산 최적화 체크리스트
 */
export function generateCrawlBudgetChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 60: 크롤 예산 최적화 체크리스트\n");

  checklist.push("### 크롤 빈도 최적화");
  checklist.push("- [ ] Google Search Console 'Crawl stats' 확인");
  checklist.push("- [ ] Critical 페이지: 일일 크롤 빈도 1회 이상");
  checklist.push("- [ ] High 페이지: 주 3-5회 크롤");
  checklist.push("- [ ] Medium 페이지: 주 1-2회 크롤");
  checklist.push("- [ ] 불필요한 페이지: robots.txt 또는 meta robots=noindex로 차단");

  checklist.push("\n### 리다이렉트 체인 제거");
  checklist.push("- [ ] 3단계 이상 리다이렉트 감지 및 평탄화");
  checklist.push("- [ ] 301 리다이렉트 모니터링 (301 → 302는 안 함)");
  checklist.push("- [ ] 리다이렉트 체인 깊이 < 2 유지");

  checklist.push("\n### 고아 페이지 처리");
  checklist.push("- [ ] 고아 페이지 0개 목표");
  checklist.push("- [ ] Critical 고아 페이지: 즉시 내부 링크 추가");
  checklist.push("- [ ] High 고아 페이지: 홈/상위 카테고리에서 링크");
  checklist.push("- [ ] Medium 고아 페이지: 관련 페이지에서 링크");

  checklist.push("\n### Sitemap & Robots.txt 최적화");
  checklist.push("- [ ] Primary sitemap: Critical + High 페이지만 포함 (최대 50K URLs)");
  checklist.push("- [ ] Secondary sitemap: Medium + Low 페이지");
  checklist.push("- [ ] Crawl-delay 설정 안 함 (불필요");
  checklist.push("- [ ] User-agent: Googlebot에 특별 규칙 없음");
  checklist.push("- [ ] Disallow: 낮은 가치 페이지만 차단 (파라미터 페이지 등)");

  checklist.push("\n### 엔티티 확장");
  checklist.push("- [ ] 주요 트렌드에 대한 의미론적 클러스터 생성");
  checklist.push("- [ ] 엔티티별 Schema markup (Thing, CreativeWork, Article, NewsArticle)");
  checklist.push("- [ ] 관련 엔티티 연결: internal linking으로 의미론적 밀도 증가");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] 주간 크롤 통계 리뷰");
  checklist.push("- [ ] 크롤 오류 (404, 5xx) 0개 목표");
  checklist.push("- [ ] Crawl budget 효율: Critical 페이지 >50% 크롤 할당");

  return checklist;
}
