/**
 * 콘텐츠 신선도 부스트 (Freshness Boost Engine)
 * 최근 업데이트된 콘텐츠를 Google 검색 순위에서 상위로 올림
 */

export interface FreshnessSignal {
  signal: string;
  freshness: number; // 0-100 스코어
  boostMultiplier: number; // 1.0-2.0x ranking boost
  lifespan: number; // days - 신선도 유지 기간
}

export interface ContentFreshnessMetrics {
  createdDate: string;
  lastModifiedDate: string;
  updateFrequency: "hourly" | "daily" | "weekly" | "monthly";
  contentAge: number; // days
  freshnessScore: number; // 0-100
  boostEligible: boolean;
  boostMultiplier: number;
}

/**
 * 신선도 점수 계산
 */
export function calculateFreshnessScore(
  createdDate: string,
  lastModifiedDate: string,
  updateFrequency: "hourly" | "daily" | "weekly" | "monthly"
): ContentFreshnessMetrics {
  const now = new Date();
  const lastModified = new Date(lastModifiedDate);
  const created = new Date(createdDate);

  // 콘텐츠 나이 (일)
  const contentAgeMs = now.getTime() - created.getTime();
  const contentAge = Math.floor(contentAgeMs / (1000 * 60 * 60 * 24));

  // 마지막 수정 이후 경과 시간
  const timeSinceModifyMs = now.getTime() - lastModified.getTime();
  const timeSinceModifyDays = Math.floor(
    timeSinceModifyMs / (1000 * 60 * 60 * 24)
  );

  // 신선도 점수 계산
  let freshnessScore = 0;

  // 1. 수정 빈도 (40점)
  const updateScores = {
    hourly: 40,
    daily: 30,
    weekly: 20,
    monthly: 10,
  };
  freshnessScore += updateScores[updateFrequency] || 10;

  // 2. 마지막 수정 시간 (40점)
  if (timeSinceModifyDays === 0) {
    freshnessScore += 40; // 오늘 수정
  } else if (timeSinceModifyDays <= 3) {
    freshnessScore += 30; // 3일 이내
  } else if (timeSinceModifyDays <= 7) {
    freshnessScore += 20; // 1주일 이내
  } else if (timeSinceModifyDays <= 30) {
    freshnessScore += 10; // 1개월 이내
  } else {
    freshnessScore += Math.max(0, 5 - Math.floor(timeSinceModifyDays / 30)); // 점진적 감소
  }

  // 3. 콘텐츠 나이 (20점)
  if (contentAge <= 7) {
    freshnessScore += 20; // 신규 콘텐츠
  } else if (contentAge <= 30) {
    freshnessScore += 15; // 최근
  } else if (contentAge <= 90) {
    freshnessScore += 10; // 중간
  } else if (contentAge <= 365) {
    freshnessScore += 5; // 오래됨
  }

  // Boost 적격성 판단
  const boostEligible =
    timeSinceModifyDays <= 3 && updateFrequency !== "monthly";

  // Boost 배수 계산
  let boostMultiplier = 1.0;
  if (boostEligible) {
    if (timeSinceModifyDays === 0) boostMultiplier = 2.0; // 오늘
    else if (timeSinceModifyDays === 1) boostMultiplier = 1.8; // 어제
    else if (timeSinceModifyDays <= 3) boostMultiplier = 1.5; // 3일
  }

  return {
    createdDate,
    lastModifiedDate,
    updateFrequency,
    contentAge,
    freshnessScore: Math.min(100, freshnessScore),
    boostEligible,
    boostMultiplier,
  };
}

/**
 * UpdateAction Schema (최신 콘텐츠 신호)
 */
export function generateUpdateActionSchema(
  contentTitle: string,
  updateDate: string,
  updateReason: string
): object {
  return {
    "@context": "https://schema.org",
    "@type": "UpdateAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: contentTitle,
    },
    startTime: updateDate,
    agent: {
      "@type": "Organization",
      name: "IssueGlobe",
    },
    description: updateReason,
  };
}

/**
 * 신선도 신호 목록 생성
 */
