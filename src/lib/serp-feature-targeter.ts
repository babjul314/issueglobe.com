/**
 * Phase 74: SERP Feature Targeting & Optimization
 * Featured Snippet, PAA, News Carousel, Image Pack, Video 등 자동 분석
 * 각 SERP 기능에 최적화된 스키마/콘텐츠 권고
 */

export type SERPFeature =
  | "featured_snippet"
  | "people_also_ask"
  | "news_carousel"
  | "image_pack"
  | "video_carousel"
  | "knowledge_panel";

export interface SERPFeatureEligibility {
  feature: SERPFeature;
  eligible: boolean;
  eligibilityScore: number;
  requirements: string[];
  currentStatus: string[];
  missingElements: string[];
  implementationSteps: string[];
  estimatedTrafficBoost: string;
  schemaRequired: string | null;
  effort: "low" | "medium" | "high";
}

export interface SERPTargetingPlan {
  keyword: string;
  country: string;
  totalEligibleFeatures: number;
  features: SERPFeatureEligibility[];
  topPriority: SERPFeatureEligibility;
  quickWins: SERPFeatureEligibility[];
  expectedTotalCTRBoost: string;
  implementationRoadmap: Array<{
    week: string;
    feature: SERPFeature;
    action: string;
    expectedGain: string;
  }>;
}

export interface BatchSERPReport {
  totalKeywords: number;
  totalEligibleOpportunities: number;
  featuredSnippetTargets: number;
  newsCarouselTargets: number;
  paaTargets: number;
  topOpportunities: SERPTargetingPlan[];
  aggregateExpectedCTRBoost: string;
}

/**
 * Featured Snippet 자격 분석
 */
export function analyzeFeaturedSnippetEligibility(
  keyword: string,
  summary: string,
  detail: string
): SERPFeatureEligibility {
  const eligible = summary.length > 40 && detail.length > 0;
  const eligibilityScore = Math.min(100, (summary.length / 60) * 50 + (detail.length / 300) * 50);

  const currentStatus: string[] = [];
  if (summary.length > 40) currentStatus.push("Summary length adequate");
  if (detail.length > 100) currentStatus.push("Detail content present");

  const missingElements: string[] = [];
  if (summary.length <= 40) missingElements.push("Summary too short (need 40+ chars)");
  if (detail.length < 100) missingElements.push("Insufficient detail (need 100+ chars)");
  if (!keyword.toLowerCase().startsWith("what") && !keyword.toLowerCase().startsWith("how")) {
    missingElements.push("Question-format keyword (consider 'What is X' variants)");
  }

  return {
    feature: "featured_snippet",
    eligible,
    eligibilityScore: Math.round(eligibilityScore),
    requirements: ["Direct answer (40-60 words)", "Clear summary", "HTML table/list format (optional)"],
    currentStatus,
    missingElements,
    implementationSteps: [
      "Place answer in <p> tag at top of article",
      "Structure as: Definition → Key points → Example",
      "Consider adding <table> or <ul> for list snippets",
      "Optimize for position 0 in SERP",
    ],
    estimatedTrafficBoost: "+20-35% CTR from position 0",
    schemaRequired: null,
    effort: "low",
  };
}

/**
 * PAA (People Also Ask) 자격 분석
 */
export function analyzePAAEligibility(keyword: string, relatedQueries: string[]): SERPFeatureEligibility {
  const eligible = relatedQueries.length >= 3;
  const eligibilityScore = Math.min(100, (relatedQueries.length / 5) * 100);

  const currentStatus: string[] = [];
  if (relatedQueries.length >= 3) currentStatus.push(`${relatedQueries.length} related questions found`);

  const missingElements: string[] = [];
  if (relatedQueries.length < 3) missingElements.push(`Only ${relatedQueries.length}/3 required questions`);
  missingElements.push("FAQPage schema markup needed");

  return {
    feature: "people_also_ask",
    eligible,
    eligibilityScore: Math.round(eligibilityScore),
    requirements: ["3+ related questions", "FAQPage schema", "Direct answers for each question"],
    currentStatus,
    missingElements,
    implementationSteps: [
      "Create FAQ section with 3-5 questions",
      "Implement FAQPage schema markup",
      "Answer format: Q (bold) + A (50-100 words)",
      "Include natural question variations from relatedQueries",
    ],
    estimatedTrafficBoost: "+10-20% additional impressions",
    schemaRequired: "FAQPage",
    effort: "medium",
  };
}

