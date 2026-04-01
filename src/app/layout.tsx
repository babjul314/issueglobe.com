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
    "Discover what the world is searching for right now. IssueGlobe brings you real-time trending topics from 30 countries, powered by Google Trends data updated daily.",
  keywords: [
    "trending topics",
    "google trends",
    "world news",
    "global trends",
    "real-time trends",
    "trending searches",
    "viral topics",
    "what is trending",
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
