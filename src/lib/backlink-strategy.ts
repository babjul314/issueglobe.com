/**
 * 백링크 전략 & 외부 참조 최적화
 * 도메인 권한을 높이기 위한 링크 빌딩 전략
 */

export interface BacklinkOpportunity {
  type: "mention" | "directory" | "resource" | "press" | "guest-post" | "partnership";
  platform: string;
  url: string;
  authority: number; // 0-100 점수
  relevance: number; // 0-100 점수
  difficulty: "easy" | "medium" | "hard";
  priority: number;
  description: string;
  actionItems: string[];
}

export interface LinkBuildingStrategy {
  timeline: "immediate" | "30-days" | "90-days";
  targetLinks: number;
  expectedDomainAuthority: number;
  strategies: BacklinkOpportunity[];
}

/**
 * 산업별 백링크 기회 카테고리
 */
export const BACKLINK_OPPORTUNITIES_BY_INDUSTRY = {
  "trending-topics": {
    mention: {
      platforms: [
        { name: "Tech News Sites", sites: ["TechCrunch", "The Verge", "Wired"] },
        { name: "Business News", sites: ["Forbes", "Bloomberg", "Business Insider"] },
        { name: "Social Media Trend Tracking", sites: ["Twitter/X", "LinkedIn", "Mastodon"] },
      ],
      difficulty: "hard" as const,
      authority: 85,
    },
    directory: {
      platforms: [
        "DMOZ (Open Directory Project)",
        "SEO Directories",
        "Business Directories",
        "Google Business Profile",
      ],
      difficulty: "easy" as const,
      authority: 40,
    },
    resource: {
      platforms: [
        "Marketing Resources Lists",
        "SEO Tools Roundups",
        "Analytics Tools Directories",
        "Trend Analysis Resources",
      ],
      difficulty: "medium" as const,
      authority: 60,
    },
  },
};

/**
 * 도메인 권한 추정 (간단한 휴리스틱)
 */
export function estimateDomainAuthority(domain: string): number {
  // 실제로는 Moz API, Ahrefs API 등을 사용해야 함
  const authorityMap: Record<string, number> = {
    "google.com": 100,
    "facebook.com": 100,
    "twitter.com": 99,
    "linkedin.com": 98,
    "reddit.com": 96,
    "medium.com": 90,
    "github.com": 92,
    "stackoverflow.com": 95,
    "producthunt.com": 88,
    "hackernews.ycombinator.com": 87,
  };

  return authorityMap[domain] || 50;
}

/**
 * 백링크 기회 자동 생성
 */
export function generateBacklinkOpportunities(
  trendTitle: string,
  countryName: string
): BacklinkOpportunity[] {
  const opportunities: BacklinkOpportunity[] = [];

  // 1. 뉴스 사이트 언급 기회
  opportunities.push({
    type: "mention",
    platform: "Tech News Networks",
    url: "https://example.com",
    authority: 85,
    relevance: 90,
    difficulty: "hard",
    priority: 1,
    description: `Pitch "${trendTitle}" as a trend story to tech news outlets`,
    actionItems: [
      "Prepare press release",
      "Identify reporter contacts",
      "Create newsworthy angle",
      "Pitch to journalists",
    ],
  });

  // 2. 인더스트리 리소스 페이지
  opportunities.push({
    type: "resource",
    platform: "Trending Analysis Resources",
    url: "https://example.com/resources",
    authority: 65,
    relevance: 80,
    difficulty: "medium",
    priority: 2,
    description: `Get listed on trending topics resource pages`,
    actionItems: [
      "Find resource page curators",
      "Prepare resource description",
      "Submit suggestion",
      "Follow up after 2 weeks",
    ],
  });

  // 3. 비즈니스 디렉토리
  opportunities.push({
    type: "directory",
    platform: "Business & Tech Directories",
    url: "https://example.com/directory",
    authority: 50,
    relevance: 70,
    difficulty: "easy",
    priority: 3,
    description: `Submit IssueGlobe to relevant business directories`,
    actionItems: [
      "Create company profile",
      "Add 200-word description",
      "Include logo and images",
      "Submit to 5+ directories",
    ],
  });

  // 4. 게스트 포스트 기회
  opportunities.push({
    type: "guest-post",
    platform: "Industry Blogs",
    url: "https://example.com/guest-posting",
    authority: 75,
    relevance: 85,
    difficulty: "medium",
    priority: 2,
    description: `Write guest posts about trend analysis on industry blogs`,
    actionItems: [
      "Research guest posting opportunities",
      "Prepare 1500+ word article",
      "Include natural link to IssueGlobe",
      "Pitch to blog editors",
    ],
  });

  // 5. 파트너십 & 콜라보레이션
  opportunities.push({
    type: "partnership",
    platform: "Complementary Services",
    url: "https://example.com/partnerships",
    authority: 80,
    relevance: 75,
    difficulty: "hard",
    priority: 1,
    description: `Partner with marketing tools, analytics platforms, and social media tools`,
    actionItems: [
      "Identify 10 potential partners",
      "Prepare partnership proposal",
      "Schedule intro calls",
      "Negotiate terms",
    ],
  });

  // 6. 언론 보도 & PR
  opportunities.push({
    type: "press",
    platform: "PR & Press Release Sites",
    url: "https://example.com/press",
    authority: 70,
    relevance: 80,
    difficulty: "medium",
    priority: 3,
    description: `Distribute press releases to PR sites and media outlets`,
    actionItems: [
      "Write compelling press release",
      "Use PRWeb, EIN Presswire",
      "Target business wire services",
      "Distribute to journalist databases",
    ],
  });

  return opportunities;
}

