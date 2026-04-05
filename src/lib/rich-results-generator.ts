/**
 * Rich Results & Advanced Schema Markup Generator
 * Google Rich Snippets을 위한 고급 구조화 데이터
 */

export interface EventSchema {
  "@context": string;
  "@type": "Event";
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  eventStatus: "EventScheduled" | "EventPostponed" | "EventCancelled";
  eventAttendanceMode: "OfflineEventAttendanceMode" | "OnlineEventAttendanceMode" | "MixedEventAttendanceMode";
  location?: {
    "@type": "Place";
    name: string;
  };
  image?: string;
  organizer: {
    "@type": "Organization";
    name: string;
    url: string;
  };
}

export interface ReviewSchema {
  "@context": string;
  "@type": "Review";
  reviewRating: {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  reviewBody: string;
  author: {
    "@type": "Person";
    name: string;
  };
  datePublished: string;
}

export interface ProductSchema {
  "@context": string;
  "@type": "Product";
  name: string;
  description: string;
  image?: string;
  offers?: {
    "@type": "Offer";
    availability: string;
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    ratingCount: number;
    bestRating: number;
    worstRating: number;
  };
}

export interface HowToSchema {
  "@context": string;
  "@type": "HowTo";
  name: string;
  description: string;
  image?: string;
  step: Array<{
    "@type": "HowToStep";
    name: string;
    text: string;
    image?: string;
    url: string;
  }>;
}

/**
 * 트렌드를 이벤트로 마크업
 * 시간-민감한 콘텐츠를 이벤트로 표현
 */
export function generateEventSchema(
  trendTitle: string,
  trendDate: string,
  countryName: string,
  trendUrl: string
): EventSchema {
  const startDate = new Date(trendDate);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // 24시간

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `"${trendTitle}" Trending Event in ${countryName}`,
    description: `Real-time trending event: "${trendTitle}" is trending in ${countryName}`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    eventStatus: "EventScheduled",
    eventAttendanceMode: "OnlineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: countryName,
    },
    organizer: {
      "@type": "Organization",
      name: "IssueGlobe",
      url: "https://issueglobe.com",
    },
  };
}

/**
 * 트렌드 인기도를 Review/Rating으로 마크업
 * 사용자 신호를 구조화된 평점으로 표현
 */
export function generateReviewSchema(
  trendTitle: string,
  searchVolume: string,
  countryName: string,
  trendDate: string
): ReviewSchema {
  // 검색량을 5단계 평점으로 변환
  const volumeNum = parseInt(searchVolume.replace(/[^\d]/g, "")) || 1000;
  const ratingValue = Math.min(5, Math.ceil(volumeNum / 10000));

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: `"${trendTitle}" is trending in ${countryName} with ${searchVolume} searches. Strong public interest and engagement.`,
    author: {
      "@type": "Person",
      name: "IssueGlobe Users",
    },
    datePublished: trendDate,
  };
}

/**
 * How-To Schema: 트렌드 이해하기
 * 사용자가 트렌드를 이해하는 방법을 단계별로 설명
 */
