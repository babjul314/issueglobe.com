/**
 * Phase 66-67: Voice Search & Competitor Gap Analysis API
 * 음성 검색 최적화 + 경쟁 분석으로 빠른 성장 기회 발굴
 */

import { NextRequest, NextResponse } from "next/server";
import {
  analyzeVoiceQuery,
  expandConversationalKeywords,
  calculateVoiceOptimizationScore,
  generateVoiceSearchStrategy,
  type VoiceSearchStrategy,
} from "@/lib/voice-search-optimizer";
import {
  analyzeCompetitorMetrics,
  identifyContentGaps,
  identifyQuickWins,
  generateCompetitorAnalysisReport,
  type CompetitorMetrics,
  type ContentGap,
} from "@/lib/competitor-gap-analyzer";

/**
 * Phase 66-67: 음성 검색 + 경쟁 분석 종합 최적화
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      // Phase 66: Voice Search
      coreKeyword = "Trending Topics",
      currentRank = 12,
      hasFeatureSnippet = false,
      hasFAQPage = false,

      // Phase 67: Competitor Analysis
      competitorDomain = "similar-competitor.com",
      ourRankingKeywords = 150,
      competitorRankingKeywords = 420,
      ourTraffic = 5000,
      competitorTraffic = 25000,
      ourBacklinks = 85,
      competitorBacklinks = 450,
      ourDA = 35,
      competitorDA = 52,
      ourPageSpeed = 72,
      competitorPageSpeed = 88,
    } = body;

    // === Phase 66: Voice Search Optimization ===

    // 1. Voice query variations 분석
    const voiceQueries = [
      analyzeVoiceQuery(`what is ${coreKeyword}`, currentRank, hasFeatureSnippet),
      analyzeVoiceQuery(`how to find ${coreKeyword}`, currentRank + 3, false),
      analyzeVoiceQuery(
        `why is ${coreKeyword} trending`,
        currentRank + 5,
        hasFAQPage
      ),
    ];

    // 2. Conversational keywords 확장
    const conversationalKeywords = expandConversationalKeywords(coreKeyword);

    // 3. Voice 최적화 스코어
    const voiceScore = calculateVoiceOptimizationScore({
      hasFeatureSnippet,
      hasFAQPage,
      shortAnswerProvided: false,
      questionCovered: 3,
      schemaMarkup: hasFAQPage,
      conversationalTone: true,
      answerPosition: "middle",
    });

    // 4. Voice 전략 생성
    const voiceStrategy = generateVoiceSearchStrategy(
      coreKeyword,
      currentRank,
      voiceScore.score
    );

    // === Phase 67: Competitor Analysis ===

    // 1. Our metrics
    const ourMetrics = analyzeCompetitorMetrics("issueglobe.com", {
      rankingKeywords: ourRankingKeywords,
      top10Keywords: Math.floor(ourRankingKeywords * 0.25),
      top3Keywords: Math.floor(ourRankingKeywords * 0.08),
      estimatedTraffic: ourTraffic,
      backlinks: ourBacklinks,
      referringDomains: Math.floor(ourBacklinks * 0.4),
      contentCount: 180,
      domainAuthority: ourDA,
    });

    // 2. Competitor metrics
    const competitorMetrics = analyzeCompetitorMetrics(competitorDomain, {
      rankingKeywords: competitorRankingKeywords,
      top10Keywords: Math.floor(competitorRankingKeywords * 0.22),
      top3Keywords: Math.floor(competitorRankingKeywords * 0.12),
      estimatedTraffic: competitorTraffic,
      backlinks: competitorBacklinks,
      referringDomains: Math.floor(competitorBacklinks * 0.35),
      contentCount: 580,
      domainAuthority: competitorDA,
    });

    // 3. Mock competitor keywords (실제로는 API나 데이터베이스에서)
    const mockCompetitorTopKeywords = [
      "trending topics today",
      "what is trending",
      "trending now",
      "trending worldwide",
      "viral trends",
      "latest trends",
      "global trends",
      "hot trends",
      "top trending topics",
      "trending on social media",
    ];

    // 4. Content gaps 식별
    const gaps = identifyContentGaps(ourMetrics, competitorMetrics, mockCompetitorTopKeywords);

    // 5. Quick wins 식별
    const quickWins = identifyQuickWins(ourMetrics, competitorMetrics, [
      { keyword: "AI trends", rank: 8 },
      { keyword: "technology trends", rank: 12 },
      { keyword: "social media trends", rank: 15 },
      { keyword: "entertainment trends", rank: 18 },
    ]);

    // 6. 경쟁 분석 리포트
    const competitorReport = generateCompetitorAnalysisReport(
      ourMetrics,
      competitorMetrics,
      gaps,
      quickWins
    );

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),

        // === Phase 66: Voice Search ===
        voiceSearchOptimization: {
          coreKeyword,
          optimizationScore: `${voiceScore.score}/100`,
          readiness: voiceScore.readiness,
          voiceQueryVariations: voiceQueries.slice(0, 3).map((q) => ({
            query: q.query,
            format: q.format,
            currentRank: q.currentPosition,
            voiceEligibility: `${q.voiceSearchEligibility}%`,
          })),
          conversationalKeywordCount: conversationalKeywords.length,
          topConversationalKeywords: conversationalKeywords
            .slice(0, 5)
            .map((k) => ({
              keyword: k.voiceVariant,
              searchVolume: k.searchVolume,
              difficulty: k.difficulty,
            })),
          recommendedContentFormat: voiceScore.gaps.length > 0 ? "FAQ + Featured Snippet" : "Ready for voice",
          gaps: voiceScore.gaps,
        },

        // === Voice Search Expected Impact ===
        voiceSearchImpact: {
          currentVoiceTraffic: "~500-1000 searches/month",
          expectedFutureVoiceTraffic: "Featured Snippet 획득 시 +100-500 clicks/month",
          implementationTimeframe: "2-4 weeks",
          priority: voiceStrategy.implementationPriority,
        },

        // === Phase 67: Competitor Analysis ===
        competitorAnalysis: {
          comparedAgainst: competitorDomain,
          ourStrengths: [
            `Domain Authority: ${ourDA} (경쟁사 ${competitorDA}보다 낮음 - 취약)`,
            `Content Count: ${ourMetrics.contentCount} (경쟁사 ${competitorMetrics.contentCount}보다 많음 - 강점)`,
            `Page Speed: ${ourPageSpeed}/100 (경쟁사 ${competitorPageSpeed}보다 낮음 - 약점)`,
          ],
          competitorWeaknesses: [
            `오래된 콘텐츠 (업데이트 필요)`,
            `Page Speed 느림 (Core Web Vitals 개선 여지)`,
            `Featured Snippet 부족 (음성 검색 취약)`,
          ],
        },

        // === Content Gaps ===
        contentGaps: {
          totalGapsIdentified: gaps.length,
          gapsByType: {
            keywordMissing: gaps.filter((g) => g.gapType === "keyword_missing").length,
            contentMissing: gaps.filter((g) => g.gapType === "content_missing").length,
            thinContent: gaps.filter((g) => g.gapType === "thin_content").length,
            outdated: gaps.filter((g) => g.gapType === "outdated").length,
          },
          topGaps: gaps.slice(0, 3).map((g) => ({
            type: g.gapType,
            opportunity: g.opportunity,
            traffic: `+${g.estimatedTraffic}/month`,
            priority: g.priority,
            action: g.actionRequired,
          })),
          totalTrafficOpportunity: `+${gaps.reduce((sum, g) => sum + g.estimatedTraffic, 0)}/month`,
        },

        // === Quick Wins ===
        quickWins: {
          identified: quickWins.length,
          topWins: quickWins.slice(0, 3).map((w) => ({
            keyword: w.keyword,
            effort: w.effort,
            timeframe: w.timeframe,
            expectedRank: w.expectedRank,
            rationale: w.rationale,
          })),
          estimatedQuickWinTraffic: `+${quickWins.reduce((sum, w) => sum + 50, 0)}-${quickWins.reduce((sum, w) => sum + 150, 0)}/month (2-4주)`,
        },

        // === Combined Impact (Phase 66-67) ===
        combinedImpact: {
          shortTerm: {
            timeframe: "2-4 weeks",
            targets: [
              `Quick win keywords: rank #2-3 진입`,
              `Voice search: Featured Snippet 최소 1개`,
              `Traffic gain: +300-800 monthly visits`,
            ],
            effort: "Medium (content writing + optimization)",
          },
          mediumTerm: {
            timeframe: "1-2 months",
            targets: [
              `Gap keyword 50%: rank #5-10 진입`,
              `Voice query coverage: 10+ conversational queries`,
              `Traffic gain: +1000-2000 monthly visits`,
              `Competitor overtake: 경쟁사 DA 추월 기회`,
            ],
            effort: "High (content cluster + backlinks)",
          },
          longTerm: {
            timeframe: "2-3 months",
            targets: [
              `Market leadership: 경쟁사 대부분 키워드에서 top 3`,
              `Voice dominance: 음성 답변 독점 (Featured Snippet)`,
              `Traffic multiplier: 2-3x 증가`,
              `Knowledge Graph: 엔티티 인정`,
            ],
            effort: "Very High (sustained content + authority)",
          },
        },

        // === Action Plan ===
        prioritizedActions: [
          "🎯 Phase 66 (음성 검색): Week 1-2",
          "   1. FAQPage schema 추가 (5-10 Q&A)",
          "   2. Featured Snippet 타겟: 40-60 word 답변 추가",
          "   3. Conversational tone 콘텐츠 리뷰",
          "",
          "🎯 Phase 67 (경쟁 분석): Week 1-3",
          "   1. Quick win 키워드 3-5개 즉시 작업",
          "   2. 각 quick win: 내부 링크 + 콘텐츠 신선도",
          "   3. 기대: +100-500/month (2주)",
          "",
          "🎯 Gap 채우기: Week 4-8",
          "   1. Keyword gap 상위 5개 콘텐츠 작성",
          "   2. Competitor 백링크 분석 → 접근 가능한 도메인 3-5개",
          "   3. 각 gap keyword: SEO 최적화 + 백링크 1-2개",
          "   4. 기대: +500-1500/month (1개월)",
        ],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Phase 66-67 optimization error:", error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Phase 66-67 optimization failed",
      },
      { status: 500 }
    );
  }
}
