/**
 * Phase 66: Voice Search & Conversational Query Optimization
 * 음성 검색(Alexa, Google Assistant, Siri) 및 자연어 질문 최적화
 * Featured Snippet + Position 0 최적화로 음성 답변 획득
 */

export interface VoiceQuery {
  query: string;
  format: "question" | "statement" | "command";
  queryLength: number; // words
  answerLength: number; // words (optimal: 40-60)
  currentPosition: number;
  voiceSearchEligibility: number; // 0-100
}

export interface ConversationalKeyword {
  keyword: string;
  voiceVariant: string; // How/What/Where/When/Why format
  searchVolume: number;
  difficulty: number;
  voiceOptimized: boolean;
  requiredAnswerFormat: "paragraph" | "list" | "table" | "definition";
}

export interface VoiceSearchStrategy {
  queryVariations: VoiceQuery[];
  conversationalKeywords: ConversationalKeyword[];
  contentRecommendations: string[];
  expectedVoiceTraffic: number; // monthly
  implementationPriority: "critical" | "high" | "medium" | "low";
}

/**
 * 음성 검색 쿼리 분석
 */
export function analyzeVoiceQuery(
  query: string,
  currentRank: number,
  hasAnswer: boolean // FAQPage에 답변 있는지
): VoiceQuery {
  const words = query.split(" ");
  const queryLength = words.length;

  // 음성 쿼리 특징:
  // 1. 길다 (평균 5-7 words, 타이핑은 1-2 words)
  // 2. 자연스럽다 ("the best restaurants" vs "restaurants")
  // 3. 질문 형식 ("How to X?", "What is X?")

  const isQuestionFormat = query.match(/^(how|what|where|when|why|can|do|is|are)/i);
  const isNaturalLanguage = queryLength > 4;

  let voiceSearchEligibility = 50;

  if (isQuestionFormat) voiceSearchEligibility += 25;
  if (isNaturalLanguage) voiceSearchEligibility += 15;
  if (hasAnswer) voiceSearchEligibility += 10;
  if (currentRank <= 3) voiceSearchEligibility += 20;

  voiceSearchEligibility = Math.min(100, voiceSearchEligibility);

  // 최적 답변 길이: 40-60 words (음성으로 5-10초)
  const optimalAnswerLength = 50;

  return {
    query,
    format: isQuestionFormat ? "question" : isNaturalLanguage ? "statement" : "command",
    queryLength,
    answerLength: optimalAnswerLength,
    currentPosition: currentRank,
    voiceSearchEligibility,
  };
}

/**
 * 자연어 키워드 확장
 * "AI" → "What is AI?", "How does AI work?", "Where is AI used?"
 */
export function expandConversationalKeywords(coreKeyword: string): ConversationalKeyword[] {
  const variations: ConversationalKeyword[] = [];

  // Question formats (most important for voice)
  const questionFormats = [
    { prefix: "What is", voice: `what is ${coreKeyword}`, difficulty: 35 },
    { prefix: "How to", voice: `how to ${coreKeyword}`, difficulty: 40 },
    { prefix: "How does", voice: `how does ${coreKeyword} work`, difficulty: 45 },
    { prefix: "Where is", voice: `where is ${coreKeyword} used`, difficulty: 50 },
    { prefix: "Why is", voice: `why is ${coreKeyword} important`, difficulty: 50 },
    { prefix: "When is", voice: `when should you use ${coreKeyword}`, difficulty: 55 },
    { prefix: "Can you", voice: `can you explain ${coreKeyword}`, difficulty: 60 },
    { prefix: "What are", voice: `what are the benefits of ${coreKeyword}`, difficulty: 45 },
  ];

  questionFormats.forEach((format) => {
    variations.push({
      keyword: coreKeyword,
      voiceVariant: format.voice,
      searchVolume: Math.floor(50 + Math.random() * 150), // 50-200
      difficulty: format.difficulty,
      voiceOptimized: true,
      requiredAnswerFormat: "paragraph",
    });
  });

  return variations;
}

/**
 * 음성 검색 최적화 스코어 계산
 */
