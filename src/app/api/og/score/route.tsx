// OGP画像生成
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const score = searchParams.get("score");
    const date = searchParams.get("date");
    const message = searchParams.get("message");

    if (!score || !date || !message) {
      return new Response("Missing required parameters", { status: 400 });
    }

    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum)) {
      return new Response("Invalid score value", { status: 400 });
    }

    // スコアに応じた色を決定
    let scoreColor = "#ef4444"; // red-500
    if (scoreNum >= 80) {
      scoreColor = "#22c55e"; // green-500
    } else if (scoreNum >= 60) {
      scoreColor = "#3b82f6"; // blue-500
    } else if (scoreNum >= 40) {
      scoreColor = "#eab308"; // yellow-500
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
            fontFamily: "system-ui, sans-serif",
            padding: "60px",
          }}
        >
          {/* タイトル */}
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#1e40af",
              marginBottom: 40,
              display: "flex",
            }}
          >
            Climode
          </div>

          {/* メインカード */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: "60px 80px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
              width: "90%",
              maxWidth: 900,
            }}
          >
            {/* 日付 */}
            <div
              style={{
                fontSize: 28,
                color: "#64748b",
                marginBottom: 30,
                display: "flex",
              }}
            >
              {date}
            </div>

            {/* スコア表示 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  color: "#1e40af",
                  marginBottom: 10,
                  display: "flex",
                }}
              >
                体調スコア
              </div>
              <div
                style={{
                  fontSize: 120,
                  fontWeight: "bold",
                  color: scoreColor,
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                {score}
                <span
                  style={{
                    fontSize: 48,
                    marginLeft: 10,
                    color: "#64748b",
                  }}
                >
                  点
                </span>
              </div>
            </div>

            {/* スコアバー */}
            <div
              style={{
                width: "100%",
                height: 24,
                background: "#dbeafe",
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 40,
                display: "flex",
              }}
            >
              <div
                style={{
                  width: `${Math.min(Math.max(scoreNum, 0), 100)}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, #f87171 0%, #fbbf24 50%, #4ade80 100%)`,
                  borderRadius: 12,
                  display: "flex",
                }}
              />
            </div>

            {/* メッセージ */}
            <div
              style={{
                fontSize: 36,
                color: "#1e293b",
                fontWeight: "600",
                display: "flex",
                textAlign: "center",
              }}
            >
              {message}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
