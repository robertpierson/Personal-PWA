import { ImageResponse } from "next/og";
import { brand } from "@/content/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#1b3a6b",
          color: "#f2f0e8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            border: "3px solid #b8862e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          M
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
          {brand.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#e8d6a0",
            marginTop: 16,
          }}
        >
          {brand.tagline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#f2f0e8",
            opacity: 0.85,
            marginTop: 40,
            maxWidth: 900,
          }}
        >
          More donors say yes. More volunteers show up.
        </div>
      </div>
    ),
    { ...size },
  );
}
