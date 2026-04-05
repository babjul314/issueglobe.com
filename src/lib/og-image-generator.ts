/**
 * 동적 OG 이미지 생성
 * 트렌드 데이터를 기반으로 소셜 공유용 이미지 생성
 */

export interface OGImageConfig {
  trendTitle: string;
  countryFlag: string;
  countryName: string;
  trafficValue: string;
  date: string;
  ranking?: number;
  backgroundColor?: string;
  accentColor?: string;
}

/**
 * Vercel OG Image 생성 URL
 * 실시간 동적 OG 이미지 생성
 */
export function generateOGImageUrl(config: OGImageConfig): string {
  const params = new URLSearchParams();
  params.append("title", config.trendTitle);
  params.append("flag", config.countryFlag);
  params.append("country", config.countryName);
  params.append("traffic", config.trafficValue);
  params.append("date", config.date);

  if (config.ranking) {
    params.append("ranking", config.ranking.toString());
  }

  if (config.backgroundColor) {
    params.append("bg", config.backgroundColor.replace("#", ""));
  }

  if (config.accentColor) {
    params.append("accent", config.accentColor.replace("#", ""));
  }

  return `https://issueglobe.com/api/og?${params.toString()}`;
}

/**
 * 트렌드 제목을 OG 이미지에 최적화된 형식으로 변환
 */
export function optimizeTitleForOG(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;

  // 단어 경계에서 자르기
  const trimmed = title.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");

  return lastSpace > maxLength - 20 ? trimmed.substring(0, lastSpace) : trimmed;
}

/**
 * 트래픽 값을 OG 이미지 친화적 형식으로 변환
 */
export function formatTrafficForOG(traffic: string): string {
  // "100K+" -> "100K", "10M+" -> "10M"
  return traffic.replace(/\+$/, "");
}

/**
 * 색상 코드를 16진수로 정규화
 */
export function normalizeHexColor(color: string): string {
  if (color.startsWith("#")) return color.toLowerCase();
  return `#${color.toLowerCase()}`;
}

/**
 * 트렌드 데이터로부터 OG 이미지 설정 생성
 */
export function createOGConfigFromTrend(
  trend: any, // TrendItem type
  countryFlag: string,
  countryName: string,
  countryColor?: string
) {
  return {
    trendTitle: optimizeTitleForOG(trend.title),
    countryFlag,
    countryName,
    trafficValue: formatTrafficForOG(trend.traffic),
    date: new Date(trend.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    backgroundColor: countryColor ? normalizeHexColor(countryColor) : "#3B82F6",
    accentColor: "#ffffff",
  };
}
