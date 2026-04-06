/**
 * Phase 73-74: Content Quality Scoring & SERP Feature Targeting API
 * 콘텐츠 품질 자동 스코어링 + SERP 기능 타겟팅 분석
 */

import { NextRequest, NextResponse } from "next/server";
import {
  scoreContentQuality,
  auditContentBatch,
  generateContentQualityChecklist,
  type ContentQualityInput,
  type ContentQualityScore,
  type ContentAuditReport,
} from "@/lib/content-quality-scorer";
import {
  batchAnalyzeSERPFeatures,
  generateSERPTargetingChecklist,
  type BatchSERPReport,
} from "@/lib/serp-feature-targeter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 기본 입력값: 5개 트렌드 샘플
    const {
      articles = [
        {
          slug: "us-ai-2024-01-01",
          title: "AI Revolution Transforming Technology",
          summary: "Artificial intelligence is revolutionizing how we work and live.",
          detail: "AI technology is changing everything from business to healthcare. Experts predict significant growth in the coming years. Investment in AI continues to soar.",
          reactions: '"This is the future of tech!" - Industry analyst',
          relatedQueries: ["what is AI", "AI trends 2024", "machine learning", "artificial intelligence", "deep learning"],
          traffic: "100K+",
          country: "US",
          imageUrl: "https://example.com/ai.jpg",
          pubTime: "2h ago",
          source: "TechCrunch",
        },
        {
          slug: "us-ai-crypto-2024-01-01",
          title: "Crypto and AI Integration",
          summary: "",
          detail: "",
          reactions: "",
          relatedQueries: ["crypto AI", "blockchain"],
          traffic: "50K+",
          country: "US",
          imageUrl: "",
          pubTime: "3h ago",
          source: "CoinDesk",
        },
        {
          slug: "kr-ai-2024-01-01",
          title: "한국 AI 산업 성장",
          summary: "한국의 인공지능 산업이 급속도로 성장하고 있습니다.",
          detail: "한국 정부는 AI 분야에 대규모 투자를 하고 있습니다. 많은 스타트업들이 AI 기술 개발에 집중하고 있습니다.",
          reactions: '"한국이 AI 강국이 될 것 같다" - 기술 전문가',
          relatedQueries: ["AI 한국", "인공지능 기술", "머신러닝"],
          traffic: "75K+",
          country: "KR",
          imageUrl: "https://example.com/korea-ai.jpg",
          pubTime: "1h ago",
          source: "Naver Tech",
        },
        {
          slug: "jp-ai-2024-01-01",
          title: "日本の AI 革新",
          summary: "日本が AI 研究をリードしています。",
          detail: "日本の大学と企業は AI 技術の開発に力を入れています。多くのスタートアップが革新的なソリューションを提供しています。",
          reactions: "\"日本の AI は世界的に注目されている\" - 技術評論家",
          relatedQueries: ["日本 AI", "人工知能", "ロボット"],
          traffic: "90K+",
          country: "JP",
          imageUrl: "https://example.com/japan-ai.jpg",
          pubTime: "1.5h ago",
          source: "NHK Tech",
        },
        {
          slug: "de-ai-2024-01-01",
          title: "Deutschland AI Innovation",
          summary: "Germany leads in AI research and development.",
          detail: "German universities and companies are investing heavily in artificial intelligence. Many startups are creating innovative solutions for industry 4.0.",
          reactions: '"Germany is an AI powerhouse" - Tech expert',
          relatedQueries: ["Germany AI", "AI research", "machine learning Germany"],
          traffic: "60K+",
          country: "DE",
          imageUrl: "https://example.com/germany-ai.jpg",
          pubTime: "2.5h ago",
          source: "Heise",
        },
      ],
    } = body as { articles?: ContentQualityInput[] };

    // === Phase 73: Content Quality Audit ===
    const qualityScores: ContentQualityScore[] = articles.map((article) => scoreContentQuality(article));
    const auditReport: ContentAuditReport = auditContentBatch(articles);

    // === Phase 74: SERP Feature Targeting ===
    const serpReport: BatchSERPReport = batchAnalyzeSERPFeatures(
      articles.map((a) => ({
        keyword: a.title,
        summary: a.summary,
        detail: a.detail,
        relatedQueries: a.relatedQueries,
        pubTime: a.pubTime || "24h ago",
        imageUrl: a.imageUrl || "",
        source: a.source || "Unknown",
        country: a.country,
        traffic: a.traffic,
      }))
    );

    // === Combined Impact ===
    const avgContentScore = auditReport.averageScore;
    const totalSerpOpportunities = serpReport.totalEligibleOpportunities;
    const combinedImpact = `+${Math.round((100 - avgContentScore) / 2)}-${Math.round((100 - avgContentScore) / 1.5)}% dwell time from quality improvements + ${serpReport.aggregateExpectedCTRBoost}`;

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),

        // === Phase 73: Content Quality ===
        phase73Results: {
          auditSummary: {
            totalArticles: auditReport.totalArticles,
            thinContentCount: auditReport.thinContentCount,
            excellentCount: auditReport.excellentCount,
            averageScore: auditReport.averageScore,
          },
          qualityScores: qualityScores.map((s) => ({
            slug: s.slug,
            title: s.title,
            country: s.country,
            overallScore: s.overallScore,
            grade: s.grade,
            isThinContent: s.isThinContent,
            thinContentReasons: s.thinContentReasons,
            improvements: s.improvements.slice(0, 3),
            expectedRankingGain: s.expectedRankingGain,
          })),
          quickWins: auditReport.quickWins.slice(0, 3).map((s) => ({
            slug: s.slug,
            title: s.title,
            currentScore: s.overallScore,
            grade: s.grade,
            topImprovement: s.improvements[0],
          })),
          prioritizedImprovements: auditReport.prioritizedImprovements.slice(0, 5),
          mostCommonIssues: auditReport.mostCommonIssues,
          expectedAggregateGain: auditReport.expectedAggregateTrafficGain,
          checklist: generateContentQualityChecklist(),
        },

        // === Phase 74: SERP Features ===
        phase74Results: {
          batchSummary: {
            totalKeywords: serpReport.totalKeywords,
            totalEligibleOpportunities: serpReport.totalEligibleOpportunities,
            featuredSnippetTargets: serpReport.featuredSnippetTargets,
            newsCarouselTargets: serpReport.newsCarouselTargets,
            paaTargets: serpReport.paaTargets,
          },
          topOpportunities: serpReport.topOpportunities.map((plan) => ({
            keyword: plan.keyword,
            country: plan.country,
            totalEligibleFeatures: plan.totalEligibleFeatures,
            features: plan.features.map((f) => ({
              feature: f.feature,
              eligible: f.eligible,
              eligibilityScore: f.eligibilityScore,
              effort: f.effort,
              estimatedTrafficBoost: f.estimatedTrafficBoost,
              schemaRequired: f.schemaRequired,
              missingElements: f.missingElements.slice(0, 2),
            })),
            topPriority: {
              feature: plan.topPriority.feature,
              effort: plan.topPriority.effort,
              boost: plan.topPriority.estimatedTrafficBoost,
            },
            quickWins: plan.quickWins.length,
            expectedTotalCTRBoost: plan.expectedTotalCTRBoost,
          })),
          aggregateExpectedCTRBoost: serpReport.aggregateExpectedCTRBoost,
          checklist: generateSERPTargetingChecklist(),
        },

        // === Combined Impact (73-74) ===
        combinedImpact: {
          contentScoring: `평균 품질 점수 ${avgContentScore}/100, Thin Content ${auditReport.thinContentCount}개 감지`,
          serpFeatures: `${totalSerpOpportunities}개 SERP 기능 기회 발굴 (Snippet ${serpReport.featuredSnippetTargets}개, News ${serpReport.newsCarouselTargets}개, PAA ${serpReport.paaTargets}개)`,
          totalExpectedImpact: combinedImpact,
          shortTerm: {
            timeframe: "1-2 weeks",
            targets: [
              "Thin content identified → Quick improvements (quality +10-20 points)",
              "SERP feature gaps filled → Featured Snippet + News Carousel deployment",
              "FAQ/PAA schema implementation → +10-20% additional impressions",
            ],
          },
          mediumTerm: {
            timeframe: "2-4 weeks",
            targets: [
              "All quick-win improvements completed → Average score 75+",
              "Top SERP features live with proper schema → Position 0 competition",
              "Content quality driving +5-10 positions per article",
            ],
          },
          expectedOutcome: {
            qualityGain: `+${Math.round((100 - avgContentScore) / 2)}-${Math.round((100 - avgContentScore) / 1.5)}% dwell time`,
            serpGain: serpReport.aggregateExpectedCTRBoost,
            totalTrafficBoost: `+${Math.round((100 - avgContentScore) / 3)}-${Math.round((100 - avgContentScore) / 1.5)}% organic traffic (quality + SERP combined)`,
          },
        },

        // === Prioritized Actions ===
        prioritizedActions: [
          `📊 Phase 73 (Quality): ${auditReport.thinContentCount}개 Thin Content 개선`,
          `  └─ 우선순위: ${auditReport.prioritizedImprovements[0]?.title || "See detailed list"}`,
          `  └─ Quick wins: ${auditReport.quickWins.length}개 (낮은 노력, 높은 효과)`,
          "  └─ Expected gain: " + auditReport.expectedAggregateTrafficGain,
          "",
          `🎯 Phase 74 (SERP): ${serpReport.totalEligibleOpportunities}개 SERP 기능 기회`,
          `  └─ Featured Snippet: ${serpReport.featuredSnippetTargets}개 대상`,
          `  └─ News Carousel: ${serpReport.newsCarouselTargets}개 대상`,
          `  └─ PAA/FAQ: ${serpReport.paaTargets}개 대상`,
          `  └─ Expected CTR boost: ${serpReport.aggregateExpectedCTRBoost}`,
        ],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Phase 73-74 optimization error:", error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Phase 73-74 optimization failed",
      },
      { status: 500 }
    );
  }
}
