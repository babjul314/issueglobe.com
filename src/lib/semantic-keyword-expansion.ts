/**
 * Phase 61: Semantic Keyword Expansion & Long-tail Optimization
 * 핵심 키워드에서 출발해 의미론적으로 관련된 긴꼬리 키워드까지 확대
 */

export interface KeywordVariation {
  keyword: string;
  searchVolume: number;
  difficulty: number; // 0-100 경쟁도
  intent: "informational" | "navigational" | "transactional" | "commercial";
  parentKeyword: string;
  estimatedTraffic: number;
}

export interface SemanticCluster {
  coreKeyword: string;
  variations: KeywordVariation[];
  questionKeywords: string[]; // "What is X?", "How to Y?"
  nounPhrases: string[];
  verbPhrases: string[];
  modifierCombos: string[];
  totalEstimatedTraffic: number;
}

export interface LongTailOpportunity {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  opportunity: number; // 0-100: (volume / difficulty) 정규화
  targetPage: string;
  implementation: string;
}

/**
 * 의미론적 키워드 확장
 * 핵심 키워드 1개 → 수십 개의 의미론적으로 관련된 변형
 */
export function expandKeywordSemantics(coreKeyword: string): SemanticCluster {
  const [mainTerm, ...modifiers] = coreKeyword.split(" ");

  // 1. 질문 형식 키워드 (Information intent)
  const questionKeywords = [
    `What is ${coreKeyword}?`,
    `What are ${coreKeyword}?`,
    `How to ${coreKeyword}?`,
    `Why ${coreKeyword}?`,
    `When ${coreKeyword}?`,
    `${coreKeyword} meaning`,
    `${coreKeyword} definition`,
    `${coreKeyword} explanation`,
    `${coreKeyword} guide`,
    `${coreKeyword} tutorial`,
    `${coreKeyword} tips`,
    `Best ${coreKeyword}`,
    `Top ${coreKeyword}`,
    `${coreKeyword} 2024`,
    `${coreKeyword} 2025`,
  ];

  // 2. 명사 구문 (다양한 형태)
  const nounPhrases = [
    coreKeyword,
    `${coreKeyword} news`,
    `${coreKeyword} trends`,
    `${coreKeyword} analysis`,
    `${coreKeyword} insights`,
    `${coreKeyword} data`,
    `${coreKeyword} statistics`,
    `${coreKeyword} report`,
    `${coreKeyword} update`,
    `${coreKeyword} summary`,
  ];

  // 3. 동사 구문
  const verbPhrases = [
    `understand ${coreKeyword}`,
    `learn about ${coreKeyword}`,
    `discover ${coreKeyword}`,
    `explore ${coreKeyword}`,
    `analyze ${coreKeyword}`,
    `track ${coreKeyword}`,
    `monitor ${coreKeyword}`,
    `follow ${coreKeyword}`,
    `stay updated on ${coreKeyword}`,
  ];

  // 4. 수정자 조합 (Modifier combinations)
  const modifierCombos = [
    `latest ${coreKeyword}`,
    `recent ${coreKeyword}`,
    `current ${coreKeyword}`,
    `top ${coreKeyword}`,
    `best ${coreKeyword}`,
    `rising ${coreKeyword}`,
    `viral ${coreKeyword}`,
    `trending ${coreKeyword}`,
    `global ${coreKeyword}`,
    `international ${coreKeyword}`,
  ];

  // 모든 변형 수집
  const allVariations = [
    ...questionKeywords,
    ...nounPhrases,
    ...verbPhrases,
    ...modifierCombos,
  ];

  // 검색량 및 난이도 시뮬레이션 (0-100 스케일)
  const variations: KeywordVariation[] = allVariations.map((keyword, idx) => {
    // 핵심 키워드에 가까울수록 검색량 높음
    const baseVolume = 1000;
    const volumeDecay = Math.exp(-idx / allVariations.length);
    const searchVolume = Math.floor(baseVolume * volumeDecay * (50 + Math.random() * 50));

    // 난이도: 길수록 낮음 (긴꼬리는 경쟁이 적음)
    const wordCount = keyword.split(" ").length;
    const difficulty = Math.max(10, 70 - wordCount * 8);

    // Intent 분류
    let intent: "informational" | "navigational" | "transactional" | "commercial" =
      "informational";
    if (keyword.includes("how") || keyword.includes("what") || keyword.includes("why")) {
      intent = "informational";
    } else if (keyword.includes("best") || keyword.includes("top")) {
      intent = "commercial";
    }

    return {
      keyword,
      searchVolume,
      difficulty,
      intent,
      parentKeyword: coreKeyword,
      estimatedTraffic: Math.floor((searchVolume / (difficulty + 1)) * 0.3), // CTR ~30%
    };
  });

  const totalEstimatedTraffic = variations.reduce((sum, v) => sum + v.estimatedTraffic, 0);

  return {
    coreKeyword,
    variations: variations.sort((a, b) => b.searchVolume - a.searchVolume),
    questionKeywords,
    nounPhrases,
    verbPhrases,
    modifierCombos,
    totalEstimatedTraffic,
  };
}

