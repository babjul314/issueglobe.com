/**
 * 자동 콘텐츠 생성 & 템플릿 최적화
 * AI 친화적 콘텐츠 구조를 통해 검색 엔진 노출 극대화
 */

import { TrendItem } from "./google-trends";

export interface ContentTemplate {
  structure: string;
  sections: Array<{ heading: string; type: string; guidelines: string[] }>;
  keywordPlacement: string[];
  estimatedLength: number;
}

export interface GeneratedContent {
  title: string;
  sections: Array<{
    heading: string;
    content: string;
    keywords: string[];
  }>;
  metadata: {
    readingTime: number;
    wordCount: number;
    keywordDensity: number;
  };
}

/**
 * 트렌드 콘텐츠 표준 템플릿
 * SEO 최적화된 구조
 */
export const TRENDING_TOPIC_TEMPLATE: ContentTemplate = {
  structure: "Hook → Context → Details → Related Topics → Conclusion",
  sections: [
    {
      heading: "What is [Trend]?",
      type: "definition",
      guidelines: [
        "첫 문장에 정확한 정의 포함",
        "Why + What + Where + When 답변",
        "200-250 단어",
        "핵심 키워드 2-3회 포함",
      ],
    },
    {
      heading: "Why is [Trend] Trending?",
      type: "explanation",
      guidelines: [
        "트렌딩 이유 명확히 설명",
        "최근 이벤트/뉴스 참조",
        "검색 의도 충족",
        "250-300 단어",
      ],
    },
    {
      heading: "Key Facts & Statistics",
      type: "facts",
      guidelines: [
        "글릿마크 3-5개",
        "구체적인 숫자/비율 포함",
        "검증 가능한 정보만",
        "각 항목 50단어 이내",
      ],
    },
    {
      heading: "Related Searches & Questions",
      type: "related",
      guidelines: [
        "사용자 질문 형식",
        "관련 키워드 포함",
        "Q&A 형식으로 정렬",
        "5-8개 질문",
      ],
    },
    {
      heading: "Timeline / Recent Developments",
      type: "timeline",
      guidelines: [
        "시간순 정렬",
        "주요 이벤트만 포함",
        "날짜 명시",
        "3-5개 이벤트",
      ],
    },
    {
      heading: "Key Takeaways",
      type: "summary",
      guidelines: [
        "요점 3-5개",
        "간결한 문장",
        "실용적인 정보",
        "100-150 단어",
      ],
    },
  ],
  keywordPlacement: [
    "H1 (주 키워드 1회)",
    "첫 100 단어 (키워드 1회)",
    "H2 (관련 키워드)",
    "본문 중간 (자연스럽게 2-3회)",
    "마지막 문단 (1회)",
  ],
  estimatedLength: 1500,
};

/**
 * 뉴스/기사 스타일 템플릿
 */
export const NEWS_ARTICLE_TEMPLATE: ContentTemplate = {
  structure: "Lede → Who/What/When → Why/How → Implications → Expert Opinion",
  sections: [
    {
      heading: "Breaking News Lede",
      type: "lede",
      guidelines: [
        "5W1H 답변 (Who, What, When, Where, Why, How)",
        "가장 중요한 정보 우선",
        "80-120 단어",
      ],
    },
    {
      heading: "Background Context",
      type: "context",
      guidelines: [
        "역사적 배경 제공",
        "관련 사건 설명",
        "200-250 단어",
      ],
    },
    {
      heading: "Current Situation",
      type: "current",
      guidelines: [
        "최신 상황 설명",
        "구체적인 세부사항",
        "인용문 포함 가능",
      ],
    },
    {
      heading: "Impact & Implications",
      type: "impact",
      guidelines: [
        "미치는 영향 분석",
        "글릿마크로 정렬 (3-5개)",
        "장기/단기 영향",
      ],
    },
  ],
  keywordPlacement: [
    "Lede 첫 문장 (핵심 키워드)",
    "Subheading들",
    "첫 단락 (2회)",
  ],
  estimatedLength: 1200,
};

/**
 * How-To/가이드 템플릿
 */
