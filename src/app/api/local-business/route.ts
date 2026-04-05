import { NextRequest, NextResponse } from "next/server";
import {
  generateGoogleBusinessProfileGuide,
  optimizeForLocalMarkets,
  validateNAPConsistency,
  calculateLocalSEOScore,
  identifyLocalKeywordOpportunities,
  generateLocalOptimizationChecklist,
} from "@/lib/local-business-optimization";

interface LocalBusinessRequest {
  businessName: string;
  countryCode: string;
  listings?: Array<{ name: string; address: string; phone: string }>;
  businessType?: string;
  cities?: string[];
}

/**
 * 지역 비즈니스 SEO 최적화 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    const body: LocalBusinessRequest = await request.json();

    const {
      businessName,
      countryCode,
      listings = [],
      businessType = "general",
      cities = [],
    } = body;

    // 1. Google Business Profile 가이드
    const gbpGuide = generateGoogleBusinessProfileGuide();

    // 2. 지역별 최적화 전략
    const localStrategy = optimizeForLocalMarkets(
      businessName,
      countryCode
    );

    // 3. NAP 일관성 검증
    const napValidation =
      listings.length > 0
        ? validateNAPConsistency(listings)
        : {
            consistent: false,
            issues: ["No listings provided for validation"],
            score: 0,
            recommendations: [
              "Add business listings to validate NAP consistency",
            ],
          };

    // 4. 지역 SEO 점수
    const localSEOMetrics = {
      mapVisibility: 65,
      businessProfileCoverage: 70,
      reviewScore: 72,
      citationConsistency: napValidation.score,
      localKeywordRanking: 45,
      nap: {
        name: napValidation.consistent && napValidation.score > 80,
        address: napValidation.consistent && napValidation.score > 80,
        phone: napValidation.consistent && napValidation.score > 80,
      },
    };

    const seoScore = calculateLocalSEOScore(localSEOMetrics);

    // 5. 지역 키워드 기회
    const keywordOpportunities = identifyLocalKeywordOpportunities(
      businessType,
      cities.length > 0 ? cities : localStrategy.cities.map((c) => c.name)
    );

    // 6. 최적화 체크리스트
    const checklist = generateLocalOptimizationChecklist();

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        businessName,
        countryCode,
        localStrategy,
        napValidation,
        localSEOScore: seoScore,
        keywordOpportunities: keywordOpportunities.slice(0, 10),
        googleBusinessGuide: gbpGuide,
        optimizationChecklist: checklist,
        nextActions: [
          "1. Claim and verify Google Business Profile",
          "2. Complete all profile sections (100% coverage)",
          "3. Ensure NAP consistency across all listings",
          "4. Add high-quality business photos (10+)",
          "5. Collect reviews from satisfied customers",
          "6. Post weekly business updates",
          "7. Monitor and respond to reviews",
          "8. Optimize for local keywords",
        ],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error(
      "Local Business SEO error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Local Business SEO analysis failed",
        message:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
