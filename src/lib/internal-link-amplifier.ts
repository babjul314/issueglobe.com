/**
 * 내부 링크 자동 증폭기 (Link Juice Flow 최적화)
 * 관련 트렌드 자동 연결로 SEO 권한 분배 최적화
 */

export interface InternalLinkRecommendation {
  targetUrl: string;
  anchorText: string;
  relevanceScore: number;
  linkType: "related" | "sequential" | "category" | "country";
  priority: "critical" | "high" | "medium" | "low";
}

export interface LinkAmplifySuggestions {
  mainTrend: string;
  existingLinks: number;
  recommendedLinks: InternalLinkRecommendation[];
  estimatedAuthorityFlow: number; // %
  linkStrategy: string[];
}

/**
 * 관련 트렌드 자동 발견 및 링크 생성
 */
export function generateAutoInternalLinks(
  currentTrend: string,
  allTrends: Array<{
    title: string;
    slug: string;
    traffic: string;
    country: string;
  }>,
  currentCountry: string
): InternalLinkRecommendation[] {
  const recommendations: InternalLinkRecommendation[] = [];

  // 1. 같은 국가의 관련 트렌드
  const sameCountryTrends = allTrends.filter(
    (t) => t.country === currentCountry && t.title.toLowerCase() !== currentTrend.toLowerCase()
  );

  // 키워드 유사도 계산 (간단한 문자열 매칭)
  const relatedInSameCountry = sameCountryTrends
    .map((trend) => {
      const currentWords = currentTrend.toLowerCase().split(" ");
      const trendWords = trend.title.toLowerCase().split(" ");
      const commonWords = currentWords.filter((w) =>
        trendWords.some((tw) => tw.includes(w) || w.includes(tw))
      ).length;
      const relevance = commonWords / Math.max(currentWords.length, trendWords.length);
      return { trend, relevance };
    })
    .filter((item) => item.relevance > 0.3)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);

  relatedInSameCountry.forEach((item, idx) => {
    recommendations.push({
      targetUrl: `/trend/${encodeURIComponent(item.trend.slug)}`,
      anchorText: `Related: ${item.trend.title}`,
      relevanceScore: item.relevance,
      linkType: "related",
      priority: idx === 0 ? "high" : "medium",
    });
  });

  // 2. 트래픽 순차적 링크 (상위 5개 트렌드 연결)
  const topTraffic = allTrends
    .filter((t) => t.country === currentCountry)
    .sort((a, b) => {
      const aNum = parseInt(a.traffic.replace(/[^0-9]/g, "")) || 0;
      const bNum = parseInt(b.traffic.replace(/[^0-9]/g, "")) || 0;
      return bNum - aNum;
    })
    .slice(0, 5);

  topTraffic.forEach((trend, idx) => {
    recommendations.push({
      targetUrl: `/trend/${encodeURIComponent(trend.slug)}`,
      anchorText: `Top ${idx + 1}: ${trend.title}`,
      relevanceScore: 0.8 - idx * 0.1,
      linkType: "sequential",
      priority: idx < 2 ? "high" : "medium",
    });
  });

  // 3. 국가 간 비교 링크
  const otherCountries = [...new Set(allTrends.map((t) => t.country))].filter(
    (c) => c !== currentCountry
  );
  if (otherCountries.length > 0) {
    const globalTopTrend = allTrends
      .filter((t) => t.title.toLowerCase().includes(currentTrend.toLowerCase().split(" ")[0]))
      .sort((a, b) => {
        const aNum = parseInt(a.traffic.replace(/[^0-9]/g, "")) || 0;
        const bNum = parseInt(b.traffic.replace(/[^0-9]/g, "")) || 0;
        return bNum - aNum;
      })
      .slice(0, 1);

    if (globalTopTrend.length > 0) {
      recommendations.push({
        targetUrl: `/trend/${encodeURIComponent(globalTopTrend[0].slug)}`,
        anchorText: `Trending globally: ${globalTopTrend[0].title}`,
        relevanceScore: 0.7,
        linkType: "country",
        priority: "medium",
      });
    }
  }

  return recommendations.slice(0, 8); // 최대 8개 링크
}

/**
 * 고아 페이지(Orphan Page) 감지 및 링크 제안
 */
export function detectOrphanPages(
  allTrends: Array<{
    title: string;
    slug: string;
    incomingLinks: number;
    traffic: string;
  }>
): Array<{
  trendTitle: string;
  trendSlug: string;
  orphanScore: number;
  linkingPriority: "critical" | "high" | "medium";
  suggestedAnchor: string[];
}> {
  const orphans = allTrends
    .filter((t) => t.incomingLinks < 2) // 2개 이하 링크
    .map((trend) => {
      const trafficNum = parseInt(trend.traffic.replace(/[^0-9]/g, "")) || 0;
      const orphanScore = trafficNum > 1000 ? 0.8 : trafficNum > 100 ? 0.5 : 0.3;

      const priority: "critical" | "high" | "medium" =
        orphanScore > 0.7
          ? "critical"
          : orphanScore > 0.5
            ? "high"
            : "medium";

      return {
        trendTitle: trend.title,
        trendSlug: trend.slug,
        orphanScore,
        linkingPriority: priority,
        suggestedAnchor: [
          `${trend.title}`,
          `Learn about ${trend.title}`,
          `${trend.title} trending`,
          `What is ${trend.title}`,
        ],
      };
    })
    .sort((a, b) => b.orphanScore - a.orphanScore);

  return orphans;
}

