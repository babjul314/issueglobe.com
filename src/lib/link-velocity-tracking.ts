/**
 * 백링크 속도(Link Velocity) 추적 & 분석
 * 신규 링크 획득 속도가 SEO 순위에 미치는 영향 모니터링
 */

export interface LinkVelocityMetric {
  period: "daily" | "weekly" | "monthly";
  newLinks: number;
  newReferringDomains: number;
  lostLinks: number;
  netGain: number;
  growth: number; // %
  timestamp: string;
}

export interface LinkVelocityTrend {
  metric: string;
  values: number[];
  dates: string[];
  averageVelocity: number;
  trend: "increasing" | "stable" | "decreasing";
  recommendation: string;
}

export interface BacklinkAcquisitionTarget {
  source: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedPA: number; // Page Authority
  estimatedDA: number; // Domain Authority
  relevance: number; // 0-100
  priority: "high" | "medium" | "low";
  contact?: string;
  lastAttempt?: string;
}

export interface LinkVelocityAlert {
  type: "spike" | "decline" | "plateau" | "opportunity";
  severity: "critical" | "warning" | "info";
  message: string;
  action: string;
}

/**
 * 링크 속도 계산
 */
export function calculateLinkVelocity(
  previousLinks: number,
  currentLinks: number,
  days: number
): {
  dailyVelocity: number;
  weeklyVelocity: number;
  monthlyVelocity: number;
  netGain: number;
  growthRate: number;
} {
  const netGain = currentLinks - previousLinks;
  const dailyVelocity = netGain / days;
  const weeklyVelocity = dailyVelocity * 7;
  const monthlyVelocity = dailyVelocity * 30;
  const growthRate =
    previousLinks > 0 ? ((netGain / previousLinks) * 100) : 0;

  return {
    dailyVelocity: Math.round(dailyVelocity * 100) / 100,
    weeklyVelocity: Math.round(weeklyVelocity),
    monthlyVelocity: Math.round(monthlyVelocity),
    netGain,
    growthRate: Math.round(growthRate * 10) / 10,
  };
}

/**
 * 건강한 링크 속도 범위 판단
 */
export function assessLinkVelocityHealth(
  monthlyVelocity: number,
  domainAge: number // months
): {
  status: "excellent" | "good" | "fair" | "poor";
  benchmark: number;
  gap: number;
  interpretation: string;
} {
  // 도메인 나이에 따른 벤치마크 설정
  let benchmark = 5; // 기본값: 월 5개 링크

  if (domainAge < 6) {
    // 신규 사이트: 월 3-5개
    benchmark = 4;
  } else if (domainAge < 12) {
    // 1년 미만: 월 5-10개
    benchmark = 7;
  } else if (domainAge < 24) {
    // 1-2년: 월 10-15개
    benchmark = 12;
  } else {
    // 2년 이상: 월 15-30개
    benchmark = 20;
  }

  const gap = monthlyVelocity - benchmark;
  let status: "excellent" | "good" | "fair" | "poor";

  if (monthlyVelocity >= benchmark * 1.5) {
    status = "excellent";
  } else if (monthlyVelocity >= benchmark) {
    status = "good";
  } else if (monthlyVelocity >= benchmark * 0.5) {
    status = "fair";
  } else {
    status = "poor";
  }

  const interpretations: Record<string, string> = {
    excellent:
      "🟢 Excellent link velocity - strong growth trajectory. Continue current strategy.",
    good: "✅ Good link velocity - on track for domain maturity. Maintain outreach efforts.",
    fair: "🟡 Fair link velocity - below benchmark. Increase link building activities.",
    poor: "🔴 Poor link velocity - significantly below expectations. Urgent action required.",
  };

  return {
    status,
    benchmark,
    gap,
    interpretation: interpretations[status],
  };
}

/**
 * 링크 속도 이상 탐지
 */
