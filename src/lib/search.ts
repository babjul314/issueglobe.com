import type { TrendItem } from "@/lib/google-trends";
import { decodeHtml } from "@/lib/utils";

const GOOGLE_SEARCH_URL = "https://www.google.com/search";

type SearchTrend = Pick<TrendItem, "title">;

export function getGoogleSearchUrl(input: SearchTrend | string): string {
  const title = typeof input === "string" ? input : input.title;
  const query = decodeHtml(title).trim() || "trending issue";
  const params = new URLSearchParams({ q: query });

  return `${GOOGLE_SEARCH_URL}?${params.toString()}`;
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

  return title || decodedSlug || "trending issue";
}
