import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EngagementTracker from "@/components/EngagementTracker";
import IPLogger from "@/components/IPLogger";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ffffff",
  colorScheme: "light",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "IssueGlobe - Real-Time Global Trending Topics from 30 Countries",
    template: "%s | IssueGlobe",
  },
  description:
    "Discover what the world is searching for right now. IssueGlobe brings you real-time trending topics from 30 countries including US, UK, Korea, Japan, Germany, France and more. Updated hourly with live Google Trends data.",
  icons: {
    icon: "/icon.svg",
    apple: "/logo.svg",
  },
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  verification: {
    google: "_jeSSgpDfW_eoTUoFRQlc4te2xIFPM-0Iev7fLEVuOw",
    other: {
      "naver-site-verification": "21b65dc9e18a913d4ad55f5ddb8e5776d0fc7bfa",
    },
  },
  keywords: [
    // 영어 - 기본 키워드
    "trending topics",
    "google trends",
    "trending now",
    "world trends",
    "global trends",
    "real-time trends",
    "trending searches",
    "viral topics",
    "what is trending",
    "trending today",

    // 영어 - 검색 의도별
    "how to find trending topics",
    "best trending topics today",
    "why is this trending",
    "see what is trending",
    "trending worldwide",
    "trending by country",
    "search trends analysis",
    "popular searches",

    // 영어 - 국가별
    "trending in US",
    "trending in Korea",
    "trending in Japan",
    "trending in Europe",
    "trending in UK",
    "trending in Germany",
    "trending in France",

    // 한국어
    "실시간 검색어",
    "트렌드",
    "트렌드 보기",
    "실시간 트렌드",
    "인기 검색어",
    "검색어 순위",

    // 일본어
    "検索トレンド",
    "トレンド",
    "話題のトピック",
    "リアルタイムトレンド",

    // 다국어
    "tendances",
    "tendencias",
    "Suchtrends",
    "trending oggi",
    "assuntos do momento",
    "熱門搜尋",
  ],
  openGraph: {
    type: "website",
    title: "IssueGlobe - Real-Time Global Trending Topics",
    description:
      "Discover what the world is searching for right now. Real-time trending topics from 30 countries.",
    siteName: "IssueGlobe",
    locale: "en_US",
    images: [
      {
        url: `https://issueglobe.com/api/og-image?title=${encodeURIComponent("Trending Topics from 30 Countries")}&description=${encodeURIComponent("Real-time insights into global search trends")}&country=${encodeURIComponent("Global")}`,
        width: 1200,
        height: 630,
        alt: "IssueGlobe - Real-Time Global Trending Topics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IssueGlobe - Real-Time Global Trending Topics",
    description:
      "Discover what the world is searching for right now. Real-time trending topics from 30 countries.",
    images: [
      `https://issueglobe.com/api/og-image?title=${encodeURIComponent("Trending Topics from 30 Countries")}&description=${encodeURIComponent("Real-time insights into global search trends")}&country=${encodeURIComponent("Global")}`,
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://issueglobe.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="prefetch" href="/icon.svg" />
        <link rel="preload" href="/_next/static/css/globals.css" as="style" />
        <link rel="dns-prefetch" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="alternate" hrefLang="x-default" href="https://issueglobe.com" />
        <link rel="alternate" hrefLang="en" href="https://issueglobe.com/country/us" />
        <link rel="alternate" hrefLang="ja" href="https://issueglobe.com/country/jp" />
        <link rel="alternate" hrefLang="de" href="https://issueglobe.com/country/de" />
        <link rel="alternate" hrefLang="en-GB" href="https://issueglobe.com/country/gb" />
        <link rel="alternate" hrefLang="fr" href="https://issueglobe.com/country/fr" />
        <link rel="alternate" hrefLang="hi" href="https://issueglobe.com/country/in" />
        <link rel="alternate" hrefLang="pt-BR" href="https://issueglobe.com/country/br" />
        <link rel="alternate" hrefLang="ko" href="https://issueglobe.com/country/kr" />
        <link rel="alternate" hrefLang="it" href="https://issueglobe.com/country/it" />
        <link rel="alternate" hrefLang="es" href="https://issueglobe.com/country/es" />
        <link rel="alternate" hrefLang="es-MX" href="https://issueglobe.com/country/mx" />
        <link rel="alternate" hrefLang="en-AU" href="https://issueglobe.com/country/au" />
        <link rel="alternate" hrefLang="nl" href="https://issueglobe.com/country/nl" />
        <link rel="alternate" hrefLang="de-CH" href="https://issueglobe.com/country/ch" />
        <link rel="alternate" hrefLang="sv" href="https://issueglobe.com/country/se" />
        <link rel="alternate" hrefLang="nl-BE" href="https://issueglobe.com/country/be" />
        <link rel="alternate" hrefLang="de-AT" href="https://issueglobe.com/country/at" />
        <link rel="alternate" hrefLang="nb" href="https://issueglobe.com/country/no" />
        <link rel="alternate" hrefLang="da" href="https://issueglobe.com/country/dk" />
        <link rel="alternate" hrefLang="pl" href="https://issueglobe.com/country/pl" />
        <link rel="alternate" hrefLang="en-IE" href="https://issueglobe.com/country/ie" />
        <link rel="alternate" hrefLang="en-NZ" href="https://issueglobe.com/country/nz" />
        <link rel="alternate" hrefLang="fi" href="https://issueglobe.com/country/fi" />
        <link rel="alternate" hrefLang="en-SG" href="https://issueglobe.com/country/sg" />
        <link rel="alternate" hrefLang="ar" href="https://issueglobe.com/country/sa" />
        <link rel="alternate" hrefLang="ar-AE" href="https://issueglobe.com/country/ae" />
        <link rel="alternate" hrefLang="en-CA" href="https://issueglobe.com/country/ca" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6D6ME59JT" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-C6D6ME59JT');
            `,
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "IssueGlobe",
              url: "https://issueglobe.com",
              logo: "https://issueglobe.com/logo.png",
              description: "Real-time trending topics from 30 countries. Discover what the world is searching for right now.",
              sameAs: [
                "https://twitter.com/issueglobe",
                "https://www.linkedin.com/company/issueglobe"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                url: "https://issueglobe.com"
              }
            }),
          }}
        />

        {/* WebSite Schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "IssueGlobe",
              url: "https://issueglobe.com",
              description: "Discover what the world is searching for right now",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://issueglobe.com/country/{country_code}"
                }
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <EngagementTracker />
        <IPLogger />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
