import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getGeminiSearchUrl, getTrendTitleFromSlug } from "@/lib/gemini";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = getTrendTitleFromSlug(slug);

  return {
    title: `${title} | Open in Gemini`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function TrendPage({ params }: PageProps) {
  const { slug } = await params;

  redirect(getGeminiSearchUrl(getTrendTitleFromSlug(slug)));
}
