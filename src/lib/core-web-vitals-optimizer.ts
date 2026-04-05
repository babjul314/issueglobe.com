/**
 * Phase 68: Core Web Vitals & User Experience Optimization
 * Google의 페이지 경험 신호 최적화 (LCP, FID, CLS, TTFB, FCP)
 */

export interface CoreWebVitalMetrics {
  metric: "LCP" | "FID" | "CLS" | "TTFB" | "FCP";
  current: number;
  target: number;
  status: "good" | "needs_improvement" | "poor";
  impact: number; // SEO ranking impact 0-100
  recommendations: string[];
}

export interface WebVitalScore {
  lcp: number; // Largest Contentful Paint (sec)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift (score 0-1)
  ttfb: number; // Time to First Byte (ms)
  fcp: number; // First Contentful Paint (sec)
  pagespeedScore: number; // 0-100
  estimatedTrafficGain: number; // %
  implementationDifficulty: "low" | "medium" | "high";
}

export interface UXOptimizationPlan {
  currentScore: number; // 0-100
  targetScore: number;
  improvements: Array<{
    area: string;
    currentState: string;
    targetState: string;
    expectedGain: string;
    effort: "low" | "medium" | "high";
    timeframe: string;
  }>;
  criticalIssues: string[];
  expectedTrafficGain: string;
}

/**
 * Core Web Vitals 분석
 */
export function analyzeWebVitals(metrics: {
  lcp: number; // seconds
  fid: number; // milliseconds
  cls: number; // score 0-1
  ttfb: number; // milliseconds
  fcp: number; // seconds
}): CoreWebVitalMetrics[] {
  const vitals: CoreWebVitalMetrics[] = [];

  // 1. LCP (Largest Contentful Paint)
  // 목표: <2.5s (good), 2.5-4s (needs improvement), >4s (poor)
  let lcpStatus: "good" | "needs_improvement" | "poor" = "good";
  if (metrics.lcp > 4) lcpStatus = "poor";
  else if (metrics.lcp > 2.5) lcpStatus = "needs_improvement";

  vitals.push({
    metric: "LCP",
    current: metrics.lcp,
    target: 2.5,
    status: lcpStatus,
    impact: lcpStatus === "good" ? 0 : lcpStatus === "needs_improvement" ? 20 : 40,
    recommendations: [
      "✅ 이미지 최적화 (WebP, 적절한 크기)",
      "✅ Lazy loading 적용",
      "✅ Preload 중요 리소스",
      "✅ 서버 응답 시간 개선 (TTFB 최적화)",
      "✅ 불필요한 CSS/JS 제거",
    ],
  });

  // 2. FID (First Input Delay)
  // 목표: <100ms (good), 100-300ms (needs), >300ms (poor)
  let fidStatus: "good" | "needs_improvement" | "poor" = "good";
  if (metrics.fid > 300) fidStatus = "poor";
  else if (metrics.fid > 100) fidStatus = "needs_improvement";

  vitals.push({
    metric: "FID",
    current: metrics.fid,
    target: 100,
    status: fidStatus,
    impact: fidStatus === "good" ? 0 : fidStatus === "needs_improvement" ? 15 : 30,
    recommendations: [
      "✅ JavaScript 청크 분할 (Code splitting)",
      "✅ 메인 스레드 차단 작업 최소화",
      "✅ 인터랙티브 요소 성능 최적화",
      "✅ Web Workers 사용 (백그라운드 작업)",
      "✅ Request-based chunking",
    ],
  });

  // 3. CLS (Cumulative Layout Shift)
  // 목표: <0.1 (good), 0.1-0.25 (needs), >0.25 (poor)
  let clsStatus: "good" | "needs_improvement" | "poor" = "good";
  if (metrics.cls > 0.25) clsStatus = "poor";
  else if (metrics.cls > 0.1) clsStatus = "needs_improvement";

  vitals.push({
    metric: "CLS",
    current: metrics.cls,
    target: 0.1,
    status: clsStatus,
    impact: clsStatus === "good" ? 0 : clsStatus === "needs_improvement" ? 10 : 25,
    recommendations: [
      "✅ 이미지/비디오 크기 속성 설정",
      "✅ 폰트 최적화 (font-display: swap)",
      "✅ 광고/iframe 크기 사전 정의",
      "✅ 애니메이션 성능 개선",
      "✅ 레이아웃 변경 최소화",
    ],
  });

  // 4. TTFB (Time to First Byte)
  // 목표: <600ms (good), 600-1800ms (needs), >1800ms (poor)
  let ttfbStatus: "good" | "needs_improvement" | "poor" = "good";
  if (metrics.ttfb > 1800) ttfbStatus = "poor";
  else if (metrics.ttfb > 600) ttfbStatus = "needs_improvement";

  vitals.push({
    metric: "TTFB",
    current: metrics.ttfb,
    target: 600,
    status: ttfbStatus,
    impact: ttfbStatus === "good" ? 0 : ttfbStatus === "needs_improvement" ? 15 : 35,
    recommendations: [
      "✅ 서버 성능 개선 (더 빠른 호스팅, 캐싱)",
      "✅ CDN 사용 (Vercel Edge Network)",
      "✅ 데이터베이스 쿼리 최적화",
      "✅ ISR (Incremental Static Regeneration)",
      "✅ API 응답 시간 최적화",
    ],
  });

  // 5. FCP (First Contentful Paint)
  // 목표: <1.8s (good), 1.8-3s (needs), >3s (poor)
  let fcpStatus: "good" | "needs_improvement" | "poor" = "good";
  if (metrics.fcp > 3) fcpStatus = "poor";
  else if (metrics.fcp > 1.8) fcpStatus = "needs_improvement";

  vitals.push({
    metric: "FCP",
    current: metrics.fcp,
    target: 1.8,
    status: fcpStatus,
    impact: fcpStatus === "good" ? 0 : fcpStatus === "needs_improvement" ? 12 : 25,
    recommendations: [
      "✅ HTML 파싱 성능 개선",
      "✅ 중요 CSS 인라인화",
      "✅ 비동기 스크립트 로딩",
      "✅ 서버 응답 시간 개선",
      "✅ 렌더링 차단 리소스 제거",
    ],
  });

  return vitals;
}

