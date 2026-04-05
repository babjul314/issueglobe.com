/**
 * Phase 67: Competitor Analysis & Content Gap Identification
 * 경쟁사 분석으로 빠르게 성장할 수 있는 틈새 찾기
 */

export interface CompetitorMetrics {
  domain: string;
  rankingKeywords: number;
  top10Keywords: number;
  top3Keywords: number;
  estimatedTraffic: number;
  backlinks: number;
  referringDomains: number;
  contentCount: number;
  domainAuthority: number;
  pagespeedScore: number; // 0-100
}

export interface ContentGap {
  gapType: "keyword_missing" | "content_missing" | "thin_content" | "outdated" | "low_rank";
  opportunity: string; // e.g., "Competitor ranks #2 for 'AI trends', we're not in top 10"
  estimatedTraffic: number;
  difficulty: number; // 0-100: competition level
  priority: "critical" | "high" | "medium" | "low";
  actionRequired: string;
}

export interface CompetitorGapAnalysis {
  comparedAgainst: string;
  ourMetrics: CompetitorMetrics;
  competitorMetrics: CompetitorMetrics;
  gaps: ContentGap[];
  opportunities: Array<{
    keyword: string;
    gapReason: string;
    potentialRank: number;
    estimatedTraffic: number;
  }>;
  shortTermWins: Array<{
    keyword: string;
    effort: "low" | "medium" | "high";
    timeframe: string;
    expectedRank: number;
    rationale: string;
  }>;
}

/**
 * 경쟁사 메트릭 평가
 */
export function analyzeCompetitorMetrics(
  domain: string,
  data: {
    rankingKeywords: number;
    top10Keywords: number;
    top3Keywords: number;
    estimatedTraffic: number;
    backlinks: number;
    referringDomains: number;
    contentCount: number;
    domainAuthority: number;
  }
): CompetitorMetrics {
  // PageSpeed 시뮬레이션 (실제로는 PageSpeed API 필요)
  const pagespeedScore = Math.min(100, 60 + (data.domainAuthority / 100) * 40);

  return {
    domain,
    rankingKeywords: data.rankingKeywords,
    top10Keywords: data.top10Keywords,
    top3Keywords: data.top3Keywords,
    estimatedTraffic: data.estimatedTraffic,
    backlinks: data.backlinks,
    referringDomains: data.referringDomains,
    contentCount: data.contentCount,
    domainAuthority: data.domainAuthority,
    pagespeedScore: Math.round(pagespeedScore),
  };
}

/**
 * 콘텐츠 갭 식별
 */
export function identifyContentGaps(
  ourDomain: CompetitorMetrics,
  competitorDomain: CompetitorMetrics,
  competitorRankingKeywords: string[] // 경쟁사가 순위 중인 모든 키워드
): ContentGap[] {
  const gaps: ContentGap[] = [];

  // Gap 1: 우리가 순위하지 않는 경쟁사의 키워드
  const ourTopKeywords = new Set(
    competitorRankingKeywords.slice(0, ourDomain.rankingKeywords)
  );
  const competitorOnlyKeywords = competitorRankingKeywords.filter(
    (kw) => !ourTopKeywords.has(kw)
  );

  competitorOnlyKeywords.slice(0, 5).forEach((keyword) => {
    gaps.push({
      gapType: "keyword_missing",
      opportunity: `경쟁사가 '${keyword}'로 순위 중이지만 우리는 랭크 되지 않음`,
      estimatedTraffic: Math.floor(50 + Math.random() * 200),
      difficulty: 45,
      priority: "high",
      actionRequired: `콘텐츠 작성 또는 기존 콘텐츠 최적화 필요`,
    });
  });

  // Gap 2: 콘텐츠 수 차이
  if (competitorDomain.contentCount > ourDomain.contentCount * 1.5) {
    gaps.push({
      gapType: "content_missing",
      opportunity: `경쟁사는 ${competitorDomain.contentCount}개 콘텐츠 vs 우리는 ${ourDomain.contentCount}개`,
      estimatedTraffic: competitorDomain.estimatedTraffic * 0.3, // 30% 차이
      difficulty: 50,
      priority: "medium",
      actionRequired: `콘텐츠 확대: 매달 ${Math.round((competitorDomain.contentCount - ourDomain.contentCount) / 6)}개 추가`,
    });
  }

  // Gap 3: Backlink 차이
  if (competitorDomain.backlinks > ourDomain.backlinks * 2) {
    gaps.push({
      gapType: "keyword_missing",
      opportunity: `경쟁사: ${competitorDomain.backlinks} backlinks vs 우리: ${ourDomain.backlinks}`,
      estimatedTraffic: 0, // 직접 트래픽 영향 아님
      difficulty: 65,
      priority: "medium",
      actionRequired: `백링크 구축: 게스트 포스트, PR, 업계 파트너십`,
    });
  }

  // Gap 4: Page Speed
  if (competitorDomain.pagespeedScore > ourDomain.pagespeedScore + 10) {
    gaps.push({
      gapType: "outdated",
      opportunity: `경쟁사 Page Speed: ${competitorDomain.pagespeedScore}/100 vs 우리: ${ourDomain.pagespeedScore}/100`,
      estimatedTraffic: Math.floor(ourDomain.estimatedTraffic * 0.05), // 5% CTR 영향
      difficulty: 40,
      priority: "high",
      actionRequired: `Core Web Vitals 최적화: LCP, FID, CLS 개선`,
    });
  }

  return gaps;
}

