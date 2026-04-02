import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ videos: [] });
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ videos: [], error: "NO_API_KEY" });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=5&order=relevance&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ videos: [], error: `YOUTUBE_API_${res.status}`, detail: errorText.slice(0, 200) });
    }

    const data = await res.json();

    const videos = (data.items || []).map((item: { id: { videoId: string }; snippet: { title: string; thumbnails: { medium: { url: string } }; channelTitle: string } }) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
    }));

    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json({ videos: [] });
  }
}
