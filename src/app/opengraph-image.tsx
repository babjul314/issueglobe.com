import { ImageResponse } from "next/og";

export const alt = "IssueGlobe - Real-Time Global Trending Topics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
          color: "white",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              fontSize: 36,
            }}
          >
            🌍
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 900 }}>IssueGlobe</div>
            <div style={{ display: "flex", fontSize: 16, opacity: 0.8 }}>Real-Time Global Trends</div>
          </div>
        </div>

        {/* Main message */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 900, lineHeight: 1.1 }}>
            30개국 실시간 검색어
          </div>
          <div style={{ display: "flex", fontSize: 26, opacity: 0.85 }}>
            전 세계가 지금 무엇을 검색하는지 한눈에 확인하세요
          </div>
        </div>

        {/* Flags row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", fontSize: 40 }}>🇺🇸</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇰🇷</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇯🇵</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇩🇪</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇬🇧</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇫🇷</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇧🇷</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇮🇳</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇨🇦</div>
          <div style={{ display: "flex", fontSize: 40 }}>🇦🇺</div>
          <div style={{ display: "flex", fontSize: 20, opacity: 0.75, marginLeft: 8 }}>+20 more</div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            paddingTop: 20,
            fontSize: 16,
            opacity: 0.75,
          }}
        >
          <div style={{ display: "flex" }}>issueglobe.com</div>
          <div style={{ display: "flex" }}>매시간 업데이트 · 무료</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
