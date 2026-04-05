/**
 * Phase 69: User Engagement & Behavior Signal Optimization
 * 사용자 행동 신호 강화로 Google의 만족도 지표 개선
 * (Bounce rate, Dwell time, Click-through rate, Pages per session)
 */

export interface UserEngagementMetrics {
  metric: "bounce_rate" | "avg_dwell_time" | "ctr" | "pages_per_session" | "return_visitor";
  current: number;
  target: number;
  impact: number; // SEO ranking impact 0-100
  recommendations: string[];
  expectedImprovement: string;
}

export interface BehaviorSignalScore {
  bounceRate: number; // %
  avgDwellTime: number; // seconds
  ctr: number; // %
  pagesPerSession: number;
  returnVisitorRate: number; // %
  overallEngagementScore: number; // 0-100
  estimatedRankingImprovement: number; // positions
}

export interface EngagementOptimizationPlan {
  currentEngagementScore: number; // 0-100
  targetScore: number;
  improvements: Array<{
    signal: string;
    currentState: string;
    targetState: string;
    expectedRankGain: string;
    implementation: string;
    timeframe: string;
  }>;
  priorityActions: string[];
  expectedTrafficGain: string;
}

/**
 * 사용자 행동 신호 분석
 */
export function analyzeEngagementMetrics(metrics: {
  bounceRate: number; // % (낮을수록 좋음)
  avgDwellTime: number; // seconds (높을수록 좋음)
  ctr: number; // % (높을수록 좋음)
  pagesPerSession: number; // (높을수록 좋음)
  returnVisitorRate: number; // % (높을수록 좋음)
}): UserEngagementMetrics[] {
  const signals: UserEngagementMetrics[] = [];

  // 1. Bounce Rate
  // 목표: <40% (good), 40-60% (needs), >60% (poor)
  let bounceStatus = metrics.bounceRate < 40 ? "good" : metrics.bounceRate < 60 ? "needs_improvement" : "poor";
  signals.push({
    metric: "bounce_rate",
    current: metrics.bounceRate,
    target: 40,
    impact: bounceStatus === "good" ? 0 : bounceStatus === "needs_improvement" ? 15 : 30,
    recommendations: [
      "✅ 제목 + 설명: 검색 의도와 정확히 매칭",
      "✅ 콘텐츠 구조: 명확한 목차 + 시각 자료",
      "✅ 첫 단락: 1-2초 내 가치 전달",
      "✅ Call-to-Action: 다음 스텝 명확히",
      "✅ 내부 링크: 관련 콘텐츠 제안",
    ],
    expectedImprovement: "Bounce rate 10-20% 감소",
  });

  // 2. Dwell Time (체류 시간)
  // 목표: >2분 (120초) (good), 1-2분 (needs), <1분 (poor)
  let dwellStatus = metrics.avgDwellTime > 120 ? "good" : metrics.avgDwellTime > 60 ? "needs_improvement" : "poor";
  signals.push({
    metric: "avg_dwell_time",
    current: metrics.avgDwellTime,
    target: 120,
    impact: dwellStatus === "good" ? 0 : dwellStatus === "needs_improvement" ? 20 : 35,
    recommendations: [
      "✅ 콘텐츠 깊이: 1,500+ words (충분한 정보)",
      "✅ 형식: 문단 + 리스트 + 테이블 + 이미지 혼합",
      "✅ 읽기 쉬움: 짧은 문장, 여백, 강조",
      "✅ 시각 자료: 인포그래픽, 비디오, 스크린샷",
      "✅ 신선성: 최근 데이터/통계 포함",
    ],
    expectedImprovement: "평균 체류 시간 30-60초 증가",
  });

  // 3. Click-Through Rate (CTR)
  // 목표: >5% (good), 3-5% (needs), <3% (poor)
  let ctrStatus = metrics.ctr > 5 ? "good" : metrics.ctr > 3 ? "needs_improvement" : "poor";
  signals.push({
    metric: "ctr",
    current: metrics.ctr,
    target: 5,
    impact: ctrStatus === "good" ? 0 : ctrStatus === "needs_improvement" ? 12 : 25,
    recommendations: [
      "✅ 제목: 호기심 자극 + 명확성",
      "✅ 메타 설명: 50-160자, CTA 포함",
      "✅ 의도 매칭: 검색어와 콘텐츠 일치",
      "✅ 스니펫 최적화: Featured Snippet 목표",
      "✅ A/B 테스트: 제목/설명 변형 테스트",
    ],
    expectedImprovement: "CTR 1-3% 증가",
  });

  // 4. Pages Per Session
  // 목표: >3 pages (good), 2-3 (needs), <2 (poor)
  let ppsStatus = metrics.pagesPerSession > 3 ? "good" : metrics.pagesPerSession > 2 ? "needs_improvement" : "poor";
  signals.push({
    metric: "pages_per_session",
    current: metrics.pagesPerSession,
    target: 3,
    impact: ppsStatus === "good" ? 0 : ppsStatus === "needs_improvement" ? 18 : 30,
    recommendations: [
      "✅ 내부 링크: 관련 콘텐츠 3-5개 (자연스럽게)",
      "✅ 링크 배치: 텍스트 내 + 사이드바 + 하단",
      "✅ Anchor text: 명확한 설명 (자연스러운)",
      "✅ 'Related posts': 콘텐츠 추천 섹션",
      "✅ User journey: 단계적 경로 설계",
    ],
    expectedImprovement: "Pages per session +0.5-1.0",
  });

  // 5. Return Visitor Rate
  // 목표: >30% (good), 15-30% (needs), <15% (poor)
  let returnStatus = metrics.returnVisitorRate > 30 ? "good" : metrics.returnVisitorRate > 15 ? "needs_improvement" : "poor";
  signals.push({
    metric: "return_visitor",
    current: metrics.returnVisitorRate,
    target: 30,
    impact: returnStatus === "good" ? 0 : returnStatus === "needs_improvement" ? 10 : 20,
    recommendations: [
      "✅ 이메일 뉴스레터: 신규 콘텐츠 구독",
      "✅ 앱/PWA: 모바일 재방문 용이",
      "✅ 푸시 알림: 새로운 트렌드 알림",
      "✅ 회원 프로그램: 로그인 인센티브",
      "✅ 브랜드 구축: 신뢰도 + 반복 방문 유도",
    ],
    expectedImprovement: "Return visitor +10-20%",
  });

  return signals;
}

