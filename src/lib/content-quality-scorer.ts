/**
 * Phase 73: Content Quality Scoring & Thin Content Detection
 * 콘텐츠 품질을 자동 스코어링하여 Thin Content 감지 및 개선 액션 제공
 * (더 풍부한 콘텐츠 = 더 높은 랭킹)
 */

export interface ContentQualityInput {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  reactions: string;
  relatedQueries: string[];
  traffic: string;
  country: string;
  imageUrl: string;
  pubTime?: string;
  source?: string;
}

export interface ContentQualityScore {
  slug: string;
  title: string;
  country: string;
  titleScore: number;
  summaryScore: number;
  detailScore: number;
  reactionScore: number;
  structureScore: number;
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  isThinContent: boolean;
  thinContentReasons: string[];
  improvements: Array<{
    field: string;
    issue: string;
    fix: string;
    estimatedImpact: string;
    priority: "critical" | "high" | "medium" | "low";
  }>;
  expectedRankingGain: number;
}

export interface ContentAuditReport {
  totalArticles: number;
  thinContentCount: number;
  excellentCount: number;
  averageScore: number;
  mostCommonIssues: string[];
  quickWins: ContentQualityScore[];
  prioritizedImprovements: Array<{
    slug: string;
    title: string;
    currentScore: number;
    potentialScore: number;
    estimatedTrafficGain: string;
    topFix: string;
  }>;
  expectedAggregateTrafficGain: string;
}

/**
 * 제목 품질 점수 계산
 */
export function scoreTitleQuality(title: string, traffic: string): number {
  let score = 0;

  // 길이 점수
  const len = title.length;
  if (len >= 50 && len <= 60) score += 30;
  else if (len >= 40 && len <= 70) score += 20;
  else score += 10;

  // 감정 단어 ("breaking", "viral", "trending", "new", "why")
  const emotionalWords = ["breaking", "viral", "trending", "new", "why"];
  if (emotionalWords.some((word) => title.toLowerCase().includes(word))) score += 15;

  // 숫자 포함
  if (/\d+/.test(title)) score += 10;

  // 브랜드 포함
  if (title.toLowerCase().includes("issueglobe")) score += 5;

  // 트래픽 기반 추가 점수
  const trafficNum = parseInt(traffic.replace(/[^0-9]/g, "")) || 0;
  if (trafficNum >= 100000) score += 10;
  else if (trafficNum >= 50000) score += 5;

  return Math.min(100, score);
}

/**
 * 요약 품질 점수 계산
 */
export function scoreSummaryQuality(summary: string): number {
  if (!summary || summary.trim().length === 0) return 0;

  let score = 0;
  const len = summary.length;

  // 길이 점수
  if (len >= 100 && len <= 300) score += 40;
  else if (len >= 50 && len <= 100) score += 20;
  else if (len > 300) score += 30;
  else score += 10;

  // 완성된 문장 (마침표로 끝남)
  if (summary.trim().endsWith(".")) score += 20;

  // 키워드 밀도 (단어 반복 없음)
  const words = summary.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words).size;
  if (uniqueWords / words.length > 0.7) score += 20;

  // 의문사 포함
  if (/who|what|why|how/i.test(summary)) score += 20;

  return Math.min(100, score);
}

/**
 * 상세 콘텐츠 품질 점수 계산
 */
export function scoreDetailQuality(detail: string): number {
  if (!detail || detail.trim().length === 0) return 0;

  let score = 0;

  // 단어 수
  const wordCount = detail.split(/\s+/).length;
  if (wordCount > 200) score += 40;
  else if (wordCount > 100) score += 25;
  else if (wordCount > 50) score += 15;
  else score += 5;

  // 단락 수
  const paragraphs = detail.split("\n").filter((p) => p.trim().length > 0).length;
  if (paragraphs >= 3) score += 30;
  else if (paragraphs === 2) score += 20;
  else if (paragraphs === 1) score += 10;

  // 문장 다양성
  const sentences = detail.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length > 0) {
    const avgSentenceLength = wordCount / sentences.length;
    if (avgSentenceLength >= 10 && avgSentenceLength <= 25) score += 30;
  }

  return Math.min(100, score);
}

/**
 * 반응(소셜 신호) 품질 점수 계산
 */
