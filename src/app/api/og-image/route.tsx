import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Trending Now";
  const description =
    url.searchParams.get("description") || "Discover what the world is searching for";
  const country = url.searchParams.get("country") || "Global";

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
            textAlign: "center",
            justifyContent: "space-between",
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

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1, marginTop: 20 }}>
            {/* Logo area */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 40,
                gap: 20,
              }}
            >
              {/* Globe icon */}
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
                  borderWidth: 3,
                  borderColor: "white",
                  borderStyle: "solid",
                }}
              >
                🌍
              </div>
              <div style={{ textAlign: "left" }}>
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
                fontSize: 56,
                fontWeight: 900,
                marginBottom: 20,
                lineHeight: 1.2,
                maxWidth: "90%",
                margin: "0 auto 20px",
              }}
            >
              {decodeURIComponent(title)}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 28,
                opacity: 0.95,
                marginBottom: 30,
                maxWidth: "90%",
                margin: "0 auto 30px",
                lineHeight: 1.3,
              }}
            >
              {decodeURIComponent(description)}
            </div>

            {/* Country badge */}
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
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1,
              borderTop: "2px solid rgba(255, 255, 255, 0.3)",
              paddingTop: 30,
              fontSize: 16,
            }}
          >
            <div>issueglobe.com</div>
            <div style={{ opacity: 0.8 }}>
              ✨ Updated Hourly • 30 Countries
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=3600",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