/**
 * 종합 engagement 점수 계산
 */
export function calculateEngagementScore(signals: UserEngagementMetrics[]): BehaviorSignalScore {
  const bounceSignal = signals.find((s) => s.metric === "bounce_rate")!;
  const dwellSignal = signals.find((s) => s.metric === "avg_dwell_time")!;
  const ctrSignal = signals.find((s) => s.metric === "ctr")!;
  const ppsSignal = signals.find((s) => s.metric === "pages_per_session")!;
  const returnSignal = signals.find((s) => s.metric === "return_visitor")!;

  // 각 신호를 0-100 점수로 변환 (정규화)
  const bounceScore = Math.max(0, 100 - bounceSignal.current * 1.5); // 0-40% = 100, 60%+ = 10
  const dwellScore = Math.min(100, (dwellSignal.current / 180) * 100); // 180초 = 100
  const ctrScore = Math.min(100, (ctrSignal.current / 7) * 100); // 7% = 100
  const ppsScore = Math.min(100, (ppsSignal.current / 4) * 100); // 4 pages = 100
  const returnScore = Math.min(100, (returnSignal.current / 40) * 100); // 40% = 100

  // 종합 점수 (가중치: Dwell 30%, Bounce 25%, Pages 20%, CTR 15%, Return 10%)
  const overallEngagementScore = Math.round(
    dwellScore * 0.3 +
    bounceScore * 0.25 +
    ppsScore * 0.2 +
    ctrScore * 0.15 +
    returnScore * 0.1
  );

  // 순위 개선 예상: engagement score가 높을수록 더 많은 순위 개선
  const estimatedRankingImprovement = Math.round((overallEngagementScore / 100) * 15); // 최대 +15 positions

  return {
    bounceRate: Math.round(bounceSignal.current * 10) / 10,
    avgDwellTime: Math.round(dwellSignal.current),
    ctr: Math.round(ctrSignal.current * 10) / 10,
    pagesPerSession: Math.round(ppsSignal.current * 10) / 10,
    returnVisitorRate: Math.round(returnSignal.current * 10) / 10,
    overallEngagementScore,
    estimatedRankingImprovement,
  };
}

/**
 * User Engagement 최적화 계획 생성
 */
