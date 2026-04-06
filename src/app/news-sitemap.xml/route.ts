/**
 * Phase 75: Google News Sitemap
 * Google News 봇이 실시간 트렌드 아티클을 즉시 인덱싱하도록 표준 Google News Sitemap XML 제공
 * 트렌딩 사이트에서 구글 뉴스/Discover 노출 = 트래픽 3-10x 스파이크
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchTrendsForCountry, TrendItem } from "@/lib/google-trends";

// Google News Sitemap 갱신: 5분마다
export const revalidate = 300;

// 상위 10개 국가 + 해당 언어 코드
const NEWS_COUNTRIES = [
  { code: "US", lang: "en" },
  { code: "GB", lang: "en" },
  { code: "JP", lang: "ja" },
  { code: "KR", lang: "ko" },
  { code: "IN", lang: "hi" },
  { code: "AU", lang: "en" },
  { code: "CA", lang: "en" },
  { code: "DE", lang: "de" },
  { code: "FR", lang: "fr" },
  { code: "BR", lang: "pt" },
];

/**
 * pubTime 문자열을 ISO 8601 형식으로 파싱
 * "2h ago", "30m ago", "14:30" 형식 지원
 */
function parsePubTime(pubTime: string): string {
  try {
    const now = new Date();

    // "Xh ago" 형식 (시간)
    const hourMatch = pubTime.match(/(\d+)\s*h/i);
    if (hourMatch) {
      const hours = parseInt(hourMatch[1]);
      return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
    }

    // "Xm ago" 형식 (분)
    const minMatch = pubTime.match(/(\d+)\s*m/i);
    if (minMatch) {
      const mins = parseInt(minMatch[1]);
      return new Date(now.getTime() - mins * 60 * 1000).toISOString();
    }

    // ISO 형식 그대로 (Date 개체)
    if (pubTime.includes("T")) {
      return new Date(pubTime).toISOString();
    }

    // Fallback: 현재 시간
    return now.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * 트렌드가 24시간 이내인지 확인 (Google News 요구사항)
 */
function isRecentTrend(trend: TrendItem): boolean {
  try {
    const pubDate = new Date(parsePubTime(trend.pubTime));
    const now = new Date();
    const diffHours = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);
    return diffHours < 24;
  } catch {
    return false;
  }
}

/**
 * Google News Sitemap XML 생성
 */
function generateNewsXml(trends: Array<TrendItem & { countryLang: string }>): string {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  const urlEntries = trends
    .map((trend) => {
      const pubDate = parsePubTime(trend.pubTime);
      const keywords = (trend.relatedQueries || []).slice(0, 3).join(", ");

      return `  <url>
    <loc>https://issueglobe.com/trend/${encodeURIComponent(trend.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>IssueGlobe</news:name>
        <news:language>${trend.countryLang}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(trend.title)}</news:title>
      ${keywords ? `<news:keywords>${escapeXml(keywords)}</news:keywords>` : ""}
    </news:news>
  </url>`;
    })
    .join("\n");

  const xmlFooter = "</urlset>";

  return `${xmlHeader}\n${urlEntries}\n${xmlFooter}`;
}

/**
 * XML 특수 문자 이스케이프
 */
function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: NextRequest) {
  try {
    // 병렬 처리: 상위 10개 국가에서 트렌드 수집
    const fetchPromises = NEWS_COUNTRIES.map(async ({ code, lang }) => {
      try {
        const trends = await fetchTrendsForCountry(code);
        return trends
          .filter(isRecentTrend) // 24시간 이내만 포함
          .slice(0, 5) // 국가별 상위 5개
          .map((t) => ({ ...t, countryLang: lang }));
      } catch (error) {
        console.error(`News sitemap fetch failed for ${code}:`, error);
        return [];
      }
    });

    // 모든 국가에서 트렌드 수집
    const results = await Promise.allSettled(fetchPromises);
    const allTrends: Array<TrendItem & { countryLang: string }> = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        allTrends.push(...result.value);
      }
    }

    // 트래픽 기반으로 정렬 (높은 트래픽이 상위)
    allTrends.sort((a, b) => {
      const aTraffic = parseInt(a.traffic.replace(/[^0-9]/g, "")) || 0;
      const bTraffic = parseInt(b.traffic.replace(/[^0-9]/g, "")) || 0;
      return bTraffic - aTraffic;
    });

    // XML 생성
    const xml = generateNewsXml(allTrends);

    // XML 응답 반환
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("News sitemap generation error:", error);

    // 에러 발생 시 빈 sitemap 반환 (형식 유지)
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;

    return new NextResponse(emptyXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}