/**
 * News Carousel 자격 분석
 */
export function analyzeNewsCarouselEligibility(pubTime: string, imageUrl: string, source: string): SERPFeatureEligibility {
  // pubTime 파싱
  const hoursMatch = pubTime.match(/(\d+)/);
  const hours = hoursMatch ? parseInt(hoursMatch[0]) : 24;
  const isRecent = hours < 24;

  const eligible: boolean = isRecent && !!imageUrl && imageUrl.trim().length > 0 && !!source && source.trim().length > 0;
  const eligibilityScore = eligible ? 100 : isRecent ? 60 : 30;

  const currentStatus: string[] = [];
  if (isRecent) currentStatus.push(`Recent content (${hours}h ago)`);
  if (imageUrl) currentStatus.push("Featured image present");
  if (source) currentStatus.push(`Source: ${source}`);

  const missingElements: string[] = [];
  if (!isRecent) missingElements.push("Content too old (need < 24 hours)");
  if (!imageUrl) missingElements.push("Featured image required");
  if (!source) missingElements.push("Publisher attribution needed");

  return {
    feature: "news_carousel",
    eligible,
    eligibilityScore: Math.round(eligibilityScore),
    requirements: ["Published < 24 hours ago", "Featured image (1200x630px+)", "Publisher attribution", "NewsArticle schema"],
    currentStatus,
    missingElements,
    implementationSteps: [
      "Ensure pubTime is accurate",
      "Add high-quality featured image",
      "Implement NewsArticle schema",
      "Include publisher name in byline",
      "Submit to Google News (if eligible)",
    ],
    estimatedTrafficBoost: "+50-100% impressions during trending window",
    schemaRequired: "NewsArticle",
    effort: "low",
  };
}

/**
 * Image Pack 자격 분석
 */
export function analyzeImagePackEligibility(imageUrl: string, title: string): SERPFeatureEligibility {
  const hasImage = !!imageUrl && imageUrl.trim().length > 0;
  const eligible: boolean = hasImage;
  const eligibilityScore = hasImage ? 100 : 0;

  const currentStatus: string[] = [];
  if (hasImage) currentStatus.push("Featured image present");

  const missingElements: string[] = [];
  if (!hasImage) missingElements.push("Image URL required");
  missingElements.push("ImageObject schema recommended");
  missingElements.push("Descriptive alt text needed");

  return {
    feature: "image_pack",
    eligible,
    eligibilityScore: Math.round(eligibilityScore),
    requirements: ["High-quality image (1200x630px+)", "Descriptive alt text", "ImageObject schema", "Relevant to query"],
    currentStatus,
    missingElements,
    implementationSteps: [
      "Optimize image size and compression",
      "Add descriptive alt text (title-based)",
      "Implement ImageObject schema",
      "Use natural image filename (not img123.jpg)",
      "Ensure image is above the fold",
    ],
    estimatedTrafficBoost: "+5-15% CTR from image results",
    schemaRequired: "ImageObject",
    effort: "low",
  };
}

/**
 * Video Carousel 자격 분석
 */
export function analyzeVideoCarouselEligibility(title: string, relatedQueries: string[]): SERPFeatureEligibility {
  const hasVideoIntent = relatedQueries.some((q) =>
    ["how to", "tutorial", "guide", "video", "watch", "show"].some((word) => q.toLowerCase().includes(word))
  );

  const eligible = true; // Trending topics often have video intent
  const eligibilityScore = hasVideoIntent ? 80 : 60;

  const currentStatus: string[] = [];
  if (hasVideoIntent) currentStatus.push("Video intent detected in related queries");

  const missingElements: string[] = [];
  missingElements.push("VideoObject schema required");
  missingElements.push("YouTube embed or video hosting needed");

  return {
    feature: "video_carousel",
    eligible,
    eligibilityScore: Math.round(eligibilityScore),
    requirements: ["VideoObject schema", "Video embed (YouTube/hosted)", "Thumbnail image", "Video transcript (optional)"],
    currentStatus,
    missingElements,
    implementationSteps: [
      "Create or embed relevant video",
      "Implement VideoObject schema",
      "Add video thumbnail image",
      "Include video transcript for accessibility",
      "Optimize video duration (3-5 min ideal for trending)",
    ],
    estimatedTrafficBoost: "+15-25% additional SERP real estate",
    schemaRequired: "VideoObject",
    effort: "medium",
  };
}