/**
 * 긴꼬리 기회 식별
 * 검색량 대비 경쟁도가 낮은 키워드 찾기 (기회 점수)
 */
export function identifyLongTailOpportunities(
  semanticCluster: SemanticCluster,
  minOpportunityScore: number = 50
): LongTailOpportunity[] {
  return semanticCluster.variations
    .map((variation) => {
      // 기회 점수: (검색량 / 경쟁도) 정규화 (0-100)
      const opportunityScore = Math.min(100, (variation.searchVolume / (variation.difficulty + 1)) * 2);

      return {
        keyword: variation.keyword,
        searchVolume: variation.searchVolume,
        difficulty: variation.difficulty,
        opportunity: Math.round(opportunityScore),
        targetPage: `/trend/${encodeURIComponent(variation.keyword.toLowerCase())}`,
        implementation: `Create dedicated section or subsection for "${variation.keyword}"`,
      };
    })
    .filter((opp) => opp.opportunity >= minOpportunityScore)
    .sort((a, b) => b.opportunity - a.opportunity)
    .slice(0, 10); // 상위 10개 긴꼬리
}

/**
 * 의도별 콘텐츠 전략
 */
export function generateIntentBasedContentStrategy(
  semanticCluster: SemanticCluster
): Record<
  "informational" | "navigational" | "transactional" | "commercial",
  {
    keywords: KeywordVariation[];
    contentType: string[];
    expectedCTR: string;
    priority: "critical" | "high" | "medium" | "low";
  }
> {
  const byIntent: Record<string, KeywordVariation[]> = {
    informational: [],
    navigational: [],
    transactional: [],
    commercial: [],
  };

  semanticCluster.variations.forEach((v) => {
    byIntent[v.intent].push(v);
  });

  return {
    informational: {
      keywords: byIntent.informational,
      contentType: [
        "How-to guides",
        "FAQs",
        "Educational articles",
        "Explanatory blog posts",
        "Tutorials",
      ],
      expectedCTR: "3-5%",
      priority: "high",
    },
    navigational: {
      keywords: byIntent.navigational,
      contentType: ["Category pages", "Directory listings", "Aggregation pages"],
      expectedCTR: "5-8%",
      priority: "high",
    },
    transactional: {
      keywords: byIntent.transactional,
      contentType: [
        "Comparison pages",
        "Review pages",
        "Product/service pages",
        "Case studies",
      ],
      expectedCTR: "4-6%",
      priority: "medium",
    },
    commercial: {
      keywords: byIntent.commercial,
      contentType: [
        "Best/Top-ranked articles",
        "Trending analysis",
        "News coverage",
        "Analysis pieces",
      ],
      expectedCTR: "2-4%",
      priority: "high",
    },
  };
}

/**
 * 키워드 우선순위 매트릭스
 */
export function prioritizeKeywords(
  variations: KeywordVariation[]
): Array<{
  keyword: string;
  priority: "P0" | "P1" | "P2" | "P3";
  reasoning: string;
}> {
  return variations.map((v) => {
    let priority: "P0" | "P1" | "P2" | "P3" = "P3";
    let reasoning = "";

    if (v.searchVolume > 500 && v.difficulty < 40) {
      priority = "P0";
      reasoning = "High volume + Low difficulty = Quick win";
    } else if (v.searchVolume > 200 && v.difficulty < 50) {
      priority = "P1";
      reasoning = "Good opportunity with moderate effort";
    } else if (v.searchVolume > 50) {
      priority = "P2";
      reasoning = "Long-tail keyword with niche audience";
    } else {
      priority = "P3";
      reasoning = "Very specific/niche keyword (future opportunity)";
    }

    return { keyword: v.keyword, priority, reasoning };
  });
}

/**
 * 의미론적 키워드 확장 전략 가이드
 */
