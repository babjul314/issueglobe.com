/**
 * 다국어 키워드 최적화
 * 각 시장의 검색 의도에 맞는 지역화 키워드 생성
 */

export interface LocalizedKeywords {
  language: string;
  country: string;
  base: string[];
  searchIntent: string[];
  location: string[];
  related: string[];
  seasonal?: string[];
}

/**
 * 언어별 지역화 키워드 맵
 * 실제 검색 행동 기반
 */
const LANGUAGE_KEYWORD_MAPS: Record<string, LocalizedKeywords> = {
  // 한국어 (Korean)
  KR: {
    language: "ko",
    country: "South Korea",
    base: ["실시간 검색어", "트렌드", "인기 검색어", "최신 키워드", "핫한 주제"],
    searchIntent: [
      "실시간 검색어 순위",
      "오늘의 트렌드",
      "왜 트렌딩되나",
      "검색어 의미",
      "트렌드 뉘앙스",
    ],
    location: ["대한민국", "한국", "국내 핫", "국내 트렌드"],
    related: ["포털", "다음", "구글 트렌드", "뉴스"],
    seasonal: ["설날 트렌드", "추석 검색어", "연말 검색"],
  },

  // 일본어 (Japanese)
  JP: {
    language: "ja",
    country: "Japan",
    base: [
      "トレンド",
      "検索キーワード",
      "話題",
      "ホットキーワード",
      "リアルタイム",
    ],
    searchIntent: [
      "なぜトレンド",
      "トレンド理由",
      "キーワード意味",
      "トレンド分析",
      "検索理由",
    ],
    location: ["日本", "日本国内", "日本トレンド", "国内話題"],
    related: ["ヤフー検索", "Google Trends", "SNS", "Twitter"],
    seasonal: ["お正月トレンド", "お盆トレンド", "GWトレンド"],
  },

  // 독일어 (German)
  DE: {
    language: "de",
    country: "Germany",
    base: [
      "Trends",
      "Suchtrends",
      "beliebte Suchanfragen",
      "Trendthemen",
      "Suchbegriffe",
    ],
    searchIntent: [
      "Warum Trend",
      "Trendanalyse",
      "Suchvolumen",
      "Trending Themen",
      "Aktuelle Trends",
    ],
    location: ["Deutschland", "Deutscher Trend", "Deutschlandweit", "Lokal"],
    related: ["Google Trends", "Suchmaschine", "SEO", "Online"],
    seasonal: ["Neujahrs-Trend", "Weihnachts-Trend", "Urlaubszeit"],
  },

  // 프랑스어 (French)
  FR: {
    language: "fr",
    country: "France",
    base: [
      "Tendances",
      "Recherches populaires",
      "Mots-clés",
      "Sujets à la mode",
      "Recherches du moment",
    ],
    searchIntent: [
      "Pourquoi tendance",
      "Analyse tendance",
      "Sens du mot-clé",
      "Tendance en direct",
      "Volume recherche",
    ],
    location: ["France", "Français", "Tendance française", "Actualité"],
    related: [
      "Google Trends",
      "Actualités",
      "Réseaux sociaux",
      "Viral",
    ],
    seasonal: ["Tendance Noël", "Tendance Été", "Tendance Printemps"],
  },

  // 포르투갈어 (Portuguese)
  BR: {
    language: "pt",
    country: "Brazil",
    base: [
      "Tendências",
      "Pesquisas populares",
      "Assuntos do momento",
      "Palavras-chave",
      "Tópicos em alta",
    ],
    searchIntent: [
      "Por que está em alta",
      "Análise de tendência",
      "Significado",
      "Tendência real",
      "Volume de busca",
    ],
    location: [
      "Brasil",
      "Brasileiro",
      "Tendência BR",
      "Notícia Brasil",
    ],
    related: ["Google Trends", "Notícias", "Twitter", "Redes sociais"],
    seasonal: ["Tendência Carnaval", "Tendência Natal", "Tendência Copa"],
  },

  // 영어 (English)
  US: {
    language: "en",
    country: "United States",
    base: [
      "Trending Topics",
      "Google Trends",
      "What is Trending",
      "Popular Searches",
      "Viral Keywords",
    ],
    searchIntent: [
      "Why is trending",
      "Trend Analysis",
      "Search Volume",
      "Real-time Trends",
      "Trending Now",
    ],
    location: ["United States", "USA", "America", "American Trends"],
    related: ["News", "Social Media", "Viral", "Buzz"],
    seasonal: ["Super Bowl Trends", "Oscar Trends", "Holiday Trends"],
  },

  // 스페인어 (Spanish)
  MX: {
    language: "es",
    country: "Mexico",
    base: [
      "Tendencias",
      "Búsquedas populares",
      "Temas virales",
      "Palabras clave",
      "Lo que está en tendencia",
    ],
    searchIntent: [
      "Por qué está en tendencia",
      "Análisis de tendencia",
      "Significado",
      "Tendencia en vivo",
      "Volumen de búsqueda",
    ],
    location: ["México", "Mexicano", "Tendencia Mexico", "Noticia Mexico"],
    related: ["Google Trends", "Noticias", "Twitter", "Viral"],
    seasonal: ["Tendencia Navidad", "Tendencia Independencia", "Tendencia Semana Santa"],
  },

  // 힌디어 (Hindi)
  IN: {
    language: "hi",
    country: "India",
    base: ["ट्रेंडिंग", "खोज", "लोकप्रिय विषय", "वायरल", "चर्चित"],
    searchIntent: [
      "ट्रेंडिंग क्यों",
      "ट्रेंड विश्लेषण",
      "मतलब",
      "लाइव ट्रेंड",
      "खोज मात्रा",
    ],
    location: ["भारत", "भारतीय", "भारत ट्रेंड", "समाचार"],
    related: ["Google ट्रेंड", "समाचार", "सोशल मीडिया", "वायरल"],
  },
};

