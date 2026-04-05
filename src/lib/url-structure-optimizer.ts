/**
 * URL 구조 최적화
 * SEO 친화적인 URL 패턴과 쿼리 파라미터 관리
 */

export interface URLStructureConfig {
  baseUrl: string;
  countryCode: string;
  trendSlug: string;
  query?: string;
  period?: "24h" | "7d" | "30d" | "90d";
  category?: string;
  language?: string;
}

export interface CanonicalConfig {
  preferredVersion: "www" | "non-www";
  preferHttps: boolean;
  trailing_slash: boolean;
}

/**
 * 트렌드 페이지 URL 생성
 * SEO 최적화된 구조
 */
export function generateTrendUrl(
  trendSlug: string,
  baseUrl: string = "https://issueglobe.com"
): string {
  return `${baseUrl}/trend/${encodeURIComponent(trendSlug)}`;
}

/**
 * 국가별 URL 생성
 */
export function generateCountryUrl(
  countryCode: string,
  baseUrl: string = "https://issueglobe.com"
): string {
  return `${baseUrl}/country/${countryCode.toLowerCase()}`;
}

/**
 * 필터링된 트렌드 URL 생성
 * 시간대/카테고리 필터 지원
 */
export function generateFilteredTrendUrl(
  countryCode: string,
  period?: "24h" | "7d" | "30d" | "90d",
  category?: string,
  baseUrl: string = "https://issueglobe.com"
): string {
  let url = generateCountryUrl(countryCode, baseUrl);

  const params = new URLSearchParams();
  if (period) params.append("period", period);
  if (category) params.append("category", category);

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * 캐노니컬 URL 정규화
 * URL 변형 문제 방지
 */
export function normalizeCanonical(
  url: string,
  config: Partial<CanonicalConfig> = {}
): string {
  const {
    preferredVersion = "non-www",
    preferHttps = true,
    trailing_slash = false,
  } = config;

  try {
    const urlObj = new URL(url);

    // HTTPS 선호
    if (preferHttps) {
      urlObj.protocol = "https:";
    }

    // www 처리
    if (preferredVersion === "non-www") {
      urlObj.hostname = urlObj.hostname.replace(/^www\./, "");
    } else if (preferredVersion === "www") {
      if (!urlObj.hostname.startsWith("www.")) {
        urlObj.hostname = `www.${urlObj.hostname}`;
      }
    }

    // 트레일링 슬래시
    if (!trailing_slash && urlObj.pathname.endsWith("/")) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    } else if (trailing_slash && !urlObj.pathname.endsWith("/") && urlObj.pathname !== "/") {
      urlObj.pathname += "/";
    }

    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * 국가별 URL 변형 생성
 * hreflang 대체용
 */
export function generateAlternateUrls(
  countries: Array<{ code: string; locale: string }>,
  path: string,
  baseUrl: string = "https://issueglobe.com"
): Array<{ locale: string; url: string }> {
  return countries.map((country) => ({
    locale: country.locale,
    url: `${baseUrl}/country/${country.code.toLowerCase()}${path}`,
  }));
}

/**
 * 검색 엔진 친화적 URL 구조 검증
 */
export function validateSEOUrl(url: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  try {
    const urlObj = new URL(url);

    // 프로토콜 확인
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      issues.push("Invalid protocol");
    }

    // HTTPS 권장
    if (urlObj.protocol === "http:") {
      issues.push("Should use HTTPS");
    }

    // URL 길이 확인 (권장: 75자 이하)
    if (url.length > 75) {
      issues.push("URL too long (> 75 characters)");
    }

    // 특수 문자 확인
    if (/%[^0-9A-Fa-f]|%[0-9A-Fa-f]$/.test(url)) {
      issues.push("Invalid URL encoding");
    }

    // 파라미터 순서 최적화 (권장: 중요도 순)
    const params = new URLSearchParams(urlObj.search);
    if (params.has("utm_source") || params.has("utm_medium")) {
      issues.push("UTM parameters detected - use separately tracked URLs for cleaner canonicals");
    }

    // 동적 세션 ID 확인
    if (/jsessionid|phpsessid|sid/i.test(url)) {
      issues.push("Session ID in URL - should be handled with cookies");
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  } catch (error) {
    return {
      isValid: false,
      issues: ["Invalid URL format"],
    };
  }
}

/**
 * 중복 콘텐츠 필터 파라미터 정의
 * 검색 엔진에 정렬/필터가 원본 콘텐츠를 변경하지 않음을 알림
 */
export function getFilterParameters(): {
  facetParameters: string[];
  sessionParameters: string[];
} {
  return {
    // 이 파라미터들은 정렬/필터링만 변경
    facetParameters: [
      "sort",
      "period",
      "category",
      "region",
      "language",
      "view",
    ],
    // 이 파라미터들은 세션 추적용 (canonical에서 제거)
    sessionParameters: [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "fbclid",
      "gclid",
      "msclkid",
    ],
  };
}

/**
 * 캐노니컬 URL 계산
 * 모든 변형에서 기본 버전으로 지정
 */
export function calculateCanonical(
  currentUrl: string,
  config: Partial<CanonicalConfig> = {}
): string {
  const { sessionParameters } = getFilterParameters();

  try {
    const urlObj = new URL(currentUrl);

    // 세션/추적 파라미터 제거
    sessionParameters.forEach((param) => {
      urlObj.searchParams.delete(param);
    });

    const cleaned = urlObj.toString();
    return normalizeCanonical(cleaned, config);
  } catch {
    return normalizeCanonical(currentUrl, config);
  }
}

/**
 * 트렌드 페이지 URL 정보 추출
 */
export function parseTrendUrl(url: string): {
  countryCode?: string;
  trendSlug?: string;
  isValid: boolean;
} {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/").filter(Boolean);

    if (parts[0] === "trend" && parts[1]) {
      return {
        trendSlug: decodeURIComponent(parts[1]),
        isValid: true,
      };
    }

    if (parts[0] === "country" && parts[1]) {
      return {
        countryCode: parts[1].toUpperCase(),
        isValid: true,
      };
    }

    return {
      isValid: false,
    };
  } catch {
    return {
      isValid: false,
    };
  }
}

/**
 * URL 슬러그 정규화
 * 일관된 URL 생성
 */
export function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // 알파벳, 숫자, 공백, 하이픈만 유지
    .replace(/[\s_-]+/g, "-") // 공백/언더스코어/하이픈을 하이픈으로 통일
    .replace(/^-+|-+$/g, ""); // 앞/뒤 하이픈 제거
}
