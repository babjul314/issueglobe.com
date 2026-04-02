#!/usr/bin/env node

/**
 * 30개국 Google Trends RSS를 가져와서 Claude API로 요약/상세/반응을 생성하고
 * trending-content.ts 파일을 업데이트하는 자동화 스크립트.
 * GitHub Actions에서 30분마다 실행됩니다.
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is not set");
  process.exit(1);
}

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const COUNTRIES = [
  { code: "US", name: "United States", lang: "en" },
  { code: "GB", name: "United Kingdom", lang: "en" },
  { code: "DE", name: "Germany", lang: "de" },
  { code: "JP", name: "Japan", lang: "ja" },
  { code: "CA", name: "Canada", lang: "en" },
  { code: "AU", name: "Australia", lang: "en" },
  { code: "FR", name: "France", lang: "fr" },
  { code: "KR", name: "South Korea", lang: "ko" },
  { code: "IT", name: "Italy", lang: "it" },
  { code: "BR", name: "Brazil", lang: "pt" },
  { code: "IN", name: "India", lang: "en" },
  { code: "ES", name: "Spain", lang: "es" },
  { code: "NL", name: "Netherlands", lang: "nl" },
  { code: "CH", name: "Switzerland", lang: "de" },
  { code: "SE", name: "Sweden", lang: "sv" },
  { code: "MX", name: "Mexico", lang: "es" },
  { code: "NO", name: "Norway", lang: "no" },
  { code: "DK", name: "Denmark", lang: "da" },
  { code: "BE", name: "Belgium", lang: "nl" },
  { code: "AT", name: "Austria", lang: "de" },
  { code: "IE", name: "Ireland", lang: "en" },
  { code: "SG", name: "Singapore", lang: "en" },
  { code: "IL", name: "Israel", lang: "he" },
  { code: "AE", name: "UAE", lang: "ar" },
  { code: "NZ", name: "New Zealand", lang: "en" },
  { code: "FI", name: "Finland", lang: "fi" },
  { code: "PL", name: "Poland", lang: "pl" },
  { code: "TW", name: "Taiwan", lang: "zh" },
  { code: "SA", name: "Saudi Arabia", lang: "ar" },
  { code: "HK", name: "Hong Kong", lang: "zh" },
];

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function extractTag(xml, tag) {
  const cdataRegex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`);
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return decodeHtmlEntities(cdataMatch[1].trim());

  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const m = regex.exec(xml);
  return m ? decodeHtmlEntities(m[1].trim()) : null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uac00-\ud7af\u0600-\u06ff\u0590-\u05ff\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

async function fetchRSS(countryCode) {
  const url = `https://trends.google.com/trending/rss?geo=${countryCode}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; IssueGlobe/1.0)" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = extractTag(itemXml, "title");
      const traffic = extractTag(itemXml, "ht:approx_traffic") || "N/A";
      const newsUrl = extractTag(itemXml, "ht:news_item_url") || "";
      const newsTitle = extractTag(itemXml, "ht:news_item_title") || "";
      const newsSource = extractTag(itemXml, "ht:news_item_source") || "";
      const pictureUrl = extractTag(itemXml, "ht:picture") || "";
      if (title) {
        items.push({ title, traffic, newsUrl, newsTitle, newsSource, pictureUrl });
      }
    }
    return items.slice(0, 5); // 상위 5개만
  } catch (e) {
    console.error(`RSS fetch failed for ${countryCode}:`, e.message);
    return [];
  }
}

// 기사 URL에서 텍스트 추출 (최대 500자)
async function fetchArticleText(url) {
  if (!url) return "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; IssueGlobe/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    // HTML 태그 제거하고 텍스트만 추출
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 1500); // 1500자까지만
  } catch {
    return "";
  }
}

async function generateContent(countryCode, countryName, lang, trends) {
  if (trends.length === 0) return [];

  // 각 트렌드의 기사 내용 가져오기
  console.log(`    Fetching ${trends.length} articles for ${countryCode}...`);
  const articlesText = await Promise.all(
    trends.map(async (t) => {
      const text = await fetchArticleText(t.newsUrl);
      return text ? `[Article for "${t.title}"]: ${text.slice(0, 800)}` : "";
    })
  );

  const trendList = trends
    .map((t, i) => {
      const article = articlesText[i] ? `\n   ${articlesText[i]}` : "";
      return `${i + 1}. "${t.title}" (${t.traffic} searches) - ${t.newsTitle || "no description"}${article}`;
    })
    .join("\n\n");

  const prompt = `You write for IssueGlobe.com. Explain these trending topics in ${countryName} like you're telling a friend about it - casual, natural, easy to understand.

TRENDS AND ARTICLES:
${trendList}

Write in ${lang === "en" ? "English" : `the native language of ${countryName} (${lang})`}:

For EACH trend:
1. summary: 1 friendly sentence explaining what's going on (polite/formal tone but easy to read)
2. detail: 5 natural sentences explaining the story (based on the article). Use polite but conversational language - like a friendly news host, not a textbook. Cover: what happened, who's involved, why people care, what's going on now, and what might happen next.
3. reactions: 1-2 sentences about how people are reacting online
4. relatedQueries: 3 related search terms

IMPORTANT: Do NOT use curly/smart quotes. Use only straight quotes (' and "). Be friendly and natural but use polite/formal speech (e.g. Korean: 존댓말, Japanese: です/ます).

Return ONLY valid JSON array, no markdown:
[{"title":"...","summary":"...","detail":"...","reactions":"...","relatedQueries":["...","...","..."]}]`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text.trim();
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error(`AI generation failed for ${countryCode}:`, e.message);
    return [];
  }
}

async function main() {
  const today = new Date().toISOString().split("T")[0];
  console.log(`[${new Date().toISOString()}] Starting trend update for ${today}`);

  const allTrends = {};

  // 5개국씩 배치로 처리 (rate limiting)
  for (let i = 0; i < COUNTRIES.length; i += 5) {
    const batch = COUNTRIES.slice(i, i + 5);
    const results = await Promise.all(
      batch.map(async (c) => {
        console.log(`  Fetching RSS for ${c.code}...`);
        const rssItems = await fetchRSS(c.code);
        if (rssItems.length === 0) {
          console.log(`  No RSS data for ${c.code}, skipping AI`);
          return { code: c.code, trends: [] };
        }

        console.log(`  Generating content for ${c.code} (${rssItems.length} trends)...`);
        const enriched = await generateContent(c.code, c.name, c.lang, rssItems);

        const trends = rssItems.map((rss) => {
          const ai = enriched.find(
            (e) => e.title && e.title.toLowerCase() === rss.title.toLowerCase()
          ) || enriched.find(
            (e) => e.title && rss.title.toLowerCase().includes(e.title.toLowerCase().slice(0, 10))
          ) || {};

          return {
            title: rss.title,
            slug: `${c.code.toLowerCase()}-${slugify(rss.title)}-${today}`,
            traffic: rss.traffic,
            description: rss.newsTitle,
            source: rss.newsSource,
            sourceUrl: rss.newsUrl,
            imageUrl: rss.pictureUrl,
            country: c.code,
            date: today,
            relatedQueries: ai.relatedQueries || [],
            summary: ai.summary || "",
            detail: ai.detail || "",
            reactions: ai.reactions || "",
          };
        });

        return { code: c.code, trends };
      })
    );

    for (const r of results) {
      if (r.trends.length > 0) {
        allTrends[r.code] = r.trends;
      }
    }

    // 배치 간 1초 대기
    if (i + 5 < COUNTRIES.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // TypeScript 파일 생성
  const tsContent = `// Auto-generated by update-trends.mjs
// Last updated: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - this file is overwritten every 30 minutes

import { TrendItem } from "@/lib/google-trends";

const today = new Date().toISOString().split("T")[0];

export const preloadedTrends: Record<string, TrendItem[]> = ${JSON.stringify(allTrends, null, 2)
    .replace(/"(\w+)":/g, '$1:')
    .replace(/: "([^"]*?)"/g, ': "$1"')};

export function getPreloadedTrends(countryCode: string): TrendItem[] {
  return preloadedTrends[countryCode] || [];
}
`;

  const outPath = path.join(process.cwd(), "src", "data", "trending-content.ts");
  fs.writeFileSync(outPath, tsContent, "utf-8");

  const countryCount = Object.keys(allTrends).length;
  const trendCount = Object.values(allTrends).reduce((sum, t) => sum + t.length, 0);
  console.log(`\nDone! Updated ${countryCount} countries, ${trendCount} trends.`);
  console.log(`Written to: ${outPath}`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
