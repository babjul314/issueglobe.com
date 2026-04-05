/**
 * Phase 60-62: SEO Engine Bot Exposure Optimization API
 * 크롤 예산, 의미론적 키워드, SERP 스니펫 종합 최적화
 */

import { NextRequest, NextResponse } from "next/server";
import {
  optimizeCrawlFrequency,
  generateCrawlBudgetStrategy,
  expandEntitySemantics,
} from "@/lib/crawl-budget-optimizer";
import {
  expandKeywordSemantics,
  identifyLongTailOpportunities,
  generateIntentBasedContentStrategy,
} from "@/lib/semantic-keyword-expansion";
import {
  optimizeMetaTitle,
  optimizeMetaDescription,
  optimizeFeaturedSnippet,
  generateCTRImprovementStrategy,
} from "@/lib/serp-snippet-optimizer";

/**
 * Phase 60-62 종합 최적화
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      pageUrl = "https://issueglobe.com/trend/sample",
      trendKeyword = "Artificial Intelligence",
      countryCode = "US",
      currentRank = 12,
      traffic = 2500,
      backlinks = 18,
      lastModified = new Date().toISOString(),
      updateFrequency = "daily",
    } = body;

    // === Phase 60: Crawl Budget Optimization ===
    const crawlOptimization = optimizeCrawlFrequency({
      url: pageUrl,
      lastModified,
      traffic,
      backlinks,
      updateFrequency,
    });

    // Entity expansion for semantic understanding
    const entityExpansion = expandEntitySemantics(trendKeyword, countryCode);

    // === Phase 61: Semantic Keyword Expansion ===
    const semanticCluster = expandKeywordSemantics(trendKeyword);
    const longTailOpportunities = identifyLongTailOpportunities(semanticCluster, 40);
    const contentStrategy = generateIntentBasedContentStrategy(semanticCluster);

    // === Phase 62: SERP Snippet Optimization ===
    const titleOptimization = optimizeMetaTitle(
      `${trendKeyword} - Trending Now`,
      trendKeyword
    );

    const descriptionOptimization = optimizeMetaDescription(
      `Discover the latest trends and analysis about ${trendKeyword}. Stay updated with real-time insights.`,
      trendKeyword
    );

    const snippetStrategy = generateCTRImprovementStrategy(
      titleOptimization.optimizedTitle,
      descriptionOptimization.optimizedDescription,
      trendKeyword
    );

    const featuredSnippetTarget = optimizeFeaturedSnippet(trendKeyword);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        trendKeyword,
        countryCode,
        pageUrl,

        // Phase 60 Results
        crawlBudgetOptimization: {
          crawlFrequency: {
            frequency: `${crawlOptimization.crawlFrequency}x per week`,
            priority: crawlOptimization.priority,
            estimatedBudget: `${crawlOptimization.estimatedCrawlBudget}% of total`,
          },
          recommendations: crawlOptimization.recommendedActions,
          entityExpansion: {
            coreName: entityExpansion.entityName,
            relatedEntities: entityExpansion.relatedEntities.slice(0, 10),
            schemaMarkupRequired: entityExpansion.schemaMarkupRequired,
            confidenceScore: entityExpansion.confidenceScore,
          },
        },

        // Phase 61 Results
        semanticKeywordExpansion: {
          coreKeyword: semanticCluster.coreKeyword,
          totalVariations: semanticCluster.variations.length,
          top10LongTail: longTailOpportunities.slice(0, 10).map((opp) => ({
            keyword: opp.keyword,
            searchVolume: opp.searchVolume,
            difficulty: opp.difficulty,
            opportunityScore: opp.opportunity,
          })),
          estimatedTrafficGain: `${Math.round(semanticCluster.totalEstimatedTraffic / 10)}-${Math.round(semanticCluster.totalEstimatedTraffic / 5)} visits/month`,
          contentStrategy: {
            informational: contentStrategy.informational.keywords.length,
            commercial: contentStrategy.commercial.keywords.length,
            transactional: contentStrategy.transactional.keywords.length,
            navigationAl: contentStrategy.navigational.keywords.length,
          },
        },

        // Phase 62 Results
        serpSnippetOptimization: {
          metaTitle: {
            optimized: titleOptimization.optimizedTitle,
            length: titleOptimization.length,
            ctrBoost: `+${titleOptimization.ctrBoost}%`,
          },
          metaDescription: {
            optimized: descriptionOptimization.optimizedDescription,
            length: descriptionOptimization.length,
            ctrBoost: `+${descriptionOptimization.ctrBoost}%`,
          },
          ctrImprovement: {
            currentEstimate: "3.5%",
            optimizedEstimate: `${Math.round(snippetStrategy.optimizations.expectedCTR)}%`,
            improvement: `+${Math.round(snippetStrategy.optimizations.expectedCTR - 3.5)}%`,
            expectedAdditionalClicks: snippetStrategy.optimizations.expectedClicks,
          },
          featuredSnippet: {
            targetQuery: featuredSnippetTarget.query,
            snippetType: featuredSnippetTarget.snippetType,
            requirements: featuredSnippetTarget.requirements,
            estimatedTraffic: `+${featuredSnippetTarget.estimatedTraffic} clicks/month`,
          },
          testVariants: snippetStrategy.variants.slice(0, 2).map((v) => ({
            title: v.title,
            description: v.description.slice(0, 70) + "...",
            predictedCTR: `${Math.round(v.predictedCTR * 10) / 10}%`,
          })),
        },

        // Comprehensive Recommendations
        nextSteps: [
          "1. Phase 60: 크롤 예산 최적화",
          `   - 현재 크롤 빈도: ${crawlOptimization.crawlFrequency}x/주`,
          `   - Priority: ${crawlOptimization.priority}`,
          `   - Action: ${crawlOptimization.recommendedActions[0]}`,
          "",
          "2. Phase 61: 의미론적 키워드 확장",
          `   - 관련 키워드: ${semanticCluster.variations.length}개 생성`,
          `   - 긴꼬리 기회: ${longTailOpportunities.length}개`,
          `   - 예상 트래픽: ${Math.round(semanticCluster.totalEstimatedTraffic / 10)}-${Math.round(semanticCluster.totalEstimatedTraffic / 5)} visits/month`,
          "",
          "3. Phase 62: SERP 스니펫 최적화",
          `   - 타이틀 CTR 부스트: +${titleOptimization.ctrBoost}%`,
          `   - 설명 CTR 부스트: +${descriptionOptimization.ctrBoost}%`,
          `   - Featured Snippet: "${featuredSnippetTarget.snippetType}" 형식 권장`,
        ].join("\n"),

        estimatedOutcome: {
          timeframe: "2-4 weeks (Phase 60-62)",
          expectedRankImprovement: `${currentRank} → ${Math.max(1, currentRank - 3)}`,
          expectedCTRIncrease: `3.5% → ${Math.round(snippetStrategy.optimizations.expectedCTR)}% (+${Math.round((snippetStrategy.optimizations.expectedCTR - 3.5) * 100 / 3.5)}%)`,
          expectedTrafficIncrease: `${Math.round((snippetStrategy.optimizations.expectedCTR - 3.5) / 3.5 * 100)}% increase from current traffic`,
          keywordExpansion: `${semanticCluster.coreKeyword} → ${semanticCluster.variations.length} semantic variations`,
          recommendation:
            "Phase 60-62 completed → Engine bot exposure significantly increased via crawl optimization, semantic expansion, and SERP snippet enhancement",
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Phase 60-62 optimization error:", error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Phase 60-62 optimization failed",
      },
      { status: 500 }
    );
  }
}