export function scoreReactionQuality(reactions: string): number {
  if (!reactions || reactions.trim().length === 0) return 0;

  let score = 0;

  // 따옴표 포함 (소셜 반응 형식)
  if (reactions.includes('"') || reactions.includes("'")) score += 30;

  // 길이
  const len = reactions.length;
  if (len >= 50 && len <= 200) score += 40;
  else score += 20;

  // 감정적 단어
  const emotionalWords = ["amazing", "shocked", "incredible", "love", "hate"];
  if (emotionalWords.some((word) => reactions.toLowerCase().includes(word))) score += 30;

  return Math.min(100, score);
}

/**
 * 구조 품질 점수 계산 (이미지, 관련쿼리, 메타데이터 등)
 */
export function scoreStructureQuality(item: ContentQualityInput): number {
  let score = 0;

  // 이미지 존재
  if (item.imageUrl && item.imageUrl.trim().length > 0) score += 30;

  // 관련 쿼리 수
  const queryCount = item.relatedQueries?.length || 0;
  if (queryCount >= 5) score += 35;
  else if (queryCount >= 3) score += 25;
  else if (queryCount >= 1) score += 15;

  // 국가 코드
  if (item.country && item.country.trim().length > 0) score += 10;

  // 트래픽 파싱
  const trafficNum = parseInt(item.traffic.replace(/[^0-9]/g, "")) || 0;
  if (trafficNum > 0) score += 10;
  if (trafficNum >= 10000) score += 15;

  return Math.min(100, score);
}

/**
 * 단일 콘텐츠 품질 점수 계산
 */
export function scoreContentQuality(item: ContentQualityInput): ContentQualityScore {
  const titleScore = scoreTitleQuality(item.title, item.traffic);
  const summaryScore = scoreSummaryQuality(item.summary);
  const detailScore = scoreDetailQuality(item.detail);
  const reactionScore = scoreReactionQuality(item.reactions);
  const structureScore = scoreStructureQuality(item);

  // 가중치 평균: title*0.25 + summary*0.25 + detail*0.25 + reaction*0.1 + structure*0.15
  const overallScore = Math.round(
    titleScore * 0.25 + summaryScore * 0.25 + detailScore * 0.25 + reactionScore * 0.1 + structureScore * 0.15
  );

  // 등급
  let grade: "A" | "B" | "C" | "D" | "F";
  if (overallScore >= 90) grade = "A";
  else if (overallScore >= 75) grade = "B";
  else if (overallScore >= 60) grade = "C";
  else if (overallScore >= 45) grade = "D";
  else grade = "F";

  // Thin Content 판정
  const isThinContent = overallScore < 50;
  const thinContentReasons: string[] = [];

  if (titleScore < 50) thinContentReasons.push("제목이 최적화되지 않음 (길이 또는 감정 단어 부족)");
  if (summaryScore < 50) thinContentReasons.push("요약이 너무 짧거나 불완전함 (100자 미만 또는 마침표 없음)");
  if (detailScore < 50) thinContentReasons.push("상세 콘텐츠가 얕음 (100단어 미만 또는 단락 부족)");
  if (reactionScore < 50) thinContentReasons.push("소셜 신호/반응이 부족함");
  if (structureScore < 50) thinContentReasons.push("이미지/관련쿼리 등 구조적 신호 부족");

  // 개선 액션
  const improvements: ContentQualityScore["improvements"] = [];

  if (titleScore < 50) {
    improvements.push({
      field: "title",
      issue: `제목 점수 ${titleScore}/100 (너무 짧거나 감정 단어 부족)`,
      fix: '50-60자, "breaking", "viral", "trending", "new", "why" 등 감정 단어 포함',
      estimatedImpact: "+5-10 positions",
      priority: "high",
    });
  }

  if (summaryScore < 50) {
    improvements.push({
      field: "summary",
      issue: `요약 점수 ${summaryScore}/100 (짧거나 마침표 없음)`,
      fix: "100-300자 범위, 마침표로 끝남, who/what/why/how 포함",
      estimatedImpact: "+5-10 positions",
      priority: "high",
    });
  }

  if (detailScore < 50) {
    improvements.push({
      field: "detail",
      issue: `상세 점수 ${detailScore}/100 (너무 얕음)`,
      fix: "최소 100단어, 3개 이상 단락, 평균 문장 길이 10-25 단어",
      estimatedImpact: "+10-15 positions",
      priority: "critical",
    });
  }

  if (reactionScore < 50) {
    improvements.push({
      field: "reactions",
      issue: `반응 점수 ${reactionScore}/100 (소셜 신호 부족)`,
      fix: '따옴표 포함, 50-200자, "amazing", "shocked" 등 감정 단어',
      estimatedImpact: "+3-5 positions",
      priority: "medium",
    });
  }

  if (structureScore < 50) {
    improvements.push({
      field: "structure",
      issue: `구조 점수 ${structureScore}/100 (이미지/메타데이터 부족)`,
      fix: "이미지 URL 추가, 관련쿼리 3개 이상, 높은 트래픽 키워드",
      estimatedImpact: "+5-10 positions",
      priority: "medium",
    });
  }

  // 예상 랭킹 개선
  const expectedRankingGain = improvements.length * 3;

  return {
    slug: item.slug,
    title: item.title,
    country: item.country,
    titleScore,
    summaryScore,
    detailScore,
    reactionScore,
    structureScore,
    overallScore,
    grade,
    isThinContent,
    thinContentReasons,
    improvements,
    expectedRankingGain,
  };
}

