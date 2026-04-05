/**
 * 검색 쿼리 확장 & Q&A 최적화
 * 사용자의 숨겨진 검색 의도를 파악하여 콘텐츠 범위 확대
 */

export interface SearchQuery {
  query: string;
  searchVolume: number;
  difficulty: "easy" | "medium" | "hard";
  intent: "informational" | "navigational" | "commercial" | "transactional";
  ctr: number; // %
  avgPosition: number;
  variations: string[];
}

export interface QAItem {
  question: string;
  answer: string;
  answerLength: number; // words
  featured_snippet: boolean;
  searchVolume: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface ContentGap {
  topic: string;
  searchVolume: number;
  currentCoverage: number; // %
  opportunity: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTraffic: number;
}

export interface QueryCluster {
  cluster: string;
  queries: string[];
  intent: string;
  contentPiece: string;
  priority: "high" | "medium" | "low";
}

/**
 * 긴 꼬리 키워드 확장 생성
 */
export function expandLongTailKeywords(
  mainKeyword: string,
  searchIntents: string[]
): SearchQuery[] {
  const baseQuestions = [
    `What is ${mainKeyword}?`,
    `Why is ${mainKeyword} trending?`,
    `How to understand ${mainKeyword}`,
    `${mainKeyword} explained`,
    `Latest news about ${mainKeyword}`,
    `${mainKeyword} impact`,
    `${mainKeyword} statistics`,
    `Best ${mainKeyword} information`,
  ];

  const locations = ["", " in US", " in Korea", " in Japan", " in UK"];
  const timeframes = ["", " today", " this week", " right now"];
  const questions = [
    `Is ${mainKeyword}?`,
    `Where is ${mainKeyword}?`,
    `When is ${mainKeyword}?`,
    `Who is involved in ${mainKeyword}?`,
  ];

  const allQueries: SearchQuery[] = [];

  // 기본 질문 + 위치/시간
  baseQuestions.forEach((q) => {
    locations.forEach((loc) => {
      timeframes.forEach((time) => {
        allQueries.push({
          query: q + loc + time,
          searchVolume: Math.floor(Math.random() * 5000) + 100,
          difficulty: Math.random() > 0.6 ? "easy" : "medium",
          intent: "informational",
          ctr: Math.round((Math.random() * 8 + 2) * 10) / 10,
          avgPosition: Math.floor(Math.random() * 20) + 1,
          variations: [q, q + loc, q + time],
        });
      });
    });
  });

  // 추가 질문들
  questions.forEach((q) => {
    allQueries.push({
      query: q,
      searchVolume: Math.floor(Math.random() * 3000) + 50,
      difficulty: "medium",
      intent: "informational",
      ctr: Math.round((Math.random() * 6 + 2) * 10) / 10,
      avgPosition: Math.floor(Math.random() * 15) + 1,
      variations: [],
    });
  });

  // 정렬 (검색 볼륨 기준)
  return allQueries
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .slice(0, 30);
}

/**
 * Q&A 콘텐츠 자동 생성
 */
export function generateQAContent(
  trend: string,
  description: string,
  relatedTopics: string[]
): QAItem[] {
  const qaItems: QAItem[] = [];

  const questions = [
    {
      q: `What is ${trend}?`,
      a: `${trend} is ${description}. It has been gaining significant attention and search volume in recent times.`,
      volume: 8500,
    },
    {
      q: `Why is ${trend} trending?`,
      a: `${trend} is trending because of its relevance to current events, media coverage, and widespread public interest. It represents a significant shift in what people are searching for.`,
      volume: 6200,
    },
    {
      q: `How does ${trend} affect people?`,
      a: `The impact of ${trend} varies depending on context and location. It influences public opinion, market trends, and social conversations globally.`,
      volume: 3400,
    },
    {
      q: `Where is ${trend} most popular?`,
      a: `${trend} has gained popularity across multiple countries and regions. It shows strong search interest in major markets worldwide.`,
      volume: 2100,
    },
    {
      q: `When did ${trend} start trending?`,
      a: `${trend} began its upward trend recently and has been gaining momentum steadily. The search interest has grown significantly over the past period.`,
      volume: 1800,
    },
    {
      q: `Related to ${trend}: ${relatedTopics[0] || "similar topics"}`,
      a: `${trend} is connected to several related topics that provide additional context and understanding. Exploring these relationships helps grasp the broader picture.`,
      volume: 1200,
    },
  ];

  questions.forEach((item) => {
    qaItems.push({
      question: item.q,
      answer: item.a,
      answerLength: item.a.split(" ").length,
      featured_snippet: Math.random() > 0.4,
      searchVolume: item.volume,
      difficulty: Math.random() > 0.6 ? "easy" : "medium",
    });
  });

  return qaItems;
}

/**
 * 콘텐츠 갭 분석
 */
export function analyzeContentGaps(
  existingTopics: string[],
  relatedSearches: string[]
): ContentGap[] {
  const gaps: ContentGap[] = [];

  relatedSearches.forEach((search) => {
    const isCovered = existingTopics.some(
      (topic) =>
        topic.toLowerCase().includes(search.toLowerCase()) ||
        search.toLowerCase().includes(topic.toLowerCase())
    );

    const coverage = isCovered ? 80 : 0;
    const volume = Math.floor(Math.random() * 10000) + 500;

    gaps.push({
      topic: search,
      searchVolume: volume,
      currentCoverage: coverage,
      opportunity: `Create comprehensive content about ${search}`,
      difficulty: Math.random() > 0.5 ? "medium" : "hard",
      estimatedTraffic: Math.ceil(volume * 0.05), // 5% CTR 가정
    });
  });

  return gaps
    .sort((a, b) => b.estimatedTraffic - a.estimatedTraffic)
    .slice(0, 10);
}

/**
 * 검색 쿼리 클러스터링
 */
export function clusterSearchQueries(queries: SearchQuery[]): QueryCluster[] {
  const clusters: Map<string, QueryCluster> = new Map();

  const intentMap = {
    informational: "Educational & Explanation",
    navigational: "Finding Specific Content",
    commercial: "Comparing & Evaluating",
    transactional: "Taking Action",
  };

  queries.forEach((query) => {
    const clusterKey = intentMap[query.intent];

    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, {
        cluster: clusterKey,
        queries: [],
        intent: query.intent,
        contentPiece: `Create ${clusterKey.toLowerCase()} content`,
        priority: "high",
      });
    }

    const cluster = clusters.get(clusterKey)!;
    cluster.queries.push(query.query);
  });

  return Array.from(clusters.values()).map((cluster) => ({
    ...cluster,
    priority:
      cluster.queries.length > 5
        ? "high"
        : cluster.queries.length > 2
          ? "medium"
          : "low",
  }));
}

