import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // 헤더 설정 (캐싱, 보안, SEO)
  headers: async () => [
    {
      source: "/",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=60, stale-while-revalidate=300",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
      ],
    },
    {
      source: "/country/:code",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=300, stale-while-revalidate=600",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
      ],
    },
    {
      source: "/trend/:slug",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=600, stale-while-revalidate=1800",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600, stale-while-revalidate=86400",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
      ],
    },
    {
      source: "/api/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=300",
        },
      ],
    },
    {
      source: "/sitemap.xml",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600",
        },
      ],
    },
    {
      source: "/robots.txt",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400",
        },
      ],
    },
  ],

  // 리다이렉트 설정
  redirects: async () => [
    // 오래된 URL 구조 호환성
    {
      source: "/trends",
      destination: "/",
      permanent: true,
    },
  ],
};

export default nextConfig;
