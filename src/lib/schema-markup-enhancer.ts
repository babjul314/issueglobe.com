/**
 * 고급 Schema Markup 생성 (JSON-LD)
 * Google Rich Results, Knowledge Graph, Voice Search 최적화
 */

export interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

/**
 * Breadcrumb List Schema 생성
 */
export function generateBreadcrumbSchema(
  countryName: string,
  trendTitle?: string
): StructuredData {
  const items: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://issueglobe.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: countryName,
      item: `https://issueglobe.com/country/${countryName.toLowerCase()}`,
    },
  ];

  if (trendTitle) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: trendTitle,
      item: `https://issueglobe.com/trend/${trendTitle.toLowerCase()}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

/**
 * NewsArticle Schema (트렌드 페이지용)
 */
export function generateNewsArticleSchema(
  title: string,
  description: string,
  imageUrl: string,
  publishedDate: string,
  modifiedDate: string,
  countryName: string
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    image: [imageUrl],
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Organization",
      name: "IssueGlobe",
      logo: {
        "@type": "ImageObject",
        url: "https://issueglobe.com/logo.svg",
        width: 512,
        height: 512,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "IssueGlobe",
      logo: {
        "@type": "ImageObject",
        url: "https://issueglobe.com/logo.svg",
        width: 512,
        height: 512,
      },
    },
    mainEntity: {
      "@type": "Thing",
      name: title,
      description: description,
    },
    articleBody: description,
    inLanguage: "en",
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    keywords: [title, countryName, "trending", "search trends"],
  };
}

/**
 * FAQPage Schema (자동 생성)
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * SearchAction Schema (Site Search 최적화)
 */
export function generateSearchActionSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://issueglobe.com",
    name: "IssueGlobe",
    description: "Real-Time Global Trending Topics from 30 Countries",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://issueglobe.com/search?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };
}

/**
 * CollectionPage Schema (국가별 트렌드 목록)
 */
export function generateCollectionPageSchema(
  countryName: string,
  trendCount: number,
  trends: Array<{ title: string; url: string }>
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Trending in ${countryName}`,
    description: `Real-time trending searches and topics in ${countryName}. Currently tracking ${trendCount} trending items.`,
    url: `https://issueglobe.com/country/${countryName.toLowerCase()}`,
    image: "https://issueglobe.com/logo.svg",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: trends.slice(0, 20).map((trend, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: trend.url,
        name: trend.title,
      })),
    },
    isPartOf: {
      "@type": "WebSite",
      name: "IssueGlobe",
      url: "https://issueglobe.com",
    },
  };
}

/**
 * Trending Event Schema
 */
export function generateTrendingEventSchema(
  title: string,
  description: string,
  startDate: string,
  countryName: string
): StructuredData {
  // 트렌드는 대개 몇 시간 지속
  const endDate = new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Trending: ${title}`,
    description: description,
    startDate: startDate,
    endDate: endDate,
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
 * VideoObject Schema (YouTube 비디오)
 */
export function generateVideoSchema(
  title: string,
  description: string,
  thumbnailUrl: string,
  uploadDate: string,
  duration: string,
  videoUrl: string
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description: description,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: uploadDate,
    duration: duration || "PT10M",
    contentUrl: videoUrl,
    embedUrl: videoUrl,
    interactionCount: "0",
  };
}

/**
 * Organization Schema (메인 도메인용)
 */
export function generateOrganizationSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IssueGlobe",
    alternateName: "Issue Globe",
    url: "https://issueglobe.com",
    logo: "https://issueglobe.com/logo.svg",
    description:
      "Real-Time Global Trending Topics from 30 Countries. Discover what the world is searching for right now with hourly updates.",
    sameAs: [
      "https://twitter.com/issueglobe",
      "https://www.linkedin.com/company/issueglobe",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@issueglobe.com",
      url: "https://issueglobe.com",
    },
    foundingDate: "2024",
    areaServed: [
      "US",
      "GB",
      "DE",
      "FR",
      "JP",
      "KR",
      "IN",
      "BR",
      "AU",
      "CA",
      "MX",
      "ES",
      "IT",
      "NL",
      "SE",
      "CH",
      "BE",
      "AT",
      "DK",
      "NO",
      "FI",
      "PL",
      "IE",
      "SG",
      "HK",
      "TW",
      "NZ",
      "IL",
      "AE",
      "SA",
    ],
  };
}

/**
 * Person/Author Schema (신뢰도 증가)
 */
export function generateAuthorSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "IssueGlobe Team",
    jobTitle: "Data Analyst",
    url: "https://issueglobe.com",
    sameAs: ["https://twitter.com/issueglobe"],
    description: "Real-time trend analysis and insights team",
  };
}

/**
 * Product Schema (트렌드를 "제품"으로 마크업)
 */
export function generateTrendProductSchema(
  title: string,
  description: string,
  trend_rating: number,
  search_volume: string,
  url: string
): StructuredData {
  // search_volume을 숫자로 변환
  const volumeNumber = parseInt(search_volume.replace(/[^0-9]/g, "")) || 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description,
    url: url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.min(5, 1 + Math.log(volumeNumber) / 10),
      ratingCount: volumeNumber,
      reviewCount: Math.max(1, Math.floor(volumeNumber / 100)),
    },
  };
}

/**
 * LocalBusiness Schema (지역별 최적화)
 */
export function generateLocalBusinessSchema(
  countryName: string,
  countryCode: string
): StructuredData {
  const coordinates: Record<string, { latitude: number; longitude: number }> =
    {
      US: { latitude: 37.7749, longitude: -122.4194 },
      GB: { latitude: 51.5074, longitude: -0.1278 },
      JP: { latitude: 35.6762, longitude: 139.6503 },
      KR: { latitude: 37.5665, longitude: 126.978 },
      DE: { latitude: 52.52, longitude: 13.405 },
      FR: { latitude: 48.8566, longitude: 2.3522 },
      CA: { latitude: 43.6532, longitude: -79.3832 },
      AU: { latitude: -33.8688, longitude: 151.2093 },
      IN: { latitude: 28.6139, longitude: 77.209 },
      BR: { latitude: -23.5505, longitude: -46.6333 },
    };

  const geo = coordinates[countryCode] || { latitude: 0, longitude: 0 };

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `IssueGlobe - ${countryName}`,
    url: `https://issueglobe.com/country/${countryCode.toLowerCase()}`,
    image: "https://issueglobe.com/logo.svg",
    description: `Real-time trending searches and topics in ${countryName}`,
    areaServed: countryName,
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
  };
}

/**
 * Schema Markup HTML 생성기
 */
export function generateSchemaMarkupHTML(schemas: StructuredData[]): string {
  return schemas
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    )
    .join("\n");
}
