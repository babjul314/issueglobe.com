/**
 * Core Web Vitals 모니터링 & 최적화
 * Google의 최신 순위 신호 추적
 */

export interface WebVitalMetric {
  name: string;
  value: number;
  unit: string;
  rating: "good" | "needs improvement" | "poor";
  threshold: {
    good: number;
    needsImprovement: number;
  };
}

export interface CoreWebVitalsReport {
  timestamp: string;
  lcp: WebVitalMetric; // Largest Contentful Paint
  fid: WebVitalMetric; // First Input Delay
  cls: WebVitalMetric; // Cumulative Layout Shift
  ttfb: WebVitalMetric; // Time to First Byte
  fcp: WebVitalMetric; // First Contentful Paint
  overallScore: number;
  recommendations: string[];
}

/**
 * Core Web Vitals 임계값 정의
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    good: 2500, // 2.5초
    needsImprovement: 4000, // 4초
  },
  FID: {
    good: 100, // 100ms
    needsImprovement: 300, // 300ms
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  TTFB: {
    good: 800, // 800ms
    needsImprovement: 1800, // 1.8초
  },
  FCP: {
    good: 1800, // 1.8초
    needsImprovement: 3000, // 3초
  },
};

/**
 * 메트릭 값을 등급으로 변환
 */
export function rateMetric(
  value: number,
  thresholds: { good: number; needsImprovement: number }
): "good" | "needs improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.needsImprovement) return "needs improvement";
  return "poor";
}

/**
 * LCP (Largest Contentful Paint) 최적화 권장사항
 */
export function getLCPRecommendations(lcpValue: number): string[] {
  const recommendations: string[] = [];

  if (lcpValue > WEB_VITALS_THRESHOLDS.LCP.needsImprovement) {
    recommendations.push(
      "🎯 LCP 최적화: 이미지 지연 로딩 확인 (lazy loading)"
    );
    recommendations.push(
      "🎯 LCP 최적화: 큰 JavaScript 번들 code splitting으로 축소"
    );
    recommendations.push("🎯 LCP 최적화: CSS-in-JS 라이브러리 성능 검토");
    recommendations.push("🎯 LCP 최적화: 서드파티 스크립트 비동기 로딩");
  } else if (lcpValue > WEB_VITALS_THRESHOLDS.LCP.good) {
    recommendations.push(
      "⚠️ LCP 개선: 이미지 최적화 (WebP, 적절한 크기)"
    );
    recommendations.push("⚠️ LCP 개선: 폰트 로딩 최적화 (font-display)");
  }

  return recommendations;
}

/**
 * FID (First Input Delay) 최적화 권장사항
 */
export function getFIDRecommendations(fidValue: number): string[] {
  const recommendations: string[] = [];

  if (fidValue > WEB_VITALS_THRESHOLDS.FID.needsImprovement) {
    recommendations.push(
      "🎯 FID 최적화: 메인 스레드 작업 분산 (Web Workers)"
    );
    recommendations.push("🎯 FID 최적화: 장시간 작업을 더 작은 작업으로 분할");
    recommendations.push(
      "🎯 FID 최적화: React.useTransition 또는 debounce 사용"
    );
  } else if (fidValue > WEB_VITALS_THRESHOLDS.FID.good) {
    recommendations.push(
      "⚠️ FID 개선: JavaScript 실행 시간 프로파일링 및 최적화"
    );
    recommendations.push("⚠️ FID 개선: 무거운 계산 지연 또는 비동기 처리");
  }

  return recommendations;
}

/**
 * CLS (Cumulative Layout Shift) 최적화 권장사항
 */
export function getCLSRecommendations(clsValue: number): string[] {
  const recommendations: string[] = [];

  if (clsValue > WEB_VITALS_THRESHOLDS.CLS.needsImprovement) {
    recommendations.push("🎯 CLS 최적화: 이미지에 명시적 크기 지정 (width/height)");
    recommendations.push(
      "🎯 CLS 최적화: 동적 콘텐츠 공간 미리 확보 (height 지정)"
    );
    recommendations.push(
      "🎯 CLS 최적화: 광고/임베드 콘텐츠에 컨테이너 크기 설정"
    );
  } else if (clsValue > WEB_VITALS_THRESHOLDS.CLS.good) {
    recommendations.push(
      "⚠️ CLS 개선: 폰트 로드 완료 전 텍스트 레이아웃 시프트 확인"
    );
    recommendations.push(
      "⚠️ CLS 개선: 애니메이션 transform 사용 (position 변경 피하기)"
    );
  }

  return recommendations;
}

/**
 * TTFB (Time to First Byte) 최적화 권장사항
 */
export function getTTFBRecommendations(ttfbValue: number): string[] {
  const recommendations: string[] = [];

  if (ttfbValue > WEB_VITALS_THRESHOLDS.TTFB.needsImprovement) {
    recommendations.push(
      "🎯 TTFB 최적화: 서버 응답 시간 개선 (DB 쿼리 최적화)"
    );
    recommendations.push("🎯 TTFB 최적화: CDN 사용 확인 (Vercel Edge Network)");
    recommendations.push("🎯 TTFB 최적화: 서버 캐싱 전략 검토");
  } else if (ttfbValue > WEB_VITALS_THRESHOLDS.TTFB.good) {
    recommendations.push("⚠️ TTFB 개선: 캐시 헤더 최적화");
    recommendations.push("⚠️ TTFB 개선: ISR (Incremental Static Regeneration) 검토");
  }

  return recommendations;
}

