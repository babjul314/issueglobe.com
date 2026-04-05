/**
 * Phase 65: Content Cluster Hub-Spoke Architecture & Topical Authority
 * 토픽 권한 구축으로 Google의 주제별 깊이 있는 사이트로 평가받기
 */

export interface ContentCluster {
  hubKeyword: string; // e.g., "Artificial Intelligence"
  pillarUrl: string; // e.g., /trend/artificial-intelligence
  clusterTopics: Array<{
    keyword: string; // e.g., "Machine Learning", "Deep Learning"
    url: string;
    relatedQuestions: string[];
    linkStrategy: "internal" | "external" | "both";
  }>;
  topicalAuthority: number; // 0-100
  estimatedRankGain: number; // positions
  implementationPriority: "critical" | "high" | "medium" | "low";
}

export interface TopicalAuthorityMetrics {
  topicName: string;
  contentDepth: number; // 0-100: 관련 콘텐츠 수
  internalLinkDensity: number; // 0-100: 내부 링크 강도
  externalAuthority: number; // 0-100: 외부 링크 품질
  userEngagement: number; // 0-100: 체류시간, CTR
  freshness: number; // 0-100: 신선도
  totalAuthorityScore: number; // 0-100
}

export interface ClusterImpactProjection {
  cluster: ContentCluster;
  shortTerm: {
    timeframe: string;
    expectedRanks: Record<string, number>;
    expectedTraffic: number;
  };
  longTerm: {
    timeframe: string;
    expectedRanks: Record<string, number>;
    expectedTraffic: number;
    knowledgeGraphProbability: number; // %
  };
}

/**
 * Hub-Spoke 구조 자동 생성
 */
export function generateContentCluster(
  hubKeyword: string,
  relatedKeywords: string[],
  existingContent: Array<{ title: string; url: string }>
): ContentCluster {
  // Hub URL 생성
  const pillarUrl = `/trend/${encodeURIComponent(hubKeyword.toLowerCase())}`;

  // Cluster 토픽 생성
  const clusterTopics = relatedKeywords.map((keyword) => ({
    keyword,
    url: `/trend/${encodeURIComponent(keyword.toLowerCase())}`,
    relatedQuestions: [
      `What is ${keyword}?`,
      `How does ${keyword} work?`,
      `${keyword} vs ${hubKeyword}`,
      `Best practices for ${keyword}`,
      `${keyword} future trends`,
    ],
    linkStrategy: "internal" as const,
  }));

  // Topical Authority 계산
  const contentCount = existingContent.length + relatedKeywords.length;
  const topicalAuthority = Math.min(100, (contentCount / 20) * 100); // 20개 = 100

  return {
    hubKeyword,
    pillarUrl,
    clusterTopics,
    topicalAuthority,
    estimatedRankGain: Math.round((topicalAuthority / 100) * 25), // 최대 +25 순위
    implementationPriority:
      topicalAuthority > 70
        ? "critical"
        : topicalAuthority > 50
          ? "high"
          : topicalAuthority > 30
            ? "medium"
            : "low",
  };
}

/**
 * 토픽 권한 메트릭 평가
 */
export function evaluateTopicalAuthority(
  topicName: string,
  metrics: {
    relatedContentCount: number;
    internalLinkCount: number;
    backlinksCount: number;
    averageDwellTime: number; // seconds
    ctr: number; // %
    lastUpdateDays: number;
  }
): TopicalAuthorityMetrics {
  // Content Depth: 관련 콘텐츠 수 (20개 = 100)
  const contentDepth = Math.min(100, (metrics.relatedContentCount / 20) * 100);

  // Internal Link Density: 내부 링크 강도 (50개 = 100)
  const internalLinkDensity = Math.min(100, (metrics.internalLinkCount / 50) * 100);

  // External Authority: 외부 링크 품질 (100개 = 100)
  const externalAuthority = Math.min(100, (metrics.backlinksCount / 100) * 100);

  // User Engagement: 체류시간 + CTR
  // 2분 이상 = 100, CTR 5% 이상 = 100
  const engagementScore = (metrics.averageDwellTime / 120) * 50 + (metrics.ctr / 5) * 50;
  const userEngagement = Math.min(100, engagementScore);

  // Freshness: 신선도 (1일 = 100, 30일 = 50, 90일+ = 20)
  let freshness = 100;
  if (metrics.lastUpdateDays > 90) freshness = 20;
  else if (metrics.lastUpdateDays > 30) freshness = 50;
  else if (metrics.lastUpdateDays > 7) freshness = 80;

  // Total Authority Score
  const totalAuthorityScore =
    contentDepth * 0.25 +
    internalLinkDensity * 0.25 +
    externalAuthority * 0.25 +
    userEngagement * 0.15 +
    freshness * 0.1;

  return {
    topicName,
    contentDepth: Math.round(contentDepth),
    internalLinkDensity: Math.round(internalLinkDensity),
    externalAuthority: Math.round(externalAuthority),
    userEngagement: Math.round(userEngagement),
    freshness: Math.round(freshness),
    totalAuthorityScore: Math.round(totalAuthorityScore),
  };
}