export const HOW_TO_GUIDE_TEMPLATE: ContentTemplate = {
  structure: "Intro → Prerequisites → Steps → Tips → FAQ → Conclusion",
  sections: [
    {
      heading: "Introduction",
      type: "intro",
      guidelines: [
        "Why this matters 설명",
        "Expected outcome",
        "100-150 단어",
      ],
    },
    {
      heading: "What You Need",
      type: "prerequisites",
      guidelines: [
        "필요한 것 목록화",
        "글릿마크 사용",
        "배경 지식",
      ],
    },
    {
      heading: "Step-by-Step Instructions",
      type: "steps",
      guidelines: [
        "순서가 있는 리스트",
        "스크린샷/이미지 권장",
        "각 스텝 명확히",
        "5-10 스텝",
      ],
    },
    {
      heading: "Pro Tips & Tricks",
      type: "tips",
      guidelines: [
        "고급 팁",
        "흔한 실수",
        "시간 절약 팁",
      ],
    },
    {
      heading: "Common Questions",
      type: "faq",
      guidelines: [
        "Q&A 형식",
        "실제 사용자 질문",
        "3-5개 Q&A",
      ],
    },
  ],
  keywordPlacement: [
    "H1 (How to [action] [object])",
    "Introduction",
    "Step headings",
  ],
  estimatedLength: 1800,
};

/**
 * 트렌드 콘텐츠 개요 자동 생성
 */
export function generateContentOutline(
  trend: TrendItem,
  countryName: string,
  template: ContentTemplate = TRENDING_TOPIC_TEMPLATE
): Array<{ level: number; text: string; keywords: string[] }> {
  const outline: Array<{ level: number; text: string; keywords: string[] }> =
    [];

  // H1
  outline.push({
    level: 1,
    text: `${trend.title} - Trending in ${countryName}`,
    keywords: [trend.title, countryName, "trending"],
  });

  // 템플릿 섹션들을 H2로 추가
  template.sections.forEach((section) => {
    const heading = section.heading
      .replace("[Trend]", trend.title)
      .replace("[Trends]", trend.title);

    outline.push({
      level: 2,
      text: heading,
      keywords: [trend.title],
    });

    // 서브포인트 추가 (H3)
    if (section.type === "facts" || section.type === "related") {
      for (let i = 0; i < 3; i++) {
        outline.push({
          level: 3,
          text: `${section.type === "facts" ? "Key Point" : "Related Query"} ${i + 1}`,
          keywords: trend.relatedQueries.slice(i, i + 1),
        });
      }
    }
  });

  return outline;
}

/**
 * 작성 지침 생성
 */
export function generateWritingGuidelines(
  trend: TrendItem,
  targetKeyword: string
): string[] {
  const guidelines: string[] = [];

  guidelines.push("## SEO 최적화 글쓰기 가이드라인\n");

  guidelines.push("### 제목 & 메타");
  guidelines.push(
    `- H1: "${trend.title} - Trending in [Country]" (Power word 사용)`
  );
  guidelines.push(
    `- Meta Description: 150-160자, 주요 키워드 2-3개 포함`
  );

  guidelines.push("\n### 콘텐츠");
  guidelines.push(`- 타겟 키워드: "${targetKeyword}"`);
  guidelines.push("- 키워드 밀도: 0.5-2.5% (자연스럽게)");
  guidelines.push("- 첫 100 단어에 타겟 키워드 포함");
  guidelines.push("- 문장 평균 길이: 15-20 단어");
  guidelines.push("- 단락 평균 길이: 50-80 단어");

  guidelines.push("\n### 구조");
  guidelines.push("- H1 태그: 1개만");
  guidelines.push("- H2-H3: 계층적으로 정렬");
  guidelines.push("- 글릿마크: 문단당 3-5개");
  guidelines.push("- 숫자 리스트: 단계별 설명에 사용");

  guidelines.push("\n### 외부 연결");
  guidelines.push("- 권위 있는 출처 1-3개 링크");
  guidelines.push("- 관련된 자체 페이지 2-4개 링크");
  guidelines.push("- 새 탭에서 열기 (target='_blank')");

  guidelines.push("\n### 이미지");
  guidelines.push("- 최소 1개 (메인 hero 이미지)");
  guidelines.push("- 최소 600x400px");
  guidelines.push("- Alt text: 키워드 포함 (60자 이내)");
  guidelines.push("- WebP 형식으로 최적화");

  return guidelines;
}

/**
 * 콘텐츠 길이 권장사항
 */
export function getContentLengthRecommendation(
  trendPopularity: string
): {
  minWords: number;
  optimalWords: number;
  maxWords: number;
  reason: string;
} {
  // 검색량으로부터 인기도 추정
  const popularity = parseInt(trendPopularity.replace(/[^\d]/g, "")) || 0;

  if (popularity < 1000) {
    return {
      minWords: 800,
      optimalWords: 1200,
      maxWords: 1500,
      reason: "낮은 경쟁력, 짧은 콘텐츠로도 순위 가능",
    };
  } else if (popularity < 10000) {
    return {
      minWords: 1200,
      optimalWords: 1800,
      maxWords: 2500,
      reason: "중간 경쟁력, 심화된 콘텐츠 필요",
    };
  } else if (popularity < 100000) {
    return {
      minWords: 1800,
      optimalWords: 2500,
      maxWords: 3500,
      reason: "높은 경쟁력, 포괄적인 가이드 필요",
    };
  } else {
    return {
      minWords: 2500,
      optimalWords: 3500,
      maxWords: 5000,
      reason: "매우 높은 경쟁력, 완벽한 리소스 필요",
    };
  }
}

