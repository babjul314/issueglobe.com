import { NextResponse } from "next/server";
import { getGeminiSearchUrl, getTrendTitleFromSlug } from "@/lib/gemini";

type TrendRouteContext = {
  params: Promise<{ slug: string }>;
};

async function redirectToGemini({ params }: TrendRouteContext) {
  const { slug } = await params;
  const title = getTrendTitleFromSlug(slug);

  return NextResponse.redirect(getGeminiSearchUrl(title), 307);
}

export async function GET(_request: Request, context: TrendRouteContext) {
  return redirectToGemini(context);
}

export async function HEAD(_request: Request, context: TrendRouteContext) {
  return redirectToGemini(context);
}