/**
 * 링크 빌딩 로드맵 생성
 */
export function generateLinkBuildingRoadmap(
  currentDomainAuthority: number = 20,
  targetDomainAuthority: number = 50
): LinkBuildingStrategy {
  const gapToFill = targetDomainAuthority - currentDomainAuthority;
  const estimatedLinks = Math.ceil(gapToFill * 3); // 각 DA 포인트당 ~3개 링크

  return {
    timeline: "90-days",
    targetLinks: estimatedLinks,
    expectedDomainAuthority: targetDomainAuthority,
    strategies: [
      {
        type: "directory",
        platform: "High Authority Directories",
        url: "https://dmoz.org",
        authority: 80,
        relevance: 60,
        difficulty: "easy",
        priority: 1,
        description: "Submit to top 20 directories (DMOZ, Yahoo Directory alternatives)",
        actionItems: [
          "Compile directory list",
          "Prepare 150-200 word descriptions",
          "Submit to directories",
          "Track submissions",
        ],
      },
      {
        type: "resource",
        platform: "Best Tools Lists",
        url: "https://example.com",
        authority: 75,
        relevance: 85,
        difficulty: "medium",
        priority: 1,
        description:
          "Get mentioned in 'best tools for trend analysis' roundup posts",
        actionItems: [
          "Find 20 roundup posts",
          "Email authors with suggestion",
          "Offer data or insight",
          "Ask for mention/link",
        ],
      },
      {
        type: "guest-post",
        platform: "Industry Publications",
        url: "https://example.com",
        authority: 78,
        relevance: 80,
        difficulty: "medium",
        priority: 2,
        description: "Write 5-10 guest posts on industry publications",
        actionItems: [
          "Identify publications",
          "Prepare 3 article ideas",
          "Pitch editors",
          "Write and publish articles",
        ],
      },
      {
        type: "mention",
        platform: "Tech/Business News",
        url: "https://example.com",
        authority: 88,
        relevance: 75,
        difficulty: "hard",
        priority: 1,
        description: "Get mentioned in news articles about trends",
        actionItems: [
          "Prepare monthly press release",
          "Build media relationships",
          "Send to news distribution",
          "Track mentions",
        ],
      },
      {
        type: "partnership",
        platform: "Technology Partners",
        url: "https://example.com",
        authority: 82,
        relevance: 80,
        difficulty: "hard",
        priority: 2,
        description: "Partner with 3-5 complementary services",
        actionItems: [
          "Research potential partners",
          "Prepare partnership benefits doc",
          "Schedule meetings",
          "Finalize agreements",
        ],
      },
    ],
  };
}

/**
 * 링크 프로필 분석
 */
