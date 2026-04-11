"use client";

import { useEffect } from "react";

export default function IPLogger() {
  useEffect(() => {
    // IP 정보 수집 (내부 분석용, 콘솔 노출 없음)
    fetch("/api/ip-info").catch(() => {});
  }, []);

  return null;
}
