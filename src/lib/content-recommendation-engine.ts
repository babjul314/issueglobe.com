/**
 * 콘텐츠 추천 엔진 & 갭 분석
 * AI 기반 콘텐츠 전략 및 자동 추천
 */

export interface ContentRecommendation {
  title: string;
  topic: string;
  format: "blog" | "guide" | "infographic" | "video" | "podcast" | "list";
  priority: "critical" | "high" | "medium" | "low";
  estimatedTraffic: number;
  difficulty: "easy" | "medium" | "hard";
  timeToCreate: number; // hours
  keyQueries: string[];
  recommendedLength: number; // words
  relatedTopics: string[];
}

export interface ContentAudit {
  totalPages: number;
  topicsCovered: number;
  gapCount: number;
  avgContentLength: number;
  freshContentPercent: number;
  overlapPercent: number; // duplicate/similar content
  scoreCard: {
    coverage: number; // %
    depth: number; // %
    freshness: number; // %
    diversity: number; // % (format diversity)
  };
}

export interface TrendingTopicScore {
  topic: string;
  relevance: number; // 0-100
  urgency: number; // 0-100
  competitionLevel: number; // 0-100
  winScore: number; // 0-100: higher = more winnable
  recommendation: string;
}

export interface KeywordDensityMap {
  keyword: string;
  coverage: number; // % of pages
  depth: number; // average mentions per page
  recommendation: string;
}

/**
 * 콘텐츠 추천 생성
 */
export function generateContentRecommendations(
  trendingTopics: string[],
  existingContent: string[],
  trafficData: Record<string, number>
): ContentRecommendation[] {
  const recommendations: ContentRecommendation[] = [];

  trendingTopics.forEach((topic, index) => {
    const isExists = existingContent.some(
      (c) =>
        c.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(c.toLowerCase())
    );

    if (isExists) return; // Skip if already covered

    const baseTraffic = trafficData[topic] || Math.floor(Math.random() * 10000);
    const formats: ContentRecommendation["format"][] = [
      "blog",
      "guide",
      "infographic",
      "video",
    ];
    const format = formats[index % formats.length];

    const baseLength: Record<ContentRecommendation["format"], number> = {
      blog: 1500,
      guide: 3000,
      infographic: 500,
      video: 10, // minutes
      podcast: 45,
      list: 2000,
    };

    const timeMap: Record<ContentRecommendation["format"], number> = {
      blog: 4,
      guide: 8,
      infographic: 6,
      video: 12,
      podcast: 10,
      list: 5,
    };

    let priority: ContentRecommendation["priority"] = "low";
    if (baseTraffic > 5000) priority = "critical";
    else if (baseTraffic > 2000) priority = "high";
    else if (baseTraffic > 500) priority = "medium";

    recommendations.push({
      title: `Complete Guide to ${topic}`,
      topic,
      format,
      priority,
      estimatedTraffic: Math.ceil(baseTraffic * 0.15), // 15% CTR from new content
      difficulty: priority === "critical" ? "hard" : "medium",
      timeToCreate: timeMap[format] || 4,
      keyQueries: [
        `${topic}`,
        `what is ${topic}`,
        `${topic} explained`,
        `how to understand ${topic}`,
        `${topic} guide`,
      ],
      recommendedLength: baseLength[format],
      relatedTopics: trendingTopics.slice(0, 3).filter((t) => t !== topic),
    });
  });

  return recommendations
    .sort((a, b) => {
      const priorityMap = { critical: 3, high: 2, medium: 1, low: 0 };
      return (
        priorityMap[b.priority] - priorityMap[a.priority] ||
        b.estimatedTraffic - a.estimatedTraffic
      );
    })
    .slice(0, 15);
}

/**
 * 콘텐츠 감사 보고서
 */
export function generateContentAudit(
  pages: Array<{
    title: string;
    topic: string;
    length: number;
    lastUpdated: Date;
    format: string;
  }>
): ContentAudit {
  const totalPages = pages.length;
  const uniqueTopics = new Set(pages.map((p) => p.topic)).size;
  const avgLength =
    pages.reduce((sum, p) => sum + p.length, 0) / totalPages;

  // 신선도 계산 (30일 이내 업데이트)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const freshPages = pages.filter((p) => p.lastUpdated > thirtyDaysAgo).length;
  const freshPercent = (freshPages / totalPages) * 100;

  // 중복 검사
  const topicCount = new Map<string, number>();
  pages.forEach((p) => {
    topicCount.set(p.topic, (topicCount.get(p.topic) || 0) + 1);
  });
  const overlapPages = Array.from(topicCount.values()).filter((c) => c > 1)
    .length;
  const overlapPercent = (overlapPages / totalPages) * 100;

  // 포맷 다양성
  const formats = new Set(pages.map((p) => p.format)).size;
  const formatDiversity = (formats / 5) * 100; // 5가지 포맷 기준

  const coverage = (uniqueTopics / Math.max(20, uniqueTopics)) * 100;
  const depth = Math.min(100, (avgLength / 2000) * 100);

  return {
    totalPages,
    topicsCovered: uniqueTopics,
    gapCount: Math.max(0, 50 - uniqueTopics), // 50개 주요 주제 기준
    avgContentLength: Math.round(avgLength),
    freshContentPercent: Math.round(freshPercent),
    overlapPercent: Math.round(overlapPercent),
    scoreCard: {
      coverage: Math.round(coverage),
      depth: Math.round(depth),
      freshness: Math.round(freshPercent),
      diversity: Math.round(Math.min(100, formatDiversity)),
    },
  };
}

