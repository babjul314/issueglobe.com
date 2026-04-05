/**
 * 음성 검색 & 자연어 쿼리 최적화
 * Google Assistant, Alexa, Siri 등의 음성 검색을 위한 최적화
 */

export interface VoiceSearchOptimization {
  conversationalQueries: string[];
  answerBoxFormat: string;
  schemaMarkup: Record<string, unknown>;
  faqStructure: Array<{ question: string; answer: string }>;
  featureSnippetContent: string;
}

export interface VoiceSearchQuery {
  query: string;
  intent: "informational" | "navigational" | "commercial" | "transactional";
  format: "question" | "command" | "statement";
  deviceType: "phone" | "smart-speaker" | "car" | "watch";
  expectedAnswer: string;
}

/**
 * 음성 검색을 위한 자연스러운 쿼리 생성
 */
export function generateConversationalQueries(
  trendTitle: string,
  countryName: string
): string[] {
  const queries: string[] = [];

  // 정보형 음성 쿼리
  queries.push(`What is ${trendTitle}?`);
  queries.push(`Why is ${trendTitle} trending?`);
  queries.push(`Tell me about ${trendTitle}`);
  queries.push(`Show me trending topics in ${countryName}`);
  queries.push(`What is trending right now in ${countryName}?`);

  // 질문형 음성 쿼리
  queries.push(`Is ${trendTitle} trending?`);
  queries.push(`How many people are searching for ${trendTitle}?`);
  queries.push(`Where is ${trendTitle} trending?`);
  queries.push(`When did ${trendTitle} start trending?`);

  // 명령형 음성 쿼리
  queries.push(`Show me trending topics`);
  queries.push(`Find trends in ${countryName}`);
  queries.push(`Search for ${trendTitle}`);
  queries.push(`Compare trends across countries`);

  // 장치별 최적화 쿼리
  queries.push(`Alexa, what is trending today?`);
  queries.push(`Hey Google, show me ${trendTitle}`);
  queries.push(`Siri, what's trending in ${countryName}?`);

  return queries;
}

/**
 * 음성 검색 답변 최적화
 * 직접적이고 간단한 답변 형식
 */
export function optimizeForVoiceAnswer(
  trendTitle: string,
  summary: string,
  relatedInfo?: string
): string {
  // 음성 검색은 첫 번째 문장을 중요하게 봄 (27-29 단어가 최적)
  const answerLength = summary.split(" ").length;

  if (answerLength < 20) {
    // 너무 짧음 - 확장
    return `${summary}. ${relatedInfo || `It has been gaining significant attention and search volume.`}`;
  } else if (answerLength > 40) {
    // 너무 길음 - 축약
    const firstSentence = summary.split(". ")[0];
    return firstSentence.length > 100
      ? firstSentence.substring(0, 100) + "..."
      : firstSentence;
  }

  return summary;
}

/**
 * Featured Snippet 최적화 포맷
 */
export function generateFeaturedSnippetContent(
  trendTitle: string,
  definition: string,
  keyPoints: string[]
): {
  paragraph: string;
  list: string;
  table: string;
} {
  return {
    // 단락 형식 (정의형)
    paragraph: `${trendTitle} is ${definition}. ${keyPoints.join(" ")}`,

    // 리스트 형식
    list: `${trendTitle} has several important aspects:\n${keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`,

    // 표 형식
    table: `Key Information about ${trendTitle}:\n${keyPoints.map((p) => `| ${p} |`).join("\n")}`,
  };
}

/**
 * 구조화된 데이터 - QnA Schema (음성 검색 최적화)
 */
export function generateVoiceSearchSchema(
  trendTitle: string,
  questions: string[],
  answers: string[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((question, index) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answers[index] || "See full details above",
        // 음성 검색을 위한 최적화된 답변
        speaker: "IssueGlobe",
        duration: "PT10S", // 약 10초 음성
      },
    })),
  };
}

/**
 * 음성 검색 최적화 점수 계산
 */
