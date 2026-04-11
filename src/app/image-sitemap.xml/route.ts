export async function GET() {
  try {
    const baseUrl = "https://issueglobe.com";

    // 주요 이미지 항목들
    const images = [
      {
        url: `${baseUrl}`,
        image: `${baseUrl}/og-image.png`,
        title: "IssueGlobe - Global Trending Topics"
      },
      {
        url: `${baseUrl}/country/us`,
        image: `${baseUrl}/og-image.png`,
        title: "Trending in United States"
      },
      {
        url: `${baseUrl}/country/kr`,
        image: `${baseUrl}/og-image.png`,
        title: "Trending in South Korea"
      },
      {
        url: `${baseUrl}/country/jp`,
        image: `${baseUrl}/og-image.png`,
        title: "Trending in Japan"
      },
      {
        url: `${baseUrl}/country/gb`,
        image: `${baseUrl}/og-image.png`,
        title: "Trending in United Kingdom"
      },
      {
        url: `${baseUrl}/country/de`,
        image: `${baseUrl}/og-image.png`,
        title: "Trending in Germany"
      },
      {
        url: `${baseUrl}/country/fr`,
        image: `${baseUrl}/og-image.png`,
        title: "Trending in France"
      },
      {
        url: `${baseUrl}/country/br`,
        image: `${baseUrl}/og-image.png`,
        title: "Trending in Brazil"
      }
    ];

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${images.map(item => `
  <url>
    <loc>${item.url}</loc>
    <image:image>
      <image:loc>${item.image}</image:loc>
      <image:title>${item.title}</image:title>
    </image:image>
  </url>`).join('')}
</urlset>`;

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error("Image Sitemap generation error:", error instanceof Error ? error.message : String(error));

    // 에러 발생 시 최소 사이트맵 반환
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
}
