import { NextRequest, NextResponse } from "next/server";
import {
  expandLongTailKeywords,
  generateQAContent,
  analyzeContentGaps,
  clusterSearchQueries,
  generateAutocompleteQueries,
  generateSearchQueryChecklist,
} from "@/lib/search-query-expansion";

/**
 * 검색 쿼리 확장 및 Q&A 최적화 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      mainKeyword = "artificial intelligence",
      description = "The field of computer science focused on creating intelligent machines",
      relatedTopics = [
        "machine learning",
        "deep learning",
        "neural networks",
      ],
    } = body;

    // 1. 긴 꼬리 키워드 확장
    const longTailKeywords = expandLongTailKeywords(mainKeyword, []);

    // 2. Q&A 콘텐츠 생성
    const qaContent = generateQAContent(mainKeyword, description, relatedTopics);

    // 3. 콘텐츠 갭 분석
    const contentGaps = analyzeContentGaps(
      [mainKeyword, ...relatedTopics],
      [
        `${mainKeyword} tutorial`,
        `${mainKeyword} for beginners`,
        `${mainKeyword} vs competitors`,
        `${mainKeyword} tools`,
        `${mainKeyword} best practices`,
      ]
    );

    // 4. 쿼리 클러스터링
    const queryClusters = clusterSearchQueries(longTailKeywords.slice(0, 12));

    // 5. 자동완성 쿼리
    const autocompleteQueries = generateAutocompleteQueries(mainKeyword);

    // 6. 체크리스트
    const checklist = generateSearchQueryChecklist();

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        keyword: mainKeyword,
        expansionStats: {
          uniqueQueries: longTailKeywords.length,
          avgSearchVolume: Math.round(
            longTailKeywords.reduce((sum, q) => sum + q.searchVolume, 0) /
              longTailKeywords.length
          ),
          highValueQueries: longTailKeywords.filter(
            (q) => q.searchVolume > 2000
          ).length,
        },
        longTailKeywords: longTailKeywords.slice(0, 10),
        qaContent: {
          items: qaContent,
          totalQuestions: qaContent.length,
          avgAnswerLength: Math.round(
            qaContent.reduce((sum, q) => sum + q.answerLength, 0) /
              qaContent.length
          ),
          featuredSnippetOpportunities: qaContent.filter(
            (q) => q.featured_snippet
          ).length,
        },
        contentGaps: contentGaps.slice(0, 8),
        queryClusters,
        autocompleteQueries,
        checklist,
        nextSteps: [
          "1. Create detailed answers for top 5 QA items",
          "2. Add FAQ schema markup to pages",
          "3. Target long-tail keywords in new content",
          "4. Fill identified content gaps (30+ estimated traffic)",
          "5. Optimize title/description for auto-complete queries",
          "6. Monitor search console for impressions on new queries",
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
      "Search optimization error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Search optimization failed",
      },
      { status: 500 }
    );
  }
}