/**
 * Cluster Impact 예측
 */
export function projectClusterImpact(
  cluster: ContentCluster,
  currentMetrics: {
    hubCurrentRank: number;
    clusterAverageRank: number;
  }
): ClusterImpactProjection {
  // Short-term (2-4 weeks): 내부 링크만으로 순위 개선
  const shortTermRankGain = Math.round(cluster.estimatedRankGain * 0.5);
  const shortTermTraffic = Math.round(
    cluster.clusterTopics.length * (currentMetrics.clusterAverageRank > 10 ? 50 : 150)
  );

  // Long-term (2-3 months): 전체 cluster 효과 + 토픽 권한 reputation
  const longTermRankGain = cluster.estimatedRankGain;
  const longTermTraffic = shortTermTraffic * 2;
  const knowledgeGraphProbability = cluster.topicalAuthority > 70 ? 75 : 50;

  return {
    cluster,
    shortTerm: {
      timeframe: "2-4 weeks",
      expectedRanks: {
        hub: currentMetrics.hubCurrentRank - shortTermRankGain,
        average: currentMetrics.clusterAverageRank - shortTermRankGain * 0.7,
      },
      expectedTraffic: shortTermTraffic,
    },
    longTerm: {
      timeframe: "2-3 months",
      expectedRanks: {
        hub: currentMetrics.hubCurrentRank - longTermRankGain,
        average: currentMetrics.clusterAverageRank - longTermRankGain * 0.8,
      },
      expectedTraffic: longTermTraffic,
      knowledgeGraphProbability,
    },
  };
}

/**
 * Hub-Spoke 내부 링크 전략
 */
export function generateHubSpokeInternalLinkingStrategy(cluster: ContentCluster): {
  hubLinksOut: number;
  spokeLinksToHub: number;
  spokesToSpokes: number;
  anchorTextStrategy: string;
  expectedAnchorDistribution: Record<string, number>;
} {
  const spokeCount = cluster.clusterTopics.length;

  // Hub에서 나가는 링크: 각 spoke + external 5-8개
  const hubLinksOut = spokeCount + 6;

  // Spoke에서 hub로 돌아오는 링크: 모두
  const spokeLinksToHub = spokeCount;

  // Spoke to Spoke: 각 spoke에서 2-3개 관련 spoke로
  const spokesToSpokes = spokeCount * 2.5;

  // Anchor text 전략
  const anchorTextStrategy = `
    1. Hub (Pillar) 링크:
       - 30%: Exact match ("${cluster.hubKeyword}")
       - 30%: Partial ("Learn about ${cluster.hubKeyword}")
       - 40%: Natural ("Check our comprehensive guide")

    2. Spoke to Spoke 링크:
       - 40%: Related keyword ("${cluster.clusterTopics[0]?.keyword}")
       - 30%: Natural ("Related: ...")
       - 30%: Branded ("IssueGlobe's ...")
  `;

  const expectedAnchorDistribution = {
    exact_match: 30,
    partial_match: 30,
    natural: 40,
  };

  return {
    hubLinksOut,
    spokeLinksToHub,
    spokesToSpokes: Math.round(spokesToSpokes),
    anchorTextStrategy: anchorTextStrategy.trim(),
    expectedAnchorDistribution,
  };
}

/**
 * Topical Authority 구축 로드맵
 */