export function calculateVoiceOptimizationScore(
  contentData: {
    hasFeatureSnippet: boolean;
    hasFAQPage: boolean;
    shortAnswerProvided: boolean; // 40-60 words
    questionCovered: number; // (What, How, Where, When, Why 몇 개?)
    schemaMarkup: boolean;
    conversationalTone: boolean;
    answerPosition: "top" | "middle" | "bottom";
  }
): {
  score: number; // 0-100
  readiness: "ready" | "preparing" | "not_ready";
  gaps: string[];
} {
  let score = 50; // baseline

  if (contentData.hasFeatureSnippet) score += 20;
  if (contentData.hasFAQPage) score += 15;
  if (contentData.shortAnswerProvided) score += 10;
  score += contentData.questionCovered * 3; // max 15
  if (contentData.schemaMarkup) score += 10;
  if (contentData.conversationalTone) score += 5;
  if (contentData.answerPosition === "top") score += 10;
  else if (contentData.answerPosition === "middle") score += 5;

  score = Math.min(100, score);

  let readiness: "ready" | "preparing" | "not_ready" = "not_ready";
  if (score > 75) readiness = "ready";
  else if (score > 50) readiness = "preparing";

  const gaps: string[] = [];
  if (!contentData.hasFeatureSnippet) gaps.push("❌ Featured Snippet 없음");
  if (!contentData.hasFAQPage) gaps.push("❌ FAQPage schema 없음");
  if (!contentData.shortAnswerProvided) gaps.push("❌ 40-60 word 답변 없음");
  if (contentData.questionCovered < 3) gaps.push("⚠️ 질문 형식 부족");
  if (!contentData.schemaMarkup) gaps.push("❌ Schema markup 없음");
  if (!contentData.conversationalTone) gaps.push("⚠️ 자연스러운 톤 부족");

  return { score: Math.round(score), readiness, gaps };
}

/**
 * 음성 검색 콘텐츠 최적화 권장사항
 */
export function generateVoiceSearchContentRecommendations(
  keyword: string,
  currentScore: number
): string[] {
  const recommendations: string[] = [];

  // 상위 3가지 우선순위
  if (currentScore < 80) {
    recommendations.push(`🎯 Primary: Featured Snippet 최적화`);
    recommendations.push(
      `  - 40-60 word 답변을 콘텐츠 상단에 배치`
    );
    recommendations.push(
      `  - 질문: "What is ${keyword}?", "How to ${keyword}?"`
    );
  }

  if (currentScore < 70) {
    recommendations.push(`🎯 Secondary: FAQPage Schema 추가`);
    recommendations.push(
      `  - 최소 5-10개 Q&A 추가`
    );
    recommendations.push(
      `  - 각 답변: 40-60 words (음성 최적화)`
    );
  }

  if (currentScore < 75) {
    recommendations.push(`🎯 Tertiary: 자연어 콘텐츠`);
    recommendations.push(
      `  - "How do you...", "What are the...", "Where can you..." 형식`
    );
    recommendations.push(
      `  - 회화체 (formal이 아닌 conversational)`
    );
  }

  // 추가 팁
  recommendations.push("\n💡 추가 최적화:");
  recommendations.push("- 숫자와 통계 포함 (음성으로 명확한 답변)");
  recommendations.push("- 목록 형식 활용 (3-5개 항목)");
  recommendations.push("- 느린 인터넷 환경 고려 (빠른 답변)");
  recommendations.push("- 모바일 우선 (음성 검색 대부분 모바일)");

  return recommendations;
}

/**
 * Voice Search 전략 생성
 */
export function generateVoiceSearchStrategy(
  coreKeyword: string,
  existingRank: number,
  currentOptimizationScore: number
): VoiceSearchStrategy {
  const queryVariations = [
    analyzeVoiceQuery(`what is ${coreKeyword}`, existingRank, true),
    analyzeVoiceQuery(`how to use ${coreKeyword}`, existingRank + 2, false),
    analyzeVoiceQuery(`why is ${coreKeyword} important`, existingRank + 5, false),
    analyzeVoiceQuery(`where is ${coreKeyword} used`, existingRank + 3, false),
  ];

  const conversationalKeywords = expandConversationalKeywords(coreKeyword);

  const recommendations = generateVoiceSearchContentRecommendations(
    coreKeyword,
    currentOptimizationScore
  );

  // 음성 검색 트래픽 추정
  // Voice search는 현재 전체 검색의 5-10%, 향후 50% 예상
  // Featured Snippet 획득 시 +100-500 음성 검색 클릭/월
  const expectedVoiceTraffic =
    currentOptimizationScore > 75
      ? Math.floor(200 + Math.random() * 300) // 200-500
      : currentOptimizationScore > 50
        ? Math.floor(50 + Math.random() * 150) // 50-200
        : Math.floor(10 + Math.random() * 40); // 10-50

  return {
    queryVariations,
    conversationalKeywords,
    contentRecommendations: recommendations,
    expectedVoiceTraffic,
    implementationPriority:
      currentOptimizationScore > 70
        ? "medium"
        : currentOptimizationScore > 50
          ? "high"
          : "critical",
  };
}

/**
 * Voice Search 체크리스트
 */
