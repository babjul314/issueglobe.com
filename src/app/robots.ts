import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/country/", "/_next/image", "/_next/static"],
        disallow: ["/api/", "/private/", "/trend/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/_next/image", "/_next/static"],
        disallow: ["/api/", "/private/", "/trend/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/_next/image"],
        disallow: ["/api/", "/private/", "/trend/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/_next/image", "/_next/static"],
        disallow: ["/api/", "/private/", "/trend/"],
      },
      // 네이버 크롤러 (실제 봇 이름: Yeti)
      {
        userAgent: "Yeti",
        allow: ["/", "/_next/image", "/_next/static"],
        disallow: ["/api/", "/private/", "/trend/"],
        crawlDelay: 1,
      },
      // 다음/카카오 크롤러
      {
        userAgent: "Daum",
        allow: ["/", "/_next/image", "/_next/static"],
        disallow: ["/api/", "/private/", "/trend/"],
      },
      {
        userAgent: "Yandex",
        allow: ["/", "/_next/image", "/_next/static"],
        disallow: ["/api/", "/private/", "/trend/"],
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
    sitemap: ["https://issueglobe.com/sitemap.xml"],
    host: "https://issueglobe.com",
  };
}
