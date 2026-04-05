/**
 * 경쟁사 분석 & SEO 벤치마킹
 * 시장 위치 파악 및 개선 기회 식별
 */

export interface CompetitorProfile {
  domain: string;
  name: string;
  estimatedDA: number; // Domain Authority
  backlinks: number;
  topicalAuthority: number; // 주제별 권한도
  contentPages: number;
  monthlyTraffic: number; // 추정치
  mainKeywords: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface BenchmarkReport {
  yourMetric: number;
  competitorAverage: number;
  benchmark: number;
  gap: number;
  percentile: number;
  recommendation: string;
}

export interface CompetitiveGapAnalysis {
  metric: string;
  yourValue: number;
  competitorValue: number;
  gap: number;
  importance: "critical" | "high" | "medium" | "low";
  actionItems: string[];
}

/**
 * 트렌드 분석 분야의 주요 경쟁사
 */
export const MAJOR_COMPETITORS = [
  {
    domain: "trends.google.com",
    name: "Google Trends",
    estimatedDA: 100,
    mainKeywords: ["google trends", "trending searches", "search trends"],
  },
  {
    domain: "twitter.com/trends",
    name: "Twitter Trends",
    estimatedDA: 99,
    mainKeywords: ["twitter trends", "what is trending", "trending topics"],
  },
  {
    domain: "reddit.com/r/all",
    name: "Reddit Trending",
    estimatedDA: 96,
    mainKeywords: ["reddit trending", "viral topics", "trending now"],
  },
  {
    domain: "producthunt.com",
    name: "Product Hunt",
    estimatedDA: 88,
    mainKeywords: ["trending products", "product trends", "new trends"],
  },
  {
    domain: "hackernews.com",
    name: "Hacker News",
    estimatedDA: 87,
    mainKeywords: ["trending tech", "tech news", "hacker news trends"],
  },
];

/**
 * SEO 메트릭 벤치마킹
 */
export function benchmarkSEOMetrics(yourMetrics: {
  domainAuthority: number;
  backlinks: number;
  contentPages: number;
  monthlyTraffic: number;
  topicsRanking: number;
  keywordsRanking: number;
}): Record<string, BenchmarkReport> {
  // 경쟁사 평균값 (시뮬레이션)
  const competitorAverages = {
    domainAuthority: 62,
    backlinks: 245,
    contentPages: 520,
    monthlyTraffic: 85000,
    topicsRanking: 128,
    keywordsRanking: 5240,
  };

  const benchmarks: Record<string, BenchmarkReport> = {};

  // Domain Authority
  benchmarks.domainAuthority = {
    yourMetric: yourMetrics.domainAuthority,
    competitorAverage: competitorAverages.domainAuthority,
    benchmark: 75, // 목표값
    gap: yourMetrics.domainAuthority - competitorAverages.domainAuthority,
    percentile: Math.round((yourMetrics.domainAuthority / 100) * 100),
    recommendation:
      yourMetrics.domainAuthority < competitorAverages.domainAuthority
        ? "🔴 DA 개선 필요: 고품질 백링크 30+ 확보"
        : "✅ DA 경쟁력 있음",
  };

  // Backlinks
  benchmarks.backlinks = {
    yourMetric: yourMetrics.backlinks,
    competitorAverage: competitorAverages.backlinks,
    benchmark: 200,
    gap: yourMetrics.backlinks - competitorAverages.backlinks,
    percentile: Math.round((yourMetrics.backlinks / 300) * 100),
    recommendation:
      yourMetrics.backlinks < competitorAverages.backlinks
        ? `🟡 백링크 부족: ${competitorAverages.backlinks - yourMetrics.backlinks}개 추가 필요`
        : "✅ 백링크 수 양호",
  };

  // Content Pages
  benchmarks.contentPages = {
    yourMetric: yourMetrics.contentPages,
    competitorAverage: competitorAverages.contentPages,
    benchmark: 400,
    gap: yourMetrics.contentPages - competitorAverages.contentPages,
    percentile: Math.round((yourMetrics.contentPages / 600) * 100),
    recommendation:
      yourMetrics.contentPages < competitorAverages.contentPages
        ? `📝 콘텐츠 부족: ${competitorAverages.contentPages - yourMetrics.contentPages}개 페이지 추가`
        : "✅ 콘텐츠량 충분",
  };

  // Monthly Traffic
  benchmarks.monthlyTraffic = {
    yourMetric: yourMetrics.monthlyTraffic,
    competitorAverage: competitorAverages.monthlyTraffic,
    benchmark: 100000,
    gap: yourMetrics.monthlyTraffic - competitorAverages.monthlyTraffic,
    percentile: Math.round((yourMetrics.monthlyTraffic / 150000) * 100),
    recommendation:
      yourMetrics.monthlyTraffic < competitorAverages.monthlyTraffic
        ? "📊 트래픽 증가 필요: SEO 최적화 및 링크 빌딩"
        : "✅ 트래픽 경쟁력 있음",
  };

  // Topics Ranking
  benchmarks.topicsRanking = {
    yourMetric: yourMetrics.topicsRanking,
    competitorAverage: competitorAverages.topicsRanking,
    benchmark: 150,
    gap: yourMetrics.topicsRanking - competitorAverages.topicsRanking,
    percentile: Math.round((yourMetrics.topicsRanking / 200) * 100),
    recommendation:
      yourMetrics.topicsRanking < competitorAverages.topicsRanking
        ? `🎯 더 많은 주제로 순위 달성: ${competitorAverages.topicsRanking - yourMetrics.topicsRanking}개 주제 추가`
        : "✅ 주제 커버리지 양호",
  };

  // Keywords Ranking
  benchmarks.keywordsRanking = {
    yourMetric: yourMetrics.keywordsRanking,
    competitorAverage: competitorAverages.keywordsRanking,
    benchmark: 5000,
    gap: yourMetrics.keywordsRanking - competitorAverages.keywordsRanking,
    percentile: Math.round((yourMetrics.keywordsRanking / 7000) * 100),
    recommendation:
      yourMetrics.keywordsRanking < competitorAverages.keywordsRanking
        ? "🔍 키워드 순위 증가 필요"
        : "✅ 키워드 순위 경쟁력 있음",
  };

  return benchmarks;
}

/**
 * 경쟁사 약점 식별
 */
export function identifyCompetitorWeaknesses(
  competitors: CompetitorProfile[]
): Array<{
  opportunity: string;
  advantage: string;
  difficulty: "easy" | "medium" | "hard";
  timeframe: string;
}> {
  const opportunities: Array<{
    opportunity: string;
    advantage: string;
    difficulty: "easy" | "medium" | "hard";
    timeframe: string;
  }> = [];

  // 콘텐츠 갭 분석
  const avgContentPages =
    competitors.reduce((sum, c) => sum + c.contentPages, 0) / competitors.length;
  const avgTraffic =
    competitors.reduce((sum, c) => sum + c.monthlyTraffic, 0) / competitors.length;

  if (avgContentPages < 300) {
    opportunities.push({
      opportunity: "콘텐츠 확장 기회",
      advantage: "경쟁사보다 더 포괄적인 가이드와 리소스 제공",
      difficulty: "medium",
      timeframe: "3개월",
    });
  }

  // 로컬 & 다국어 갭
  opportunities.push({
    opportunity: "다국어 시장 확대",
    advantage: "8개 언어 지원으로 글로벌 시장 장악",
    difficulty: "medium",
    timeframe: "2개월",
  });

  // 기술 특화
  opportunities.push({
    opportunity: "AI 기반 분석",
    advantage: "자동 트렌드 예측 및 분석 기능 제공",
    difficulty: "hard",
    timeframe: "6개월",
  });

  // 사용자 경험
  opportunities.push({
    opportunity: "모바일 우선 설계",
    advantage: "완벽한 모바일 최적화로 경쟁력 확보",
    difficulty: "easy",
    timeframe: "1개월",
  });

  // 실시간성
  opportunities.push({
    opportunity: "하이퍼 리얼타임 업데이트",
    advantage: "10분 단위 수동 업데이트로 최신성 확보",
    difficulty: "medium",
    timeframe: "2개월",
  });

  return opportunities;
}

/**
 * 경쟁 포지셔닝 맵 생성
 */
export function generateCompetitivePositioningMap(
  yourMetrics: { da: number; traffic: number; contentPages: number },
  competitors: CompetitorProfile[]
): {
  positioning: string;
  marketShare: number;
  competitiveAdvantage: string[];
  strategies: string[];
} {
  const avgDA = competitors.reduce((sum, c) => sum + c.estimatedDA, 0) / competitors.length;
  const avgTraffic =
    competitors.reduce((sum, c) => sum + c.monthlyTraffic, 0) / competitors.length;

  let positioning = "";
  let marketShare = 0;

  if (yourMetrics.da > avgDA && yourMetrics.traffic > avgTraffic) {
    positioning = "Market Leader";
    marketShare = 35;
  } else if (yourMetrics.da > avgDA || yourMetrics.traffic > avgTraffic) {
    positioning = "Strong Challenger";
    marketShare = 25;
  } else if (yourMetrics.da > avgDA * 0.7) {
    positioning = "Emerging Competitor";
    marketShare = 15;
  } else {
    positioning = "New Entrant";
    marketShare = 5;
  }

  const competitiveAdvantage = [];
  if (yourMetrics.contentPages > competitors[0].contentPages) {
    competitiveAdvantage.push("가장 포괄적인 콘텐츠");
  }
  if (yourMetrics.traffic > avgTraffic) {
    competitiveAdvantage.push("높은 사용자 참여");
  }
  competitiveAdvantage.push("다국어 지원");
  competitiveAdvantage.push("리얼타임 업데이트");

  const strategies = [];
  strategies.push("1. 백링크 빌딩으로 DA 30 이상 달성");
  strategies.push("2. 장기 꼬리 키워드 콘텐츠 작성");
  strategies.push("3. 브랜드 인식도 증가 (PR, 게스트 포스트)");
  strategies.push("4. 사용자 경험 최적화로 참여도 증가");

  return {
    positioning,
    marketShare,
    competitiveAdvantage,
    strategies,
  };
}

/**
 * 경쟁 갭 분석 (상세)
 */
export function performCompetitiveGapAnalysis(
  yourMetrics: Record<string, number>,
  competitorMetrics: Record<string, number>
): CompetitiveGapAnalysis[] {
  const gaps: CompetitiveGapAnalysis[] = [];

  Object.keys(yourMetrics).forEach((metric) => {
    const your = yourMetrics[metric];
    const competitor = competitorMetrics[metric] || 0;
    const gap = your - competitor;

    let importance: "critical" | "high" | "medium" | "low" = "medium";
    if (metric.includes("backlink") || metric.includes("authority")) {
      importance = "critical";
    } else if (metric.includes("content") || metric.includes("traffic")) {
      importance = "high";
    }

    const actionItems: string[] = [];

    if (gap < 0) {
      if (importance === "critical") {
        actionItems.push(
          `❌ ${Math.abs(gap)}개 부족 - 즉시 개선 필요`
        );
      } else if (importance === "high") {
        actionItems.push(`⚠️ ${Math.abs(gap)}개 부족 - 30일 이내 개선`);
      } else {
        actionItems.push(`📝 ${Math.abs(gap)}개 부족 - 90일 이내 개선`);
      }
    } else if (gap > 0) {
      actionItems.push(`✅ ${gap}개 우수 - 현 상태 유지 및 강화`);
    }

    gaps.push({
      metric,
      yourValue: your,
      competitorValue: competitor,
      gap,
      importance,
      actionItems,
    });
  });

  return gaps.sort((a, b) => {
    const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return importanceOrder[a.importance] - importanceOrder[b.importance];
  });
}

/**
 * 월별 경쟁 모니터링 체크리스트
 */
export function generateCompetitiveMonitoringChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 월별 경쟁사 분석 & 모니터링 체크리스트\n");

  checklist.push("### 주(Week) 1");
  checklist.push("- [ ] 경쟁사 DA, 백링크 수 추적");
  checklist.push("- [ ] 경쟁사 새로운 콘텐츠 분석");
  checklist.push("- [ ] 키워드 순위 변화 모니터링");

  checklist.push("\n### 주(Week) 2");
  checklist.push("- [ ] 경쟁사 백링크 분석 (새로운 링크)");
  checklist.push("- [ ] 콘텐츠 갭 식별");
  checklist.push("- [ ] 시장 기회 발굴");

  checklist.push("\n### 주(Week) 3");
  checklist.push("- [ ] 경쟁 포지셔닝 맵 업데이트");
  checklist.push("- [ ] 약점 기반 전략 수립");
  checklist.push("- [ ] 우리의 강점 강화 계획");

  checklist.push("\n### 주(Week) 4");
  checklist.push("- [ ] 월간 경쟁 리포트 작성");
  checklist.push("- [ ] 다음 달 전략 수정");
  checklist.push("- [ ] 벤치마킹 지표 업데이트");

  return checklist;
}