/**
 * 종합 Core Web Vitals 점수 계산
 */
export function calculateCoreWebVitalsScore(report: CoreWebVitalsReport): number {
  const metrics = [report.lcp, report.fid, report.cls, report.ttfb, report.fcp];

  const goodCount = metrics.filter((m) => m.rating === "good").length;
  const needsImprovementCount = metrics.filter(
    (m) => m.rating === "needs improvement"
  ).length;

  return Math.round((goodCount * 20 + needsImprovementCount * 10) / 5);
}

/**
 * Core Web Vitals 종합 평가
 */
export function getOverallRating(score: number): string {
  if (score >= 90) return "Excellent - 상위 10% 사이트";
  if (score >= 70) return "Good - 권장사항 이행 필요";
  if (score >= 50) return "Fair - 개선 필요";
  return "Poor - 우선 최적화 필요";
}

/**
 * 성능 병목 지점 식별
 */
export function identifyBottlenecks(report: CoreWebVitalsReport): string[] {
  const bottlenecks: string[] = [];

  const poorMetrics = [report.lcp, report.fid, report.cls, report.ttfb, report.fcp]
    .filter((m) => m.rating === "poor")
    .map((m) => m.name);

  if (poorMetrics.includes("LCP")) {
    bottlenecks.push("🔴 최우선: LCP 개선 (시각적 로딩 성능)");
  }
  if (poorMetrics.includes("FID")) {
    bottlenecks.push("🔴 최우선: FID 개선 (상호작용 반응성)");
  }
  if (poorMetrics.includes("CLS")) {
    bottlenecks.push("🔴 최우선: CLS 개선 (시각적 안정성)");
  }
  if (poorMetrics.includes("TTFB")) {
    bottlenecks.push("🟠 중요: TTFB 개선 (서버 응답)");
  }
  if (poorMetrics.includes("FCP")) {
    bottlenecks.push("🟠 중요: FCP 개선 (첫 렌더링)");
  }

  return bottlenecks;
}

/**
 * 성능 개선 우선순위 매트릭스
 */
export function getPriorityMatrix(
  report: CoreWebVitalsReport
): Array<{
  metric: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  priority: number;
}> {
  return [
    {
      metric: "LCP",
      impact: report.lcp.rating === "poor" ? "high" : "medium",
      effort: "medium",
      priority: report.lcp.rating === "poor" ? 1 : 3,
    },
    {
      metric: "FID",
      impact: report.fid.rating === "poor" ? "high" : "medium",
      effort: "high",
      priority: report.fid.rating === "poor" ? 2 : 4,
    },
    {
      metric: "CLS",
      impact: report.cls.rating === "poor" ? "high" : "low",
      effort: "low",
      priority: report.cls.rating === "poor" ? 1 : 5,
    },
  ];
}

/**
 * 성능 개선 로드맵 생성
 */
export function generateOptimizationRoadmap(
  report: CoreWebVitalsReport
): string[] {
  const roadmap: string[] = [];
  const recommendations = new Set<string>();

  // LCP 최적화
  if (report.lcp.rating !== "good") {
    getLCPRecommendations(report.lcp.value).forEach((r) =>
      recommendations.add(r)
    );
  }

  // FID 최적화
  if (report.fid.rating !== "good") {
    getFIDRecommendations(report.fid.value).forEach((r) =>
      recommendations.add(r)
    );
  }

  // CLS 최적화
  if (report.cls.rating !== "good") {
    getCLSRecommendations(report.cls.value).forEach((r) =>
      recommendations.add(r)
    );
  }

  // TTFB 최적화
  if (report.ttfb.rating !== "good") {
    getTTFBRecommendations(report.ttfb.value).forEach((r) =>
      recommendations.add(r)
    );
  }

  // 우선순위별 정렬
  return Array.from(recommendations).sort((a, b) => {
    const priorityA = a.includes("🎯") ? 0 : a.includes("⚠️") ? 1 : 2;
    const priorityB = b.includes("🎯") ? 0 : b.includes("⚠️") ? 1 : 2;
    return priorityA - priorityB;
  });
}

/**
 * 시간에 따른 성능 추이 추적
 */
export interface PerformanceTrend {
  date: string;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  score: number;
}

/**
 * 성능 개선 목표 설정
 */
export function setPerformanceTargets(
  currentReport: CoreWebVitalsReport
): Record<string, { current: number; target: number; improvement: number }> {
  return {
    LCP: {
      current: currentReport.lcp.value,
      target: WEB_VITALS_THRESHOLDS.LCP.good,
      improvement: Math.round(
        ((currentReport.lcp.value - WEB_VITALS_THRESHOLDS.LCP.good) /
          currentReport.lcp.value) *
          100
      ),
    },
    FID: {
      current: currentReport.fid.value,
      target: WEB_VITALS_THRESHOLDS.FID.good,
      improvement: Math.round(
        ((currentReport.fid.value - WEB_VITALS_THRESHOLDS.FID.good) /
          currentReport.fid.value) *
          100
      ),
    },
    CLS: {
      current: currentReport.cls.value,
      target: WEB_VITALS_THRESHOLDS.CLS.good,
      improvement: Math.round(
        ((currentReport.cls.value - WEB_VITALS_THRESHOLDS.CLS.good) /
          currentReport.cls.value) *
          100
      ),
    },
  };
}
