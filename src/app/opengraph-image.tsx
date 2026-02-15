import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Climode - 体調管理アプリ";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#1e40af",
            marginBottom: 16,
          }}
        >
          Climode
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#4b5563",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          体調と気候のリズムを可視化する
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#6b7280",
            marginTop: 12,
          }}
        >
          健康管理アプリ
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
