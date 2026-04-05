/**
 * 콘텐츠 구조 최적화
 * SEO를 위한 제목 계층구조 및 가독성 개선
 */

export interface ContentStructureScore {
  overallScore: number;
  headingHierarchy: {
    valid: boolean;
    issues: string[];
    score: number;
  };
  readability: {
    avgParagraphLength: number;
    avgSentenceLength: number;
    score: number;
  };
  keywordDensity: {
    density: number;
    isOptimal: boolean;
    recommendation: string;
  };
  listUsage: {
    bulletPoints: number;
    numberedLists: number;
    score: number;
  };
  recommendations: string[];
}

/**
 * 제목 계층구조 분석 및 검증
 */
export function analyzeHeadingHierarchy(headings: Array<{ level: number; text: string }>): {
  valid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;

  if (headings.length === 0) {
    issues.push("❌ H1 태그가 없습니다");
    return { valid: false, issues, score: 0 };
  }

  // H1 체크
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count === 0) {
    issues.push("❌ H1 태그가 없습니다");
    score -= 40;
  } else if (h1Count > 1) {
    issues.push(`⚠️ H1 태그가 ${h1Count}개입니다 (권장: 1개)`);
    score -= 10;
  }

  // 계층 순서 체크
  let previousLevel = 0;
  for (let i = 0; i < headings.length; i++) {
    const currentLevel = headings[i].level;

    // 다음 레벨이 현재 레벨 + 1 이상 뛰어넘는 경우
    if (currentLevel > previousLevel + 1) {
      issues.push(
        `⚠️ 제목 계층이 불규칙합니다: H${previousLevel} → H${currentLevel}`
      );
      score -= 5;
    }

    previousLevel = currentLevel;
  }

  // H2+ 없이 H1만 있는 경우
  const h2AndBelow = headings.filter((h) => h.level >= 2).length;
  if (h2AndBelow === 0 && h1Count > 0) {
    issues.push("⚠️ 하위 제목(H2, H3)이 없습니다");
    score -= 15;
  }

  return {
    valid: issues.length === 0,
    issues,
    score: Math.max(0, score),
  };
}

/**
 * 가독성 점수 계산 (Flesch-Kincaid Grade Level 기반)
 */
export function analyzeReadability(text: string): {
  avgParagraphLength: number;
  avgSentenceLength: number;
  score: number;
  grade: string;
} {
  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
  const sentences = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);

  const avgParagraphLength = Math.round(
    words.length / Math.max(paragraphs.length, 1)
  );
  const avgSentenceLength = Math.round(words.length / Math.max(sentences.length, 1));

  // Flesch Kincaid Grade Level
  const grade =
    0.39 * (words.length / Math.max(sentences.length, 1)) +
    11.8 * (syllableCount(words) / words.length) -
    15.59;

  let score = 100;
  let gradeLabel = "Perfect";

  if (grade <= 6) {
    score = 100;
    gradeLabel = "Excellent (Grade 6)";
  } else if (grade <= 8) {
    score = 90;
    gradeLabel = "Good (Grade 8)";
  } else if (grade <= 10) {
    score = 80;
    gradeLabel = "Fair (Grade 10)";
  } else if (grade <= 12) {
    score = 70;
    gradeLabel = "Difficult (Grade 12)";
  } else {
    score = 50;
    gradeLabel = "Very Difficult (College+)";
  }

  return {
    avgParagraphLength,
    avgSentenceLength,
    score,
    grade: gradeLabel,
  };
}

/**
 * 단어의 음절 수 계산
 */
function syllableCount(words: string[]): number {
  let count = 0;

  words.forEach((word) => {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
    const vowelRuns = cleaned.match(/[aeiouy]+/g) || [];
    const syllables = Math.max(1, vowelRuns.length);
    count += syllables;
  });

  return count;
}

/**
 * 키워드 밀도 분석
 */
export function analyzeKeywordDensity(
  text: string,
  targetKeyword: string
): {
  density: number;
  isOptimal: boolean;
  recommendation: string;
} {
  const words = text.toLowerCase().split(/\s+/);
  const keywordWords = targetKeyword.toLowerCase().split(/\s+/);

  let keywordCount = 0;

  // 정확한 문구 일치
  const regex = new RegExp(targetKeyword, "gi");
  keywordCount = (text.match(regex) || []).length;

  // 개별 단어 일치 (부분 일치)
  let wordMatches = 0;
  keywordWords.forEach((kw) => {
    const count = words.filter((w) => w.includes(kw)).length;
    wordMatches = Math.max(wordMatches, count);
  });

  // 더 높은 값 사용
  keywordCount = Math.max(keywordCount, Math.ceil(wordMatches / keywordWords.length));

  const density = (keywordCount / words.length) * 100;

  let isOptimal = false;
  let recommendation = "";

  if (density < 0.5) {
    recommendation = `❌ 키워드 밀도 너무 낮음 (${density.toFixed(2)}%). 자연스럽게 더 추가하세요`;
  } else if (density < 1) {
    isOptimal = true;
    recommendation = `✅ 키워드 밀도 최적 (${density.toFixed(2)}%)`;
  } else if (density <= 2.5) {
    isOptimal = true;
    recommendation = `✅ 키워드 밀도 양호 (${density.toFixed(2)}%)`;
  } else if (density <= 3.5) {
    recommendation = `⚠️ 키워드 밀도 약간 높음 (${density.toFixed(2)}%). 더 자연스럽게 작성하세요`;
  } else {
    recommendation = `❌ 키워드 스터핑 주의! (${density.toFixed(2)}%). 자연스러운 문맥을 유지하세요`;
  }

  return {
    density: parseFloat(density.toFixed(2)),
    isOptimal,
    recommendation,
  };
}

