import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q) {
    console.warn("YouTube API: Missing query parameter");
    return NextResponse.json({ videos: [] });
  }

  if (!YOUTUBE_API_KEY) {
    console.error("YouTube API: API key not configured");
    return NextResponse.json({ videos: [], error: "NO_API_KEY" });
  }

  try {
    const startTime = Date.now();
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=5&order=relevance&key=${YOUTUBE_API_KEY}`,
      {
        next: { revalidate: 7200 }, // 2시간 캐시
        headers: {
          'Accept-Encoding': 'gzip'
        }
      }
    );

    const duration = Date.now() - startTime;
    console.log(`YouTube API: Query "${q}" completed in ${duration}ms with status ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`YouTube API error: ${res.status} - ${errorText.slice(0, 100)}`);
      return NextResponse.json(
        { videos: [], error: `YOUTUBE_API_${res.status}`, detail: errorText.slice(0, 200) },
        { status: 200 }
      );
    }

    const data = await res.json();

    const videos = (data.items || []).map((item: { id: { videoId: string }; snippet: { title: string; thumbnails: { medium: { url: string } }; channelTitle: string } }) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    }));

    return NextResponse.json(
      { videos },
      {
        headers: {
          'Cache-Control': 'public, max-age=7200, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'max-age=7200'
        }
      }
    );
  } catch (error) {
    console.error("YouTube API error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ videos: [] });
  }
}