export function calculateVoiceSearchScore(content: {
  hasStructuredData: boolean;
  hasFAQSchema: boolean;
  answerLength: number; // 단어 수
  hasConversationalLanguage: boolean;
  hasMobileOptimized: boolean;
  hasLocalMarkup: boolean;
  responseTime: number; // ms
}): {
  score: number;
  grade: string;
  recommendations: string[];
} {
  let score = 0;
  const recommendations: string[] = [];

  // 구조화된 데이터 (20점)
  if (content.hasStructuredData) {
    score += 20;
  } else {
    recommendations.push("❌ 구조화된 데이터(Schema) 추가 필요");
  }

  // FAQ 스키마 (15점)
  if (content.hasFAQSchema) {
    score += 15;
  } else {
    recommendations.push("❌ FAQ Schema 구현 필요");
  }

  // 답변 길이 최적화 (20점)
  const optimalLength = 27; // 최적 음성 답변은 27단어
  const lengthRatio = Math.min(content.answerLength / optimalLength, 1);
  score += lengthRatio * 20;
  if (lengthRatio < 0.8) {
    recommendations.push("⚠️ 답변을 더 길게 작성 (최소 20단어)");
  } else if (lengthRatio > 1.3) {
    recommendations.push("⚠️ 답변을 더 짧게 요약 (27단어 근처)");
  }

  // 자연스러운 언어 (15점)
  if (content.hasConversationalLanguage) {
    score += 15;
  } else {
    recommendations.push("⚠️ 더 자연스러운 음성 친화적 언어 사용");
  }

  // 모바일 최적화 (15점)
  if (content.hasMobileOptimized) {
    score += 15;
  } else {
    recommendations.push("⚠️ 모바일 사용자 경험 개선");
  }

  // 로컬 마크업 (10점)
  if (content.hasLocalMarkup) {
    score += 10;
  }

  // 응답 속도 (5점)
  if (content.responseTime < 2000) {
    score += 5;
  } else {
    recommendations.push(`⚠️ 응답 속도 개선 필요 (현재: ${content.responseTime}ms)`);
  }

  const finalScore = Math.min(100, score);
  let grade = "F";

  if (finalScore >= 90) grade = "A+";
  else if (finalScore >= 80) grade = "A";
  else if (finalScore >= 70) grade = "B";
  else if (finalScore >= 60) grade = "C";
  else if (finalScore >= 50) grade = "D";

  return { score: finalScore, grade, recommendations };
}

/**
 * 스마트 스피커 최적화
 * Alexa, Google Home, Siri 등
 */
export function optimizeForSmartSpeaker(
  trendTitle: string,
  content: string
): {
  googleHome: string;
  alexa: string;
  siri: string;
} {
  const shortSummary = content.split(".")[0]; // 첫 문장만

  return {
    // Google Home - 직설적이고 정보 풍부
    googleHome: `${trendTitle} is ${shortSummary}. ${content.split(". ")[1] || ""}`,

    // Alexa - 짧고 명확한 답변
    alexa: shortSummary,

    // Siri - 자연스러운 대화 형식
    siri: `Let me tell you about ${trendTitle}. ${shortSummary}`,
  };
}

/**
 * 음성 쿼리 의도 분류
 */
export function classifyVoiceQueryIntent(query: string): {
  intent: "informational" | "navigational" | "commercial" | "transactional";
  confidence: number;
  answersNeed: string;
} {
  const query_lower = query.toLowerCase();

  if (
    query_lower.includes("what") ||
    query_lower.includes("tell me") ||
    query_lower.includes("how")
  ) {
    return {
      intent: "informational",
      confidence: 0.9,
      answersNeed:
        "명확한 정의, 설명, 배경 정보를 포함한 상세 답변",
    };
  } else if (
    query_lower.includes("where") ||
    query_lower.includes("find") ||
    query_lower.includes("show")
  ) {
    return {
      intent: "navigational",
      confidence: 0.85,
      answersNeed: "웹사이트로의 직접 링크, 네비게이션 가이드",
    };
  } else if (
    query_lower.includes("best") ||
    query_lower.includes("compare") ||
    query_lower.includes("trending")
  ) {
    return {
      intent: "commercial",
      confidence: 0.8,
      answersNeed: "비교 정보, 검토, 트렌드 분석",
    };
  } else {
    return {
      intent: "transactional",
      confidence: 0.7,
      answersNeed: "실행 가능한 단계, 직접적인 답변",
    };
  }
}

/**
 * 음성 검색 최적화 체크리스트
 */
export function generateVoiceSearchChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 음성 검색 최적화 체크리스트\n");

  checklist.push("### Schema & Structured Data");
  checklist.push("- [ ] FAQ Schema 구현");
  checklist.push("- [ ] QnA 마크업 추가");
  checklist.push("- [ ] Organization Schema 설정");
  checklist.push("- [ ] BreadcrumbList Schema 완성");

  checklist.push("\n### Content Optimization");
  checklist.push("- [ ] 자연스러운 언어로 재작성");
  checklist.push("- [ ] 첫 문장에서 질문 답변");
  checklist.push("- [ ] 27단어 규칙 준수 (최적 길이)");
  checklist.push("- [ ] 음성 친화적 형식 사용 (문어체 피하기)");

  checklist.push("\n### Mobile & Speed");
  checklist.push("- [ ] 모바일 페이지 속도 < 2초");
  checklist.push("- [ ] 모바일 반응형 테스트");
  checklist.push("- [ ] 터치 친화적 UI");
  checklist.push("- [ ] 큰 텍스트 버튼");

  checklist.push("\n### Local SEO");
  checklist.push("- [ ] Google Business Profile 최적화");
  checklist.push("- [ ] 지역 Schema 마크업");
  checklist.push("- [ ] 위치 정보 포함");

  checklist.push("\n### Testing");
  checklist.push("- [ ] Google Assistant 테스트");
  checklist.push("- [ ] Alexa 시뮬레이터 테스트");
  checklist.push("- [ ] iOS Siri 테스트");
  checklist.push("- [ ] 실제 기기에서 테스트");

  return checklist;
}