export function generateHowToSchema(
  trendTitle: string,
  trendSummary: string,
  trendUrl: string,
  relatedSearches: string[] = []
): HowToSchema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Understand "${trendTitle}" Trending Topic`,
    description: `Learn why "${trendTitle}" is trending and what it means.`,
    step: [
      {
        "@type": "HowToStep",
        name: "1. Understand the Topic",
        text: trendSummary || `Find out what "${trendTitle}" is and why people are searching for it.`,
        url: trendUrl,
      },
      {
        "@type": "HowToStep",
        name: "2. Check Related Searches",
        text: `See related searches: ${relatedSearches.slice(0, 3).join(", ") || "Explore related keywords"}`,
        url: trendUrl,
      },
      {
        "@type": "HowToStep",
        name: "3. Read News & Articles",
        text: "Check the curated articles section to learn more context and news about this trending topic.",
        url: trendUrl,
      },
      {
        "@type": "HowToStep",
        name: "4. Watch Videos",
        text: "View related YouTube videos to get visual explanations and different perspectives.",
        url: trendUrl,
      },
      {
        "@type": "HowToStep",
        name: "5. Join Discussions",
        text: "See what others are saying in the comments section and join the conversation.",
        url: trendUrl,
      },
    ],
  };
}

/**
 * Collection Page Schema
 * 여러 트렌드를 컬렉션으로 마크업
 */
export function generateCollectionPageSchema(
  collectionName: string,
  collectionDescription: string,
  items: Array<{ title: string; url: string }>,
  collectionUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collectionName,
    description: collectionDescription,
    url: collectionUrl,
    hasPart: items.map((item) => ({
      "@type": "WebPage",
      name: item.title,
      url: item.url,
    })),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: item.url,
      })),
    },
  };
}

/**
 * Carousel Schema
 * 결과를 회전식으로 표시
 */
export function generateCarouselSchema(
  items: Array<{ title: string; url: string; image?: string }>,
  carouselUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      item: {
        "@type": "Article",
        name: item.title,
        image: item.image,
        url: item.url,
      },
    })),
  };
}

/**
 * FAQ Schema 고급형
 * 더 많은 Q&A 포함
 */
export function generateComprehensiveFAQSchema(trendTitle: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What does "${trendTitle}" mean?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `"${trendTitle}" is a trending search term showing significant public interest and search volume.`,
        },
      },
      {
        "@type": "Question",
        name: `Why is "${trendTitle}" trending?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `"${trendTitle}" has become a trending topic due to recent events, news, or cultural moments capturing public attention.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I find more information about "${trendTitle}"?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check the related articles, YouTube videos, and related searches sections on this page for comprehensive information.",
        },
      },
      {
        "@type": "Question",
        name: `How are IssueGlobe trending topics updated?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "IssueGlobe updates trending topics hourly with real-time data from Google Trends, ensuring you always see what's hot right now.",
        },
      },
      {
        "@type": "Question",
        name: `Can I see trends from different countries?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! IssueGlobe covers trending topics from 30 countries. Visit any country's page to see region-specific trends.",
        },
      },
    ],
  };
}

/**
 * Breadcrumb Schema 고급형
 * 구조화된 네비게이션
 */
export function generateAdvancedBreadcrumbSchema(
  trendTitle: string,
  countryName: string,
  countryCode: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://issueglobe.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Trending Topics",
        item: "https://issueglobe.com",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: countryName,
        item: `https://issueglobe.com/country/${countryCode.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: trendTitle,
        item: `https://issueglobe.com/trend/${encodeURIComponent(trendTitle)}`,
      },
    ],
  };
}

/**
 * Social Media Profile Schema
 * 브랜드 신뢰도 강화
 */
export function generateOrganizationWithSocialSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IssueGlobe",
    url: "https://issueglobe.com",
    logo: "https://issueglobe.com/logo.png",
    description: "Real-time trending topics from 30 countries worldwide",
    sameAs: [
      "https://twitter.com/issueglobe",
      "https://www.linkedin.com/company/issueglobe",
      "https://www.youtube.com/@issueglobe",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Support",
      url: "https://issueglobe.com",
    },
    socialMediaFollowingCount: 10000,
  };
}

/**
 * Credit (저작권) 정보 마크업
 * 출처 투명성
 */
export function generateCreditSchema(
  trendTitle: string,
  sourceUrl: string,
  sourceName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: trendTitle,
    url: sourceUrl,
    isBasedOn: {
      "@type": "Service",
      name: "Google Trends",
      url: "https://trends.google.com",
    },
    publisher: {
      "@type": "Organization",
      name: "IssueGlobe",
      url: "https://issueglobe.com",
    },
    sourceOrganization: {
      "@type": "Organization",
      name: sourceName || "Google Trends",
    },
  };
}
