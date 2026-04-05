/**
 * Phase 62: SERP Snippet Optimizer & Search Feature Integration
 * Google SERP 에서 보이는 제목과 설명문 최적화로 CTR 향상
 * Featured Snippet, Knowledge Panel, People Also Ask, News Results 최적화
 */

export interface SnippetOptimization {
  metaTitle: string;
  metaDescription: string;
  headlineVariations: string[];
  descriptionVariations: string[];
  expectedCTR: number; // 0-100%
  expectedClicks: number;
  suggestions: string[];
}

export interface FeaturedSnippetTarget {
  query: string;
  snippetType: "paragraph" | "list" | "table" | "definition";
  currentRank: number;
  estimatedTraffic: number;
  requirements: string[];
  implementation: string;
}

export interface SearchFeatureStrategy {
  keyword: string;
  targetFeatures: string[];
  contentStructure: string[];
  schemaMarkupRequired: string[];
  expectedTrafficGain: string;
}

/**
 * 메타 타이틀 최적화
 * 길이, 키워드 위치, 감정 신호를 고려한 CTR 최대화
 */
export function optimizeMetaTitle(pageTitle: string, primaryKeyword: string): {
  optimizedTitle: string;
  length: number;
  ctrBoost: number; // %
  explanation: string;
} {
  // 최적 길이: 50-60자 (데스크톱), 30-40자 (모바일)
  const optimalLength = 55;

  // 1. 키워드를 제목 앞에 배치 (모바일 표시 우선)
  let optimizedTitle = pageTitle;

  if (primaryKeyword && !pageTitle.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    optimizedTitle = `${primaryKeyword} | ${pageTitle}`.slice(0, optimalLength);
  }

  // 2. 감정 신호 추가 (선택적 - 스팸이 아닌 범위 내에서)
  const emotionalSignals = ["🔥", "✨", "💡"];
  const hasSignal = emotionalSignals.some((sig) => optimizedTitle.includes(sig));

  if (!hasSignal && optimizedTitle.length < optimalLength - 3) {
    // 선택적으로 이모지 추가 (분야에 따라)
    optimizedTitle = `🔥 ${optimizedTitle}`;
  }

  // 3. 브랜드명 추가 (권장)
  if (!optimizedTitle.includes("IssueGlobe") && optimizedTitle.length < optimalLength - 12) {
    optimizedTitle = `${optimizedTitle} | IssueGlobe`.slice(0, optimalLength);
  }

  // CTR 부스트 계산
  let ctrBoost = 0;
  if (optimizedTitle.includes(primaryKeyword)) ctrBoost += 10;
  if (optimizedTitle.includes("🔥") || optimizedTitle.includes("✨")) ctrBoost += 5;
  if (optimizedTitle.includes("IssueGlobe")) ctrBoost += 3;
  if (optimizedTitle.length > 48 && optimizedTitle.length < 62) ctrBoost += 5;

  return {
    optimizedTitle: optimizedTitle.slice(0, 60),
    length: optimizedTitle.slice(0, 60).length,
    ctrBoost,
    explanation: `Keyword position: Front. Emotional signal: ${hasSignal ? "Yes" : "No"}. Brand: Included.`,
  };
}

/**
 * 메타 설명 최적화
 * 40-160자, 주요 키워드 포함, 행동 유도 (CTA)
 */
export function optimizeMetaDescription(description: string, primaryKeyword: string): {
  optimizedDescription: string;
  length: number;
  ctrBoost: number;
  explanation: string;
} {
  const minLength = 100;
  const maxLength = 160;

  let optimized = description;

  // 1. 길이 조정
  if (optimized.length < minLength) {
    // 너무 짧으면 추가 정보 붙이기
    optimized += ` Learn more about ${primaryKeyword}.`;
  } else if (optimized.length > maxLength) {
    // 너무 길면 줄이기
    optimized = optimized.slice(0, maxLength - 3) + "...";
  }

  // 2. 키워드 확인 (자연스럽게)
  let ctrBoost = 0;
  if (optimized.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    ctrBoost += 10;
  }

  // 3. CTA 포함 확인
  const ctaPhrases = [
    "learn",
    "discover",
    "find out",
    "explore",
    "read",
    "check",
    "see",
    "view",
  ];
  if (ctaPhrases.some((cta) => optimized.toLowerCase().includes(cta))) {
    ctrBoost += 8;
  }

  // 4. 숫자/통계 포함
  if (/\d+/.test(optimized)) {
    ctrBoost += 5;
  }

  // 5. 긍정적 신호어
  const positiveSignals = ["trending", "breaking", "essential", "must-know", "critical"];
  if (positiveSignals.some((sig) => optimized.toLowerCase().includes(sig))) {
    ctrBoost += 5;
  }

  return {
    optimizedDescription: optimized.slice(0, 160),
    length: optimized.slice(0, 160).length,
    ctrBoost,
    explanation: `Keyword included: ${optimized.includes(primaryKeyword) ? "Yes" : "No"}. CTA present: ${ctaPhrases.some((cta) => optimized.includes(cta)) ? "Yes" : "No"}. Stats/Numbers: ${/\d+/.test(optimized) ? "Yes" : "No"}.`,
  };
}

