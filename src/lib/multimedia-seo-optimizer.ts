/**
 * 멀티미디어 SEO 최적화 (Images, Videos, Audio)
 * 이미지 검색, YouTube, 비디오 검색 결과 노출 극대화
 */

export interface ImageSEOMetrics {
  filename: string;
  altText: string;
  title: string;
  fileSize: number; // KB
  dimensions: { width: number; height: number };
  format: string; // webp, jpg, png
  srcset: boolean;
  lazyLoading: boolean;
  schema: boolean;
  crawlability: number; // 0-100
}

export interface VideoSEOMetrics {
  title: string;
  description: string;
  duration: number; // seconds
  uploadDate: string;
  thumbnail: string;
  embedCode: boolean;
  transcript: boolean;
  schema: boolean;
  thumbnail_quality: number; // 0-100
  indexability: number; // 0-100
}

export interface MultimediaOptimizationPlan {
  assetType: string;
  currentScore: number;
  targetScore: number;
  improvements: string[];
  priority: "critical" | "high" | "medium" | "low";
  estimatedTrafficGain: number; // %
}

/**
 * 이미지 SEO 최적화
 */
export function optimizeImageSEO(image: {
  url: string;
  altText?: string;
  title?: string;
}): ImageSEOMetrics {
  const filename = image.url.split("/").pop() || "";
  const altText = image.altText || filename.split(".")[0];
  const title = image.title || altText;

  // 파일명에서 확장자 추출
  const format = filename.split(".").pop()?.toLowerCase() || "jpg";

  // 기본값 (실제로는 이미지 분석 필요)
  const metrics: ImageSEOMetrics = {
    filename,
    altText,
    title,
    fileSize: 150, // KB (평균)
    dimensions: { width: 1200, height: 630 },
    format,
    srcset: true,
    lazyLoading: true,
    schema: true,
    crawlability: 0,
  };

  // Crawlability 점수 계산
  let crawlability = 50;

  // Alt text (25점)
  if (altText && altText.length > 10 && altText.includes(" ")) {
    crawlability += 25;
  } else if (altText) {
    crawlability += 15;
  }

  // 파일명 (15점)
  if (filename.includes("-") || filename.includes("_")) {
    crawlability += 15;
  } else if (!filename.match(/\d{5,}/)) {
    crawlability += 10;
  }

  // 포맷 (10점)
  if (format === "webp") {
    crawlability += 10;
  } else if (format === "jpg" || format === "png") {
    crawlability += 5;
  }

  // Schema (10점)
  if (metrics.schema) {
    crawlability += 10;
  }

  // srcset (5점)
  if (metrics.srcset) {
    crawlability += 5;
  }

  metrics.crawlability = Math.min(100, crawlability);
  return metrics;
}

/**
 * 비디오 SEO 최적화
 */
export function optimizeVideoSEO(video: {
  title: string;
  description?: string;
  duration?: number;
  uploadDate?: string;
  thumbnail?: string;
}): VideoSEOMetrics {
  const metrics: VideoSEOMetrics = {
    title: video.title,
    description:
      video.description ||
      `Watch: ${video.title}. Full video content available.`,
    duration: video.duration || 300,
    uploadDate: video.uploadDate || new Date().toISOString().split("T")[0],
    thumbnail: video.thumbnail || "https://issueglobe.com/video-thumbnail.jpg",
    embedCode: true,
    transcript: true,
    schema: true,
    thumbnail_quality: 0,
    indexability: 0,
  };

  // Thumbnail Quality (40점)
  let thumbnailQuality = 30;
  if (metrics.thumbnail && metrics.thumbnail.startsWith("http")) {
    thumbnailQuality = 40; // 최적
  }
  metrics.thumbnail_quality = thumbnailQuality;

  // Indexability 점수 (60점)
  let indexability = 30;

  // Title (15점)
  if (video.title.length > 20 && video.title.length < 60) {
    indexability += 15;
  } else if (video.title.length > 10) {
    indexability += 10;
  }

  // Description (15점)
  if (
    video.description &&
    video.description.length > 100 &&
    video.description.length < 500
  ) {
    indexability += 15;
  } else if (video.description && video.description.length > 50) {
    indexability += 10;
  }

  // Duration (10점)
  if (video.duration && video.duration >= 120 && video.duration <= 600) {
    indexability += 10;
  }

  // Schema (10점)
  if (metrics.schema) {
    indexability += 10;
  }

  // Embed Code (10점)
  if (metrics.embedCode) {
    indexability += 10;
  }

  // Transcript (5점)
  if (metrics.transcript) {
    indexability += 5;
  }

  metrics.indexability = Math.min(100, indexability);
  return metrics;
}

/**
 * 이미지 검색 최적화 전략
 */