/**
 * 링크 Juice 흐름 계산
 */
export function calculateLinkJuiceFlow(
  trendTitle: string,
  incomingLinks: number,
  outgoingLinks: number,
  pageTraffic: number
): {
  inboundAuthority: number; // 받는 권한
  outboundAuthority: number; // 보내는 권한
  netAuthority: number; // 순 권한
  healthScore: number; // 0-100
  recommendations: string[];
} {
  // Incoming Links에서 받는 권한 (각 링크 = 1 권한)
  const inboundAuthority = Math.min(100, incomingLinks * 5);

  // Outgoing Links로 분산되는 권한 (더 많을수록 희석됨)
  const outboundPenalty = Math.min(50, outgoingLinks * 1);
  const outboundAuthority = Math.max(0, inboundAuthority - outboundPenalty);

  // Net Authority (Traffic 반영)
  const trafficBoost = Math.min(20, pageTraffic / 100);
  const netAuthority = Math.min(
    100,
    outboundAuthority + trafficBoost
  );

  // Health Score
  const healthScore = Math.round(
    (netAuthority / 100) * 100 +
      (incomingLinks > 5 ? 10 : 0) +
      (outgoingLinks > 0 && outgoingLinks < 10 ? 5 : -5)
  );

  const recommendations: string[] = [];

  if (incomingLinks < 3) {
    recommendations.push(
      `❌ Low incoming links (${incomingLinks}). Target 5+ quality backlinks.`
    );
  }
  if (outgoingLinks > 15) {
    recommendations.push(
      `⚠️ Too many outgoing links (${outgoingLinks}). Consider reducing to 5-8.`
    );
  }
  if (netAuthority < 30) {
    recommendations.push(
      "🔴 Low authority. Boost with more internal links from homepage/top pages."
    );
  } else if (netAuthority < 60) {
    recommendations.push(
      "🟡 Moderate authority. Add 2-3 more internal links from high-authority pages."
    );
  } else {
    recommendations.push(
      "✅ Good authority flow. Maintain current linking strategy."
    );
  }

  return {
    inboundAuthority: Math.round(inboundAuthority),
    outboundAuthority: Math.round(outboundAuthority),
    netAuthority: Math.round(netAuthority),
    healthScore: Math.max(0, Math.min(100, healthScore)),
    recommendations,
  };
}

/**
 * 내부 링크 전략 가이드
 */
export function generateInternalLinkingStrategy(
  trendCount: number
): LinkAmplifySuggestions {
  const optimalLinksPerPage = Math.ceil(trendCount / 10);

  return {
    mainTrend: "All Trending Topics",
    existingLinks: 0,
    recommendedLinks: [],
    estimatedAuthorityFlow: Math.min(100, optimalLinksPerPage * 10),
    linkStrategy: [
      `1. 홈페이지 → 상위 5개 트렌드 (권한 분산 시작)`,
      `2. 각 국가 페이지 → Top 3 트렌드 + 관련 트렌드 (최대 8개)`,
      `3. 트렌드 페이지 → 관련 트렌드 3-5개 (콘텐츠 기반)`,
      `4. 하단 "더 보기" 섹션 → 추가 트렌드 5개`,
      `5. 아키텍처: 홈 → 국가 → 트렌드 (계층적 흐름)`,
      `최적 아웃바운드 링크: 페이지당 5-8개 (권한 희석 방지)`,
      `고아 페이지 감지: 월 1회 audit, 2개 이하 링크면 연결`,
      `Anchor text 다양화: 정확도 30% + 부분일치 30% + 자연스러운 40%`,
    ],
  };
}

/**
 * 내부 링크 체크리스트
 */
export function generateInternalLinkingChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 내부 링크 최적화 체크리스트\n");

  checklist.push("### 아키텍처 & 계층");
  checklist.push("- [ ] 홈 → 국가 → 트렌드 계층구조 확인");
  checklist.push("- [ ] 최대 3클릭으로 모든 페이지 도달 가능");
  checklist.push("- [ ] 고아 페이지(orphan) 0개");

  checklist.push("\n### 링크 배치");
  checklist.push("- [ ] 홈페이지: Top 5 트렌드 + 30개 국가 링크");
  checklist.push("- [ ] 국가 페이지: Top 3 + 관련 3 = 최대 8개");
  checklist.push("- [ ] 트렌드 페이지: 관련 3 + 추가 5 = 8개");
  checklist.push("- [ ] 페이지당 아웃바운드 5-8개 제한");

  checklist.push("\n### Anchor Text 최적화");
  checklist.push("- [ ] Exact match: 30%");
  checklist.push("- [ ] Partial match: 30%");
  checklist.push("- [ ] Branded/Natural: 40%");
  checklist.push("- [ ] Anchor text 다양화");

  checklist.push("\n### 모니터링");
  checklist.push("- [ ] 월간 고아 페이지 감시");
  checklist.push("- [ ] Link Juice 분배 확인");
  checklist.push("- [ ] 깨진 내부 링크 확인");
  checklist.push("- [ ] 과도한 링크(>15개) 제거");

  return checklist;
}