/**
 * Featured Snippet 최적화
 */
export function optimizeFeaturedSnippet(query: string): FeaturedSnippetTarget {
  // 예시 데이터 (실제로는 Search Console 데이터 필요)
  const snippetStrategies: Record<string, FeaturedSnippetTarget> = {
    default: {
      query,
      snippetType: "paragraph",
      currentRank: 8,
      estimatedTraffic: 150,
      requirements: [
        "40-60자 답변을 텍스트 블록으로 제공",
        "상위 5개 순위에 필수",
        "질문을 명확하게 반복",
        "정확한 정의 또는 설명",
      ],
      implementation: "Add <p> block at top of content with concise answer",
    },
  };

  return snippetStrategies.default;
}

/**
 * People Also Ask (관련 질문) 최적화
 */
export function optimizePeopleAlsoAsk(mainKeyword: string): Array<{
  relatedQuestion: string;
  answerLength: "40-60" | "60-100" | "100-150";
  contentSection: string;
  implementation: string;
}> {
  const relatedQuestions = [
    `What is ${mainKeyword}?`,
    `How does ${mainKeyword} work?`,
    `Why is ${mainKeyword} important?`,
    `When did ${mainKeyword} start?`,
    `Where is ${mainKeyword} trending?`,
    `Who is involved in ${mainKeyword}?`,
  ];

  return relatedQuestions.map((question, idx) => ({
    relatedQuestion: question,
    answerLength: idx % 2 === 0 ? "40-60" : idx % 3 === 0 ? "60-100" : "100-150",
    contentSection: `H3: ${question}`,
    implementation: `Add dedicated FAQ section with structured data markup`,
  }));
}

/**
 * News Results 최적화 (뉴스 첫 페이지 노출)
 */
export function optimizeNewsResults(keyword: string): {
  contentType: string[];
  publishingRequirements: string[];
  schemaMarkup: string[];
  publishingSchedule: string;
  expectedTraffic: string;
} {
  return {
    contentType: [
      "Breaking news",
      "Original reporting",
      "News analysis",
      "Exclusive interviews",
      "Investigation pieces",
    ],
    publishingRequirements: [
      "속보성: 사건 발생 후 48시간 내 게시",
      "원본 콘텐츠: 정보 출처 인용 및 추가 분석",
      "고품질: 사실 검증, 다각적 관점",
      "정기 갱신: 새로운 정보나 전개 반영",
      "뉴스 사이트맵 (news_sitemap.xml) 제출",
    ],
    schemaMarkup: ["NewsArticle", "ImageObject", "VideoObject"],
    publishingSchedule: "Breaking: 즉시 / Analysis: 24-48시간 내 / Updates: 새 소식 시 갱신",
    expectedTraffic: "뉴스 결과 진출 시 +500-1000% 트래픽 (1-2주 지속)",
  };
}

/**
 * Rich Results (리뷰/평점) 최적화
 */
export function optimizeRichResults(): {
  eligibleSchemaTypes: string[];
  requirements: Record<string, string[]>;
  implementation: string[];
  expectedTraffic: string;
} {
  return {
    eligibleSchemaTypes: [
      "AggregateRating",
      "Rating",
      "Review",
      "Recipe",
      "Event",
      "FAQPage",
      "HowTo",
      "Product",
      "Article",
    ],
    requirements: {
      AggregateRating: [
        "최소 10개 이상 리뷰",
        "평점 4.0 이상 (추천)",
        "리뷰 수 표시",
        "정기적 갱신",
      ],
      Recipe: [
        "이미지",
        "조리 시간 & 난이도",
        "재료 목록",
        "단계별 지침",
        "영양가 정보 (선택)",
      ],
      Event: [
        "이벤트 날짜 & 시간",
        "장소 (또는 온라인 URL)",
        "참가 방법",
        "가격 (있으면)",
        "이미지",
      ],
    },
    implementation: [
      "Schema.org JSON-LD 또는 Microdata 추가",
      "Google Rich Results Test로 검증",
      "Search Console에서 'Rich results' 리포트 확인",
      "자동 리치 리절트 검증 (월간)",
    ],
    expectedTraffic: "Rich results 진출 시 +20-40% CTR 증가",
  };
}

/**
 * SERP 클릭률(CTR) 개선 전략
 */