export function generateImageSearchStrategy(): MultimediaOptimizationPlan[] {
  return [
    {
      assetType: "Alt Text Optimization",
      currentScore: 45,
      targetScore: 95,
      improvements: [
        "모든 이미지에 descriptive alt text 추가",
        "Alt text에 주요 키워드 포함 (자연스럽게)",
        "Alt text 30-50자 길이 유지",
        "특수 문자 피하기",
      ],
      priority: "critical",
      estimatedTrafficGain: 15,
    },
    {
      assetType: "Image Filename Optimization",
      currentScore: 55,
      targetScore: 90,
      improvements: [
        "파일명에 키워드 포함 (하이픈 구분)",
        "예: trending-topic-korea-2026.jpg",
        "날짜나 임의 숫자 제거",
        "영문 소문자 사용",
      ],
      priority: "high",
      estimatedTrafficGain: 10,
    },
    {
      assetType: "Image Format & Compression",
      currentScore: 65,
      targetScore: 95,
      improvements: [
        "WebP 형식으로 변환 (30% 크기 감소)",
        "각 이미지 100KB 이하",
        "적절한 해상도 사용 (최대 1200x630)",
        "Srcset 구현 (반응형)",
      ],
      priority: "high",
      estimatedTrafficGain: 12,
    },
    {
      assetType: "Image Schema Markup",
      currentScore: 30,
      targetScore: 100,
      improvements: [
        "ImageObject schema 추가",
        "name, description, datePublished 포함",
        "author/creator 정보",
        "license 정보 (CC, copyrighted 등)",
      ],
      priority: "medium",
      estimatedTrafficGain: 8,
    },
  ];
}

/**
 * YouTube & 비디오 최적화 전략
 */
export function generateVideoSearchStrategy(): MultimediaOptimizationPlan[] {
  return [
    {
      assetType: "Video Title Optimization",
      currentScore: 60,
      targetScore: 95,
      improvements: [
        "주요 키워드를 제목 앞에 배치",
        "40-60자 길이 (SERP에 완전히 표시)",
        "시청자 클릭을 유도하는 제목",
        "숫자나 대괄호 사용 (예: [LIVE] or [2026])",
      ],
      priority: "high",
      estimatedTrafficGain: 20,
    },
    {
      assetType: "Video Description Expansion",
      currentScore: 40,
      targetScore: 100,
      improvements: [
        "최소 300자 이상 설명",
        "첫 25자에 핵심 내용",
        "타임스탬프 추가 (YouTube 시간 표시)",
        "관련 링크 3-5개 포함",
        "트랜스크립트 링크 추가",
      ],
      priority: "high",
      estimatedTrafficGain: 18,
    },
    {
      assetType: "Thumbnail Quality",
      currentScore: 55,
      targetScore: 95,
      improvements: [
        "고대비 이미지 (가독성 좋음)",
        "얼굴/감정 표현 포함",
        "텍스트 오버레이 (최대 3단어)",
        "1280x720 최소 해상도",
      ],
      priority: "high",
      estimatedTrafficGain: 25,
    },
    {
      assetType: "Video Schema Markup",
      currentScore: 35,
      targetScore: 100,
      improvements: [
        "VideoObject schema 추가",
        "description, uploadDate, duration 포함",
        "thumbnailUrl 지정",
        "contentUrl 또는 embedUrl 포함",
      ],
      priority: "medium",
      estimatedTrafficGain: 12,
    },
    {
      assetType: "Closed Captions & Transcript",
      currentScore: 20,
      targetScore: 95,
      improvements: [
        "정확한 자막 추가 (100% 정확도)",
        "주요 키워드 자막에 포함",
        "YouTube 자동 생성 검토 및 수정",
        "전체 트랜스크립트 페이지에 제공",
      ],
      priority: "critical",
      estimatedTrafficGain: 30,
    },
  ];
}

/**
 * 멀티미디어 SEO 체크리스트
 */
export function generateMultimediaSEOChecklist(): string[] {
  const checklist: string[] = [];

  checklist.push("## 멀티미디어 SEO 최적화 체크리스트\n");

  checklist.push("### 이미지 최적화");
  checklist.push("- [ ] 모든 이미지 alt text 추가");
  checklist.push("- [ ] 파일명 키워드 포함 (하이픈 구분)");
  checklist.push("- [ ] WebP 형식 변환");
  checklist.push("- [ ] 각 이미지 <100KB");
  checklist.push("- [ ] Srcset 구현 (반응형)");
  checklist.push("- [ ] ImageObject Schema 추가");

  checklist.push("\n### 비디오 최적화");
  checklist.push("- [ ] YouTube 제목 최적화 (주요키워드 앞)");
  checklist.push("- [ ] 설명 300자 이상, 타임스탬프 추가");
  checklist.push("- [ ] 고품질 썸네일 (1280x720+)");
  checklist.push("- [ ] 정확한 자막 추가");
  checklist.push("- [ ] 전체 트랜스크립트 제공");
  checklist.push("- [ ] VideoObject Schema 추가");

  checklist.push("\n### 멀티미디어 Sitemap");
  checklist.push("- [ ] Image Sitemap 생성 및 제출");
  checklist.push("- [ ] Video Sitemap 생성");
  checklist.push("- [ ] Google Search Console 제출");
  checklist.push("- [ ] 월간 자동 갱신 설정");

  checklist.push("\n### 성능 모니터링");
  checklist.push("- [ ] 이미지 검색 트래픽 추적");
  checklist.push("- [ ] YouTube 비디오 클릭 분석");
  checklist.push("- [ ] 비디오 조회 시간 모니터링");
  checklist.push("- [ ] 멀티미디어 CTR 분석");

  return checklist;
}
