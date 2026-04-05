/**
 * Phase 68-69: Core Web Vitals & User Engagement Optimization API
 * 페이지 경험 신호 + 사용자 행동 신호 종합 최적화
 */

import { NextRequest, NextResponse } from "next/server";
import {
  analyzeWebVitals,
  calculatePagespeedScore,
  generateUXOptimizationPlan,
  type CoreWebVitalMetrics,
  type WebVitalScore,
} from "@/lib/core-web-vitals-optimizer";
import {
  analyzeEngagementMetrics,
  calculateEngagementScore,
  generateEngagementOptimizationPlan,
  type UserEngagementMetrics,
  type BehaviorSignalScore,
} from "@/lib/user-engagement-optimizer";

/**
 * Phase 68-69: UX + Engagement 종합 최적화
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      // Phase 68: Core Web Vitals
      lcp = 3.2, // Largest Contentful Paint (seconds)
      fid = 85, // First Input Delay (ms)
      cls = 0.12, // Cumulative Layout Shift (0-1)
      ttfb = 800, // Time to First Byte (ms)
      fcp = 1.8, // First Contentful Paint (seconds)

      // Phase 69: User Engagement
      bounceRate = 52, // %
      avgDwellTime = 75, // seconds
      ctr = 3.5, // %
      pagesPerSession = 2.1,
      returnVisitorRate = 18, // %
    } = body;

    // === Phase 68: Core Web Vitals ===
    const webVitals = analyzeWebVitals({
      lcp,
      fid,
      cls,
      ttfb,
      fcp,
    });

    const pagespeedScore: WebVitalScore = calculatePagespeedScore(webVitals);

    const uxPlan = generateUXOptimizationPlan(webVitals);

    // === Phase 69: User Engagement ===
    const engagementSignals = analyzeEngagementMetrics({
      bounceRate,
      avgDwellTime,
      ctr,
      pagesPerSession,
      returnVisitorRate,
    });

    const engagementScore: BehaviorSignalScore = calculateEngagementScore(engagementSignals);

    const engagementPlan = generateEngagementOptimizationPlan(engagementSignals);

    // === Combined Impact ===
    const totalRankingImprovement = pagespeedScore.estimatedTrafficGain + engagementScore.estimatedRankingImprovement;

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),

        // === Phase 68: Core Web Vitals ===
        coreWebVitals: {
          lcp: {
            current: `${pagespeedScore.lcp}s`,
            target: "<2.5s",
            status: pagespeedScore.lcp < 2.5 ? "✅ Good" : pagespeedScore.lcp < 4 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          fid: {
            current: `${pagespeedScore.fid}ms`,
            target: "<100ms",
            status: pagespeedScore.fid < 100 ? "✅ Good" : pagespeedScore.fid < 300 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          cls: {
            current: pagespeedScore.cls.toFixed(3),
            target: "<0.1",
            status: pagespeedScore.cls < 0.1 ? "✅ Good" : pagespeedScore.cls < 0.25 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          ttfb: {
            current: `${pagespeedScore.ttfb}ms`,
            target: "<600ms",
            status: pagespeedScore.ttfb < 600 ? "✅ Good" : pagespeedScore.ttfb < 1800 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          fcp: {
            current: `${pagespeedScore.fcp}s`,
            target: "<1.8s",
            status: pagespeedScore.fcp < 1.8 ? "✅ Good" : pagespeedScore.fcp < 3 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          pagespeedScore: {
            overall: `${pagespeedScore.pagespeedScore}/100`,
            interpretation:
              pagespeedScore.pagespeedScore > 85
                ? "✅ Excellent"
                : pagespeedScore.pagespeedScore > 70
                  ? "⚠️ Good (room for improvement)"
                  : pagespeedScore.pagespeedScore > 50
                    ? "⚠️ Needs Improvement"
                    : "🔴 Poor",
          },
        },

        // === UX Optimization Plan ===
        uxOptimization: {
          currentScore: `${uxPlan.currentScore}/100`,
          targetScore: "90/100",
          criticalIssues: uxPlan.criticalIssues,
          improvements: uxPlan.improvements.slice(0, 3).map((imp) => ({
            area: imp.area,
            current: imp.currentState,
            target: imp.targetState,
            effort: imp.effort,
            timeframe: imp.timeframe,
          })),
          expectedTrafficGain: uxPlan.expectedTrafficGain,
          implementationDifficulty: pagespeedScore.implementationDifficulty,
        },

        // === Phase 69: User Engagement ===
        userEngagement: {
          bounceRate: {
            current: `${engagementScore.bounceRate}%`,
            target: "<40%",
            status: engagementScore.bounceRate < 40 ? "✅ Good" : engagementScore.bounceRate < 60 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          avgDwellTime: {
            current: `${engagementScore.avgDwellTime}s (${Math.round(engagementScore.avgDwellTime / 60)}m)`,
            target: ">120s (>2m)",
            status: engagementScore.avgDwellTime > 120 ? "✅ Good" : engagementScore.avgDwellTime > 60 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          ctr: {
            current: `${engagementScore.ctr}%`,
            target: ">5%",
            status: engagementScore.ctr > 5 ? "✅ Good" : engagementScore.ctr > 3 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          pagesPerSession: {
            current: engagementScore.pagesPerSession.toFixed(1),
            target: ">3",
            status: engagementScore.pagesPerSession > 3 ? "✅ Good" : engagementScore.pagesPerSession > 2 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          returnVisitorRate: {
            current: `${engagementScore.returnVisitorRate}%`,
            target: ">30%",
            status: engagementScore.returnVisitorRate > 30 ? "✅ Good" : engagementScore.returnVisitorRate > 15 ? "⚠️ Needs Improvement" : "🔴 Poor",
          },
          engagementScore: {
            overall: `${engagementScore.overallEngagementScore}/100`,
            interpretation:
              engagementScore.overallEngagementScore > 75
                ? "✅ Excellent"
                : engagementScore.overallEngagementScore > 60
                  ? "⚠️ Good"
                  : engagementScore.overallEngagementScore > 40
                    ? "⚠️ Needs Improvement"
                    : "🔴 Poor",
          },
        },

        // === Engagement Optimization Plan ===
        engagementOptimization: {
          currentScore: `${engagementPlan.currentEngagementScore}/100`,
          targetScore: "85/100",
          priorityActions: engagementPlan.priorityActions,
          improvements: engagementPlan.improvements.slice(0, 3),
          expectedTrafficGain: engagementPlan.expectedTrafficGain,
        },

        // === Combined Impact (Phase 68-69) ===
        combinedImpact: {
          totalRankingImprovement: `+${totalRankingImprovement}-${Math.round(totalRankingImprovement * 1.5)} positions (2-4주 내)`,
          trafficMultiplier: `${((pagespeedScore.estimatedTrafficGain + engagementScore.estimatedRankingImprovement) / 40).toFixed(1)}x (vs baseline)`,
          shortTermPriority: [
            "🎯 Week 1-2: Bounce rate 감소 (제목 + 첫 단락)",
            "🎯 Week 2-3: Page speed 개선 (이미지 + 캐싱)",
            "🎯 Week 3-4: Dwell time 증가 (콘텐츠 깊이)",
            "🎯 Week 4+: 내부 링크 + 뉴스레터",
          ],
          expectedOutcome: {
            timeframe: "2-4 weeks",
            trafficGain: `+${pagespeedScore.estimatedTrafficGain}-${engagementScore.estimatedRankingImprovement * 2}% (모든 개선 완료 시)`,
            rankingGain: `+${totalRankingImprovement} positions (평균)`,
            coreWebVitalsTarget: "모두 'Good' 상태",
            engagementTarget: "모든 신호 개선",
          },
        },

        // === Implementation Roadmap ===
        implementation: {
          phase68_WebVitals: {
            priority: "High (ranking factor)",
            effort: pagespeedScore.implementationDifficulty,
            timeframe: "2-3 weeks",
            expectedRankGain: `+${pagespeedScore.estimatedTrafficGain}%`,
          },
          phase69_Engagement: {
            priority: "Critical (user satisfaction)",
            effort: "Medium (content + linking)",
            timeframe: "3-6 weeks",
            expectedRankGain: `+${Math.round(engagementScore.estimatedRankingImprovement / 2)}-${engagementScore.estimatedRankingImprovement} positions`,
          },
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Phase 68-69 optimization error:", error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Phase 68-69 optimization failed",
      },
      { status: 500 }
    );
  }
}
