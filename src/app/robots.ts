import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/country/", "/trend/", "/_next/image", "/_next/static"],
        disallow: ["/api/", "/private/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/image", "/_next/static"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/_next/image"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/_next/image", "/_next/static"],
      },
      // 네이버 크롤러 (실제 봇 이름: Yeti)
      {
        userAgent: "Yeti",
        allow: ["/", "/_next/image", "/_next/static"],
        crawlDelay: 1,
      },
      // 다음/카카오 크롤러
      {
        userAgent: "Daum",
        allow: ["/", "/_next/image", "/_next/static"],
      },
      {
        userAgent: "Yandex",
        allow: ["/", "/_next/image", "/_next/static"],
      },
      // AI 크롤러 차단
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        disallow: ["/"],
      },
    ],
    sitemap: [
      "https://issueglobe.com/sitemap.xml",
      "https://issueglobe.com/sitemap-news.xml",
    ],
    host: "https://issueglobe.com",
  };
}