/**
 * 빠른 승리 기회 식별 (Quick Wins)
 */
export function identifyQuickWins(
  ourMetrics: CompetitorMetrics,
  competitorMetrics: CompetitorMetrics,
  ourCurrentRankings: Array<{ keyword: string; rank: number }>
): Array<{
  keyword: string;
  effort: "low" | "medium" | "high";
  timeframe: string;
  expectedRank: number;
  rationale: string;
}> {
  const quickWins: Array<{
    keyword: string;
    effort: "low" | "medium" | "high";
    timeframe: string;
    expectedRank: number;
    rationale: string;
  }> = [];

  // Quick Win 1: 현재 rank 4-10인 키워드를 top 3로 (적은 노력)
  const almostTop3 = ourCurrentRankings.filter((r) => r.rank > 3 && r.rank <= 10);
  almostTop3.slice(0, 3).forEach((item) => {
    quickWins.push({
      keyword: item.keyword,
      effort: "low",
      timeframe: "1-2주",
      expectedRank: 2,
      rationale: `현재 ${item.rank}위, 내부 링크 + 콘텐츠 신선도로 top 3 진입 가능`,
    });
  });

  // Quick Win 2: 경쟁사가 약한 부분 (DA 낮은 경쟁사)
  if (competitorMetrics.domainAuthority < 40) {
    quickWins.push({
      keyword: "우리의 Core Keyword",
      effort: "medium",
      timeframe: "2-4주",
      expectedRank: 1,
      rationale: `경쟁사 DA: ${competitorMetrics.domainAuthority} (낮음), 우리가 집중 투자 시 역전 가능`,
    });
  }

  return quickWins;
}

/**
 * 경쟁사 분석 리포트 생성
 */
export function generateCompetitorAnalysisReport(
  ourMetrics: CompetitorMetrics,
  competitorMetrics: CompetitorMetrics,
  gaps: ContentGap[],
  quickWins: Array<{ keyword: string; effort: "low" | "medium" | "high"; timeframe: string; expectedRank: number; rationale: string }>
): CompetitorGapAnalysis {
  const opportunities = gaps
    .filter((g) => g.gapType === "keyword_missing")
    .map((g) => ({
      keyword: g.opportunity.match(/'([^']+)'/)?.[1] || "Unknown",
      gapReason: g.opportunity,
      potentialRank: 5,
      estimatedTraffic: g.estimatedTraffic,
    }));

  return {
    comparedAgainst: competitorMetrics.domain,
    ourMetrics,
    competitorMetrics,
    gaps,
    opportunities: opportunities.slice(0, 10),
    shortTermWins: quickWins,
  };
}

/**
 * Competitor Analysis 체크리스트
 */
export function generateCompetitorAnalysisChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 67: Competitor Analysis & Gap Identification 체크리스트\n");

  checklist.push("### 경쟁사 선정");
  checklist.push("- [ ] Top 3 경쟁사 식별 (우리 core keyword 순위)");
  checklist.push("- [ ] 각 경쟁사의 메인 키워드 30+ 리스트업");
  checklist.push("- [ ] DA, PA, 백링크, 트래픽 기록");

  checklist.push("\n### 콘텐츠 갭 분석");
  checklist.push("- [ ] 경쟁사가 순위 중이지만 우리는 아닌 키워드 식별");
  checklist.push("- [ ] 각 갭 키워드의 예상 트래픽 계산");
  checklist.push("- [ ] 갭 채우기 비용 vs 기대 수익 평가");
  checklist.push("- [ ] Priority 순서 지정");

  checklist.push("\n### Quick Win 식별");
  checklist.push("- [ ] 우리가 rank 4-10인 키워드 (low effort)");
  checklist.push("- [ ] 경쟁사보다 우리 DA가 높은 경우 (rank 1 가능)");
  checklist.push("- [ ] 경쟁사 콘텐츠가 오래되고 업데이트 안 된 경우");
  checklist.push("- [ ] 경쟁사가 누락한 관련 주제");

  checklist.push("\n### 백링크 기회");
  checklist.push("- [ ] 경쟁사의 상위 백링크 소스 분석");
  checklist.push("- [ ] 우리가 접근 가능한 도메인 식별");
  checklist.push("- [ ] 게스트 포스트 / PR 기회 발굴");
  checklist.push("- [ ] Broken link 기회 찾기");

  checklist.push("\n### 콘텐츠 분석");
  checklist.push("- [ ] 경쟁사 Top 10 콘텐츠 검토");
  checklist.push("- [ ] 우리가 더 잘 할 수 있는 부분 식별");
  checklist.push("- [ ] 콘텐츠 깊이, 최신성, 구성 비교");
  checklist.push("- [ ] 우리가 추가할 수 있는 독창적 관점");

  checklist.push("\n### 기술 SEO");
  checklist.push("- [ ] 경쟁사 Core Web Vitals 점수");
  checklist.push("- [ ] Mobile optimization 비교");
  checklist.push("- [ ] Schema markup 비교");
  checklist.push("- [ ] 우리의 약점 식별");

  checklist.push("\n### 실행 계획");
  checklist.push("- [ ] Quick win 키워드 3-5개 선정");
  checklist.push("- [ ] 각 키워드별 작업 계획 수립");
  checklist.push("- [ ] Timeline: Week 1-2 = quick wins, Week 3-8 = major gaps");
  checklist.push("- [ ] 결과 측정: 2주 단위로 순위 추적");

  return checklist;
}

