import { NextRequest, NextResponse } from "next/server";
import {
  generateContentRecommendations,
  generateContentAudit,
  scoreTrendingTopic,
  mapKeywordCoverage,
  generateContentStrategyChecklist,
} from "@/lib/content-recommendation-engine";

/**
 * 콘텐츠 추천 및 전략 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      trendingTopics = [
        "artificial intelligence",
        "climate change",
        "quantum computing",
        "blockchain",
        "metaverse",
      ],
      existingContent = ["AI trends", "climate updates"],
      trafficData = {},
    } = body;

    // 1. 콘텐츠 추천 생성
    const recommendations = generateContentRecommendations(
      trendingTopics,
      existingContent,
      trafficData
    );

    // 2. 콘텐츠 감사
    const auditPages = existingContent.map((topic: string) => ({
      title: topic,
      topic: topic.toLowerCase(),
      length: Math.floor(Math.random() * 3000) + 1000,
      lastUpdated: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      ),
      format: ["blog", "guide", "video"][Math.floor(Math.random() * 3)] as "blog" | "guide" | "video",
    }));

    const contentAudit = generateContentAudit(auditPages);

    // 3. 트렌드 토픽 점수
    const topicScores = trendingTopics.map((topic: string) =>
      scoreTrendingTopic(
        topic,
        Math.floor(Math.random() * 10000) + 1000,
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 30) + 1,
        Math.floor(Math.random() * 20)
      )
    );

    // 4. 키워드 커버리지 맵
    const allKeywords = trendingTopics.slice(0, 5) as string[];
    const pageContent: Record<string, string> = Object.fromEntries(
      existingContent.map((c: string) => [c, c.toLowerCase().repeat(10)])
    );
    const keywordCoverage = mapKeywordCoverage(allKeywords, pageContent);

    // 5. 체크리스트
    const checklist = generateContentStrategyChecklist();

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        contentAudit: {
          ...contentAudit,
          scoreCard: {
            ...contentAudit.scoreCard,
            overall: Math.round(
              (contentAudit.scoreCard.coverage +
                contentAudit.scoreCard.depth +
                contentAudit.scoreCard.freshness +
                contentAudit.scoreCard.diversity) /
                4
            ),
          },
        },
        recommendations: recommendations.slice(0, 10),
        recommendationStats: {
          critical: recommendations.filter((r) => r.priority === "critical")
            .length,
          high: recommendations.filter((r) => r.priority === "high").length,
          totalEstimatedTraffic: recommendations.reduce(
            (sum, r) => sum + r.estimatedTraffic,
            0
          ),
        },
        topicScores,
        keywordCoverage,
        strategy: {
          approach:
            "Prioritize critical topics, fill content gaps, diversify formats",
          roadmap: [
            "Week 1-2: Create 2 critical priority content pieces",
            "Week 3-4: Create 3 high priority content pieces",
            "Month 2: Fill top 5 content gaps",
            "Month 3: Expand format diversity (video, infographic)",
          ],
        },
        checklist,
        nextSteps: [
          `1. Create ${recommendations.filter((r) => r.priority === "critical").length} critical content pieces this month`,
          "2. Audit existing content for outdated information",
          "3. Fill top 5 identified content gaps",
          "4. Diversify content formats (30% video target)",
          "5. Implement content calendar for next 3 months",
          "6. Set up monthly content audit cycle",
        ],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      }
    );
  } catch (error) {
    console.error(
      "Content recommendation error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Content recommendation failed",
      },
      { status: 500 }
    );
  }
}
