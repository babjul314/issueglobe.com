import { NextRequest, NextResponse } from "next/server";
import {
  calculateLinkVelocity,
  assessLinkVelocityHealth,
  detectLinkVelocityAnomalies,
  identifyLinkOpportunities,
  setLinkAcquisitionGoals,
  generateLinkVelocityReport,
  generateLinkVelocityChecklist,
  type LinkVelocityMetric,
} from "@/lib/link-velocity-tracking";

interface LinkVelocityRequest {
  previousBacklinks?: number;
  currentBacklinks?: number;
  days?: number;
  domainAge?: number;
  niche?: string;
  targetDA?: number;
  timeframe?: "3months" | "6months" | "12months";
}

/**
 * 백링크 속도 추적 및 분석 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    const body: LinkVelocityRequest = await request.json();

    const {
      previousBacklinks = 120,
      currentBacklinks = 145,
      days = 30,
      domainAge = 6,
      niche = "trends",
      targetDA = 40,
      timeframe = "6months",
    } = body;

    // 1. 링크 속도 계산
    const velocity = calculateLinkVelocity(
      previousBacklinks,
      currentBacklinks,
      days
    );

    // 2. 링크 속도 건강도 평가
    const health = assessLinkVelocityHealth(
      velocity.monthlyVelocity,
      domainAge
    );

    // 3. 비정상 패턴 탐지
    const velocityHistory: number[] = [
      3, 4, 5, 5, 6, 7, 8, 8, 9, 10, 11, 12,
    ]; // 12개월 데이터
    const anomalies = detectLinkVelocityAnomalies(velocityHistory);

    // 4. 백링크 기회 식별
    const opportunities = identifyLinkOpportunities(niche, []);

    // 5. 링크 획득 목표 설정
    const goals = setLinkAcquisitionGoals(
      currentBacklinks,
      targetDA,
      timeframe
    );

    // 6. 시뮬레이션 메트릭 생성
    const metrics: LinkVelocityMetric[] = [
      {
        period: "monthly",
        newLinks: velocity.monthlyVelocity,
        newReferringDomains: Math.ceil(velocity.monthlyVelocity / 2),
        lostLinks: 2,
        netGain: velocity.monthlyVelocity - 2,
        growth: velocity.growthRate,
        timestamp: new Date().toISOString(),
      },
    ];

    // 7. 종합 리포트 생성
    const report = generateLinkVelocityReport(metrics);

    // 8. 체크리스트 생성
    const checklist = generateLinkVelocityChecklist();

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        linkVelocity: {
          dailyVelocity: velocity.dailyVelocity,
          weeklyVelocity: velocity.weeklyVelocity,
          monthlyVelocity: velocity.monthlyVelocity,
          netGain: velocity.netGain,
          growthRate: `${velocity.growthRate}%`,
        },
        health: {
          status: health.status,
          benchmark: `${health.benchmark} links/month`,
          gap: health.gap,
          interpretation: health.interpretation,
        },
        anomalies,
        linkOpportunities: opportunities.slice(0, 5),
        acquisitionGoals: {
          timeframe,
          totalLinksNeeded: goals.totalLinksNeeded,
          monthlyTarget: goals.monthlyTarget,
          weeklyTarget: goals.weeklyTarget,
          milestones: goals.milestones,
        },
        report,
        checklist,
        nextSteps: [
          "1. Diversify link sources (target 5+ different sources)",
          "2. Start 5 guest posting outreach campaigns",
          "3. Create link-worthy content (data, research, tools)",
          "4. Monitor competitor backlinks weekly",
          "5. Audit link quality and remove toxic links",
          `6. Target ${goals.weeklyTarget} new links per week`,
          `7. Reach ${goals.monthlyTarget} new links per month`,
        ],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      }
    );
  } catch (error) {
    console.error(
      "Link Velocity analysis error:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: "Link Velocity analysis failed",
        message:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
