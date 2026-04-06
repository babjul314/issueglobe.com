/**
 * Phase 76: Auto-FAQ Schema Generator
 * relatedQueries를 FAQPage JSON-LD 스키마로 변환
 * PAA(People Also Ask) 박스 점유 + +10-20% 추가 노출
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

/**
 * relatedQueries를 질문 형식으로 변환
 */
function normalizeQuestion(query: string): string {
  // 이미 질문형인지 확인
  const questionWords = ["what", "why", "how", "when", "where", "who", "is", "are", "can", "could", "should", "would"];
  const lowerQuery = query.toLowerCase().trim();

  // 물음표 끝나는지 확인
  if (lowerQuery.endsWith("?")) {
    return query;
  }

  // 질문 단어로 시작하는지 확인
  const firstWord = lowerQuery.split(/\s+/)[0];
  if (questionWords.includes(firstWord)) {
    return query + "?";
  }

  // 아니면 "What is..." 형식으로 변환
  return `What is ${query}?`;
}

/**
 * 답변 생성 (title, summary, detail 기반)
 */
function generateAnswer(
  trend: {
    title: string;
    summary: string;
    detail: string;
    country?: string;
  },
  questionIndex: number,
  totalFAQs: number
): string {
  // 첫 번째 FAQ: title + summary 조합
  if (questionIndex === 0 && trend.summary) {
    // summary가 이미 있으면 그대로 사용
    if (trend.summary.length > 20) {
      return trend.summary;
    }
    // 요약이 너무 짧으면 title과 조합
    return `${trend.title} is a trending topic. ${trend.summary}`;
  }

  // 두 번째 이상: detail에서 첫 문장 또는 요약
  if (trend.detail && trend.detail.length > 20) {
    // 첫 문장 추출
    const sentences = trend.detail.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    if (sentences.length > 0) {
      return sentences[0].trim() + ".";
    }
    // detail이 충분히 길면 처음 100자
    return trend.detail.substring(0, 120).trim() + "...";
  }

  // Fallback: 기본 답변
  const countryStr = trend.country ? ` in ${trend.country}` : "";
  return `${trend.title} is a trending topic${countryStr}.`;
}

/**
 * 트렌드 객체에서 FAQ items 생성
 */
export function generateFAQItems(trend: {
  title: string;
  summary: string;
  detail: string;
  relatedQueries?: string[];
  country?: string;
}): FAQItem[] {
  const faqs: FAQItem[] = [];

  if (!trend.relatedQueries || trend.relatedQueries.length === 0) {
    // relatedQueries가 없으면 기본 FAQ 1개 생성
    faqs.push({
      question: `What is ${trend.title}?`,
      answer: generateAnswer(trend, 0, 1),
    });
    return faqs;
  }

  // 최대 5개 FAQ 생성
  const queries = trend.relatedQueries.slice(0, 5);

  queries.forEach((query, index) => {
    const question = normalizeQuestion(query);
    const answer = generateAnswer(trend, index, queries.length);

    faqs.push({
      question,
      answer,
    });
  });

  return faqs;
}

/**
 * FAQ items를 FAQPage 스키마로 변환
 */
export function generateFAQSchema(faqs: FAQItem[]): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * 트렌드 객체에서 FAQPage 스키마 JSON 스트링 생성
 */
export function generateFAQSchemaString(trend: {
  title: string;
  summary: string;
  detail: string;
  relatedQueries?: string[];
  country?: string;
}): string {
  const faqs = generateFAQItems(trend);
  const schema = generateFAQSchema(faqs);
  return JSON.stringify(schema);
}

/**
 * 트렌드 페이지에 주입할 FAQ items와 schema 생성
 */
export function injectFAQToPage(trend: {
  title: string;
  summary: string;
  detail: string;
  relatedQueries?: string[];
  country?: string;
}): { faqs: FAQItem[]; schema: string } {
  const faqs = generateFAQItems(trend);
  const schema = generateFAQSchemaString(trend);

  return { faqs, schema };
}