/**
 * 리스트 사용 분석
 * 리스트는 스캐너빌리티 및 SEO 개선
 */
export function analyzeListUsage(text: string): {
  bulletPoints: number;
  numberedLists: number;
  score: number;
  recommendation: string;
} {
  const bulletPoints = (text.match(/^[\s]*[-•*]/gm) || []).length;
  const numberedLists = (text.match(/^[\s]*\d+\./gm) || []).length;

  const totalLists = bulletPoints + numberedLists;
  const words = text.split(/\s+/).length;

  // 문장 100개당 리스트 1개 이상 권장
  const sentenceCount = text.split(/[.!?]+/).length;
  const idealListCount = Math.ceil(sentenceCount / 5);

  let score = 50;
  let recommendation = "";

  if (totalLists === 0 && sentenceCount > 10) {
    recommendation = "📝 리스트를 추가하면 가독성과 SEO가 개선됩니다";
  } else if (totalLists >= idealListCount) {
    score = 100;
    recommendation = `✅ 리스트 사용이 적절합니다 (${totalLists}개)`;
  } else {
    score = 70;
    recommendation = `⚠️ 더 많은 리스트를 추가하면 좋습니다 (현재: ${totalLists}, 권장: ${idealListCount})`;
  }

  return {
    bulletPoints,
    numberedLists,
    score,
    recommendation,
  };
}

/**
 * 종합 콘텐츠 구조 점수 계산
 */
export function analyzeContentStructure(
  text: string,
  headings: Array<{ level: number; text: string }>,
  targetKeyword: string
): ContentStructureScore {
  const headingAnalysis = analyzeHeadingHierarchy(headings);
  const readabilityAnalysis = analyzeReadability(text);
  const keywordAnalysis = analyzeKeywordDensity(text, targetKeyword);
  const listAnalysis = analyzeListUsage(text);

  const overallScore = Math.round(
    (headingAnalysis.score * 0.25 +
      readabilityAnalysis.score * 0.25 +
      (keywordAnalysis.isOptimal ? 100 : 50) * 0.2 +
      listAnalysis.score * 0.3) /
      1
  );

  const recommendations: string[] = [];

  if (!headingAnalysis.valid) {
    recommendations.push(...headingAnalysis.issues);
  }

  if (readabilityAnalysis.score < 80) {
    recommendations.push(
      `⚠️ 가독성 개선 필요: ${readabilityAnalysis.grade}. 문장과 단락을 짧게 하세요`
    );
  }

  recommendations.push(keywordAnalysis.recommendation);
  recommendations.push(listAnalysis.recommendation);

  if (recommendations.length === 0) {
    recommendations.push("✅ 콘텐츠 구조가 최적화되었습니다");
  }

  return {
    overallScore,
    headingHierarchy: {
      valid: headingAnalysis.valid,
      issues: headingAnalysis.issues,
      score: headingAnalysis.score,
    },
    readability: {
      avgParagraphLength: readabilityAnalysis.avgParagraphLength,
      avgSentenceLength: readabilityAnalysis.avgSentenceLength,
      score: readabilityAnalysis.score,
    },
    keywordDensity: {
      density: keywordAnalysis.density,
      isOptimal: keywordAnalysis.isOptimal,
      recommendation: keywordAnalysis.recommendation,
    },
    listUsage: {
      bulletPoints: listAnalysis.bulletPoints,
      numberedLists: listAnalysis.numberedLists,
      score: listAnalysis.score,
    },
    recommendations,
  };
}

/**
 * 콘텐츠 구조 개선 체크리스트
 */
export function generateContentCheckList(score: ContentStructureScore): string[] {
  const checklist: string[] = [];

  checklist.push("## SEO 콘텐츠 구조 최적화 체크리스트\n");

  checklist.push("### 제목 구조");
  checklist.push(
    score.headingHierarchy.valid ? "✅ H1-H6 계층 올바름" : "❌ 제목 계층 개선 필요"
  );
  score.headingHierarchy.issues.forEach((issue) => {
    checklist.push(`- ${issue}`);
  });

  checklist.push("\n### 가독성");
  checklist.push(
    `📊 평균 단락 길이: ${score.readability.avgParagraphLength}단어`
  );
  checklist.push(
    `📊 평균 문장 길이: ${score.readability.avgSentenceLength}단어`
  );

  checklist.push("\n### 키워드 최적화");
  checklist.push(`- ${score.keywordDensity.recommendation}`);

  checklist.push("\n### 리스트 사용");
  checklist.push(`- 글릿마크: ${score.listUsage.bulletPoints}개`);
  checklist.push(`- 숫자 리스트: ${score.listUsage.numberedLists}개`);

  return checklist;
}
