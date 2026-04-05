/**
 * 모바일 성능 최적화 & Core Web Vitals 개선
 * 모바일 우선 사용자 경험 및 페이지 속도 최적화
 */

export interface CoreWebVitalsMetrics {
  lcp: number; // Largest Contentful Paint (ms) - 2.5s = good
  fid: number; // First Input Delay (ms) - 100ms = good
  cls: number; // Cumulative Layout Shift (decimal) - 0.1 = good
  ttfb: number; // Time to First Byte (ms) - 800ms = good
  fcp: number; // First Contentful Paint (ms) - 1.8s = good
}

export interface MobileOptimizationMetrics {
  pageSize: number; // KB
  requestCount: number;
  jsSize: number; // KB
  cssSize: number; // KB
  imageCount: number;
  unoptimizedImages: number;
  cacheability: number; // %
  gzipSavings: number; // %
}

export interface PerformanceIssue {
  type: "critical" | "warning" | "info";
  metric: string;
  current: number;
  target: number;
  impact: string;
  solution: string;
  effort: "easy" | "medium" | "hard";
}

export interface OptimizationStrategy {
  strategy: string;
  expectedImprovement: number; // ms
  estimatedImpact: number; // % improvement
  timeframe: string;
  priority: "critical" | "high" | "medium" | "low";
  implementation: string[];
}

/**
 * Core Web Vitals 점수 계산
 */
export function calculateCWVScore(
  metrics: CoreWebVitalsMetrics
): {
  score: number;
  grade: string;
  details: Record<string, { status: string; score: number }>;
} {
  let totalScore = 0;

  // LCP 평가 (0-25점)
  let lcpScore = 0;
  if (metrics.lcp <= 2500) lcpScore = 25;
  else if (metrics.lcp <= 4000) lcpScore = 15;
  else lcpScore = 5;

  // FID 평가 (0-25점)
  let fidScore = 0;
  if (metrics.fid <= 100) fidScore = 25;
  else if (metrics.fid <= 300) fidScore = 15;
  else fidScore = 5;

  // CLS 평가 (0-25점)
  let clsScore = 0;
  if (metrics.cls <= 0.1) clsScore = 25;
  else if (metrics.cls <= 0.25) clsScore = 15;
  else clsScore = 5;

  // TTFB 평가 (0-12.5점)
  let ttfbScore = 0;
  if (metrics.ttfb <= 800) ttfbScore = 12.5;
  else if (metrics.ttfb <= 1500) ttfbScore = 8;
  else ttfbScore = 3;

  // FCP 평가 (0-12.5점)
  let fcpScore = 0;
  if (metrics.fcp <= 1800) fcpScore = 12.5;
  else if (metrics.fcp <= 3000) fcpScore = 8;
  else fcpScore = 3;

  totalScore = lcpScore + fidScore + clsScore + ttfbScore + fcpScore;

  let grade = "F";
  if (totalScore >= 90) grade = "A+";
  else if (totalScore >= 80) grade = "A";
  else if (totalScore >= 70) grade = "B";
  else if (totalScore >= 60) grade = "C";
  else if (totalScore >= 50) grade = "D";

  return {
    score: Math.round(totalScore),
    grade,
    details: {
      lcp: {
        status: lcpScore >= 20 ? "Good" : lcpScore >= 10 ? "Needs Work" : "Poor",
        score: Math.round(lcpScore),
      },
      fid: {
        status: fidScore >= 20 ? "Good" : fidScore >= 10 ? "Needs Work" : "Poor",
        score: Math.round(fidScore),
      },
      cls: {
        status: clsScore >= 20 ? "Good" : clsScore >= 10 ? "Needs Work" : "Poor",
        score: Math.round(clsScore),
      },
      ttfb: {
        status:
          ttfbScore >= 10 ? "Good" : ttfbScore >= 5 ? "Needs Work" : "Poor",
        score: Math.round(ttfbScore),
      },
      fcp: {
        status:
          fcpScore >= 10 ? "Good" : fcpScore >= 5 ? "Needs Work" : "Poor",
        score: Math.round(fcpScore),
      },
    },
  };
}

/**
 * 성능 문제 진단
 */