export function generateEngagementOptimizationPlan(signals: UserEngagementMetrics[]): EngagementOptimizationPlan {
  const currentEngagementScore = Math.round(
    signals.reduce((sum, s) => {
      if (s.impact === 0) return sum + 100;
      if (s.impact <= 15) return sum + 70;
      return sum + 40;
    }, 0) / signals.length
  );

  const improvements = signals
    .filter((s) => s.impact > 0)
    .map((signal) => {
      let timeframe = "2-4주";
      if (signal.metric === "ctr") timeframe = "1-2주"; // CTR 개선은 빠름
      if (signal.metric === "bounce_rate") timeframe = "3-6주"; // Bounce rate는 콘텐츠 개선 필요

      return {
        signal: signal.metric.replace(/_/g, " ").toUpperCase(),
        currentState: `${signal.current}${signal.metric === "bounce_rate" || signal.metric === "ctr" || signal.metric === "return_visitor" ? "%" : signal.metric === "avg_dwell_time" ? "s" : ""}`,
        targetState: `${signal.target}${signal.metric === "bounce_rate" || signal.metric === "ctr" || signal.metric === "return_visitor" ? "%" : signal.metric === "avg_dwell_time" ? "s" : ""}`,
        expectedRankGain: `+${Math.round(signal.impact / 2)}-${signal.impact} positions`,
        implementation: signal.recommendations.join(" → "),
        timeframe,
      };
    });

  const priorityActions = [
    "🎯 P1 (즉시): Bounce rate 감소 (제목 + 첫 단락 최적화)",
    "🎯 P2 (1-2주): CTR 개선 (메타 설명 + Featured Snippet)",
    "🎯 P3 (2-4주): Dwell time 증가 (콘텐츠 깊이 + 시각 자료)",
    "🎯 P4 (3-6주): Pages per session 증가 (내부 링크)",
    "🎯 P5 (지속): Return visitor 증가 (이메일 + 앱)",
  ];

  const totalImpact = signals.reduce((sum, s) => sum + s.impact, 0);
  const expectedTrafficGain = `+${Math.round(totalImpact / 10)}-${Math.round(totalImpact / 5)}% (모든 신호 개선 시)`;

  return {
    currentEngagementScore,
    targetScore: 85,
    improvements,
    priorityActions,
    expectedTrafficGain,
  };
}

/**
 * User Engagement 체크리스트
 */
export function generateEngagementChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 69: User Engagement & Behavior Signals 체크리스트\n");

  checklist.push("### Bounce Rate 감소 (<40%)");
  checklist.push("- [ ] 제목: 검색 의도와 정확히 매칭");
  checklist.push("- [ ] 첫 단락: 1-2초 내 가치 제시");
  checklist.push("- [ ] 목차: 명확한 구조 (H2, H3)");
  checklist.push("- [ ] 시각 자료: 첫 섹션 내 이미지 포함");

  checklist.push("\n### Dwell Time 증가 (>2분)");
  checklist.push("- [ ] 콘텐츠 깊이: 1,500+ words");
  checklist.push("- [ ] 형식: 문단 + 리스트 + 테이블 혼합");
  checklist.push("- [ ] 이미지: 주요 섹션마다 포함");
  checklist.push("- [ ] 신선성: 최근 데이터/통계");

  checklist.push("\n### CTR 개선 (>5%)");
  checklist.push("- [ ] 제목: 호기심 + 명확성");
  checklist.push("- [ ] 메타 설명: 50-160자, CTA 포함");
  checklist.push("- [ ] Featured Snippet 타겟");
  checklist.push("- [ ] A/B 테스트: 제목 변형");

  checklist.push("\n### Pages Per Session 증가 (>3)");
  checklist.push("- [ ] 내부 링크: 관련 콘텐츠 3-5개");
  checklist.push("- [ ] 링크 배치: 텍스트 + 사이드바 + 하단");
  checklist.push("- [ ] 'Related posts' 섹션 추가");
  checklist.push("- [ ] 사용자 여정 설계");

  checklist.push("\n### Return Visitor 증가 (>30%)");
  checklist.push("- [ ] 이메일 뉴스레터 구독 옵션");
  checklist.push("- [ ] 앱 또는 PWA 개발");
  checklist.push("- [ ] 푸시 알림 (새로운 콘텐츠)");
  checklist.push("- [ ] 브랜드 신호 강화");

  checklist.push("\n### 분석 & 모니터링");
  checklist.push("- [ ] Google Analytics: 주간 engagement 리뷰");
  checklist.push("- [ ] Bounce rate 추적 (목표: <40%)");
  checklist.push("- [ ] Avg session duration 추적 (목표: >2min)");
  checklist.push("- [ ] Pages/session 추적 (목표: >3)");

  return checklist;
}
