export interface TrendItem {
  title: string;
  slug: string;
  traffic: string;
  description: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  country: string;
  date: string;
  pubTime: string; // 트렌드 등록 시간 (예: "3시간 전", "14:30")
  relatedQueries: string[];
  summary: string;
  detail: string;
  reactions: string;
}

// 인메모리 캐시 (Vercel 서버리스 환경 호환)
const memoryCache = new Map<string, { data: TrendItem[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1시간

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ぁ-んァ-ヶ亜-熙\u0600-\u06FF\u0590-\u05FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getCacheKey(countryCode: string): string {
  return `${countryCode}_${getToday()}`;
}

// 나라별 허용 도메인 (해당 나라 언론사만 허용)
const COUNTRY_DOMAINS: Record<string, string[]> = {
  US: [".com", ".org", ".net", ".us", ".gov"],
  GB: [".co.uk", ".uk", ".bbc.", ".guardian.", ".telegraph."],
  KR: [".kr", ".daum.", ".naver.", ".chosun.", ".joins.", ".donga.", ".hankyung.", ".mk.", ".newsis.", ".ytn.", ".sbs.", ".kbs.", ".mbc."],
  JP: [".jp", ".yahoo.co.jp", ".nhk.", ".asahi.", ".nikkei.", ".mainichi."],
  DE: [".de", ".tagesschau.", ".spiegel.", ".bild.", ".zeit.", ".welt.", ".handelsblatt.", ".n-tv."],
  FR: [".fr", ".lemonde.", ".lefigaro.", ".leparisien.", ".ouest-france.", ".bfmtv."],
  IT: [".it", ".corriere.", ".gazzetta.", ".repubblica.", ".sky.it", ".ansa."],
  ES: [".es", ".elpais.", ".elmundo.", ".marca.", ".lavanguardia.", ".abc.es"],
  BR: [".br", ".globo.", ".uol.", ".folha.", ".estadao."],
  IN: [".in", ".indiatimes.", ".ndtv.", ".thehindu.", ".espn.in", ".hindustantimes."],
  AU: [".au", ".com.au", ".abc.net.au", ".smh.", ".news.com.au"],
  CA: [".ca", ".cbc.", ".globalnews.", ".ctvnews.", ".thestar."],
  NL: [".nl", ".nos.", ".rtv.", ".telegraaf.", ".nu.nl", ".volkskrant."],
  TW: [".tw", ".ltn.", ".udn.", ".chinatimes.", ".ettoday."],
  SG: [".sg", ".straitstimes.", ".channelnewsasia."],
  AE: [".ae", "gulfnews.", "khaleejtimes.", "thenationalnews."],
  SA: [".sa", "arabnews.", "saudigazette."],
  CH: [".ch", "swissinfo.", "nzz."],
  SE: [".se", "svd.", "dn.se", "aftonbladet."],
  NO: [".no", "nrk.", "vg.no", "dagbladet."],
  DK: [".dk", "dr.dk", "berlingske.", "politiken."],
  BE: [".be", "rtbf.", "vrt.", "standaard."],
  AT: [".at", "orf.", "derstandard.", "kurier."],
  IE: [".ie", "rte.", "irishtimes.", "independent.ie"],
  NZ: [".nz", "stuff.co.nz", "nzherald."],
  FI: [".fi", "yle.", "hs.fi", "iltalehti."],
  PL: [".pl", "tvn24.", "onet.", "wp.pl", "gazeta.pl"],
  IL: [".il", "haaretz.", "timesofisrael.", "jpost."],
  HK: [".hk", "scmp.", "mingpao.", "hk01."],
  MX: [".mx", "eluniversal.", "milenio.", "excelsior."],
};

function isSourceFromCountry(newsUrl: string, countryCode: string): boolean {
  if (!newsUrl) return true; // URL 없으면 통과
  const domains = COUNTRY_DOMAINS[countryCode];
  if (!domains) return true; // 도메인 목록 없으면 통과
  // 글로벌 소스는 모든 나라에서 허용
  const globalDomains = [".reuters.", ".apnews.", "bbc.com", ".cnn.", ".aljazeera.", ".espn.", ".goal.com", ".si.com"];
  const url = newsUrl.toLowerCase();
  if (globalDomains.some((d) => url.includes(d))) return true;
  return domains.some((d) => url.includes(d));
}

// Google Trends RSS 피드에서 트렌드 가져오기
async function fetchTrendsFromRSS(countryCode: string): Promise<TrendItem[]> {
  const today = getToday();
  const url = `https://trends.google.com/trending/rss?geo=${countryCode}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; IssueGlobe/1.0)",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`RSS fetch failed for ${countryCode}: ${res.status}`);
    return [];
  }

  const xml = await res.text();

  // RSS XML 파싱
  const items: TrendItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title") || "";
    const traffic = extractTag(itemXml, "ht:approx_traffic") || "N/A";
    const newsUrl = extractTag(itemXml, "ht:news_item_url") || "";
    const newsTitle = extractTag(itemXml, "ht:news_item_title") || "";
    const newsSource = extractTag(itemXml, "ht:news_item_source") || "";
    const pictureUrl = extractTag(itemXml, "ht:picture") || "";
    const pubDate = extractTag(itemXml, "pubDate") || "";

    // pubDate를 "~시간 전" 형식으로 변환
    let pubTime = "";
    if (pubDate) {
      const pub = new Date(pubDate);
      const now = new Date();
      const diffMs = now.getTime() - pub.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 60) pubTime = `${diffMin}m ago`;
      else if (diffMin < 1440) pubTime = `${Math.floor(diffMin / 60)}h ago`;
      else pubTime = `${Math.floor(diffMin / 1440)}d ago`;
    }

    // 출처가 다른 나라 언론사면 제외
    if (title && isSourceFromCountry(newsUrl, countryCode)) {
      items.push({
        title,
        slug: `${countryCode.toLowerCase()}-${slugify(title)}-${today}`,
        traffic,
        description: newsTitle,
        source: newsSource,
        sourceUrl: newsUrl,
        imageUrl: pictureUrl,
        country: countryCode,
        date: today,
        pubTime,
        relatedQueries: [],
        summary: "",
        detail: "",
        reactions: "",
      });
    }
  }

  return items;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function extractTag(xml: string, tag: string): string | null {
  // CDATA 지원
  const cdataRegex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`);
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return decodeHtmlEntities(cdataMatch[1].trim());

  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const m = regex.exec(xml);
  return m ? decodeHtmlEntities(m[1].trim()) : null;
}

export async function fetchTrendsForCountry(
  countryCode: string
): Promise<TrendItem[]> {
  const cacheKey = getCacheKey(countryCode);
  const cached = memoryCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // 미리 작성된 콘텐츠 가져오기 (동적 import로 순환 참조 방지)
  let preloaded: TrendItem[] = [];
  try {
    const { getPreloadedTrends } = await import("@/data/trending-content");
    preloaded = getPreloadedTrends(countryCode);
  } catch {
    // preloaded 없으면 무시
  }

  try {
    const rssItems = await fetchTrendsFromRSS(countryCode);

    // RSS 데이터와 미리 작성된 콘텐츠 병합
    const merged = rssItems.map((rssItem) => {
      // 유연한 매칭: 정확히 일치 → 포함 관계 → slug 비교
      const titleLower = rssItem.title.toLowerCase();
      const enriched = preloaded.find(
        (p) => p.title.toLowerCase() === titleLower
      ) || preloaded.find(
        (p) => titleLower.includes(p.title.toLowerCase()) || p.title.toLowerCase().includes(titleLower)
      ) || preloaded.find(
        (p) => {
          const pSlugBase = p.slug.replace(/-\d{4}-\d{2}-\d{2}$/, "");
          const rSlugBase = rssItem.slug.replace(/-\d{4}-\d{2}-\d{2}$/, "");
          return pSlugBase === rSlugBase;
        }
      );
      if (enriched) {
        return {
          ...rssItem,
          summary: enriched.summary,
          detail: enriched.detail,
          reactions: enriched.reactions,
          relatedQueries: enriched.relatedQueries.length > 0 ? enriched.relatedQueries : rssItem.relatedQueries,
          description: enriched.description || rssItem.description,
        };
      }
      return rssItem;
    });

    // enriched 콘텐츠가 있는 항목 수 확인
    const enrichedCount = merged.filter((m) => m.detail).length;

    // preloaded에 상세 콘텐츠가 있고 RSS 매칭이 부족하면 preloaded 우선
    // RSS 항목에 preloaded 콘텐츠를 앞에 추가
    let result: TrendItem[];
    if (preloaded.length > 0 && preloaded[0].detail && enrichedCount < 2) {
      // preloaded를 메인으로, RSS 중 매칭 안 된 것만 뒤에 추가
      const preloadedTitles = new Set(preloaded.map((p) => p.title.toLowerCase()));
      const extraRss = merged.filter((m) => !m.detail && !preloadedTitles.has(m.title.toLowerCase()));
      result = [...preloaded, ...extraRss];
    } else {
      result = merged.length > 0 ? merged : preloaded;
    }

    if (result.length > 0) {
      memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
    }
    return result;
  } catch (error) {
    console.error(`Failed to fetch trends for ${countryCode}:`, error);
    return preloaded;
  }
}