/**
 * 콘텐츠 체크리스트 생성
 */
export function generateContentCheckList(trend: TrendItem): string[] {
  const checklist: string[] = [];

  checklist.push("## 콘텐츠 공개 전 SEO 체크리스트\n");

  checklist.push("### 기술적 SEO");
  checklist.push("- [ ] Title tag: 50-60자, 주요 키워드 포함");
  checklist.push("- [ ] Meta description: 150-160자");
  checklist.push("- [ ] H1-H6 계층 확인");
  checklist.push("- [ ] URL slug: 하이픈으로 분리, 50자 이내");
  checklist.push("- [ ] Canonical URL 설정");

  checklist.push("\n### 온페이지 SEO");
  checklist.push("- [ ] 타겟 키워드 밀도 확인 (0.5-2.5%)");
  checklist.push("- [ ] LSI 키워드 포함 (관련 검색어)");
  checklist.push("- [ ] 첫 100 단어 내 키워드");
  checklist.push("- [ ] 이미지 alt text 작성");
  checklist.push("- [ ] 내부 링크 3+ 추가");

  checklist.push("\n### 콘텐츠 품질");
  checklist.push("- [ ] 원본성 확인 (표절 검사)");
  checklist.push("- [ ] 문법 및 철저 검토");
  checklist.push("- [ ] 정보 정확성 확인");
  checklist.push("- [ ] 출처 인용");
  checklist.push("- [ ] 가독성 테스트");

  checklist.push("\n### 사용자 경험");
  checklist.push("- [ ] 모바일 반응형 확인");
  checklist.push("- [ ] 로딩 속도 < 3초");
  checklist.push("- [ ] CTA (Call-to-Action) 포함");
  checklist.push("- [ ] 소셜 공유 버튼");
  checklist.push("- [ ] 댓글 기능 활성화");

  checklist.push("\n### 구조화된 데이터");
  checklist.push("- [ ] Schema markup 적용");
  checklist.push("- [ ] OG 태그 (Facebook/Twitter)");
  checklist.push("- [ ] JSON-LD 구현");

  return checklist;
}

/**
 * SEO 점수 기반 콘텐츠 등급
 */
export function calculateContentScore(metrics: {
  titleScore: number;
  descriptionScore: number;
  contentLength: number;
  keywordDensity: number;
  readability: number;
  mobileOptimized: boolean;
  schemaMarkup: boolean;
  internalLinks: number;
}): { score: number; grade: string; feedback: string[] } {
  let score = 0;
  const feedback: string[] = [];

  // Title (20점)
  score += metrics.titleScore;
  if (metrics.titleScore < 80) {
    feedback.push("❌ 제목 개선 필요");
  }

  // Description (15점)
  score += metrics.descriptionScore * 0.75;
  if (metrics.descriptionScore < 80) {
    feedback.push("⚠️ 메타 설명 최적화 필요");
  }

  // Content Length (20점)
  const idealLength = 1500;
  const lengthRatio = Math.min(metrics.contentLength / idealLength, 1);
  score += lengthRatio * 20;
  if (lengthRatio < 0.8) {
    feedback.push("📝 콘텐츠를 더 추가하세요");
  }

  // Keyword Density (15점)
  const densityScore =
    metrics.keywordDensity > 0.5 && metrics.keywordDensity < 2.5 ? 15 : 8;
  score += densityScore;
  if (densityScore < 15) {
    feedback.push("🔍 키워드 밀도 조정 필요");
  }

  // Readability (10점)
  score += metrics.readability * 0.1;

  // Mobile (10점)
  if (metrics.mobileOptimized) {
    score += 10;
  } else {
    feedback.push("📱 모바일 최적화 필요");
  }

  // Schema (10점)
  if (metrics.schemaMarkup) {
    score += 10;
  } else {
    feedback.push("📊 구조화된 데이터 추가");
  }

  // Internal Links (5점)
  const linkBonus = Math.min(metrics.internalLinks, 5);
  score += linkBonus;

  const finalScore = Math.min(100, Math.round(score));

  let grade = "F";
  if (finalScore >= 90) grade = "A+";
  else if (finalScore >= 80) grade = "A";
  else if (finalScore >= 70) grade = "B";
  else if (finalScore >= 60) grade = "C";
  else if (finalScore >= 50) grade = "D";

  return { score: finalScore, grade, feedback };
}
