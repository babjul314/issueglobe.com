import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/country/", "/trend/"],
        disallow: ["/api/", "/_next/"],
        crawlDelay: 0.5,
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: [
      "https://issueglobe.com/sitemap.xml",
    ],
    host: "https://issueglobe.com",
  };
}
