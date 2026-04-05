/**
 * Phase 64: Brand Signal Amplification & Entity Authority Expansion
 * 브랜드 신호를 강화해 Google의 신뢰도 평가 향상
 * EEA-T(Experience, Expertise, Authoritativeness, Trustworthiness) 신호 확대
 */

export interface BrandSignal {
  signal: string;
  type: "direct_traffic" | "brand_search" | "entity_mention" | "citation" | "social" | "eeat";
  strength: number; // 0-100
  impact: number; // SEO impact 0-100
  implementation: string;
  timeline: string; // 수주, 수개월 등
}

export interface EntityAuthorityMetrics {
  entityName: string;
  googleKnowledgeGraphCoverage: boolean;
  wikipediaPresence: boolean;
  citationCount: number; // 웹 전체에서의 언급 수
  citationConsistency: number; // 0-100: Name-Address-Phone 일관성
  averageRating: number; // 0-5
  reviewCount: number;
  eeatScore: number; // 0-100
}

export interface BrandAmplificationStrategy {
  signals: BrandSignal[];
  totalBrandStrength: number; // 0-100
  eeatComponents: Record<string, number>;
  recommendations: string[];
  expectedRankingBoost: string;
}

/**
 * 브랜드 신호 강도 평가
 */
export function calculateBrandSignalStrength(
  directTraffic: number, // monthly
  brandSearchVolume: number, // monthly searches for "issueglobe"
  mentionCount: number, // mentions across web
  citationCount: number,
  reviewCount: number,
  averageRating: number // 0-5
): BrandSignal[] {
  const signals: BrandSignal[] = [];

  // 1. Direct Traffic 신호
  // Direct traffic가 높을수록 사용자가 직접 방문 = 브랜드 인지도
  const directTrafficScore = Math.min(100, (directTraffic / 500) * 100);
  signals.push({
    signal: "Direct Traffic Visits",
    type: "direct_traffic",
    strength: directTrafficScore,
    impact: 15, // 15% ranking factor
    implementation: "Encourage repeat visits, improve brand recall",
    timeline: "3-6 months",
  });

  // 2. Brand Search 신호
  // "IssueGlobe"를 직접 검색하는 사용자 수
  const brandSearchScore = Math.min(100, (brandSearchVolume / 100) * 100);
  signals.push({
    signal: "Brand Search Volume",
    type: "brand_search",
    strength: brandSearchScore,
    impact: 20, // 20% ranking factor (strongest signal)
    implementation: "Increase brand awareness through content marketing, PR, social media",
    timeline: "2-4 months",
  });

  // 3. Entity Mention 신호 (Co-occurrence)
  // "IssueGlobe"와 주요 키워드가 함께 언급되는 빈도
  const mentionScore = Math.min(100, (mentionCount / 1000) * 100);
  signals.push({
    signal: "Entity Mentions (Co-occurrence)",
    type: "entity_mention",
    strength: mentionScore,
    impact: 12,
    implementation: "Build topical authority, get featured in industry news",
    timeline: "2-3 months",
  });

  // 4. Citation 신호 (Name, Address, Phone 일관성)
  // 비즈니스 디렉토리, 뉴스 사이트 등에서의 일관된 언급
  const citationScore = Math.min(100, (citationCount / 500) * 100);
  signals.push({
    signal: "Citations (NAP Consistency)",
    type: "citation",
    strength: citationScore,
    impact: 10,
    implementation: "Submit to business directories, maintain consistent NAP across web",
    timeline: "2-6 weeks",
  });

  // 5. Social Proof 신호 (리뷰, 평점)
  // Review count와 average rating이 높을수록 신뢰도 증가
  const reviewScore = Math.min(100, (reviewCount / 100) * 50 + (averageRating / 5) * 50);
  signals.push({
    signal: "Social Proof (Reviews & Ratings)",
    type: "social",
    strength: reviewScore,
    impact: 8,
    implementation: "Encourage user reviews, respond to feedback, maintain 4.5+ rating",
    timeline: "Ongoing",
  });

  return signals;
}

/**
 * EEA-T 점수 계산 (Google 신뢰도 지표)
 * Experience, Expertise, Authoritativeness, Trustworthiness
 */
export function calculateEEATScore(
  contentQuality: number, // 0-100: 전문성
  authorCredentials: number, // 0-100: 저자 자격
  topicalAuthority: number, // 0-100: 주제 권한 (깊이 있는 콘텐츠)
  userSatisfaction: number, // 0-100: 사용자 만족도 (bounce rate, dwell time)
  trustSignals: number // 0-100: SSL, privacy policy, contact info 등
): Record<string, number> {
  const experience = contentQuality; // 콘텐츠 질 = 경험 증명
  const expertise = authorCredentials; // 저자 자격 = 전문성
  const authoritativeness = topicalAuthority; // 주제 심화 = 권한성
  const trustworthiness = Math.min(100, (userSatisfaction + trustSignals) / 2); // 신뢰성

  const totalEEAT = (experience + expertise + authoritativeness + trustworthiness) / 4;

  return {
    experience: Math.round(experience),
    expertise: Math.round(expertise),
    authoritativeness: Math.round(authoritativeness),
    trustworthiness: Math.round(trustworthiness),
    totalEEAT: Math.round(totalEEAT),
  };
}