export function generateVoiceSearchChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 66: Voice Search Optimization 체크리스트\n");

  checklist.push("### 콘텐츠 최적화");
  checklist.push("- [ ] 질문 형식 키워드 식별 (What, How, Where, When, Why)");
  checklist.push("- [ ] 40-60 word 답변을 콘텐츠 상단에 배치");
  checklist.push("- [ ] Featured Snippet 타겟 (현재 top 10 키워드)");
  checklist.push("- [ ] 자연스러운 회화체로 작성");
  checklist.push("- [ ] 숫자/통계 포함");

  checklist.push("\n### Schema Markup");
  checklist.push("- [ ] FAQPage schema: 최소 5-10 Q&A");
  checklist.push("- [ ] 각 답변: 40-60 words");
  checklist.push("- [ ] BreadcrumbList (음성 컨텍스트)");
  checklist.push("- [ ] SpeakableRange markup (음성 최적화된 부분 표시)");

  checklist.push("\n### Featured Snippet 최적화");
  checklist.push("- [ ] Paragraph snippet: 정의/설명 (40-60 words)");
  checklist.push("- [ ] List snippet: 단계별 지침");
  checklist.push("- [ ] Table snippet: 비교/통계");
  checklist.push("- [ ] 현재 top 5 여야 snippet 획득");

  checklist.push("\n### 모바일 최적화");
  checklist.push("- [ ] 모바일 속도 <3초 (음성 검색은 모바일)");
  checklist.push("- [ ] 터치하기 쉬운 UI");
  checklist.push("- [ ] 음성 검색 버튼 추가");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] Google Search Console: 'Voice' 쿼리 추적");
  checklist.push("- [ ] Featured Snippet 획득 여부");
  checklist.push("- [ ] 음성 검색 트래픽 분석");
  checklist.push("- [ ] Page speed insights 점수 모니터링");

  return checklist;
}

/**
 * Voice Search 전략 가이드
 */
export function generateVoiceSearchStrategy_Guide(): string[] {
  const strategy: string[] = [];

  strategy.push("## Phase 66: Voice Search & Conversational Query 전략\n");

  strategy.push("### 왜 음성 검색인가?");
  strategy.push("- 2024: 전체 검색의 5-10% (향후 50% 예상)");
  strategy.push("- 모바일 기반: 운전 중, 요리 중, 손이 바쁠 때");
  strategy.push("- Featured Snippet 획득 = 음성 답변 독점");
  strategy.push("- 자연어 쿼리: 긴꼬리 키워드의 미래");

  strategy.push("\n### 4가지 최적화 Pillar");
  strategy.push("");
  strategy.push("1. **Featured Snippet 최적화**");
  strategy.push("   - 40-60 word 정의/답변 (음성으로 5-10초)");
  strategy.push("   - H2나 콘텐츠 상단에 배치");
  strategy.push("   - 현재 rank 5 이내여야 snippet 획득");
  strategy.push("   - Impact: +100-500 음성 클릭/월");
  strategy.push("");
  strategy.push("2. **FAQPage Schema**");
  strategy.push("   - 5-10개 Q&A");
  strategy.push("   - 각 답변 40-60 words (음성 최적)");
  strategy.push("   - 자연스러운 질문 형식");
  strategy.push("");
  strategy.push("3. **Conversational Tone**");
  strategy.push("   - 'People also ask' 형식 자연스러운 언어");
  strategy.push("   - '우리는', '당신은' 같은 2인칭");
  strategy.push("   - Jargon 최소화, 명확한 설명");
  strategy.push("");
  strategy.push("4. **Mobile-First Performance**");
  strategy.push("   - Core Web Vitals 최적화");
  strategy.push("   - Page Speed <3초");
  strategy.push("   - 음성 검색 사용자 90%가 모바일");

  strategy.push("\n### 예상 효과");
  strategy.push("- Featured Snippet 획득: +100-500 음성 클릭/월");
  strategy.push("- Voice 트래픽: 기존 검색의 5-10% (미래 50%)");
  strategy.push("- Brand awareness: 음성으로 브랜드 이름 언급");
  strategy.push("- Featured Snippet + Rich Results: +30-50% CTR");

  strategy.push("\n### 2주 빠른 구현");
  strategy.push("Week 1:");
  strategy.push("- Top 10 질문형 키워드 식별");
  strategy.push("- 40-60 word 정의 답변 콘텐츠 상단 추가");
  strategy.push("- FAQPage schema 추가 (5-10 Q&A)");
  strategy.push("");
  strategy.push("Week 2:");
  strategy.push("- Featured Snippet 타겟 (현재 rank 5-10만 함)");
  strategy.push("- Mobile page speed 최적화");
  strategy.push("- Google Search Console에서 'Voice' 쿼리 모니터링");

  return strategy;
}