export function detectLinkVelocityAnomalies(
  velocities: number[]
): LinkVelocityAlert[] {
  const alerts: LinkVelocityAlert[] = [];

  if (velocities.length < 4) {
    return alerts;
  }

  const average =
    velocities.reduce((a, b) => a + b, 0) / velocities.length;
  const stdDev = Math.sqrt(
    velocities.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) /
      velocities.length
  );

  const lastVelocity = velocities[velocities.length - 1];
  const previousAverage =
    velocities.slice(0, -1).reduce((a, b) => a + b, 0) /
    (velocities.length - 1);

  // 급증 감지 (Spike)
  if (lastVelocity > average + stdDev * 2) {
    alerts.push({
      type: "spike",
      severity: "info",
      message: `🚀 Link velocity spike detected! (${lastVelocity.toFixed(1)} vs ${average.toFixed(1)} average)`,
      action: "Analyze spike source and replicate successful tactics",
    });
  }

  // 급락 감지 (Decline)
  if (lastVelocity < average - stdDev * 2) {
    alerts.push({
      type: "decline",
      severity: "warning",
      message: `📉 Link velocity decline detected! (${lastVelocity.toFixed(1)} vs ${average.toFixed(1)} average)`,
      action: "Investigate cause and increase outreach efforts",
    });
  }

  // 정체 감지 (Plateau)
  if (
    Math.abs(lastVelocity - previousAverage) / previousAverage < 0.1 &&
    previousAverage < average * 0.7
  ) {
    alerts.push({
      type: "plateau",
      severity: "warning",
      message: `📊 Link velocity plateau - stagnant growth detected`,
      action: "Diversify link sources and refresh outreach list",
    });
  }

  return alerts;
}

/**
 * 백링크 획득 기회 식별
 */
export function identifyLinkOpportunities(
  niche: string,
  competitors: string[]
): BacklinkAcquisitionTarget[] {
  const opportunities: BacklinkAcquisitionTarget[] = [];

  const baseOpportunities: Record<string, BacklinkAcquisitionTarget[]> = {
    trends: [
      {
        source: "Industry News Websites",
        difficulty: "medium",
        estimatedPA: 45,
        estimatedDA: 65,
        relevance: 95,
        priority: "high",
      },
      {
        source: "Tech Blogs & Newsletters",
        difficulty: "medium",
        estimatedPA: 40,
        estimatedDA: 55,
        relevance: 85,
        priority: "high",
      },
      {
        source: "Business Directory Sites",
        difficulty: "easy",
        estimatedPA: 35,
        estimatedDA: 50,
        relevance: 70,
        priority: "medium",
      },
      {
        source: "Research & Data Resources",
        difficulty: "hard",
        estimatedPA: 55,
        estimatedDA: 75,
        relevance: 90,
        priority: "high",
      },
      {
        source: "Social Media Community Sites",
        difficulty: "easy",
        estimatedPA: 30,
        estimatedDA: 45,
        relevance: 60,
        priority: "medium",
      },
      {
        source: "Podcasts & Video Channels",
        difficulty: "medium",
        estimatedPA: 38,
        estimatedDA: 60,
        relevance: 75,
        priority: "medium",
      },
    ],
  };

  return baseOpportunities[niche] || baseOpportunities["trends"];
}

/**
 * 링크 획득 목표 수립
 */
export function setLinkAcquisitionGoals(
  currentBacklinks: number,
  targetDA: number, // Target Domain Authority
  timeframe: "3months" | "6months" | "12months"
): {
  totalLinksNeeded: number;
  monthlyTarget: number;
  weeklyTarget: number;
  milestones: Array<{ month: number; target: number }>;
} {
  // DA 향상마다 필요한 링크: 약 10-15개
  const linksPerDAPoint = 12;
  const daGapNeeded = Math.max(10, targetDA - (currentBacklinks / 10)); // 현재 DA 추정
  const totalLinksNeeded = Math.ceil(daGapNeeded * linksPerDAPoint);

  const monthMap = {
    "3months": 3,
    "6months": 6,
    "12months": 12,
  };

  const months = monthMap[timeframe];
  const monthlyTarget = Math.ceil(totalLinksNeeded / months);
  const weeklyTarget = Math.ceil(monthlyTarget / 4);

  const milestones: Array<{ month: number; target: number }> = [];
  for (let i = 1; i <= months; i++) {
    milestones.push({
      month: i,
      target: monthlyTarget * i,
    });
  }

  return {
    totalLinksNeeded,
    monthlyTarget,
    weeklyTarget,
    milestones,
  };
}

