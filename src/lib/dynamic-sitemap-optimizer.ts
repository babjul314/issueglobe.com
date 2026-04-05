/**
 * 동적 사이트맵 생성 & 업데이트 최적화
 * XML 사이트맵, 이미지 사이트맵, 비디오 사이트맵 자동 생성 및 업데이트 전략
 */

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number; // 0.0 ~ 1.0
  images?: Array<{
    url: string;
    title?: string;
    caption?: string;
  }>;
  videos?: Array<{
    thumbnailUrl: string;
    title: string;
    description: string;
    contentUrl: string;
    duration: number; // seconds
  }>;
}

export interface SitemapIndexEntry {
  loc: string;
  lastmod: string;
}

export interface SitemapPerformance {
  totalUrls: number;
  imageCount: number;
  videoCount: number;
  sitemapSize: number; // bytes
  updateFrequency: string;
  crawlability: number; // %
  indexability: number; // %
  issues: string[];
}

/**
 * XML 사이트맵 자동 생성
 */
export function generateXMLSitemap(entries: SitemapEntry[]): string {
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetStart =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n' +
    '         xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

  const urlsXml = entries
    .map((entry) => {
      let xml = "  <url>\n";
      xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;

      // 이미지 추가
      if (entry.images && entry.images.length > 0) {
        entry.images.forEach((img) => {
          xml += '    <image:image>\n';
          xml += `      <image:loc>${escapeXml(img.url)}</image:loc>\n`;
          if (img.title)
            xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
          if (img.caption)
            xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
          xml += '    </image:image>\n';
        });
      }

      // 비디오 추가
      if (entry.videos && entry.videos.length > 0) {
        entry.videos.forEach((vid) => {
          xml += '    <video:video>\n';
          xml += `      <video:thumbnail_loc>${escapeXml(vid.thumbnailUrl)}</video:thumbnail_loc>\n`;
          xml += `      <video:title>${escapeXml(vid.title)}</video:title>\n`;
          xml += `      <video:description>${escapeXml(vid.description)}</video:description>\n`;
          xml += `      <video:content_loc>${escapeXml(vid.contentUrl)}</video:content_loc>\n`;
          xml += `      <video:duration>${vid.duration}</video:duration>\n`;
          xml += '    </video:video>\n';
        });
      }

      xml += "  </url>\n";
      return xml;
    })
    .join("");

  const urlsetEnd = "</urlset>";

  return header + urlsetStart + urlsXml + urlsetEnd;
}

/**
 * 사이트맵 인덱스 생성 (대규모 사이트용)
 */
export function generateSitemapIndex(sitemaps: SitemapIndexEntry[]): string {
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const sitemapindexStart =
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const sitempasXml = sitemaps
    .map((sitemap) => {
      return (
        "  <sitemap>\n" +
        `    <loc>${escapeXml(sitemap.loc)}</loc>\n` +
        `    <lastmod>${sitemap.lastmod}</lastmod>\n` +
        "  </sitemap>\n"
      );
    })
    .join("");

  const sitemapindexEnd = "</sitemapindex>";

  return header + sitemapindexStart + sitempasXml + sitemapindexEnd;
}

/**
 * XML 특수 문자 이스케이프
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * 동적 updatefreq 결정
 */
export function determineUpdateFrequency(
  contentAge: number, // days
  updateHistory: number[] // update frequencies in past 30 days
): "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" {
  const avgUpdatesPerDay = updateHistory.length / 30;

  if (contentAge === 0) {
    return "always"; // Brand new content
  } else if (avgUpdatesPerDay >= 1) {
    return "hourly";
  } else if (avgUpdatesPerDay >= 0.3) {
    return "daily"; // Updated 3+ times in 30 days
  } else if (avgUpdatesPerDay >= 0.1) {
    return "weekly"; // Updated 3+ times in 30 days
  } else if (avgUpdatesPerDay > 0) {
    return "monthly";
  } else {
    return "yearly"; // No recent updates
  }
}

/**
 * 우선순위 자동 계산
 */
