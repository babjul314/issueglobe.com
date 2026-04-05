import { NextRequest, NextResponse } from "next/server";
import {
  calculateCWVScore,
  diagnosisPerformanceIssues,
  recommendOptimizationStrategies,
  generateMobileOptimizationChecklist,
  type CoreWebVitalsMetrics,
  type MobileOptimizationMetrics,
} from "@/lib/mobile-performance-optimizer";

/**
 * 모바일 성능 및 Core Web Vitals 분석 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 기본값 또는 제공된 메트릭 사용
    const metrics: CoreWebVitalsMetrics = {
      lcp: body.lcp || 2800, // 약간 느린 상태
      fid: body.fid || 120, // 약간 높음
      cls: body.cls || 0.12, // 약간 높음
      ttfb: body.ttfb || 900, // 약간 높음
      fcp: body.fcp || 1900,
    };

    const mobileMetrics: MobileOptimizationMetrics = {
      pageSize: body.pageSize || 2800, // KB
      requestCount: body.requestCount || 42,
      jsSize: body.jsSize || 520, // KB
      cssSize: body.cssSize || 85, // KB
      imageCount: body.imageCount || 15,
      unoptimizedImages: body.unoptimizedImages || 3,
      cacheability: body.cacheability || 75, // %
      gzipSavings: body.gzipSavings || 62, // %
    };

    // 1. Core Web Vitals 점수 계산
    const cwvScore = calculateCWVScore(metrics);

    // 2. 성능 문제 진단
    const performanceIssues = diagnosisPerformanceIssues(
      metrics,
      mobileMetrics
    );

    // 3. 최적화 전략 추천
    const strategies = recommendOptimizationStrategies(performanceIssues);

    // 4. 체크리스트
    const checklist = generateMobileOptimizationChecklist();

    // 5. 예상 개선 결과 계산
    const totalPotentialImprovement = strategies.reduce(
      (sum, s) => sum + s.expectedImprovement,
      0
    );
    const projectedLCP = Math.max(
      1500,
      metrics.lcp - totalPotentialImprovement * 0.7
    );

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        currentMetrics: {
          cwv: {
            lcp: `${metrics.lcp}ms`,
            fid: `${metrics.fid}ms`,
            cls: metrics.cls,
            ttfb: `${metrics.ttfb}ms`,
            fcp: `${metrics.fcp}ms`,
          },
          mobile: {
            pageSize: `${mobileMetrics.pageSize}KB`,
            requests: mobileMetrics.requestCount,
            jsSize: `${mobileMetrics.jsSize}KB`,
            imageCount: mobileMetrics.imageCount,
          },
        },
        score: cwvScore,
        issues: {
          critical: performanceIssues.filter((i) => i.type === "critical")
            .length,
          warning: performanceIssues.filter((i) => i.type === "warning").length,
          topIssues: performanceIssues.slice(0, 5),
        },
        optimizationStrategies: strategies,
        projectedImprovement: {
          estimatedTimeSaved: `${Math.round(totalPotentialImprovement)}ms`,
          improvementPercent: `${Math.round((totalPotentialImprovement / metrics.lcp) * 100)}%`,
          projectedLCP: `${Math.round(projectedLCP)}ms`,
          projectedGrade:
            projectedLCP <= 2500
              ? "A"
              : projectedLCP <= 3500
                ? "B"
                : "C",
        },
        implementationPlan: {
          phase1: "2 weeks",
          phase1Tasks: strategies
            .slice(0, 2)
            .map((s) => s.strategy)
            .join(", "),
          phase2: "4 weeks",
          phase2Tasks: strategies
            .slice(2, 4)
            .map((s) => s.strategy)
            .join(", "),
          phase3: "Ongoing monitoring",
        },
        checklist,
        nextSteps: [
          "1. Run PageSpeed Insights on mobile device",
          "2. Implement top 2 strategies (Image optimization + Code splitting)",
          "3. Set up performance monitoring dashboard",
          "4. Test on real devices (3G connection)",
          `5. Target ${Math.round(projectedLCP)}ms LCP within 4 weeks`,
          "6. Monitor Core Web Vitals weekly",
        ],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error(
      "Mobile performance analysis error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Mobile performance analysis failed",
      },
      { status: 500 }
    );
  }
}
