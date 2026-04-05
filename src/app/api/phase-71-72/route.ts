/**
 * Phase 71-72: Trend Velocity Prediction & Cross-Country Trend Network API
 * 트렌드 속도 분석 + 크로스-컨트리 권위 네트워크 구축
 */

import { NextRequest, NextResponse } from "next/server";
import {
  analyzeTrendVelocity,
  generateVelocityPredictionPlan,
  type TrendVelocityInput,
  type TrendVelocityScore,
  type VelocityPredictionPlan,
} from "@/lib/trend-velocity-predictor";
import {
  generateCrossCountryNetworkPlan,
  type CrossCountryTrendInput,
  type CrossCountryNetworkPlan,
} from "@/lib/cross-country-trend-network";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 기본 입력값: 3개국 AI 트렌드
    const {
      trends = [
        {
          title: "AI Revolution",
          country: "US",
          traffic: "100K+",
          pubTime: "2h ago",
          slug: "us-ai-revolution-2024-01-01",
          date: "2024-01-01",
        },
        {
          title: "AI",
          country: "KR",
          traffic: "50K+",
          pubTime: "3h ago",
          slug: "kr-ai-2024-01-01",
          date: "2024-01-01",
        },
        {
          title: "Artificial Intelligence",
          country: "JP",
          traffic: "100K+",
          pubTime: "1h ago",
          slug: "jp-artificial-intelligence-2024-01-01",
          date: "2024-01-01",
        },
      ],
    } = body as { trends?: Array<TrendVelocityInput & CrossCountryTrendInput> };

    // === Phase 71: Trend Velocity ===
    const velocityScores: TrendVelocityScore[] = trends.map((t) =>
      analyzeTrendVelocity(t)
    );
    const velocityPlan: VelocityPredictionPlan = generateVelocityPredictionPlan(
      velocityScores,
      trends
    );

    // === Phase 72: Cross-Country Network ===
    const networkPlan: CrossCountryNetworkPlan = generateCrossCountryNetworkPlan(trends);

    // === Combined Impact ===
    const totalSEOImpact = velocityPlan.breakoutCount * 15 + networkPlan.clustersFound * 20;

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),

        // === Phase 71: Velocity ===
        phase71Results: {
          summary: {
            totalTrends: velocityPlan.totalTrendsAnalyzed,
            breakoutCount: velocityPlan.breakoutCount,
            peakCount: velocityPlan.peakCount,
            decliningCount: velocityPlan.decliningCount,
          },
          velocityBreakdown: velocityScores.map((s) => ({
            slug: s.slug,
            title: s.title,
            country: s.country,
            velocityClass: s.velocityClass,
            velocityScore: s.velocityScore,
            trafficNumber: s.trafficNumber,
            ageHours: Math.round(s.ageHours * 10) / 10,
            estimatedHoursToPeak: s.estimatedHoursToPeak,
            isBreakout: s.isBreakout,
            breakoutPriority: s.breakoutPriority,
          })),
          preemptiveSEOTargets: velocityPlan.preemptiveSEOTargets,
          expectedTrafficCapture: velocityPlan.expectedTrafficCapture,
          checklist: velocityPlan.implementationChecklist,
        },

        // === Phase 72: Network ===
        phase72Results: {
          summary: {
            totalTrends: networkPlan.totalTrends,
            clustersFound: networkPlan.clustersFound,
            singletonTrends: networkPlan.singletonTrends,
            totalLinksGenerated: networkPlan.totalInternalLinksGenerated,
          },
          clusters: networkPlan.clusters.map((c) => ({
            clusterKey: c.clusterKey,
            countryCoverage: c.countryCoverage,
            globalReachScore: c.globalReachScore,
            estimatedAuthorityBoost: c.estimatedAuthorityBoost,
            internalLinkCount: c.internalLinks.length,
            topLinks: c.internalLinks.slice(0, 4),
            schemaMarkup: c.schemaMarkup,
            authorityFlowSummary: c.authorityFlowSummary,
          })),
          totalAuthorityBoost: networkPlan.totalAuthorityBoost,
          checklist: networkPlan.implementationChecklist,
        },

        // === Combined Impact (71-72) ===
        combinedImpact: {
          totalSEOImpact: `+${totalSEOImpact}% estimated organic visibility improvement`,
          shortTerm: {
            timeframe: "24-48 hours",
            targets: [
              "Pre-peak indexing for breakout trends before peak search volume",
              "Cross-country link network deployment for topic clusters",
              "JSON-LD sameAs schema on all clustered pages",
            ],
          },
          mediumTerm: {
            timeframe: "1-2 weeks",
            targets: [
              "Googlebot re-crawl of all linked pages",
              "Entity authority recognition across country variants",
              "+30-60% traffic capture vs post-peak publishing",
            ],
          },
          expectedOutcome: {
            velocityCapture: velocityPlan.expectedTrafficCapture,
            authorityBoost: networkPlan.totalAuthorityBoost,
            rankingGain: `+${Math.round(totalSEOImpact / 10)}-${Math.round(totalSEOImpact / 5)} positions on clustered topic keywords`,
          },
        },

        // === Prioritized Actions ===
        prioritizedActions: [
          "🚀 Phase 71 (Velocity): Deploy pre-optimized metadata NOW for breakout trends",
          `  └─ ${velocityPlan.breakoutCount} breakout trends identified`,
          "  └─ Submit updated sitemap to Google Search Console immediately",
          "  └─ Target: Googlebot indexing within 12-24h (before peak)",
          "",
          "🌐 Phase 72 (Network): Insert cross-country internal links within 24h",
          `  └─ ${networkPlan.clustersFound} topic clusters detected across ${networkPlan.totalTrends} trends`,
          `  └─ ${networkPlan.totalInternalLinksGenerated} bi-directional links to generate`,
          "  └─ Deploy JSON-LD sameAs schema on all clustered pages",
          "  └─ Monitor: Google Search Console → Internal Links report (48h lag)",
        ],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Phase 71-72 optimization error:", error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Phase 71-72 optimization failed",
      },
      { status: 500 }
    );
  }
}