/**
 * 배치 콘텐츠 감사
 */
export function auditContentBatch(items: ContentQualityInput[]): ContentAuditReport {
  const scores = items.map((item) => scoreContentQuality(item));

  // 통계
  const thinContentCount = scores.filter((s) => s.isThinContent).length;
  const excellentCount = scores.filter((s) => s.grade === "A").length;
  const averageScore = Math.round(scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length);

  // 가장 흔한 이슈
  const allReasons: string[] = [];
  scores.forEach((s) => allReasons.push(...s.thinContentReasons));
  const reasonCounts = new Map<string, number>();
  allReasons.forEach((reason) => {
    reasonCounts.set(reason, (reasonCounts.get(reason) || 0) + 1);
  });
  const mostCommonIssues = Array.from(reasonCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([reason]) => reason);

  // Quick Wins: grade C or D + 최소 1 field >= 40
  const quickWins = scores.filter((s) => {
    if (s.grade !== "C" && s.grade !== "D") return false;
    return (
      s.titleScore >= 40 || s.summaryScore >= 40 || s.detailScore >= 40 || s.reactionScore >= 40 || s.structureScore >= 40
    );
  });

  // 우선순위 개선 항목 (점수 낮은 순)
  const prioritizedImprovements = scores
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      currentScore: s.overallScore,
      potentialScore: Math.min(100, s.overallScore + s.expectedRankingGain),
      estimatedTrafficGain: `+${Math.round(s.expectedRankingGain * 2)}-${Math.round(s.expectedRankingGain * 4)}% (모든 개선 적용 시)`,
      topFix: s.improvements[0]?.fix || "N/A",
    }))
    .sort((a, b) => a.currentScore - b.currentScore)
    .slice(0, 10);

  // 예상 총 트래픽 개선
  const totalRankingGainPoints = scores.reduce((sum, s) => sum + s.expectedRankingGain, 0);
  const expectedAggregateTrafficGain = `+${Math.round((totalRankingGainPoints / scores.length) * 2)}-${Math.round((totalRankingGainPoints / scores.length) * 5)}% (전체 콘텐츠 개선 시)`;

  return {
    totalArticles: items.length,
    thinContentCount,
    excellentCount,
    averageScore,
    mostCommonIssues,
    quickWins,
    prioritizedImprovements,
    expectedAggregateTrafficGain,
  };
}

/**
 * 콘텐츠 품질 체크리스트
 */
export function generateContentQualityChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 73: Content Quality Scoring 체크리스트\n");

  checklist.push("### 1. Content Quality Audit");
  checklist.push("- [ ] Run auditContentBatch() on all trend articles");
  checklist.push("- [ ] Identify thin content (score < 50)");
  checklist.push("- [ ] Review most common issues");
  checklist.push("- [ ] Prioritize quick wins (grade C/D with salvageable fields)");

  checklist.push("\n### 2. Content Improvement (Priority: Critical/High)");
  checklist.push("- [ ] Expand detail section to 100+ words minimum");
  checklist.push("- [ ] Optimize title (50-60 chars, emotion word, traffic signal)");
  checklist.push("- [ ] Enhance summary (100-300 chars, complete sentence, intent word)");
  checklist.push("- [ ] Add reactions (quotes, 50-200 chars, emotional language)");
  checklist.push("- [ ] Improve structure (image URL, related queries, metadata)");

  checklist.push("\n### 3. Monitoring & Verification");
  checklist.push("- [ ] Rerun scoreContentQuality() after each improvement");
  checklist.push("- [ ] Track grade improvement (D→C, C→B, etc.)");
  checklist.push("- [ ] Monitor ranking changes in GSC (2-week lag)");
  checklist.push("- [ ] Target: Reduce thin content to <10%, average score 75+");

  return checklist;
}
