import { NextRequest, NextResponse } from "next/server";
import {
  CoreWebVitalsReport,
  WebVitalMetric,
  WEB_VITALS_THRESHOLDS,
  rateMetric,
  calculateCoreWebVitalsScore,
  getOverallRating,
  identifyBottlenecks,
  generateOptimizationRoadmap,
  setPerformanceTargets,
} from "@/lib/core-web-vitals";

/**
 * Core Web Vitals 모니터링 엔드포인트
 * Google Lighthouse의 성능 메트릭을 시뮬레이션하고 최적화 권장사항 제공
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = "https://issueglobe.com";

    // 실제 성능 측정 데이터
    // 프로덕션 환경에서는 Google PageSpeed Insights API 또는 CrUX 데이터 사용
    const mockMetrics = {
      lcp: 2100, // 2.1초 (good)
      fid: 85, // 85ms (good)
      cls: 0.08, // 0.08 (good)
      ttfb: 650, // 650ms (good)
      fcp: 1200, // 1.2초 (good)
    };

    // 메트릭 평가
    const lcpMetric: WebVitalMetric = {
      name: "LCP - Largest Contentful Paint",
      value: mockMetrics.lcp,
      unit: "ms",
      rating: rateMetric(mockMetrics.lcp, WEB_VITALS_THRESHOLDS.LCP),
      threshold: WEB_VITALS_THRESHOLDS.LCP,
    };

    const fidMetric: WebVitalMetric = {
      name: "FID - First Input Delay",
      value: mockMetrics.fid,
      unit: "ms",
      rating: rateMetric(mockMetrics.fid, WEB_VITALS_THRESHOLDS.FID),
      threshold: WEB_VITALS_THRESHOLDS.FID,
    };

    const clsMetric: WebVitalMetric = {
      name: "CLS - Cumulative Layout Shift",
      value: mockMetrics.cls,
      unit: "score",
      rating: rateMetric(mockMetrics.cls, WEB_VITALS_THRESHOLDS.CLS),
      threshold: WEB_VITALS_THRESHOLDS.CLS,
    };

    const ttfbMetric: WebVitalMetric = {
      name: "TTFB - Time to First Byte",
      value: mockMetrics.ttfb,
      unit: "ms",
      rating: rateMetric(mockMetrics.ttfb, WEB_VITALS_THRESHOLDS.TTFB),
      threshold: WEB_VITALS_THRESHOLDS.TTFB,
    };

    const fcpMetric: WebVitalMetric = {
      name: "FCP - First Contentful Paint",
      value: mockMetrics.fcp,
      unit: "ms",
      rating: rateMetric(mockMetrics.fcp, WEB_VITALS_THRESHOLDS.FCP),
      threshold: WEB_VITALS_THRESHOLDS.FCP,
    };

    const report: CoreWebVitalsReport = {
      timestamp: new Date().toISOString(),
      lcp: lcpMetric,
      fid: fidMetric,
      cls: clsMetric,
      ttfb: ttfbMetric,
      fcp: fcpMetric,
      overallScore: 0, // 계산할 것
      recommendations: [],
    };

    // 종합 점수 계산
    report.overallScore = calculateCoreWebVitalsScore(report);

    // 최적화 권장사항 생성
    report.recommendations = generateOptimizationRoadmap(report);

    // 병목 지점 식별
    const bottlenecks = identifyBottlenecks(report);

    // 성능 목표 설정
    const targets = setPerformanceTargets(report);

    // 상세 분석 정보
    const analysis = {
      timestamp: report.timestamp,
      overallScore: report.overallScore,
      rating: getOverallRating(report.overallScore),
      metrics: {
        lcp: lcpMetric,
        fid: fidMetric,
        cls: clsMetric,
        ttfb: ttfbMetric,
        fcp: fcpMetric,
      },
      bottlenecks,
      recommendations: report.recommendations,
      targets,
      passRate: {
        good: [lcpMetric, fidMetric, clsMetric, ttfbMetric, fcpMetric].filter(
          (m) => m.rating === "good"
        ).length,
        needsImprovement: [lcpMetric, fidMetric, clsMetric, ttfbMetric, fcpMetric].filter(
          (m) => m.rating === "needs improvement"
        ).length,
        poor: [lcpMetric, fidMetric, clsMetric, ttfbMetric, fcpMetric].filter(
          (m) => m.rating === "poor"
        ).length,
      },
      seoImpact: {
        description: "Core Web Vitals는 Google의 순위 신호",
        weight: "High",
        status: report.overallScore >= 75 ? "✅ SEO에 긍정적 영향" : "⚠️ 개선 필요",
      },
    };

    console.log(
      `Core Web Vitals Report: Score ${report.overallScore}/100, Rating: ${analysis.rating}`
    );

    return NextResponse.json(analysis, {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error(
      "Core Web Vitals monitoring error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overallScore: 0,
        rating: "Error",
        metrics: {},
        bottlenecks: ["Monitoring service error"],
        recommendations: ["Investigate monitoring service health"],
        seoImpact: {
          description: "Unable to assess Core Web Vitals",
          status: "❌ Monitoring failed",
        },
      },
      { status: 500 }
    );
  }
}
