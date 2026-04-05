/**
 * 검색 결과 스니펫 A/B 테스팅
 * 제목과 설명의 여러 변형으로 CTR 최적화
 */

export interface SnippetVariant {
  id: string;
  title: string;
  description: string;
  variant: "control" | "variant";
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number; // %
    position: number;
  };
}

export interface TitleVariationTest {
  keyword: string;
  controlTitle: string;
  variants: Array<{
    id: string;
    title: string;
    expectedCTRLift: number; // %
    reasoning: string;
  }>;
}

export interface MetaDescriptionVariationTest {
  keyword: string;
  controlDescription: string;
  variants: Array<{
    id: string;
    description: string;
    expectedCTRLift: number; // %
    reasoning: string;
  }>;
}

/**
 * 고성능 제목 패턴
 */
export const HIGH_PERFORMING_TITLE_PATTERNS = {
  powerWords: [
    "Best",
    "Top",
    "Ultimate",
    "Complete",
    "Essential",
    "Proven",
    "Exact",
    "Expert",
    "Secret",
    "Rare",
  ],
  numberPatterns: [
    "[NUMBER] Ways to [Topic]",
    "[NUMBER] Tips for [Topic]",
    "[NUMBER] Best [Topic]",
    "The [NUMBER] [Adjective] [Topic]",
  ],
  questionPatterns: [
    "What is [Topic]?",
    "Why is [Topic] Important?",
    "How to [Action] [Topic]?",
    "Should You [Action] [Topic]?",
  ],
  urgencyPatterns: [
    "[Topic] - NOW TRENDING",
    "[Topic] - JUST UPDATED",
    "[Topic] - BREAKING",
    "[Topic] - TODAY'S MUST-READ",
  ],
};

/**
 * 트렌드별 제목 변형 생성
 */
export function generateTitleVariations(
  trendTitle: string,
  countryName: string
): TitleVariationTest {
  return {
    keyword: trendTitle,
    controlTitle: `${trendTitle} - Trending in ${countryName}`,
    variants: [
      {
        id: "variant_1",
        title: `🔥 ${trendTitle} - NOW TRENDING in ${countryName}`,
        expectedCTRLift: 12,
        reasoning: "이모지 + 긴급성 신호로 주목도 증가",
      },
      {
        id: "variant_2",
        title: `Why is ${trendTitle} Trending in ${countryName}?`,
        expectedCTRLift: 8,
        reasoning: "질문 형식으로 호기심 자극",
      },
      {
        id: "variant_3",
        title: `${trendTitle}: Everything You Need to Know`,
        expectedCTRLift: 15,
        reasoning: "완벽한 가이드라는 신호로 클릭 유도",
      },
      {
        id: "variant_4",
        title: `The Complete Guide to ${trendTitle} in ${countryName}`,
        expectedCTRLift: 10,
        reasoning: "권위 있는 리소스임을 명시",
      },
      {
        id: "variant_5",
        title: `${trendTitle} - Real-Time Global Insights`,
        expectedCTRLift: 6,
        reasoning: "고유한 가치 제안 강조",
      },
      {
        id: "variant_6",
        title: `[TRENDING] ${trendTitle}: What Everyone's Talking About`,
        expectedCTRLift: 11,
        reasoning: "FOMO (Fear of Missing Out) 활용",
      },
    ],
  };
}

/**
 * 메타 설명 변형 생성
 */
export function generateDescriptionVariations(
  trendTitle: string,
  countryName: string,
  summary: string
): MetaDescriptionVariationTest {
  return {
    keyword: trendTitle,
    controlDescription: `${trendTitle} is trending in ${countryName}. Discover why it's going viral and what it means.`,
    variants: [
      {
        id: "desc_1",
        description: `Discover why ${trendTitle} is trending globally. Real-time insights from ${countryName} and beyond.`,
        expectedCTRLift: 8,
        reasoning: "글로벌 관점과 실시간 신호 강조",
      },
      {
        id: "desc_2",
        description: `${trendTitle} breaking through search charts. See what ${countryName} is talking about right now.`,
        expectedCTRLift: 7,
        reasoning: "긴급성과 현재성 강조",
      },
      {
        id: "desc_3",
        description: `Everything trending about ${trendTitle}. Latest insights, related searches, and expert analysis.`,
        expectedCTRLift: 10,
        reasoning: "포괄적인 정보 제공 약속",
      },
      {
        id: "desc_4",
        description: `Why ${trendTitle}? Read real-time analysis with ${countryName} data and global context.`,
        expectedCTRLift: 9,
        reasoning: "데이터 기반 콘텐츠 임을 나타냄",
      },
      {
        id: "desc_5",
        description: `${trendTitle} is on everyone's radar. Join millions exploring this viral topic with IssueGlobe.`,
        expectedCTRLift: 12,
        reasoning: "커뮤니티 규모와 인기도 강조",
      },
    ],
  };
}

/**
 * 장치별 스니펫 최적화
 */