/**
 * 링크 속도 리포트 생성
 */
export function generateLinkVelocityReport(
  metrics: LinkVelocityMetric[]
): {
  period: string;
  summary: string;
  alerts: LinkVelocityAlert[];
  recommendations: string[];
  nextSteps: string[];
} {
  const summary = `
Analyzed ${metrics.length} periods:
- Total new links: ${metrics.reduce((sum, m) => sum + m.newLinks, 0)}
- New referring domains: ${metrics.reduce((sum, m) => sum + m.newReferringDomains, 0)}
- Average growth: ${(metrics.reduce((sum, m) => sum + m.growth, 0) / metrics.length).toFixed(1)}%
  `;

  const recommendations: string[] = [];
  const recentMetric = metrics[metrics.length - 1];

  if (recentMetric.growth > 20) {
    recommendations.push(
      "📈 Strong growth momentum - maintain current tactics"
    );
  } else if (recentMetric.growth > 10) {
    recommendations.push("✅ Healthy growth - continue outreach efforts");
  } else if (recentMetric.growth > 0) {
    recommendations.push(
      "🟡 Moderate growth - consider expanding link sources"
    );
  } else {
    recommendations.push(
      "🔴 No growth detected - immediately audit and restart link building"
    );
  }

  return {
    period: metrics.map((m) => m.period).join(", "),
    summary: summary.trim(),
    alerts: detectLinkVelocityAnomalies(
      metrics.map((m) => m.newLinks / (m.period === "daily" ? 1 : m.period === "weekly" ? 7 : 30))
    ),
    recommendations,
    nextSteps: [
      "1. Review link source diversity (at least 5 different sources)",
      "2. Contact 10 new potential link partners this week",
      "3. Update existing content to attract fresh links",
      "4. Create new resource content designed for linking",
      "5. Monitor competitor backlinks for opportunities",
    ],
  };
}

/**
 * 링크 속도 추적 체크리스트
 */
export function generateLinkVelocityChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 링크 속도 추적 & 최적화 체크리스트\n");

  checklist.push("### 주간 작업");
  checklist.push("- [ ] 신규 백링크 10개 이상 획득 목표");
  checklist.push("- [ ] 경쟁사 백링크 기회 분석");
  checklist.push("- [ ] 3개 이상 게스트 포스트 제안");
  checklist.push("- [ ] 링크 기회 목록 업데이트");

  checklist.push("\n### 월간 작업");
  checklist.push("- [ ] 링크 속도 리포트 생성");
  checklist.push("- [ ] 비정상 패턴 분석");
  checklist.push("- [ ] 링크 소스 다양성 검증");
  checklist.push("- [ ] 잃어버린 링크 복구 시도");

  checklist.push("\n### 분기 작업");
  checklist.push("- [ ] 백링크 포트폴리오 감사");
  checklist.push("- [ ] 새로운 링크 전략 개발");
  checklist.push("- [ ] DA/PA 성장 추세 분석");
  checklist.push("- [ ] 목표 재설정 및 조정");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] 매일 새로운 링크 수 확인");
  checklist.push("- [ ] 링크 품질 점수 추적");
  checklist.push("- [ ] Toxic 링크 적발 및 제거 신청");
  checklist.push("- [ ] 링크 앵커 텍스트 다양성");

  return checklist;
}
