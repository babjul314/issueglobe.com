/**
 * Rich Results 검증 & Schema 마크업 테스팅
 * Google Rich Results 테스트 도구 기반 자동 검증
 */

export interface SchemaValidationResult {
  type: string;
  valid: boolean;
  warnings: string[];
  errors: string[];
  coverage: number; // %
  richResultType: "none" | "faqpage" | "newsarticle" | "event" | "breadcrumb" | "product";
}

export interface RichResultsReport {
  timestamp: string;
  validationResults: SchemaValidationResult[];
  totalScore: number;
  richResultsEligible: boolean;
  improvements: string[];
  nextSteps: string[];
}

/**
 * Schema 마크업 검증
 */
export function validateSchemaMarkup(html: string): SchemaValidationResult[] {
  const results: SchemaValidationResult[] = [];

  // FAQ Schema 검증
  const faqRegex = /FAQPage|Question|acceptedAnswer/gi;
  const hasFAQ = faqRegex.test(html);

  if (hasFAQ) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 필수 필드 확인
    if (!html.includes('"name"') || !html.includes('"text"')) {
      errors.push("FAQ Schema: 필수 필드 누락 (name 또는 text)");
    }

    // 최소 3개 질문 확인
    const questionCount = (html.match(/Question/gi) || []).length;
    if (questionCount < 3) {
      warnings.push(`FAQ: ${questionCount}개 질문만 있음 (권장: 3개 이상)`);
    }

    results.push({
      type: "FAQPage",
      valid: errors.length === 0,
      warnings,
      errors,
      coverage: hasFAQ ? 100 : 0,
      richResultType: "faqpage",
    });
  }

  // NewsArticle Schema 검증
  const newsRegex = /NewsArticle|headline|datePublished/gi;
  const hasNews = newsRegex.test(html);

  if (hasNews) {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!html.includes("datePublished")) {
      errors.push("NewsArticle: datePublished 필드 누락");
    }
    if (!html.includes("image")) {
      warnings.push("NewsArticle: 이미지 포함 권장");
    }

    results.push({
      type: "NewsArticle",
      valid: errors.length === 0,
      warnings,
      errors,
      coverage: hasNews ? 100 : 0,
      richResultType: "newsarticle",
    });
  }

  // BreadcrumbList 검증
  const bcRegex = /BreadcrumbList|ListItem|itemListElement/gi;
  const hasBreadcrumb = bcRegex.test(html);

  if (hasBreadcrumb) {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!html.includes("position")) {
      errors.push("BreadcrumbList: position 필드 누락");
    }

    results.push({
      type: "BreadcrumbList",
      valid: errors.length === 0,
      warnings,
      errors,
      coverage: hasBreadcrumb ? 100 : 0,
      richResultType: "breadcrumb",
    });
  }

  // Organization Schema 검증
  const orgRegex = /Organization|contactPoint|sameAs/gi;
  const hasOrg = orgRegex.test(html);

  if (hasOrg) {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!html.includes("contactPoint")) {
      warnings.push("Organization: contactPoint 추가 권장");
    }
    if (!html.includes("sameAs")) {
      warnings.push("Organization: 소셜 미디어 링크 추가 권장");
    }

    results.push({
      type: "Organization",
      valid: errors.length === 0,
      warnings,
      errors,
      coverage: hasOrg ? 100 : 0,
      richResultType: "none",
    });
  }

  return results;
}

/**
 * Rich Results 적격성 확인
 */
export function checkRichResultsEligibility(
  validationResults: SchemaValidationResult[]
): {
  eligible: boolean;
  richResults: string[];
  missingOpportunities: string[];
} {
  const eligible = validationResults.every((r) => r.valid);

  const richResults = validationResults
    .filter((r) => r.valid && r.richResultType !== "none")
    .map((r) => {
      const typeNames: Record<string, string> = {
        faqpage: "❓ FAQ Rich Results",
        newsarticle: "📰 News Rich Results",
        event: "📅 Event Rich Results",
        breadcrumb: "🗂️ Breadcrumb Navigation",
        product: "🛍️ Product Rich Results",
      };
      return typeNames[r.richResultType] || r.type;
    });

  const missingOpportunities: string[] = [];

  // FAQ 없으면 추가 권장
  if (!validationResults.find((r) => r.richResultType === "faqpage")) {
    missingOpportunities.push("❌ FAQ Schema 추가로 검색 결과 개선 가능");
  }

  // Event 없으면 추가 권장
  if (!validationResults.find((r) => r.richResultType === "event")) {
    missingOpportunities.push("❌ Event Schema 추가로 캘린더 노출 가능");
  }

  // Product 없으면 추가 권장
  if (!validationResults.find((r) => r.richResultType === "product")) {
    missingOpportunities.push("❌ Product Schema 추가 고려");
  }

  return {
    eligible,
    richResults,
    missingOpportunities,
  };
}

