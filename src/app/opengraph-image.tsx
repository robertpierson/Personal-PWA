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
          backgroundColor: "#0B0B0C",
          color: "#F4F3EE",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", fontSize: 40, color: "#F4F3EE" }}>[</div>
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: "#E6B24A",
              margin: "0 10px",
            }}
          />
          <div style={{ display: "flex", fontSize: 40, color: "#F4F3EE" }}>]</div>
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
          <span style={{ color: "#E6B24A" }}>{brand.name.charAt(0)}</span>
          {brand.name.slice(1)}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#E6B24A",
            marginTop: 16,
          }}
        >
          {brand.tagline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#F4F3EE",
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
