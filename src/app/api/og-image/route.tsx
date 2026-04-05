import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Trending Now";
  const description = url.searchParams.get("description") || "Discover what the world is searching for";
  const country = url.searchParams.get("country") || "Global";
  const trendsParam = url.searchParams.get("trends") || "";

  // 트렌드 목록 파싱 (콤마 구분)
  const trends = trendsParam
    ? decodeURIComponent(trendsParam)
        .split(",")
        .filter((t) => t.trim())
        .slice(0, 3)
    : [];

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            padding: "60px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background elements */}
          <div
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              top: -100,
              right: -100,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              bottom: -50,
              left: -50,
            }}
          />

          {/* Main content container */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Top section */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Logo area */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginBottom: 30,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48,
                    fontWeight: "bold",
                    border: "3px solid white",
                  }}
                >
                  🌍
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: "bold",
                      letterSpacing: "-2px",
                    }}
                  >
                    IssueGlobe
                  </div>
                  <div style={{ fontSize: 18, opacity: 0.9 }}>
                    Real-Time Global Trends
                  </div>
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  marginBottom: 15,
                  lineHeight: 1.2,
                }}
              >
                {decodeURIComponent(title)}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: 24,
                  opacity: 0.95,
                  marginBottom: 25,
                  lineHeight: 1.3,
                }}
              >
                {decodeURIComponent(description)}
              </div>
            </div>

            {/* Middle section - Trending list or country badge */}
            {trends.length > 0 ? (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 20,
                  padding: "20px 30px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  📊 TOP {trends.length} TRENDING
                </div>
                {trends.map((trend, idx) => {
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                        fontSize: 20,
                        fontWeight: 500,
                        marginBottom: idx < trends.length - 1 ? 10 : 0,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{medals[idx]}</span>
                      <span style={{ flex: 1 }}>
                        {idx + 1}. {trend.substring(0, 40)}
                        {trend.length > 40 ? "..." : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255, 255, 255, 0.25)",
                  padding: "12px 28px",
                  borderRadius: 50,
                  fontSize: 18,
                  fontWeight: 600,
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                }}
              >
                📍 Trending in {decodeURIComponent(country)}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "2px solid rgba(255, 255, 255, 0.3)",
                paddingTop: 20,
                fontSize: 16,
              }}
            >
              <div>issueglobe.com</div>
              <div style={{ opacity: 0.8 }}>
                ✨ Updated Hourly • 30 Countries
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=900",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