export function generateFreshnessSignals(
  metrics: ContentFreshnessMetrics
): FreshnessSignal[] {
  const signals: FreshnessSignal[] = [];

  // 신호 1: 최근 게시
  const contentAge = metrics.contentAge;
  if (contentAge === 0) {
    signals.push({
      signal: "Posted today",
      freshness: 100,
      boostMultiplier: 2.0,
      lifespan: 1,
    });
  } else if (contentAge <= 7) {
    signals.push({
      signal: "Posted recently",
      freshness: 90,
      boostMultiplier: 1.8,
      lifespan: 7,
    });
  }

  // 신호 2: 최근 수정
  const timeSinceModify = new Date().getTime() - new Date(metrics.lastModifiedDate).getTime();
  const timeSinceModifyDays = timeSinceModify / (1000 * 60 * 60 * 24);

  if (timeSinceModifyDays === 0) {
    signals.push({
      signal: "Updated today",
      freshness: 100,
      boostMultiplier: 1.8,
      lifespan: 1,
    });
  } else if (timeSinceModifyDays <= 7) {
    signals.push({
      signal: "Recently updated",
      freshness: 85,
      boostMultiplier: 1.5,
      lifespan: 7,
    });
  }

  // 신호 3: 정기적 업데이트
  if (metrics.updateFrequency === "hourly" || metrics.updateFrequency === "daily") {
    signals.push({
      signal: "Frequently updated",
      freshness: 80,
      boostMultiplier: 1.5,
      lifespan: 30,
    });
  }

  return signals;
}

/**
 * 신선도 기반 검색 순위 예측
 */
export function predictRankingBoost(
  currentRank: number,
  freshnessScore: number,
  boostMultiplier: number
): { predictedRank: number; improvement: number } {
  // 신선도 점수가 높을수록 더 많은 부스트
  const freshnessBoost = Math.floor(freshnessScore / 20); // 0-5 positions
  const multiplierBoost = Math.floor((boostMultiplier - 1) * 5); // 0-5 positions

  const totalBoost = freshnessBoost + multiplierBoost;
  const predictedRank = Math.max(1, currentRank - totalBoost);

  return {
    predictedRank,
    improvement: currentRank - predictedRank,
  };
}

/**
 * 신선도 전략 가이드
 */
export function generateFreshnessStrategy(): string[] {
  const strategy: string[] = [];

  strategy.push("## 콘텐츠 신선도 부스트 전략\n");

  strategy.push("### 신선도 신호 생성");
  strategy.push("- ✅ 매일 1회 이상 트렌드 업데이트");
  strategy.push("- ✅ 관련 뉴스/발전사항 추가");
  strategy.push("- ✅ 'Updated 1h ago' 타임스탬프 표시");
  strategy.push("- ✅ UpdateAction schema 추가");

  strategy.push("\n### 콘텐츠 수정 전략");
  strategy.push("- 📝 콘텐츠 공개 후 24시간 내 1회 수정");
  strategy.push("- 📝 주간 1회 주요 콘텐츠 검토");
  strategy.push("- 📝 새로운 정보 추가 시 날짜 명시");
  strategy.push("- 📝 구식 정보 제거/업데이트");

  strategy.push("\n### 신선도 신호 표시");
  strategy.push("- 🔴 'New' 배지 (24시간)");
  strategy.push("- 🟡 'Updated' 배지 (7일)");
  strategy.push("- ⏱️ 마지막 업데이트 시간 표시");
  strategy.push("- 📢 'Trending' 또는 'Breaking' 표시");

  strategy.push("\n### 신선도 부스트 기대값");
  strategy.push("- 📈 +1-5 순위 상승 (같은 날 업데이트)");
  strategy.push("- 📈 +5-10 순위 상승 (정기적 업데이트)");
  strategy.push("- 📈 +10-20% CTR 증가 (최신 콘텐츠 신호)");

  strategy.push("\n### 실시간 구현");
  strategy.push("1. 매시간 트렌드 갱신 자동화");
  strategy.push("2. 변경 사항 자동 감지 & Schema 업데이트");
  strategy.push("3. 최신 타임스탬프 자동 추가");
  strategy.push("4. 'Just updated' 카운터 표시");

  return strategy;
}

/**
 * 신선도 체크리스트
 */
export function generateFreshnessChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 콘텐츠 신선도 최적화 체크리스트\n");

  checklist.push("### 일일 작업");
  checklist.push("- [ ] 트렌드 데이터 1회 이상 갱신");
  checklist.push("- [ ] 새로운 정보/뉴스 추가");
  checklist.push("- [ ] 'Updated X hours ago' 표시 확인");
  checklist.push("- [ ] 깨진 링크 확인");

  checklist.push("\n### 주간 작업");
  checklist.push("- [ ] 오래된 콘텐츠 검토 (30일+)");
  checklist.push("- [ ] 부정확한 정보 수정");
  checklist.push("- [ ] 신선도 점수 상위 10개 콘텐츠 확인");
  checklist.push("- [ ] UpdateAction schema 생성 확인");

  checklist.push("\n### 월간 작업");
  checklist.push("- [ ] 신선도 보고서 생성");
  checklist.push("- [ ] 순위 개선 추적 (신선도 vs 순위)");
  checklist.push("- [ ] 콘텐츠 갱신 전략 검토");
  checklist.push("- [ ] 오래된 콘텐츠 리프레시 계획");

  return checklist;
}