/**
 * 트렌드 토픽 우선순위 점수
 */
export function scoreTrendingTopic(
  topic: string,
  searchVolume: number,
  backlinks: number,
  position: number,
  competitors: number
): TrendingTopicScore {
  // 관련성: 검색 볼륨 기준
  const relevance = Math.min(100, (searchVolume / 10000) * 100);

  // 긴급성: 최근성 기준 (0-30점) + 상승률 기준 (0-70점)
  const urgency = Math.min(100, 30 + (position <= 3 ? 70 : 40));

  // 경쟁도: 백링크와 경쟁사 수
  const competitionLevel = Math.min(
    100,
    (backlinks / 100) * 50 + (competitors / 20) * 50
  );

  // 승리 점수: 높은 관련성 + 높은 긴급성 + 낮은 경쟁
  const winScore = Math.round(
    (relevance * 0.4 + urgency * 0.4 + (100 - competitionLevel) * 0.2)
  );

  let recommendation = "";
  if (winScore >= 80) {
    recommendation = "🟢 URGENT: Create content immediately (high opportunity)";
  } else if (winScore >= 60) {
    recommendation = "🟡 HIGH PRIORITY: Plan content creation soon";
  } else if (winScore >= 40) {
    recommendation = "⚪ MEDIUM: Include in content roadmap";
  } else {
    recommendation = "⚫ LOW: Monitor before investing resources";
  }

  return {
    topic,
    relevance: Math.round(relevance),
    urgency: Math.round(urgency),
    competitionLevel: Math.round(competitionLevel),
    winScore,
    recommendation,
  };
}

/**
 * 주제별 커버리지 지도
 */
export function mapKeywordCoverage(
  allKeywords: string[],
  pageContent: Record<string, string>
): KeywordDensityMap[] {
  const coverageMap: KeywordDensityMap[] = [];

  allKeywords.forEach((keyword) => {
    let pagesWithKeyword = 0;
    let totalMentions = 0;

    Object.values(pageContent).forEach((content) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = content.match(regex);
      if (matches) {
        pagesWithKeyword++;
        totalMentions += matches.length;
      }
    });

    const coverage = (pagesWithKeyword / Object.keys(pageContent).length) * 100;
    const depth = totalMentions / Math.max(1, pagesWithKeyword);

    let recommendation = "";
    if (coverage < 10) {
      recommendation = `❌ Underrepresented: Add to 5+ more pages`;
    } else if (coverage < 30) {
      recommendation = `⚠️ Limited coverage: Expand to 3+ more pages`;
    } else if (depth > 5) {
      recommendation = `⚠️ Keyword stuffing risk: Reduce frequency`;
    } else {
      recommendation = `✅ Good coverage: Well-distributed`;
    }

    coverageMap.push({
      keyword,
      coverage: Math.round(coverage),
      depth: Math.round(depth * 10) / 10,
      recommendation,
    });
  });

  return coverageMap.sort((a, b) => a.coverage - b.coverage);
}

/**
 * 콘텐츠 전략 체크리스트
 */
export function generateContentStrategyChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 콘텐츠 전략 & 추천 체크리스트\n");

  checklist.push("### 현황 분석");
  checklist.push("- [ ] 전체 페이지 감사 (주제, 길이, 최근성)");
  checklist.push("- [ ] 콘텐츠 갭 식별");
  checklist.push("- [ ] 중복 콘텐츠 검사");
  checklist.push("- [ ] 포맷 다양성 평가");

  checklist.push("\n### 우선순위 결정");
  checklist.push("- [ ] 트렌드 토픽 승리 점수 계산");
  checklist.push("- [ ] 상위 15개 추천 콘텐츠 검토");
  checklist.push("- [ ] 리소스 할당 계획");
  checklist.push("- [ ] 4주 콘텐츠 스프린트 계획");

  checklist.push("\n### 콘텐츠 생성");
  checklist.push("- [ ] Critical 우선순위 콘텐츠 4개 작성");
  checklist.push("- [ ] High 우선순위 콘텐츠 2개 작성");
  checklist.push("- [ ] SEO 최적화 완료");
  checklist.push("- [ ] 내부 링크 추가");

  checklist.push("\n### 발행 & 모니터링");
  checklist.push("- [ ] 검색 콘솔에 URL 제출");
  checklist.push("- [ ] 소셜 미디어 홍보");
  checklist.push("- [ ] 주간 성과 모니터링");
  checklist.push("- [ ] 월간 콘텐츠 리포트 작성");

  return checklist;
}
