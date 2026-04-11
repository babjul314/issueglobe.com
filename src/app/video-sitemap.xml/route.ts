import { MetadataRoute } from "next";

export async function GET() {
  try {
    const baseUrl = "https://issueglobe.com";

    // 인기 트렌드별 비디오 사이트맵 생성
    const trendTopics = [
      "AI", "Technology", "Breaking News", "Entertainment",
      "Sports", "Business", "Health", "Science",
      "Politics", "World News", "Cryptocurrency", "Gaming"
    ];

    const videos: any[] = [];

    // 각 트렌드 주제별 비디오 항목 생성
    for (const topic of trendTopics) {
      videos.push({
        url: `${baseUrl}/trend/${encodeURIComponent(topic.toLowerCase())}`,
        title: `Videos about ${topic}`,
        description: `Related videos and trending content about ${topic}`,
        thumbnail_loc: `${baseUrl}/og-image.png`,
        publication_date: new Date().toISOString(),
        family_friendly: "yes",
        restriction: "allow",
        price_currency: "USD",
        price: "0",
        requires_subscription: "no"
      });
    }

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${videos.map(video => `
  <url>
    <loc>${video.url}</loc>
    <video:video>
      <video:title>${video.title}</video:title>
      <video:description>${video.description}</video:description>
      <video:thumbnail_loc>${video.thumbnail_loc}</video:thumbnail_loc>
      <video:publication_date>${video.publication_date}</video:publication_date>
      <video:family_friendly>${video.family_friendly}</video:family_friendly>
      <video:restriction relationship="allow">*</video:restriction>
    </video:video>
  </url>`).join('')}
</urlset>`;

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error("Video Sitemap generation error:", error instanceof Error ? error.message : String(error));

    // 에러 발생 시 최소 사이트맵 반환
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
}