/**
 * Entity Authority 메트릭 평가
 */
export function evaluateEntityAuthority(
  entityName: string,
  data: {
    hasKnowledgeGraph: boolean;
    hasWikipedia: boolean;
    citationCount: number;
    consistentNAP: boolean; // Name-Address-Phone 일관성
    averageRating: number;
    reviewCount: number;
    eeatScore: number;
  }
): EntityAuthorityMetrics {
  // Citation consistency score
  const citationConsistency = data.consistentNAP ? 95 : Math.max(50, data.citationCount > 100 ? 70 : 50);

  return {
    entityName,
    googleKnowledgeGraphCoverage: data.hasKnowledgeGraph,
    wikipediaPresence: data.hasWikipedia,
    citationCount: data.citationCount,
    citationConsistency,
    averageRating: data.averageRating,
    reviewCount: data.reviewCount,
    eeatScore: data.eeatScore,
  };
}

/**
 * Brand Amplification 전략 생성
 */
export function generateBrandAmplificationStrategy(
  signals: BrandSignal[],
  eeatScore: Record<string, number>
): BrandAmplificationStrategy {
  const totalBrandStrength = signals.reduce((sum, s) => sum + s.strength, 0) / signals.length;

  // EEA-T 개선 권장사항
  const weakestEEATComponent = Object.entries(eeatScore).reduce((min, [key, value]) => {
    if (key === "totalEEAT") return min;
    return value < min.value ? { key, value } : min;
  }, { key: "", value: 100 });

  const recommendations: string[] = [];

  // 신호별 권장사항
  signals.forEach((signal) => {
    if (signal.strength < 50) {
      recommendations.push(`⚠️ ${signal.type}: ${signal.implementation}`);
    }
  });

  // EEA-T 권장사항
  if (weakestEEATComponent.value < 60) {
    const improvementMap: Record<string, string> = {
      experience: "콘텐츠 깊이 증가: 더 상세하고 실용적인 가이드 제작",
      expertise: "저자 신뢰도 강화: 전문가 인증, 저자 약력 추가",
      authoritativeness: "주제 권한 구축: 관련 주제 콘텐츠 확대, 내부 링크 강화",
      trustworthiness: "신뢰 신호 추가: 프라이버시 정책, 연락처, SSL 인증 강화",
    };
    recommendations.push(
      `🎯 EEA-T 약점: ${improvementMap[weakestEEATComponent.key] || "개선 필요"}`
    );
  }

  // Brand strength 기반 권장사항
  if (totalBrandStrength < 50) {
    recommendations.push(
      "📢 브랜드 인지도 낮음: PR, 소셜 미디어, 인플루언서 마케팅 필요"
    );
  }

  // 예상 순위 개선
  const rankingBoostPercentage = (totalBrandStrength / 100) * 20; // 최대 +20 순위
  const expectedRankingBoost = `+${Math.round(rankingBoostPercentage / 2)}-${Math.round(rankingBoostPercentage)} positions (브랜드 신호 강화)`;

  return {
    signals,
    totalBrandStrength: Math.round(totalBrandStrength),
    eeatComponents: eeatScore,
    recommendations,
    expectedRankingBoost,
  };
}

/**
 * Brand amplification 체크리스트
 */