/**
 * 전체 Rich Results 점수 계산
 */
export function calculateRichResultsScore(
  validationResults: SchemaValidationResult[]
): number {
  if (validationResults.length === 0) return 0;

  const validCount = validationResults.filter((r) => r.valid).length;
  const avgCoverage =
    validationResults.reduce((sum, r) => sum + r.coverage, 0) /
    validationResults.length;
  const warningPenalty = validationResults.reduce(
    (sum, r) => sum + r.warnings.length * 5,
    0
  );

  const score =
    (validCount / validationResults.length) * 100 * (avgCoverage / 100) -
    warningPenalty;

  return Math.max(0, Math.round(score));
}

/**
 * Rich Results 구현 로드맵
 */
export function generateRichResultsRoadmap(): Array<{
  week: number;
  task: string;
  schema: string;
  expectedImpact: string;
}> {
  return [
    {
      week: 1,
      task: "FAQ Schema 구현",
      schema: "FAQPage",
      expectedImpact: "검색 결과에서 추가 스니펫 영역 확보",
    },
    {
      week: 2,
      task: "Event Schema 추가",
      schema: "Event",
      expectedImpact: "이벤트 캘린더 노출 가능",
    },
    {
      week: 3,
      task: "Organization Schema 강화",
      schema: "Organization + ContactPoint",
      expectedImpact: "브랜드 신뢰도 증가",
    },
    {
      week: 4,
      task: "Collection Schema 적용",
      schema: "CollectionPage + Carousel",
      expectedImpact: "리치 카루셀 결과 노출",
    },
    {
      week: 5,
      task: "Video Schema (YouTube 포함)",
      schema: "VideoObject",
      expectedImpact: "YouTube 영상 검색 결과 노출",
    },
    {
      week: 6,
      task: "Rich Results 테스트 & 검증",
      schema: "All",
      expectedImpact: "전체 Rich Results 적격성 달성",
    },
  ];
}

/**
 * Google Rich Results 테스트 가이드
 */
export function getGoogleRichResultsTestGuide(): string[] {
  const guide: string[] = [];

  guide.push("## Google Rich Results 테스트 가이드\n");

  guide.push("### 테스트 방법");
  guide.push(
    "1. Google Search Central > Rich Results Test (https://search.google.com/test/rich-results)"
  );
  guide.push("2. URL 또는 HTML 코드 입력");
  guide.push("3. 검증 결과 확인");

  guide.push("\n### 검증할 사항");
  guide.push("- ✅ 모든 필수 필드 포함");
  guide.push("- ✅ 올바른 데이터 타입");
  guide.push("- ✅ 권장 필드 포함");
  guide.push("- ✅ 오류 없음");

  guide.push("\n### 에러 수정");
  guide.push("- 필드명 대소문자 확인");
  guide.push("- JSON 형식 검증");
  guide.push("- 필수 필드 완성");
  guide.push("- 유효한 값 입력");

  guide.push("\n### 배포 전 체크리스트");
  guide.push("- [ ] 모든 에러 수정");
  guide.push("- [ ] 경고 사항 검토");
  guide.push("- [ ] 실제 페이지에서 테스트");
  guide.push("- [ ] 모바일 버전 테스트");

  return guide;
}

/**
 * Rich Results 모니터링 API 응답 포맷
 */
export function generateRichResultsReport(
  validationResults: SchemaValidationResult[],
  previousScore: number = 0
): RichResultsReport {
  const score = calculateRichResultsScore(validationResults);
  const { eligible, richResults, missingOpportunities } =
    checkRichResultsEligibility(validationResults);

  const improvements: string[] = [];

  if (score > previousScore) {
    improvements.push(`✅ 점수 향상: ${previousScore} → ${score} (+${score - previousScore})`);
  }

  missingOpportunities.forEach((opp) => {
    improvements.push(opp);
  });

  const nextSteps: string[] = [];

  if (!eligible) {
    nextSteps.push("🔴 우선순위: 모든 에러 수정");
  }

  if (missingOpportunities.length > 0) {
    nextSteps.push("🟡 권장: 누락된 Rich Results 추가");
  }

  if (validationResults.some((r) => r.warnings.length > 0)) {
    nextSteps.push("🟡 권장: 경고 사항 개선");
  }

  nextSteps.push("✅ 단계: Google Rich Results 테스트에서 최종 검증");
  nextSteps.push("📊 추적: 검색 결과에서 Rich Results 노출 모니터링");

  return {
    timestamp: new Date().toISOString(),
    validationResults,
    totalScore: score,
    richResultsEligible: eligible,
    improvements,
    nextSteps,
  };
}
