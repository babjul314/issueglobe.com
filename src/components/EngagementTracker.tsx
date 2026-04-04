'use client';

import { useEffect } from 'react';
import { trackEngagement, improveTimeOnPage } from '@/lib/analytics';

export default function EngagementTracker() {
  useEffect(() => {
    // 사용자 신호 추적 시작
    trackEngagement();
    improveTimeOnPage();

    console.log('Engagement tracking initialized');
  }, []);

  return null; // UI 렌더링 없음
}