export function optimizeSnippetForDevice(
  title: string,
  description: string,
  device: "desktop" | "mobile" | "voice"
): {
  title: string;
  description: string;
  characterLimit: number;
} {
  // 데스크톱: 제목 60, 설명 160
  // 모바일: 제목 50, 설명 120
  // 음성: 제목 40, 설명 100

  const limits = {
    desktop: { title: 60, description: 160 },
    mobile: { title: 50, description: 120 },
    voice: { title: 40, description: 100 },
  };

  const limit = limits[device];

  const optimizedTitle =
    title.length > limit.title
      ? title.substring(0, limit.title - 3) + "..."
      : title;

  const optimizedDescription =
    description.length > limit.description
      ? description.substring(0, limit.description - 3) + "..."
      : description;

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    characterLimit: limit.description,
  };
}

/**
 * CTR 개선 잠재력 계산
 */
export function calculateCTRPotential(metrics: {
  currentCTR: number;
  position: number;
  impressions: number;
  variants: Array<{ ctrLift: number }>;
}): {
  currentClicks: number;
  projectedClicks: Array<{ variant: number; clicks: number; lift: number }>;
  totalLiftPotential: number;
  recommendation: string;
} {
  const currentClicks = (metrics.currentCTR / 100) * metrics.impressions;

  const positionMultiplier = Math.max(1, 4 - metrics.position); // Position 1은 4배, 2는 3배, 3은 2배, 4+는 1배

  const projectedClicks = metrics.variants.map((variant, index) => {
    const projectedCTR = metrics.currentCTR + variant.ctrLift;
    const projectedClicksCount = (projectedCTR / 100) * metrics.impressions;
    const lift = projectedClicksCount - currentClicks;

    return {
      variant: index + 1,
      clicks: Math.round(projectedClicksCount),
      lift: Math.round(lift),
    };
  });

  const bestVariant = projectedClicks.reduce((prev, current) =>
    prev.lift > current.lift ? prev : current
  );

  const totalLiftPotential = bestVariant.lift;

  let recommendation = "";
  if (totalLiftPotential > 50) {
    recommendation = `🎯 높은 개선 잠재력: 최대 ${bestVariant.lift}개 추가 클릭 가능`;
  } else if (totalLiftPotential > 20) {
    recommendation = `📊 중간 개선 잠재력: ${bestVariant.lift}개 클릭 증가 예상`;
  } else {
    recommendation = `⚠️ 낮은 개선 잠재력: 현재 스니펫이 이미 최적화됨`;
  }

  return {
    currentClicks: Math.round(currentClicks),
    projectedClicks,
    totalLiftPotential,
    recommendation,
  };
}

/**
 * A/B 테스트 실행 가이드
 */
export function getABTestingGuidelines(): string[] {
  const guidelines: string[] = [];

  guidelines.push("## 검색 결과 스니펫 A/B 테스팅 가이드\n");

  guidelines.push("### 테스트 기간");
  guidelines.push("- 최소 2-4주 (충분한 데이터 수집)");
  guidelines.push("- 계절성 고려");
  guidelines.push("- 주중/주말 균형");

  guidelines.push("\n### 통계적 유의성");
  guidelines.push("- 최소 100 클릭 확보");
  guidelines.push("- 95% 신뢰도 (confidence level)");
  guidelines.push("- 통계 유의성 계산기 사용");

  guidelines.push("\n### 테스트 설정");
  guidelines.push("- 한 번에 하나의 요소만 테스트");
  guidelines.push("- 제목과 설명 분리 테스트");
  guidelines.push("- 키워드별 독립적 테스트");

  guidelines.push("\n### 성공 지표");
  guidelines.push("- CTR (Click-Through Rate) 증가");
  guidelines.push("- 평균 순위 개선");
  guidelines.push("- 사용자 참여도 향상");

  guidelines.push("\n### 주의사항");
  guidelines.push("- 과도한 변경 피하기");
  guidelines.push("- 사용자 혼동 방지");
  guidelines.push("- 정직한 표현 (오버클레임 금지)");

  return guidelines;
}

/**
 * 월별 스니펫 최적화 체크리스트
 */
export function generateSnippetOptimizationChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 월별 스니펫 최적화 체크리스트\n");

  checklist.push("### 1주차");
  checklist.push("- [ ] Top 10 키워드 CTR 분석");
  checklist.push("- [ ] 낮은 CTR 키워드 식별");
  checklist.push("- [ ] 3개 키워드 제목 변형 생성");

  checklist.push("\n### 2주차");
  checklist.push("- [ ] A/B 테스트 시작");
  checklist.push("- [ ] 설명 변형 3개 생성");
  checklist.push("- [ ] 모바일 스니펫 최적화");

  checklist.push("\n### 3주차");
  checklist.push("- [ ] 테스트 진행 상황 모니터링");
  checklist.push("- [ ] 초기 데이터 검토");
  checklist.push("- [ ] 필요시 조정");

  checklist.push("\n### 4주차");
  checklist.push("- [ ] A/B 테스트 결과 분석");
  checklist.push("- [ ] 승자 선택 및 적용");
  checklist.push("- [ ] 다음 달 테스트 계획");

  return checklist;
}