export function analyzeLinkProfile(links: Array<{ domain: string; authority: number }>) {
  const totalLinks = links.length;
  const averageAuthority = links.reduce((sum, l) => sum + l.authority, 0) / totalLinks;
  const maxAuthority = Math.max(...links.map((l) => l.authority));
  const minAuthority = Math.min(...links.map((l) => l.authority));

  // 도메인 다양성
  const uniqueDomains = new Set(links.map((l) => l.domain.split(".")[0])).size;
  const diversityScore = (uniqueDomains / totalLinks) * 100;

  // 권한 분포
  const highAuthority = links.filter((l) => l.authority > 70).length;
  const mediumAuthority = links.filter((l) => l.authority > 40 && l.authority <= 70).length;
  const lowAuthority = links.filter((l) => l.authority <= 40).length;

  return {
    totalLinks,
    averageAuthority: Math.round(averageAuthority),
    maxAuthority,
    minAuthority,
    diversityScore: Math.round(diversityScore),
    distribution: {
      highAuthority,
      mediumAuthority,
      lowAuthority,
    },
    recommendations: generateLinkProfileRecommendations(
      diversityScore,
      highAuthority,
      totalLinks
    ),
  };
}

/**
 * 링크 프로필 개선 권장사항
 */
function generateLinkProfileRecommendations(
  diversityScore: number,
  highAuthorityLinks: number,
  totalLinks: number
): string[] {
  const recommendations: string[] = [];

  if (diversityScore < 50) {
    recommendations.push(
      "⚠️ 도메인 다양성 부족: 더 많은 다양한 출처에서 링크 확보 필요"
    );
  }

  if (highAuthorityLinks < totalLinks * 0.3) {
    recommendations.push(
      `📊 고권한 링크 부족: ${totalLinks * 0.3}개 이상의 DA 70+ 링크 필요`
    );
    recommendations.push("💡 해결책: 뉴스 사이트, 산업 간행물, 주요 블로그 타겟");
  }

  if (totalLinks < 20) {
    recommendations.push(
      `📈 링크 수 부족: 최소 20개 이상의 다양한 백링크 필요`
    );
    recommendations.push("💡 해결책: 게스트 포스트, 디렉토리 제출, PR 배포");
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ 링크 프로필이 양호한 상태입니다");
  }

  return recommendations;
}

/**
 * 월별 링크 빌딩 체크리스트
 */
export function generateMonthlyLinkBuildingChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 월별 링크 빌딩 체크리스트\n");

  checklist.push("### 주(Week) 1");
  checklist.push("- [ ] 10개 고권한 디렉토리 제출");
  checklist.push("- [ ] 5개 리소스 페이지 연락 (링크 요청)");
  checklist.push("- [ ] 게스트 포스트 3개 아이디어 개발");

  checklist.push("\n### 주(Week) 2");
  checklist.push("- [ ] 게스트 포스트 1개 작성 시작");
  checklist.push("- [ ] 5개 산업 블로그에 링크 요청 이메일");
  checklist.push("- [ ] 월간 뉴스레터 작성");

  checklist.push("\n### 주(Week) 3");
  checklist.push("- [ ] 게스트 포스트 1개 게시");
  checklist.push("- [ ] PR 배포 (보도자료 1개)");
  checklist.push("- [ ] 파트너 회사 2개 연락");

  checklist.push("\n### 주(Week) 4");
  checklist.push("- [ ] 링크 프로필 분석 (백링크 추적)");
  checklist.push("- [ ] 다음 달 링크 전략 계획");
  checklist.push("- [ ] 성과 리포팅");

  checklist.push("\n### 월간 목표");
  checklist.push("- [ ] 최소 10개 새로운 백링크");
  checklist.push("- [ ] 최소 2개 게스트 포스트 게시");
  checklist.push("- [ ] 평균 링크 권한도 유지/증가");

  return checklist;
}

/**
 * 앵커 텍스트 최적화 가이드
 */
export function generateAnchorTextGuidelines(): Record<string, string[]> {
  return {
    "브랜드 (20%)": [
      "IssueGlobe",
      "IssueGlobe Trends",
      "Trending Topics",
    ],
    "정확한 매칭 (30%)": [
      "trending topics",
      "global trends",
      "real-time trends",
      "trending searches",
      "what's trending",
    ],
    "부분 매칭 (30%)": [
      "trend analysis",
      "trending searches tool",
      "global trending topics",
      "real-time trend tracker",
    ],
    "자연스러운 (20%)": [
      "click here",
      "visit this site",
      "learn more",
      "discover trends",
      "check it out",
    ],
  };
}