export function generateKeywordExpansionStrategy(coreKeyword: string): string[] {
  const strategy: string[] = [];

  strategy.push("## Phase 61: Semantic Keyword Expansion & Long-tail 전략\n");

  strategy.push("### 1단계: 핵심 키워드 분석");
  strategy.push(`- **핵심**: "${coreKeyword}"`);
  strategy.push("- 의미론적 관련 변형 생성 (질문, 명사, 동사, 수정자)");
  strategy.push("- 각 변형에 대해 검색량 & 경쟁도 평가");

  strategy.push("\n### 2단계: 긴꼬리 기회 식별");
  strategy.push("- Opportunity score 계산: (volume / difficulty) 정규화");
  strategy.push("- 기회 점수 >50인 키워드에 집중");
  strategy.push("- P0(즉시) / P1(1주) / P2(1개월) / P3(장기) 분류");

  strategy.push("\n### 3단계: 의도별 콘텐츠 계획");
  strategy.push("- Informational: 가이드, FAQ, 설명 글");
  strategy.push("- Navigational: 카테고리, 목록 페이지");
  strategy.push("- Commercial: 최고/최고 평가 글, 비교");
  strategy.push("- Transactional: 전환 최적화 페이지");

  strategy.push("\n### 4단계: 구현");
  strategy.push("- P0 키워드: 기존 페이지에 섹션 추가 (1-2주)");
  strategy.push("- P1 키워드: 전용 서브페이지 또는 섹션 (2-4주)");
  strategy.push("- P2 키워드: 별도 페이지 또는 블로그 포스트 (4-8주)");

  strategy.push("\n### 5단계: 내부 링킹");
  strategy.push("- 핵심 → 장형 변형 방향 링크");
  strategy.push("- 의도별 키워드 간 상호 링크");
  strategy.push("- Anchor text: 정확 30% + 부분 30% + 자연스러운 40%");

  strategy.push("\n### 기대값");
  strategy.push("- 📈 키워드 수: 1개 → 50-100개 (의미론적 클러스터)");
  strategy.push("- 📈 추정 트래픽: +200-500% (장기)");
  strategy.push("- 📈 순위 분산: 단일 키워드 의존도 ↓");
  strategy.push("- 📈 SERP 점유율: 1위 → 1,3,5,7,9,... 다중 점유");

  return strategy;
}

/**
 * Semantic keyword expansion 체크리스트
 */
export function generateKeywordExpansionChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 61: Semantic Keyword Expansion 체크리스트\n");

  checklist.push("### 키워드 클러스터 생성");
  checklist.push("- [ ] 핵심 트렌드 키워드 20개 선정");
  checklist.push("- [ ] 각 키워드별 의미론적 변형 50개 이상 생성");
  checklist.push("- [ ] 변형별 검색량 & 경쟁도 평가");
  checklist.push("- [ ] 기회 점수 계산 및 우선순위 지정");

  checklist.push("\n### 콘텐츠 기획");
  checklist.push("- [ ] P0 키워드: 기존 페이지 업데이트");
  checklist.push("- [ ] P1 키워드: 새 섹션 / 서브페이지");
  checklist.push("- [ ] P2 키워드: 블로그 포스트 또는 별도 페이지");
  checklist.push("- [ ] 의도별 콘텐츠 타입 분류");

  checklist.push("\n### 온페이지 최적화");
  checklist.push("- [ ] 제목 태그: 핵심 + P0 변형 포함");
  checklist.push("- [ ] 메타 설명: P0-P1 키워드 자연스럽게 포함");
  checklist.push("- [ ] H2/H3: 주요 의미론적 변형");
  checklist.push("- [ ] 본문: 자연스러운 키워드 통합 (LSI)");
  checklist.push("- [ ] 이미지 alt text: 변형 키워드 포함");

  checklist.push("\n### 내부 링킹");
  checklist.push("- [ ] 핵심 ↔ 변형 키워드 간 상호 링크");
  checklist.push("- [ ] 같은 의도 키워드끼리 연결");
  checklist.push("- [ ] Anchor text 다양화: 정확 30% + 부분 30% + 자연 40%");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] Google Search Console: 새 키워드 노출 추적");
  checklist.push("- [ ] 월별 키워드 순위 변화 분석");
  checklist.push("- [ ] 트래픽 증가 대비 분석 (예상 vs 실제)");
  checklist.push("- [ ] 클릭률(CTR) 개선 추적");

  return checklist;
}