export function generateCTRImprovementStrategy(
  currentTitle: string,
  currentDescription: string,
  primaryKeyword: string
): {
  optimizations: SnippetOptimization;
  variants: Array<{
    title: string;
    description: string;
    predictedCTR: number;
  }>;
  expectedTraffic: string;
} {
  const titleOpt = optimizeMetaTitle(currentTitle, primaryKeyword);
  const descOpt = optimizeMetaDescription(currentDescription, primaryKeyword);

  // A/B 테스트용 변형 3개
  const variants = [
    {
      title: titleOpt.optimizedTitle,
      description: descOpt.optimizedDescription,
      predictedCTR: 5.5 + titleOpt.ctrBoost * 0.1 + descOpt.ctrBoost * 0.1,
    },
    {
      title: `🔥 ${primaryKeyword} - Everything You Need to Know | IssueGlobe`,
      description: `Comprehensive guide to ${primaryKeyword}. Latest trends, analysis, and insights. ${primaryKeyword} explained for beginners and experts.`,
      predictedCTR: 6.0,
    },
    {
      title: `${primaryKeyword}: Real-time Trends & Breaking News | IssueGlobe`,
      description: `Stay updated with latest ${primaryKeyword} trends. Real-time analysis, global coverage, and expert insights. Updated hourly.`,
      predictedCTR: 5.8,
    },
  ];

  const baseCTR = 3.5; // 평균 CTR
  const bestVariant = variants.reduce((best, v) => (v.predictedCTR > best.predictedCTR ? v : best));
  const ctrImprovement = bestVariant.predictedCTR - baseCTR;
  const estimatedTraffic = `+${Math.round(ctrImprovement * 20)}-${Math.round(ctrImprovement * 40)}% (현재 트래픽 대비)`;

  return {
    optimizations: {
      metaTitle: titleOpt.optimizedTitle,
      metaDescription: descOpt.optimizedDescription,
      headlineVariations: variants.map((v) => v.title),
      descriptionVariations: variants.map((v) => v.description),
      expectedCTR: bestVariant.predictedCTR,
      expectedClicks: Math.round(bestVariant.predictedCTR * 1000 / 100), // 1000 impressions 기준
      suggestions: [
        "A/B 테스트: 3개 변형 중 2주씩 순환 테스트",
        "Google Search Console CTR 모니터링",
        "클릭률 >5.5%는 상위 페이지 수준",
        "제목 & 설명 정기적으로 리프레시 (월1회)",
      ],
    },
    variants,
    expectedTraffic: estimatedTraffic,
  };
}

/**
 * SERP Snippet 최적화 체크리스트
 */
export function generateSERPSnippetChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 62: SERP Snippet & Search Feature 체크리스트\n");

  checklist.push("### 메타 타이틀 최적화");
  checklist.push("- [ ] 길이: 50-60자 (데스크톱), 30자 (모바일)");
  checklist.push("- [ ] 키워드: 제목 앞에 배치");
  checklist.push("- [ ] 감정 신호: 이모지 추가 (선택적)");
  checklist.push("- [ ] 브랜드명: 'IssueGlobe' 포함");

  checklist.push("\n### 메타 설명 최적화");
  checklist.push("- [ ] 길이: 100-160자");
  checklist.push("- [ ] 키워드: 자연스럽게 포함");
  checklist.push("- [ ] CTA: 행동 유도 단어 포함 (Learn, Discover, Explore)");
  checklist.push("- [ ] 통계/숫자: 신뢰도 증가");

  checklist.push("\n### Featured Snippet 최적화");
  checklist.push("- [ ] 40-60자 답변을 <p> 상단에 배치");
  checklist.push("- [ ] 목표 순위: Top 5 (필수)");
  checklist.push("- [ ] List/Table snippets: 구조화된 형식 사용");
  checklist.push("- [ ] Google Search Console에서 진출 여부 확인");

  checklist.push("\n### People Also Ask (PAA) 최적화");
  checklist.push("- [ ] 관련 질문 최소 6개 답변");
  checklist.push("- [ ] 각 답변 40-150자 (차등화)");
  checklist.push("- [ ] FAQPage schema markup 추가");
  checklist.push("- [ ] H3로 질문 마크업");

  checklist.push("\n### News Results 최적화");
  checklist.push("- [ ] 속보: 48시간 내 게시");
  checklist.push("- [ ] news_sitemap.xml 제출");
  checklist.push("- [ ] NewsArticle schema 추가");
  checklist.push("- [ ] 정기 갱신 (새 소식 시)");

  checklist.push("\n### Rich Results 최적화");
  checklist.push("- [ ] 적격 schema 선택 (Rating, Review, FAQPage 등)");
  checklist.push("- [ ] Google Rich Results Test로 검증");
  checklist.push("- [ ] Search Console 'Rich results' 리포트 확인");
  checklist.push("- [ ] 클릭률(CTR) 증가 추적");

  checklist.push("\n### 모니터링 & A/B 테스트");
  checklist.push("- [ ] 주간 클릭률(CTR) 분석");
  checklist.push("- [ ] 제목/설명 변형 A/B 테스트 (2주 단위)");
  checklist.push("- [ ] 최고 성과 변형으로 고정");
  checklist.push("- [ ] Google Search Console 데이터로 검증");

  return checklist;
}