export function diagnosisPerformanceIssues(
  metrics: CoreWebVitalsMetrics,
  mobileMetrics: MobileOptimizationMetrics
): PerformanceIssue[] {
  const issues: PerformanceIssue[] = [];

  // LCP 진단
  if (metrics.lcp > 2500) {
    issues.push({
      type: metrics.lcp > 4000 ? "critical" : "warning",
      metric: "LCP (Largest Contentful Paint)",
      current: metrics.lcp,
      target: 2500,
      impact: "Slow page load affects bounce rate and SEO",
      solution:
        "Optimize image sizes, reduce JavaScript, implement lazy loading",
      effort: "medium",
    });
  }

  // FID 진단
  if (metrics.fid > 100) {
    issues.push({
      type: metrics.fid > 300 ? "critical" : "warning",
      metric: "FID (First Input Delay)",
      current: metrics.fid,
      target: 100,
      impact: "Poor interactivity frustrates users",
      solution: "Break up long JavaScript tasks, use web workers",
      effort: "hard",
    });
  }

  // CLS 진단
  if (metrics.cls > 0.1) {
    issues.push({
      type: metrics.cls > 0.25 ? "critical" : "warning",
      metric: "CLS (Cumulative Layout Shift)",
      current: metrics.cls,
      target: 0.1,
      impact: "Layout shifts create poor user experience",
      solution: "Reserve space for images, ads, and dynamic content",
      effort: "easy",
    });
  }

  // 페이지 크기 진단
  if (mobileMetrics.pageSize > 3000) {
    issues.push({
      type: mobileMetrics.pageSize > 5000 ? "critical" : "warning",
      metric: "Page Size",
      current: mobileMetrics.pageSize,
      target: 2000,
      impact: "Large pages slow down mobile loading",
      solution: "Compress images, remove unused CSS/JS, lazy load",
      effort: "medium",
    });
  }

  // 요청 수 진단
  if (mobileMetrics.requestCount > 50) {
    issues.push({
      type: "warning",
      metric: "Request Count",
      current: mobileMetrics.requestCount,
      target: 35,
      impact: "Many requests increase latency",
      solution: "Combine files, use sprite sheets, reduce external requests",
      effort: "medium",
    });
  }

  // 최적화되지 않은 이미지
  if (mobileMetrics.unoptimizedImages > 0) {
    issues.push({
      type: "warning",
      metric: "Unoptimized Images",
      current: mobileMetrics.unoptimizedImages,
      target: 0,
      impact: `${mobileMetrics.unoptimizedImages} images wasting bandwidth`,
      solution: "Convert to WebP, resize for device, use responsive images",
      effort: "easy",
    });
  }

  return issues.sort((a, b) => {
    const typeMap = { critical: 3, warning: 2, info: 1 };
    return typeMap[b.type] - typeMap[a.type];
  });
}

/**
 * 최적화 전략 추천
 */
export function recommendOptimizationStrategies(
  issues: PerformanceIssue[]
): OptimizationStrategy[] {
  const strategies: OptimizationStrategy[] = [
    {
      strategy: "Image Optimization",
      expectedImprovement: 500,
      estimatedImpact: 20,
      timeframe: "1-2 weeks",
      priority: "high",
      implementation: [
        "Convert images to WebP format",
        "Implement responsive images (srcset)",
        "Use lazy loading for below-fold images",
        "Compress all images with lossless compression",
      ],
    },
    {
      strategy: "Code Splitting & Tree Shaking",
      expectedImprovement: 300,
      estimatedImpact: 12,
      timeframe: "2-3 weeks",
      priority: "high",
      implementation: [
        "Split JavaScript bundles by route",
        "Remove unused CSS with PurgeCSS",
        "Minify and compress all assets",
        "Use dynamic imports for non-critical code",
      ],
    },
    {
      strategy: "Critical CSS Inlining",
      expectedImprovement: 200,
      estimatedImpact: 8,
      timeframe: "1 week",
      priority: "medium",
      implementation: [
        "Inline critical above-the-fold CSS",
        "Defer non-critical CSS",
        "Use CSS containment",
      ],
    },
    {
      strategy: "Server-Side Caching",
      expectedImprovement: 400,
      estimatedImpact: 15,
      timeframe: "1 week",
      priority: "high",
      implementation: [
        "Implement edge caching (Vercel, Cloudflare)",
        "Set proper cache headers",
        "Use browser caching for static assets",
        "Implement service worker caching",
      ],
    },
    {
      strategy: "Font Optimization",
      expectedImprovement: 150,
      estimatedImpact: 6,
      timeframe: "3-5 days",
      priority: "medium",
      implementation: [
        "Use system fonts or variable fonts",
        "Preload critical fonts",
        "Use font-display: swap",
        "Reduce font weights and styles",
      ],
    },
  ];

  return strategies.sort(
    (a, b) =>
      (b.estimatedImpact - a.estimatedImpact) ||
      (b.expectedImprovement - a.expectedImprovement)
  );
}

/**
 * 모바일 최적화 체크리스트
 */
export function generateMobileOptimizationChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 모바일 성능 & Core Web Vitals 체크리스트\n");

  checklist.push("### 측정 & 모니터링");
  checklist.push("- [ ] Google PageSpeed Insights 확인");
  checklist.push("- [ ] Core Web Vitals 데이터 수집");
  checklist.push("- [ ] Chrome DevTools Lighthouse 실행");
  checklist.push("- [ ] 모바일 기기에서 실제 테스트");

  checklist.push("\n### 이미지 최적화");
  checklist.push("- [ ] 모든 이미지를 WebP 변환");
  checklist.push("- [ ] Responsive Images (srcset) 구현");
  checklist.push("- [ ] Lazy Loading 적용");
  checklist.push("- [ ] 불필요한 이미지 제거");

  checklist.push("\n### 코드 최적화");
  checklist.push("- [ ] JavaScript 번들 크기 줄이기 (< 170KB)");
  checklist.push("- [ ] 불필요한 CSS 제거");
  checklist.push("- [ ] Critical CSS 인라인");
  checklist.push("- [ ] 장시간 작업 분리 (>50ms)");

  checklist.push("\n### 캐싱 & 네트워크");
  checklist.push("- [ ] 브라우저 캐시 헤더 설정");
  checklist.push("- [ ] CDN 활성화");
  checklist.push("- [ ] Gzip 압축 활성화");
  checklist.push("- [ ] Service Worker 구현");

  checklist.push("\n### 폰트 & 렌더링");
  checklist.push("- [ ] 시스템 폰트 또는 가변 폰트 사용");
  checklist.push("- [ ] 폰트-display: swap 설정");
  checklist.push("- [ ] 폰트 미리로드");
  checklist.push("- [ ] 레이아웃 시프트 방지 (CLS < 0.1)");

  return checklist;
}