export function generateBrandAmplificationChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 64: Brand Signal Amplification 체크리스트\n");

  checklist.push("### Direct Traffic 증대");
  checklist.push("- [ ] 이메일 뉴스레터 구독 버튼 추가");
  checklist.push("- [ ] 북마크 권장 (홈페이지 상단)");
  checklist.push("- [ ] 모바일 앱 또는 PWA 개발");
  checklist.push("- [ ] 푸시 알림으로 재방문 유도");

  checklist.push("\n### Brand Search 증대");
  checklist.push("- [ ] 소셜 미디어 프로필 활성화 (모든 채널)");
  checklist.push("- [ ] PR: 업계 뉴스/언론 피처");
  checklist.push("- [ ] 인플루언서 협력 (브랜드 언급)");
  checklist.push("- [ ] Google Ads: Brand term 확보");

  checklist.push("\n### Entity Authority 구축");
  checklist.push("- [ ] Google Knowledge Graph 등록 신청");
  checklist.push("- [ ] Wikipedia 엔트리 생성 (존재 및 독립성 입증)");
  checklist.push("- [ ] Wikidata에 등록");
  checklist.push("- [ ] 주요 참고자료에 링크 확보");

  checklist.push("\n### Citation & NAP 일관성");
  checklist.push("- [ ] 주요 비즈니스 디렉토리 등록 (Google My Business, Yelp, 업계 특화)");
  checklist.push("- [ ] 모든 채널에서 Name-Address-Phone 정확히 일치");
  checklist.push("- [ ] 오래된 또는 중복 등록 제거");
  checklist.push("- [ ] 월 1회 NAP 감사");

  checklist.push("\n### Social Proof (리뷰 & 평점)");
  checklist.push("- [ ] Google My Business 리뷰 100+ 확보");
  checklist.push("- [ ] 평점 4.5+ 유지");
  checklist.push("- [ ] 모든 리뷰에 신속히 답변");
  checklist.push("- [ ] 고객에게 리뷰 작성 권유");

  checklist.push("\n### EEA-T 신호 강화");
  checklist.push("- [ ] About 페이지: 저자 신뢰도 정보");
  checklist.push("- [ ] Contact 페이지: 명확한 연락처 정보");
  checklist.push("- [ ] Privacy Policy & Terms of Service");
  checklist.push("- [ ] SSL 인증 (HTTPS) 확보");
  checklist.push("- [ ] E-A-T: 저자 자격/경험 표시");

  checklist.push("\n### 콘텐츠 깊이 (Topical Authority)");
  checklist.push("- [ ] 주요 주제 10개 이상 깊이 있는 콘텐츠");
  checklist.push("- [ ] 각 주제별 내부 링크 구조 (hub-spoke)");
  checklist.push("- [ ] 관련 주제 간 연계 콘텐츠");
  checklist.push("- [ ] 정기적 콘텐츠 업데이트 (신선도)");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] Google Search Console: Brand search 추적");
  checklist.push("- [ ] Google Analytics: Direct traffic 모니터링");
  checklist.push("- [ ] Knowledge Graph 등록 상태 확인");
  checklist.push("- [ ] Citation count 및 일관성 모니터링 (월 1회)");

  return checklist;
}

/**
 * Brand Signal Amplification 전략 가이드
 */
export function generateBrandSignalStrategy(): string[] {
  const strategy: string[] = [];

  strategy.push("## Phase 64: Brand Signal Amplification 전략\n");

  strategy.push("### 왜 브랜드 신호인가?");
  strategy.push("- Google은 더 이상 순위 = 링크만이 아님");
  strategy.push("- 2023+ 업데이트: 직접 검색, brand mentions, 사용자 행동 중시");
  strategy.push("- Brand Authority = EEAT (Experience, Expertise, Authoritativeness, Trustworthiness)");
  strategy.push("- 브랜드 신호 강할수록 알고리즘 변화에 강함");

  strategy.push("\n### 4대 Brand Signal Lever");
  strategy.push("1. **Direct Traffic** (15% 영향도)");
  strategy.push("   - 구글이 직접 방문을 신뢰도 신호로 평가");
  strategy.push("   - Strategy: 이메일, 앱, 소셜, 광고로 재방문 유도");
  strategy.push("");
  strategy.push("2. **Brand Search** (20% 영향도 - 최강)");
  strategy.push("   - '이슈글로브' 검색하는 사용자 수");
  strategy.push("   - Strategy: PR, 소셜, 인플루언서로 인지도 확대");
  strategy.push("");
  strategy.push("3. **Entity Authority** (12-15% 영향도)");
  strategy.push("   - Wikipedia, Knowledge Graph 등재 여부");
  strategy.push("   - Citation consistency (NAP)");
  strategy.push("   - Strategy: 엔티티 등록, NAP 정확성");
  strategy.push("");
  strategy.push("4. **Social Proof** (8-10% 영향도)");
  strategy.push("   - 리뷰, 평점, 사용자 신호");
  strategy.push("   - Strategy: 리뷰 수집, 빠른 응답");

  strategy.push("\n### EEAT 구축 로드맵");
  strategy.push("**Week 1-2**: 기초 신호");
  strategy.push("- SSL 인증 확인");
  strategy.push("- Privacy Policy, Contact 페이지 강화");
  strategy.push("- About 페이지에 저자 신뢰도 정보 추가");
  strategy.push("");
  strategy.push("**Week 3-4**: 콘텐츠 깊이");
  strategy.push("- 주요 주제 10개 깊이 있는 콘텐츠 작성");
  strategy.push("- 내부 링크 hub-spoke 구조 구성");
  strategy.push("");
  strategy.push("**Week 5-8**: 외부 신호");
  strategy.push("- Google Knowledge Graph 등록 신청");
  strategy.push("- 비즈니스 디렉토리 등록 (NAP 일관성)");
  strategy.push("- 첫 리뷰 수집 캠페인");
  strategy.push("");
  strategy.push("**Month 3+**: 장기 브랜드 구축");
  strategy.push("- PR, 소셜, 인플루언서 (Brand search 증대)");
  strategy.push("- Wikipedia 엔트리 생성");
  strategy.push("- 업계 파트너십 (co-mention)");

  strategy.push("\n### 예상 효과");
  strategy.push("- Month 1: EEAT 기초 신호 +30 points");
  strategy.push("- Month 2-3: Entity Authority 구축 (Citation +50)");
  strategy.push("- Month 3+: Brand search +100-200 searches/month");
  strategy.push("- Combined: +10-20 순위 상승 (모든 키워드 평균)");

  return strategy;
}
