/**
 * 로컬 비즈니스 & 지도 최적화
 * Google Maps, Apple Maps, Naver Maps 등에서의 가시성 개선
 */

export interface LocalBusinessProfile {
  businessName: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  website: string;
  categories: string[];
  operatingHours: Record<string, string>;
  reviews: {
    rating: number; // 1-5
    count: number;
    sources: Array<{ platform: string; url: string; rating: number }>;
  };
}

export interface LocalSEOMetrics {
  mapVisibility: number; // %
  businessProfileCoverage: number; // %
  reviewScore: number; // 0-100
  citationConsistency: number; // %
  localKeywordRanking: number;
  nap: {
    name: boolean;
    address: boolean;
    phone: boolean;
  };
}

export interface LocalKeywordOpportunity {
  keyword: string;
  searchVolume: number;
  competition: "low" | "medium" | "high";
  intent: "local" | "informational" | "commercial";
  opportunity: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface GeoTargetingStrategy {
  country: string;
  cities: Array<{
    name: string;
    population: number;
    searchDemand: number;
    keywords: string[];
  }>;
  localTactis: string[];
}

/**
 * Google Business Profile 최적화 가이드
 */
export function generateGoogleBusinessProfileGuide(): string[] {
  const guide: string[] = [];

  guide.push("## Google Business Profile 최적화 가이드\n");

  guide.push("### 기본 정보");
  guide.push("- [ ] 정확한 비즈니스 이름 (NAP 일치)");
  guide.push("- [ ] 완전한 주소 입력");
  guide.push("- [ ] 확인된 전화번호");
  guide.push("- [ ] 웹사이트 URL");
  guide.push("- [ ] 영업시간 최신화");

  guide.push("\n### 프로필 개선");
  guide.push("- [ ] 고품질 비즈니스 사진 10개 이상");
  guide.push("- [ ] 로고 및 배경 이미지");
  guide.push("- [ ] 비디오 추가 (최소 1개)");
  guide.push("- [ ] 상세 비즈니스 설명 (200자)");

  guide.push("\n### 카테고리 & 속성");
  guide.push("- [ ] 주요 카테고리 선택");
  guide.push("- [ ] 추가 카테고리 선택 (최대 10개)");
  guide.push("- [ ] 비즈니스 속성 설정");
  guide.push("- [ ] 특별 영업시간 (휴무일, 공휴일)");

  guide.push("\n### 리뷰 & 평점");
  guide.push("- [ ] 리뷰에 적극적으로 응답");
  guide.push("- [ ] 긍정 리뷰 장려");
  guide.push("- [ ] 평점 4.5 이상 유지");
  guide.push("- [ ] 월 10개 이상 리뷰 수집");

  guide.push("\n### 포스트 & 업데이트");
  guide.push("- [ ] 주간 2-3개 비즈니스 포스트");
  guide.push("- [ ] 이벤트 공지");
  guide.push("- [ ] 특별 혜택/프로모션");
  guide.push("- [ ] 제품/서비스 업데이트");

  return guide;
}

/**
 * 다국어 로컬 비즈니스 최적화
 */
export function optimizeForLocalMarkets(
  businessName: string,
  countryCode: string
): GeoTargetingStrategy {
  const strategies: Record<string, GeoTargetingStrategy> = {
    KR: {
      country: "South Korea",
      cities: [
        {
          name: "Seoul",
          population: 9776000,
          searchDemand: 85,
          keywords: [
            "서울 트렌드",
            "서울 실시간 검색",
            "서울 화제",
          ],
        },
        {
          name: "Busan",
          population: 3393000,
          searchDemand: 45,
          keywords: [
            "부산 트렌드",
            "부산 실시간",
            "부산 화제",
          ],
        },
        {
          name: "Incheon",
          population: 2959000,
          searchDemand: 35,
          keywords: [
            "인천 트렌드",
            "인천 검색",
          ],
        },
      ],
      localTactis: [
        "Naver Local 최적화",
        "Kakao Map 등재",
        "Coupang Eats 등록",
        "당근마켓 활용",
      ],
    },
    JP: {
      country: "Japan",
      cities: [
        {
          name: "Tokyo",
          population: 13960000,
          searchDemand: 90,
          keywords: [
            "東京 トレンド",
            "東京 話題",
            "東京 今",
          ],
        },
        {
          name: "Osaka",
          population: 8839000,
          searchDemand: 50,
          keywords: [
            "大阪 トレンド",
            "大阪 話題",
          ],
        },
      ],
      localTactis: [
        "Yahoo Japan Local 최적화",
        "Google Maps Japan 등재",
        "食べログ 등록",
      ],
    },
    US: {
      country: "United States",
      cities: [
        {
          name: "New York",
          population: 8398748,
          searchDemand: 80,
          keywords: [
            "New York trends",
            "NYC trending",
            "New York search trends",
          ],
        },
        {
          name: "Los Angeles",
          population: 3990456,
          searchDemand: 75,
          keywords: [
            "Los Angeles trends",
            "LA trending",
          ],
        },
        {
          name: "Chicago",
          population: 2716000,
          searchDemand: 55,
          keywords: [
            "Chicago trends",
            "Chicago searching",
          ],
        },
      ],
      localTactis: [
        "Google My Business 최적화",
        "Yelp 등록",
        "Local.com 프로필",
        "Better Business Bureau",
      ],
    },
  };

  return (
    strategies[countryCode] || {
      country: "Global",
      cities: [],
      localTactis: ["Google My Business 등재", "Local Schema 추가"],
    }
  );
}

/**
 * NAP 일관성 검증 (Name, Address, Phone)
 */
export function validateNAPConsistency(
  listings: Array<{ name: string; address: string; phone: string }>
): {
  consistent: boolean;
  issues: string[];
  score: number;
  recommendations: string[];
} {
  if (listings.length === 0) {
    return {
      consistent: false,
      issues: ["No listings found"],
      score: 0,
      recommendations: ["Claim and optimize business listings"],
    };
  }

  const issues: string[] = [];
  const canonical = listings[0];

  const nameVariations = new Set(listings.map((l) => l.name)).size;
  const addressVariations = new Set(listings.map((l) => l.address)).size;
  const phoneVariations = new Set(listings.map((l) => l.phone)).size;

  if (nameVariations > 1) {
    issues.push(
      `❌ Business name inconsistency: ${nameVariations} variations found`
    );
  }
  if (addressVariations > 1) {
    issues.push(
      `❌ Address inconsistency: ${addressVariations} variations found`
    );
  }
  if (phoneVariations > 1) {
    issues.push(
      `❌ Phone number inconsistency: ${phoneVariations} variations found`
    );
  }

  const inconsistencies = (nameVariations > 1 ? 1 : 0) +
    (addressVariations > 1 ? 1 : 0) +
    (phoneVariations > 1 ? 1 : 0);

  const score = Math.max(0, 100 - inconsistencies * 30);

  const recommendations: string[] = [];
  if (score < 100) {
    recommendations.push("Update all business listings to match canonical NAP");
    recommendations.push(
      `Prioritize: ${["Name", "Address", "Phone"].filter((_, i) => [nameVariations, addressVariations, phoneVariations][i] > 1).join(", ")}`
    );
  }

  return {
    consistent: issues.length === 0,
    issues,
    score,
    recommendations,
  };
}

/**
 * 로컬 SEO 점수 계산
 */
export function calculateLocalSEOScore(metrics: LocalSEOMetrics): {
  score: number;
  grade: string;
  gaps: string[];
} {
  let score = 0;

  // Map Visibility (25점)
  score += (metrics.mapVisibility / 100) * 25;

  // Business Profile Coverage (20점)
  score += (metrics.businessProfileCoverage / 100) * 20;

  // Review Score (25점)
  score += (metrics.reviewScore / 100) * 25;

  // Citation Consistency (20점)
  score += (metrics.citationConsistency / 100) * 20;

  // Local Keywords (10점)
  score += Math.min(10, metrics.localKeywordRanking / 10);

  const finalScore = Math.round(score);
  let grade = "F";

  if (finalScore >= 90) grade = "A+";
  else if (finalScore >= 80) grade = "A";
  else if (finalScore >= 70) grade = "B";
  else if (finalScore >= 60) grade = "C";
  else if (finalScore >= 50) grade = "D";

  const gaps: string[] = [];
  if (metrics.mapVisibility < 80) gaps.push("Map visibility 개선 필요");
  if (metrics.businessProfileCoverage < 80)
    gaps.push("Business profile 완성도 증가");
  if (metrics.reviewScore < 75) gaps.push("Review 평점 개선 필요");
  if (metrics.citationConsistency < 90) gaps.push("NAP 일관성 개선");

  return { score: finalScore, grade, gaps };
}

/**
 * 로컬 키워드 기회 분석
 */
export function identifyLocalKeywordOpportunities(
  businessType: string,
  cities: string[]
): LocalKeywordOpportunity[] {
  const opportunities: LocalKeywordOpportunity[] = [];

  const baseKeywords: Record<string, string[]> = {
    restaurant: [
      "best restaurants",
      "local food",
      "delivery",
      "reviews",
    ],
    retail: ["shopping near me", "local stores", "sales"],
    service: ["services near me", "local professionals", "hire"],
  };

  const keywords = baseKeywords[businessType] || [];

  cities.forEach((city) => {
    keywords.forEach((keyword) => {
      const volume = Math.floor(Math.random() * 5000) + 500;
      const compIntensity = Math.random();
      let competition: "low" | "medium" | "high" = "low";
      if (compIntensity > 0.7) competition = "high";
      else if (compIntensity > 0.4) competition = "medium";

      opportunities.push({
        keyword: `${keyword} in ${city}`,
        searchVolume: volume,
        competition,
        intent: volume > 1000 ? "commercial" : "informational",
        opportunity: `Rank for local ${keyword} to capture ${city} searches`,
        difficulty:
          competition === "high"
            ? "hard"
            : competition === "medium"
              ? "medium"
              : "easy",
      });
    });
  });

  return opportunities.sort((a, b) => b.searchVolume - a.searchVolume);
}

/**
 * 지역 최적화 체크리스트
 */
export function generateLocalOptimizationChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 지역 SEO 최적화 체크리스트\n");