/**
 * Knowledge Panel 자격 분석
 */
export function analyzeKnowledgePanelEligibility(title: string, country: string, traffic: string): SERPFeatureEligibility {
  const trafficNum = parseInt(traffic.replace(/[^0-9]/g, "")) || 0;
  const isHighVolume = trafficNum >= 50000;

  const eligible = isHighVolume;
  const eligibilityScore = isHighVolume ? 100 : Math.min(80, (trafficNum / 50000) * 100);

  const currentStatus: string[] = [];
  if (isHighVolume) currentStatus.push(`High search volume (${traffic})`);

  const missingElements: string[] = [];
  if (!isHighVolume) missingElements.push(`Lower traffic (${traffic} < 50K+)`);
  missingElements.push("Organization/Event schema needed");
  missingElements.push("Wikipedia presence preferred");
  missingElements.push("NAP consistency (if local)");

  return {
    feature: "knowledge_panel",
    eligible,
    eligibilityScore: Math.round(eligibilityScore),
    requirements: ["High search volume (50K+)", "Entity schema markup", "Wikipedia reference (if applicable)", "Consistent NAP"],
    currentStatus,
    missingElements,
    implementationSteps: [
      "Implement Organization/Event schema",
      "Ensure consistent brand identity",
      "Add description (2-3 sentences)",
      "Link to official pages",
      "Request Knowledge Panel in GSC (if applicable)",
    ],
    estimatedTrafficBoost: "+30-50% brand authority and impressions",
    schemaRequired: "Organization",
    effort: "high",
  };
}

/**
 * SERP 기능 종합 분석
 */
export function analyzeSERPFeatures(item: {
  keyword: string;
  summary: string;
  detail: string;
  relatedQueries: string[];
  pubTime: string;
  imageUrl: string;
  source: string;
  country: string;
  traffic: string;
}): SERPTargetingPlan {
  const features: SERPFeatureEligibility[] = [
    analyzeFeaturedSnippetEligibility(item.keyword, item.summary, item.detail),
    analyzePAAEligibility(item.keyword, item.relatedQueries),
    analyzeNewsCarouselEligibility(item.pubTime, item.imageUrl, item.source),
    analyzeImagePackEligibility(item.imageUrl, item.keyword),
    analyzeVideoCarouselEligibility(item.keyword, item.relatedQueries),
    analyzeKnowledgePanelEligibility(item.keyword, item.country, item.traffic),
  ];

  const eligibleFeatures = features.filter((f) => f.eligible);
  const topPriority = eligibleFeatures.reduce((prev, curr) =>
    curr.eligibilityScore > prev.eligibilityScore ? curr : prev
  );
  const quickWins = features.filter((f) => f.eligible && f.effort === "low");

  // CTR 개선 예상
  const ctrBoostParts: string[] = [];
  if (eligibleFeatures.some((f) => f.feature === "featured_snippet"))
    ctrBoostParts.push("+20-35% (Featured Snippet)");
  if (eligibleFeatures.some((f) => f.feature === "news_carousel"))
    ctrBoostParts.push("+50-100% (News Carousel)");
  if (eligibleFeatures.some((f) => f.feature === "people_also_ask"))
    ctrBoostParts.push("+10-20% (PAA)");
  const expectedTotalCTRBoost = ctrBoostParts.length > 0 ? ctrBoostParts.join(" + ") : "+0% (no eligible features)";

  // 구현 로드맵
  const implementationRoadmap = [
    {
      week: "Week 1",
      feature: "featured_snippet" as SERPFeature,
      action: "Optimize answer format, place at top",
      expectedGain: "+20-35% CTR",
    },
    {
      week: "Week 2",
      feature: "news_carousel" as SERPFeature,
      action: "Implement NewsArticle schema, recent pubTime",
      expectedGain: "+50-100% impressions",
    },
    {
      week: "Week 3",
      feature: "image_pack" as SERPFeature,
      action: "Add ImageObject schema, optimize alt text",
      expectedGain: "+5-15% CTR",
    },
    {
      week: "Week 4",
      feature: "people_also_ask" as SERPFeature,
      action: "Implement FAQPage schema with related queries",
      expectedGain: "+10-20% impressions",
    },
  ];

  return {
    keyword: item.keyword,
    country: item.country,
    totalEligibleFeatures: eligibleFeatures.length,
    features,
    topPriority,
    quickWins,
    expectedTotalCTRBoost,
    implementationRoadmap,
  };
}

