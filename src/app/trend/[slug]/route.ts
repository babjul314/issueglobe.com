import { NextResponse } from "next/server";
import { getGoogleSearchUrl, getTrendTitleFromSlug } from "@/lib/search";

type TrendRouteContext = {
  params: Promise<{ slug: string }>;
};

async function redirectToGoogleSearch({ params }: TrendRouteContext) {
  const { slug } = await params;
  const title = getTrendTitleFromSlug(slug);

  return NextResponse.redirect(getGoogleSearchUrl(title), 307);
}

export async function GET(_request: Request, context: TrendRouteContext) {
  return redirectToGoogleSearch(context);
}

export async function HEAD(_request: Request, context: TrendRouteContext) {
  return redirectToGoogleSearch(context);
}