/**
 * PageSpeed 종합 점수 계산
 */
export function calculatePagespeedScore(webVitals: CoreWebVitalMetrics[]): WebVitalScore {
  // 각 메트릭을 0-100 점수로 변환
  const lcpVital = webVitals.find((v) => v.metric === "LCP")!;
  const fidVital = webVitals.find((v) => v.metric === "FID")!;
  const clsVital = webVitals.find((v) => v.metric === "CLS")!;
  const ttfbVital = webVitals.find((v) => v.metric === "TTFB")!;
  const fcpVital = webVitals.find((v) => v.metric === "FCP")!;

  const lcpScore = Math.max(0, 100 - (lcpVital.current / 4) * 100);
  const fidScore = Math.max(0, 100 - (fidVital.current / 300) * 100);
  const clsScore = Math.max(0, 100 - (clsVital.current / 0.25) * 100);
  const ttfbScore = Math.max(0, 100 - (ttfbVital.current / 1800) * 100);
  const fcpScore = Math.max(0, 100 - (fcpVital.current / 3) * 100);

  // 가중치: 각 메트릭의 중요도
  const pagespeedScore = Math.round(
    lcpScore * 0.25 +
    fidScore * 0.15 +
    clsScore * 0.15 +
    ttfbScore * 0.3 +
    fcpScore * 0.15
  );

  // 트래픽 이득 추정: pagespeed > 85 = +0%, 70-85 = +10%, 50-70 = +20%, <50 = +40%
  let estimatedTrafficGain = 0;
  if (pagespeedScore < 50) estimatedTrafficGain = 40;
  else if (pagespeedScore < 70) estimatedTrafficGain = 20;
  else if (pagespeedScore < 85) estimatedTrafficGain = 10;

  // 구현 난도
  const poorMetrics = webVitals.filter((v) => v.status === "poor").length;
  let implementationDifficulty: "low" | "medium" | "high" = "low";
  if (poorMetrics >= 3) implementationDifficulty = "high";
  else if (poorMetrics >= 2) implementationDifficulty = "medium";

  return {
    lcp: Math.round(lcpVital.current * 100) / 100,
    fid: Math.round(fidVital.current),
    cls: Math.round(clsVital.current * 1000) / 1000,
    ttfb: Math.round(ttfbVital.current),
    fcp: Math.round(fcpVital.current * 100) / 100,
    pagespeedScore,
    estimatedTrafficGain,
    implementationDifficulty,
  };
}