export function generateTopicalAuthorityRoadmap(clusters: ContentCluster[]): string[] {
  const roadmap: string[] = [];

  // 우선순위로 정렬
  const sortedClusters = clusters.sort((a, b) => {
    const priorityMap = { critical: 3, high: 2, medium: 1, low: 0 };
    return priorityMap[b.implementationPriority] - priorityMap[a.implementationPriority];
  });

  roadmap.push("## Topical Authority 구축 로드맵\n");

  roadmap.push("### Phase 1: Foundation (Week 1-2)");
  sortedClusters.slice(0, 3).forEach((cluster, idx) => {
    roadmap.push(
      `${idx + 1}. Hub: "${cluster.hubKeyword}" (Priority: ${cluster.implementationPriority})`
    );
    roadmap.push(
      `   - Pillar page: 4,000+ words (comprehensive guide)`
    );
    roadmap.push(
      `   - ${cluster.clusterTopics.length} spoke pages planned`
    );
  });

  roadmap.push("\n### Phase 2: Cluster Build (Week 3-6)");
  roadmap.push(
    "- Create spoke pages (1,500-2,000 words each)"
  );
  roadmap.push(
    "- Implement hub-spoke internal linking (all bi-directional)"
  );
  roadmap.push(
    "- Update pillar page with new spoke links"
  );

  roadmap.push("\n### Phase 3: Authority Signals (Week 7-8)");
  roadmap.push(
    "- Add FAQ sections to pillar + spoke pages"
  );
  roadmap.push(
    "- Create comparison tables (spoke vs spoke)"
  );
  roadmap.push(
    "- Add visual content (infographics, diagrams)"
  );
  roadmap.push(
    "- Schema markup: BreadcrumbList + FAQPage for cluster"
  );

  roadmap.push("\n### Phase 4: External Authority (Month 2+)");
  roadmap.push(
    "- Earn backlinks to pillar page (guest posts, PR, mentions)"
  );
  roadmap.push(
    "- Mention cluster topics in external publications"
  );
  roadmap.push(
    "- Build citations including hub keyword"
  );

  roadmap.push("\n### Expected Timeline to Authority");
  roadmap.push(
    "- Week 2-3: Initial cluster ranking improvements (+2-5 positions)"
  );
  roadmap.push(
    "- Month 2: Hub reaches top 3 (+10-15 positions from baseline)"
  );
  roadmap.push(
    "- Month 3: Full cluster dominates SERP (5-10 results from same site)"
  );
  roadmap.push(
    "- Month 4+: Knowledge Graph eligibility + featured snippet dominance"
  );

  return roadmap;
}

/**
 * Content Cluster 체크리스트
 */
export function generateContentClusterChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 65: Content Cluster (Hub-Spoke) 체크리스트\n");

  checklist.push("### Cluster 계획");
  checklist.push("- [ ] 주요 주제 5-10개 선정 (Hub 후보)");
  checklist.push("- [ ] 각 Hub별 관련 주제 10+ 식별 (Spoke 후보)");
  checklist.push("- [ ] 기존 콘텐츠 매핑 (어떤 spoke 커버?)");
  checklist.push("- [ ] 콘텐츠 갭 식별 (새로 작성 필요한 것)");

  checklist.push("\n### Pillar Page 작성");
  checklist.push("- [ ] Hub 키워드에 대한 comprehensive guide (4,000+ words)");
  checklist.push("- [ ] 모든 spoke 토픽 언급 + 링크");
  checklist.push("- [ ] Table of contents (UX 개선)");
  checklist.push("- [ ] FAQ section (최소 5개 Q&A)");
  checklist.push("- [ ] 시각 자료 (인포그래픽, 다이어그램)");

  checklist.push("\n### Spoke Pages 작성");
  checklist.push("- [ ] 각 spoke: 1,500-2,000 words");
  checklist.push("- [ ] Hub 페이지로 상호 링크");
  checklist.push("- [ ] 관련 spoke 페이지로도 링크 (2-3개)");
  checklist.push("- [ ] Hub와 spoke 앵커 텍스트 다양화");

  checklist.push("\n### 내부 링킹 구조");
  checklist.push("- [ ] Hub → 모든 spoke (정확 매칭 앵커)");
  checklist.push("- [ ] Spoke → Hub (돌아오기 링크)");
  checklist.push("- [ ] Spoke ↔ Spoke (관련 토픽 연결)");
  checklist.push("- [ ] Anchor text: 정확 30%, 부분 30%, 자연 40%");

  checklist.push("\n### Schema Markup");
  checklist.push("- [ ] BreadcrumbList: Hub > Spoke 계층 표시");
  checklist.push("- [ ] FAQPage: Hub & spoke의 Q&A");
  checklist.push("- [ ] Article: 발행일, 수정일, 저자");
  checklist.push("- [ ] SameAs: Wikipedia, Knowledge Graph 링크");

  checklist.push("\n### 콘텐츠 품질");
  checklist.push("- [ ] 모든 페이지 >1,500 words");
  checklist.push("- [ ] 최소 5개 이상 고품질 이미지");
  checklist.push("- [ ] 통계/데이터 포함 (출처 명기)");
  checklist.push("- [ ] E-E-A-T 신호 명확히");

  checklist.push("\n### 외부 신호");
  checklist.push("- [ ] Hub 페이지에 백링크 3-5개 확보");
  checklist.push("- [ ] 게스트 포스트: Hub 주제 언급");
  checklist.push("- [ ] 업계 언급: Hub 키워드 co-mention");
  checklist.push("- [ ] 소셜 공유 증대");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] Hub 순위: 목표 position 3 이내");
  checklist.push("- [ ] Spoke 순위: 평균 5-10 개선");
  checklist.push("- [ ] SERP 점유율: Hub+spoke로 3+ 결과 차지");
  checklist.push("- [ ] Knowledge Graph 등록 여부");
  checklist.push("- [ ] Featured snippet 확보 여부");

  return checklist;
}
