import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IssueGlobe - Real-Time Global Trending Topics from 30 Countries",
    template: "%s | IssueGlobe",
  },
  description:
    "Discover what the world is searching for right now. IssueGlobe brings you real-time trending topics from 30 countries including US, UK, Korea, Japan, Germany, France and more. Updated hourly with live Google Trends data.",
  keywords: [
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
    "search trends",
    "trending in US",
    "trending in Korea",
    "trending in Japan",
    "trending in Europe",
    "live trends",
    "실시간 검색어",
    "트렌드",
    "検索トレンド",
    "トレンド",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "IssueGlobe - Real-Time Global Trending Topics",
    description:
      "Discover what the world is searching for right now. Real-time trending topics from 30 countries.",
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
    <html lang="en">
      <head>
        <link rel="canonical" href="https://issueglobe.com" />
        <link rel="alternate" hrefLang="x-default" href="https://issueglobe.com" />
        <link rel="alternate" hrefLang="ko" href="https://issueglobe.com/country/kr" />
        <link rel="alternate" hrefLang="ja" href="https://issueglobe.com/country/jp" />
        <link rel="alternate" hrefLang="en" href="https://issueglobe.com/country/us" />
        <link rel="alternate" hrefLang="de" href="https://issueglobe.com/country/de" />
        <link rel="alternate" hrefLang="fr" href="https://issueglobe.com/country/fr" />
        <link rel="alternate" hrefLang="es" href="https://issueglobe.com/country/es" />
        <link rel="alternate" hrefLang="pt" href="https://issueglobe.com/country/br" />
        <link rel="alternate" hrefLang="it" href="https://issueglobe.com/country/it" />
        <link rel="alternate" hrefLang="nl" href="https://issueglobe.com/country/nl" />
        <link rel="alternate" hrefLang="sv" href="https://issueglobe.com/country/se" />
        <link rel="alternate" hrefLang="pl" href="https://issueglobe.com/country/pl" />
        <link rel="alternate" hrefLang="zh-TW" href="https://issueglobe.com/country/tw" />
        <link rel="alternate" hrefLang="zh-HK" href="https://issueglobe.com/country/hk" />
        <link rel="alternate" hrefLang="ar" href="https://issueglobe.com/country/ae" />
        <link rel="alternate" hrefLang="he" href="https://issueglobe.com/country/il" />
        <link rel="alternate" hrefLang="fi" href="https://issueglobe.com/country/fi" />
        <link rel="alternate" hrefLang="da" href="https://issueglobe.com/country/dk" />
        <link rel="alternate" hrefLang="nb" href="https://issueglobe.com/country/no" />
        <link rel="alternate" hrefLang="hi" href="https://issueglobe.com/country/in" />
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