export function calculatePriority(
  pageType: "homepage" | "category" | "trend" | "archive",
  traffic: number,
  backlinks: number,
  freshness: number // 0-100
): number {
  let basePriority = 0.5;

  // 페이지 타입별 기본값
  switch (pageType) {
    case "homepage":
      basePriority = 1.0;
      break;
    case "category":
      basePriority = 0.8;
      break;
    case "trend":
      basePriority = 0.7;
      break;
    case "archive":
      basePriority = 0.3;
      break;
  }

  // 트래픽 영향 (최대 0.2)
  const trafficBoost = Math.min(0.2, (traffic / 1000) * 0.02);

  // 백링크 영향 (최대 0.1)
  const backlinkBoost = Math.min(0.1, (backlinks / 100) * 0.01);

  // 신선도 영향 (최대 0.1)
  const freshnessBoost = (freshness / 100) * 0.1;

  const finalPriority = Math.min(
    1.0,
    basePriority + trafficBoost + backlinkBoost + freshnessBoost
  );

  return Math.round(finalPriority * 100) / 100;
}

/**
 * 사이트맵 성능 분석
 */
export function analyzeSitemapPerformance(
  sitemaps: {
    xml: SitemapEntry[];
    images: Array<{ url: string }>;
    videos: Array<{ url: string }>;
  }
): SitemapPerformance {
  const totalUrls = sitemaps.xml.length;
  const imageCount = sitemaps.images.length;
  const videoCount = sitemaps.videos.length;

  // 대략적인 크기 추정
  const sitemapSize = totalUrls * 300 + imageCount * 200 + videoCount * 400;

  // 갱신 빈도 분석
  const changefreqs = sitemaps.xml.map((e) => e.changefreq);
  const mostCommonFreq =
    changefreqs.reduce(
      (a, b) =>
        changefreqs.filter((v) => v === a).length >
        changefreqs.filter((v) => v === b).length
          ? a
          : b,
      "daily"
    );

  const issues: string[] = [];

  // 크롤 가능성 점수
  let crawlability = 95;
  if (totalUrls > 50000) {
    crawlability -= 10;
    issues.push("⚠️ URL 수 많음 (50,000+) - 사이트맵 분할 권장");
  }
  if (sitemapSize > 10 * 1024 * 1024) {
    crawlability -= 15;
    issues.push("⚠️ 사이트맵 크기 초과 (10MB+) - 사이트맵 분할 필요");
  }

  // 색인 가능성 점수
  let indexability = 90;
  if (sitemaps.xml.filter((e) => e.priority < 0.3).length / totalUrls > 0.5) {
    indexability -= 10;
    issues.push("⚠️ 낮은 우선순위 페이지 많음 - 우선순위 재조정");
  }
  if (
    sitemaps.xml.filter((e) => e.changefreq === "never").length / totalUrls >
    0.3
  ) {
    indexability -= 5;
    issues.push("🔴 업데이트 안 함 페이지 많음 (30%+) - 정책 재검토");
  }

  if (issues.length === 0) {
    issues.push("✅ 사이트맵 상태 양호");
  }

  return {
    totalUrls,
    imageCount,
    videoCount,
    sitemapSize,
    updateFrequency: mostCommonFreq,
    crawlability,
    indexability,
    issues,
  };
}

/**
 * 사이트맵 최적화 체크리스트
 */
export function generateSitemapOptimizationChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 사이트맵 최적화 체크리스트\n");

  checklist.push("### XML 사이트맵");
  checklist.push("- [ ] robots.txt에 사이트맵 URL 등록");
  checklist.push("- [ ] Google Search Console에 사이트맵 제출");
  checklist.push("- [ ] Bing 웹마스터 도구에 제출");
  checklist.push("- [ ] 올바른 XML 형식 검증");
  checklist.push("- [ ] 사이트맵 크기 10MB 이내");
  checklist.push("- [ ] 50,000 URL 이상 시 사이트맵 분할");

  checklist.push("\n### 이미지 사이트맵");
  checklist.push("- [ ] 주요 이미지 모두 포함");
  checklist.push("- [ ] 이미지 제목 및 캡션 추가");
  checklist.push("- [ ] 고해상도 이미지 URL 포함");
  checklist.push("- [ ] 라이선스 정보 추가");

  checklist.push("\n### 비디오 사이트맵");
  checklist.push("- [ ] 모든 YouTube/자체 비디오 포함");
  checklist.push("- [ ] 썸네일 이미지 URL 포함");
  checklist.push("- [ ] 비디오 제목 및 설명");
  checklist.push("- [ ] 비디오 길이(초) 포함");

  checklist.push("\n### 갱신 및 모니터링");
  checklist.push("- [ ] 매일 자동으로 사이트맵 갱신");
  checklist.push("- [ ] 사이트맵 가능성 모니터링");
  checklist.push("- [ ] Google Search Console 크롤 통계 확인");
  checklist.push("- [ ] 크롤 오류 주기적 확인");

  return checklist;
}
