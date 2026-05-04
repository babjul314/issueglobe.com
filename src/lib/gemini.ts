import type { TrendItem } from "@/lib/google-trends";
import { decodeHtml } from "@/lib/utils";

const GEMINI_APP_URL = "https://gemini.google.com/app";

type GeminiTrend = Pick<TrendItem, "title" | "country" | "traffic" | "date">;

export function buildGeminiPrompt(input: GeminiTrend | string): string {
  const title = typeof input === "string" ? input : input.title;
  const cleanTitle = decodeHtml(title).trim();

  if (typeof input === "string") {
    return [
      `Search the web for the latest reliable information about this trending issue: ${cleanTitle}`,
      "Summarize why it is trending and cite the sources you used.",
    ].join("\n");
  }

  const context = [
    input.country ? `Country: ${input.country}` : "",
    input.traffic ? `Search volume: ${input.traffic}` : "",
    input.date ? `Trend date: ${input.date}` : "",
  ].filter(Boolean);

  return [
    `Search the web for the latest reliable information about this trending issue: ${cleanTitle}`,
    ...context,
    "Summarize why it is trending and cite the sources you used.",
  ].join("\n");
}

export function getGeminiSearchUrl(input: GeminiTrend | string): string {
  const params = new URLSearchParams({
    prompt: buildGeminiPrompt(input),
  });

  return `${GEMINI_APP_URL}?${params.toString()}`;
}

export function getTrendTitleFromSlug(slug: string): string {
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }

  decodedSlug = decodeHtml(decodedSlug);
  const withoutDate = decodedSlug.replace(/-\d{4}-\d{2}-\d{2}$/, "");
  const withoutCountry = withoutDate.replace(/^[a-z]{2}-/i, "");
  const title = withoutCountry.replace(/-/g, " ").trim();

  return title || decodedSlug || "this trending issue";
}