/**
 * UX 최적화 계획 생성
 */
export function generateUXOptimizationPlan(webVitals: CoreWebVitalMetrics[]): UXOptimizationPlan {
  const currentScore = Math.round(
    webVitals.reduce((sum, v) => {
      if (v.status === "good") return sum + 100;
      if (v.status === "needs_improvement") return sum + 50;
      return sum + 20;
    }, 0) / webVitals.length
  );

  const improvements = webVitals
    .filter((v) => v.status !== "good")
    .map((vital) => {
      let effort: "low" | "medium" | "high" = "medium";
      let timeframe = "2-3주";

      if (vital.metric === "CLS") {
        effort = "low";
        timeframe = "1-2주";
      } else if (vital.metric === "TTFB") {
        effort = "high";
        timeframe = "2-4주";
      }

      return {
        area: vital.metric,
        currentState: `${vital.current}${vital.metric === "CLS" ? "" : vital.metric === "FID" ? "ms" : vital.metric === "TTFB" || vital.metric === "FCP" ? "s" : ""}`,
        targetState: `${vital.target}${vital.metric === "CLS" ? "" : vital.metric === "FID" ? "ms" : vital.metric === "TTFB" || vital.metric === "FCP" ? "s" : ""}`,
        expectedGain: `+${vital.impact}% ranking boost 잠재력`,
        effort,
        timeframe,
      };
    });

  const criticalIssues = webVitals
    .filter((v) => v.status === "poor")
    .map((v) => `🔴 ${v.metric}: ${v.current} (목표: ${v.target})`);

  const totalTrafficGain = webVitals.reduce((sum, v) => sum + v.impact, 0);
  const expectedTrafficGain = `+${Math.round(totalTrafficGain / 5)}-${Math.round(totalTrafficGain / 2)}% (모든 개선 완료 시)`;

  return {
    currentScore,
    targetScore: 90,
    improvements,
    criticalIssues,
    expectedTrafficGain,
  };
}

/**
 * Core Web Vitals 체크리스트
 */
export function generateWebVitalsChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 68: Core Web Vitals 최적화 체크리스트\n");

  checklist.push("### LCP (Largest Contentful Paint) <2.5s");
  checklist.push("- [ ] 이미지 최적화 (WebP, 적절한 크기)");
  checklist.push("- [ ] Lazy loading 적용 (이미지, iframe)");
  checklist.push("- [ ] 중요 리소스 preload");
  checklist.push("- [ ] 불필요한 CSS/JS 제거");
  checklist.push("- [ ] 서버 응답 시간 개선 (TTFB 최적화)");

  checklist.push("\n### FID (First Input Delay) <100ms");
  checklist.push("- [ ] JavaScript 청크 분할 (Code splitting)");
  checklist.push("- [ ] 메인 스레드 작업 분산");
  checklist.push("- [ ] 장시간 작업 분할 (Task breaking)");
  checklist.push("- [ ] Web Workers 사용");

  checklist.push("\n### CLS (Cumulative Layout Shift) <0.1");
  checklist.push("- [ ] 이미지/비디오 width/height 속성 설정");
  checklist.push("- [ ] 폰트 최적화 (font-display: swap)");
  checklist.push("- [ ] 광고/iframe 크기 사전 정의");
  checklist.push("- [ ] 애니메이션 성능 개선");

  checklist.push("\n### TTFB (Time to First Byte) <600ms");
  checklist.push("- [ ] CDN 사용 (Vercel Edge)");
  checklist.push("- [ ] ISR/캐싱 활용");
  checklist.push("- [ ] 데이터베이스 쿼리 최적화");
  checklist.push("- [ ] API 응답 시간 최적화");

  checklist.push("\n### FCP (First Contentful Paint) <1.8s");
  checklist.push("- [ ] 중요 CSS 인라인화");
  checklist.push("- [ ] 비동기 스크립트 로딩");
  checklist.push("- [ ] 렌더링 차단 리소스 제거");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] Google PageSpeed Insights 점수: 80+");
  checklist.push("- [ ] Lighthouse 점수: 85+");
  checklist.push("- [ ] Core Web Vitals 모두 'Good' 상태");
  checklist.push("- [ ] 주간 모니터링 (변동 감시)");

  return checklist;
}