  checklist.push("### Google Business Profile");
  checklist.push("- [ ] 프로필 완성 (100%)");
  checklist.push("- [ ] 주소 확인 완료");
  checklist.push("- [ ] 사진 업로드 (최소 10개)");
  checklist.push("- [ ] 리뷰 5개 이상 수집");

  checklist.push("\n### 인용 & 나열");
  checklist.push("- [ ] 주요 5개 지역 디렉토리 등재");
  checklist.push("- [ ] NAP 일관성 검증");
  checklist.push("- [ ] 고품질 인용 30개 목표");
  checklist.push("- [ ] 지역 뉴스 사이트 등재");

  checklist.push("\n### 구조화된 데이터");
  checklist.push("- [ ] LocalBusiness Schema 추가");
  checklist.push("- [ ] AggregateRating Schema");
  checklist.push("- [ ] GeoCoordinates 마크업");
  checklist.push("- [ ] OpeningHoursSpecification");

  checklist.push("\n### 지역 콘텐츠");
  checklist.push("- [ ] 지역 랜딩 페이지 생성");
  checklist.push("- [ ] 지역 이벤트 페이지");
  checklist.push("- [ ] 지역 블로그 포스트");
  checklist.push("- [ ] 고객 리뷰 노출");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] Google Search Console 지역 데이터");
  checklist.push("- [ ] Google Analytics 위치 추적");
  checklist.push("- [ ] Google Maps 리뷰 모니터링");
  checklist.push("- [ ] 월간 지역 순위 보고");

  return checklist;
}
