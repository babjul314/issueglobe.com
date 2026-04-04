// 사용자 신호 추적 (SEO 개선용)

export function trackEngagement() {
  if (typeof window === 'undefined') return;

  // 스크롤 깊이 추적
  let scrollDepth = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > scrollDepth) {
      scrollDepth = scrollPercent;
      if (scrollPercent % 25 === 0) {
        trackEvent('scroll_depth', {
          depth: Math.round(scrollPercent)
        });
      }
    }
  });

  // 페이지 체류 시간
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    if (timeOnPage > 5) {
      trackEvent('time_on_page', {
        seconds: timeOnPage
      });
    }
  });

  // 클릭 추적
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      const link = target.closest('a') as HTMLAnchorElement;
      if (link && link.href) {
        trackEvent('link_click', {
          href: link.href,
          text: link.textContent?.slice(0, 50)
        });
      }
    }
  });

  // 버튼 클릭
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      const button = target.closest('button') as HTMLButtonElement;
      if (button) {
        trackEvent('button_click', {
          text: button.textContent?.slice(0, 50)
        });
      }
    }
  });
}

function trackEvent(eventName: string, eventData: Record<string, any>) {
  // Google Analytics에 전송 (이미 설정되어 있음)
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }

  // 로컬 저장 (분석용)
  try {
    const events = JSON.parse(localStorage.getItem('engagement_events') || '[]');
    events.push({
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString()
    });
    // 최근 50개만 저장
    localStorage.setItem('engagement_events', JSON.stringify(events.slice(-50)));
  } catch (e) {
    // 저장 실패는 무시
  }
}

// 체류 시간 신호 개선
export function improveTimeOnPage() {
  if (typeof window === 'undefined') return;

  // 관련 콘텐츠 자동 추천 시작 시간
  const contentRecommendationDelay = 15000; // 15초
  setTimeout(() => {
    trackEvent('content_recommendation_shown', {});
  }, contentRecommendationDelay);

  // 스크롤 유도 메시지 (하단 콘텐츠 있을 때)
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trackEvent('section_viewed', {
          section: entry.target.getAttribute('id') || entry.target.className
        });
      }
    });
  }, observerOptions);

  // 주요 섹션 관찰
  document.querySelectorAll('section, article, [role="main"]').forEach(el => {
    observer.observe(el);
  });
}

declare global {
  function gtag(...args: any[]): void;
}