/**
 * Competitor Analysis 전략 가이드
 */
export function generateCompetitorAnalysisStrategy(): string[] {
  const strategy: string[] = [];

  strategy.push("## Phase 67: Competitor Analysis & Gap Identification 전략\n");

  strategy.push("### 왜 경쟁사 분석인가?");
  strategy.push("- 자신의 강점 파악 (우리가 경쟁사보다 나은 점)");
  strategy.push("- 시장 기회 발견 (빠르게 순위 올릴 수 있는 키워드)");
  strategy.push("- 낭비 방지 (우리가 이길 수 없는 전쟁 피하기)");
  strategy.push("- 우선순위 결정 (가장 수익성 높은 작업부터)");

  strategy.push("\n### 3가지 Gap Type");
  strategy.push("");
  strategy.push("1. **Keyword Gap** (우리는 없고 경쟁사는 있음)");
  strategy.push("   - 경쟁사의 키워드 상위 100개 → 우리의 상위 50개와 비교");
  strategy.push("   - 갭 키워드의 難度 & 트래픽 계산");
  strategy.push("   - 갭 채울 비용 vs 기대 수익 분석");
  strategy.push("");
  strategy.push("2. **Content Gap** (경쟁사는 상세, 우리는 박함)");
  strategy.push("   - 경쟁사 콘텐츠가 2배 이상 깊을 때");
  strategy.push("   - 스키마, 비주얼, 링크 등 구성 비교");
  strategy.push("   - 우리가 추가할 독창적 관점");
  strategy.push("");
  strategy.push("3. **Authority Gap** (경쟁사는 강하고 우리는 약할 때)");
  strategy.push("   - DA/PA 차이 (>10차이면 significant)");
  strategy.push("   - 백링크 프로필 분석");
  strategy.push("   - 우리가 접근 가능한 기회 찾기");

  strategy.push("\n### Quick Win 우선순위");
  strategy.push("");
  strategy.push("**Priority 1 (1주 내)**: Low hanging fruit");
  strategy.push("- 현재 rank 4-10 키워드 (top 3으로 push)");
  strategy.push("- 노력: 내부 링크 + 콘텐츠 신선도");
  strategy.push("- 기대: +100-500 월간 트래픽");
  strategy.push("");
  strategy.push("**Priority 2 (2-4주)**: Medium effort, high reward");
  strategy.push("- 경쟁사 DA < 우리 DA인 키워드");
  strategy.push("- 노력: 콘텐츠 작성 + 백링크 1-2개");
  strategy.push("- 기대: top 5 진입 (기존 콘텐츠 없으면 top 10도 가능)");
  strategy.push("");
  strategy.push("**Priority 3 (1-2개월)**: Long-term plays");
  strategy.push("- 높은 트래픽 + 높은 난제 키워드");
  strategy.push("- 노력: 가이드급 콘텐츠 + 백링크 3-5개");
  strategy.push("- 기대: top 5-10 (경쟁사보다 높을 수는 없을 가능성)");

  strategy.push("\n### 예상 효과");
  strategy.push("- Quick wins: +300-500 트래픽/월 (2-3주)");
  strategy.push("- Medium effort: +500-1000 트래픽/월 (1-2개월)");
  strategy.push("- Long-term: +1000+ 트래픽/월 (2-3개월)");
  strategy.push("- **전체**: 분석된 갭을 모두 채우면 +300-700% 트래픽");

  return strategy;
}