/**
 * 배치 SERP 기능 분석
 */
export function batchAnalyzeSERPFeatures(
  items: Array<{
    keyword: string;
    summary: string;
    detail: string;
    relatedQueries: string[];
    pubTime: string;
    imageUrl: string;
    source: string;
    country: string;
    traffic: string;
  }>
): BatchSERPReport {
  const plans = items.map((item) => analyzeSERPFeatures(item));

  const totalEligibleOpportunities = plans.reduce((sum, p) => sum + p.totalEligibleFeatures, 0);
  const featuredSnippetTargets = plans.filter((p) =>
    p.features.some((f) => f.feature === "featured_snippet" && f.eligible)
  ).length;
  const newsCarouselTargets = plans.filter((p) =>
    p.features.some((f) => f.feature === "news_carousel" && f.eligible)
  ).length;
  const paaTargets = plans.filter((p) => p.features.some((f) => f.feature === "people_also_ask" && f.eligible)).length;

  // 상위 기회 Top 5 (totalEligibleFeatures 기준)
  const topOpportunities = plans
    .sort((a, b) => b.totalEligibleFeatures - a.totalEligibleFeatures)
    .slice(0, 5);

  const aggregateExpectedCTRBoost =
    `+${Math.round(totalEligibleOpportunities * 10)}-${Math.round(totalEligibleOpportunities * 25)}% aggregate CTR boost potential`;

  return {
    totalKeywords: items.length,
    totalEligibleOpportunities,
    featuredSnippetTargets,
    newsCarouselTargets,
    paaTargets,
    topOpportunities,
    aggregateExpectedCTRBoost,
  };
}

/**
 * SERP Feature Targeting 체크리스트
 */
export function generateSERPTargetingChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## Phase 74: SERP Feature Targeting 체크리스트\n");

  checklist.push("### 1. SERP Feature Analysis");
  checklist.push("- [ ] Run batchAnalyzeSERPFeatures() on all trending keywords");
  checklist.push("- [ ] Identify eligible SERP features (featured snippet, news, PAA, image, video)");
  checklist.push("- [ ] Prioritize by eligibilityScore and effort");

  checklist.push("\n### 2. Featured Snippet Targeting (Quick Win)");
  checklist.push("- [ ] Place answer in opening paragraph (40-60 words)");
  checklist.push("- [ ] Use clear answer format: Definition → Key points → Example");
  checklist.push("- [ ] Consider adding <table> or <ul> for list snippets");
  checklist.push("- [ ] Expect: +20-35% CTR from position 0");

  checklist.push("\n### 3. News Carousel (High Impact)");
  checklist.push("- [ ] Implement NewsArticle schema");
  checklist.push("- [ ] Ensure pubTime < 24h for trending content");
  checklist.push("- [ ] Add featured image (1200x630px+)");
  checklist.push("- [ ] Include publisher attribution");
  checklist.push("- [ ] Expect: +50-100% impressions during trending window");

  checklist.push("\n### 4. FAQ/PAA (Medium Effort)");
  checklist.push("- [ ] Implement FAQPage schema");
  checklist.push("- [ ] Create FAQ section with 3-5 questions");
  checklist.push("- [ ] Use relatedQueries as FAQ question variations");
  checklist.push("- [ ] Answer format: 50-100 words, direct answer");

  checklist.push("\n### 5. Image & Video (Ongoing)");
  checklist.push("- [ ] Add ImageObject schema for featured image");
  checklist.push("- [ ] Embed relevant video (YouTube/hosted)");
  checklist.push("- [ ] Implement VideoObject schema");
  checklist.push("- [ ] Add video transcript for accessibility");

  return checklist;
}