/**
 * 검색 시뮬레이터 - 자동완성 쿼리 생성
 */
export function generateAutocompleteQueries(
  baseKeyword: string
): Array<{ query: string; type: "suggestion" | "related" | "question" }> {
  const suggestions = [
    { query: `${baseKeyword} today`, type: "suggestion" as const },
    { query: `${baseKeyword} meaning`, type: "suggestion" as const },
    { query: `${baseKeyword} news`, type: "suggestion" as const },
    { query: `${baseKeyword} latest`, type: "suggestion" as const },
    { query: `${baseKeyword} analysis`, type: "suggestion" as const },
    { query: `Why is ${baseKeyword} trending?`, type: "question" as const },
    { query: `What is ${baseKeyword}?`, type: "question" as const },
    { query: `How does ${baseKeyword} work?`, type: "question" as const },
    { query: `${baseKeyword} impact`, type: "related" as const },
    { query: `${baseKeyword} explained`, type: "related" as const },
  ];

  return suggestions;
}

/**
 * 키워드 의도 일치도 분석
 */
export function analyzeIntentMatch(
  query: string,
  contentType: "definition" | "news" | "analysis" | "how-to" | "comparison"
): { match: number; recommendation: string } {
  const intentMap: Record<string, string[]> = {
    definition: ["what", "is", "meaning", "explain"],
    news: ["news", "today", "latest", "breaking", "update"],
    analysis: ["analysis", "impact", "effect", "trend", "statistics"],
    "how-to": [
      "how",
      "steps",
      "guide",
      "tutorial",
      "create",
      "make",
    ],
    comparison: [
      "vs",
      "compare",
      "difference",
      "better",
      "best",
      "choose",
    ],
  };

  const queryLower = query.toLowerCase();
  const relevantKeywords = intentMap[contentType];
  const matches = relevantKeywords.filter((kw) => queryLower.includes(kw))
    .length;
  const match = Math.min(100, (matches / relevantKeywords.length) * 100);

  const recommendation =
    match >= 80
      ? `✅ Perfect match for ${contentType} content`
      : match >= 50
        ? `🟡 ${contentType} content partially suitable`
        : `❌ Consider creating ${contentType} version for better match`;

  return { match, recommendation };
}

/**
 * 검색 쿼리 확장 체크리스트
 */
export function generateSearchQueryChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 검색 쿼리 확장 & Q&A 최적화 체크리스트\n");

  checklist.push("### 키워드 리서치");
  checklist.push("- [ ] 주요 키워드 긴 꼬리 변형 30+ 식별");
  checklist.push("- [ ] 검색 의도별 분류 (정보, 항법, 상업)");
  checklist.push("- [ ] 지역별 검색량 분석");
  checklist.push("- [ ] 계절성 및 트렌드 패턴 파악");

  checklist.push("\n### Q&A 콘텐츠");
  checklist.push("- [ ] FAQ 페이지에 10+ 질문 추가");
  checklist.push("- [ ] 각 질문마다 150+ 단어 답변");
  checklist.push("- [ ] Featured Snippet 최적화");
  checklist.push("- [ ] 구조화된 데이터 마크업 추가");

  checklist.push("\n### 콘텐츠 갭");
  checklist.push("- [ ] 상위 10개 관련 검색어 분석");
  checklist.push("- [ ] 미충족 검색 의도 식별");
  checklist.push("- [ ] 새 콘텐츠 우선순위 결정");
  checklist.push("- [ ] 관련 내부 링크 추가");

  checklist.push("\n### 쿼리 최적화");
  checklist.push("- [ ] 모든 페이지의 쿼리 의도 일치 확인");
  checklist.push("- [ ] 제목/설명의 쿼리 변형 포함");
  checklist.push("- [ ] 자동완성 최적화");
  checklist.push("- [ ] 검색 결과 스니펫 테스트");

  return checklist;
}