/**
 * 특정 언어/국가의 지역화 키워드 가져오기
 */
export function getLocalizedKeywords(
  countryCode: string
): LocalizedKeywords | null {
  return LANGUAGE_KEYWORD_MAPS[countryCode] || null;
}

/**
 * 트렌드 제목으로부터 지역화 검색 키워드 생성
 */
export function generateLocalizedSearchTerms(
  trendTitle: string,
  countryCode: string
): string[] {
  const keywords = getLocalizedKeywords(countryCode);
  if (!keywords) return [];

  const localizedTerms = new Set<string>();

  // 기본 키워드와 조합
  keywords.base.forEach((base) => {
    localizedTerms.add(`${base} ${trendTitle}`);
    localizedTerms.add(`${trendTitle} ${base}`);
  });

  // 검색 의도별 조합
  keywords.searchIntent.forEach((intent) => {
    localizedTerms.add(`${trendTitle} ${intent}`);
  });

  // 지역 명시
  localizedTerms.add(`${trendTitle} ${keywords.country}`);
  localizedTerms.add(`${trendTitle} ${keywords.location[0]}`);

  return Array.from(localizedTerms);
}

/**
 * 다국어 SEO 메타 태그 생성
 */
export function generateMultilingualMeta(
  trendTitle: string,
  countryCode: string,
  baseMeta?: { description?: string }
) {
  const keywords = getLocalizedKeywords(countryCode);
  if (!keywords) return null;

  const searchTerms = generateLocalizedSearchTerms(trendTitle, countryCode);

  // 언어별 제목 변형
  const titleVariations = {
    KR: `${trendTitle} - ${keywords.country}에서 트렌딩 중`,
    JP: `${trendTitle} - ${keywords.country}でトレンド中`,
    DE: `${trendTitle} - Trend in ${keywords.country}`,
    FR: `${trendTitle} - Tendance en ${keywords.country}`,
    BR: `${trendTitle} - Tendência no ${keywords.country}`,
    ES: `${trendTitle} - Tendencia en ${keywords.country}`,
    US: `${trendTitle} - Trending in ${keywords.country}`,
    IN: `${trendTitle} - ${keywords.country} में ट्रेंडिंग`,
  };

  return {
    language: keywords.language,
    country: keywords.country,
    keywords: searchTerms,
    description:
      baseMeta?.description ||
      `Discover why ${trendTitle} is trending in ${keywords.country}. Real-time search trends and insights.`,
    title:
      titleVariations[countryCode as keyof typeof titleVariations] ||
      `${trendTitle} - Trending in ${keywords.country}`,
  };
}

/**
 * 시간 기반 계절 키워드
 * 연휴/시즌별 검색량 증가
 */
export function getSeasonalKeywords(
  countryCode: string,
  date: Date = new Date()
): string[] {
  const keywords = getLocalizedKeywords(countryCode);
  if (!keywords?.seasonal) return [];

  const month = date.getMonth() + 1;
  const seasonalTerms: Record<number, string[]> = {
    1: keywords.seasonal || [],
    12: keywords.seasonal || [],
  };

  return seasonalTerms[month] || [];
}

/**
 * 국가별 인기 검색 카테고리
 * 시장 특화 콘텐츠 전략 지원
 */
export function getMarketSpecificCategories(
  countryCode: string
): Record<string, string[]> {
  const categoryMap: Record<string, Record<string, string[]>> = {
    KR: {
      entertainment: ["K-POP", "드라마", "영화", "연예인"],
      tech: ["AI", "5G", "스마트폰", "게임"],
      news: ["국정", "경제", "사회", "스포츠"],
    },
    JP: {
      entertainment: ["アニメ", "ドラマ", "映画", "芸能人"],
      tech: ["ロボット", "AI", "ゲーム", "スマートフォン"],
      news: ["ニュース", "政治", "経済", "スポーツ"],
    },
    DE: {
      entertainment: ["Kino", "Serie", "Musik", "Promi"],
      tech: ["Industrie 4.0", "AI", "Cybersecurity", "Smartphone"],
      news: ["Politik", "Wirtschaft", "Fußball", "Verkehr"],
    },
    FR: {
      entertainment: ["Cinéma", "Série", "Musique", "Célébrité"],
      tech: ["Innovation", "IA", "Cybersécurité", "Tech"],
      news: ["Politique", "Économie", "Sport", "Société"],
    },
    BR: {
      entertainment: ["Novela", "Música", "Cinema", "Celebridade"],
      tech: ["Tecnologia", "IA", "Redes Sociais", "Smartphone"],
      news: ["Notícias", "Política", "Futebol", "Economia"],
    },
  };

  return categoryMap[countryCode] || {};
}
