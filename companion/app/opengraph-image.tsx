import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Companion by Danè — AI Coaching Companion";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#2E1A47",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(75,46,131,0.9) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(126,100,181,0.4) 0%, transparent 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <svg width="100" height="100" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38 16.5C35.2 10.5 29 7 22 7C12.6 7 5 14.6 5 24C5 33.4 12.6 41 22 41C29 41 35.2 37.5 38 31.5" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M30 20L32 24L30 28L28 24Z" fill="#B9A7E6" />
            <path d="M33.5 17L35.5 21.5L33.5 26L31.5 21.5Z" fill="#FF6F9F" opacity="0.95" />
            <circle cx="29.5" cy="24" r="1.4" fill="#FF6F9F" />
          </svg>
        </div>
        <div style={{ fontSize: 80, fontWeight: "bold", color: "white", letterSpacing: "-2px", lineHeight: 1, marginBottom: 12 }}>
          Companion
        </div>
        <div style={{ fontSize: 38, fontStyle: "italic", color: "#FF6F9F", marginBottom: 36 }}>
          by Danè
        </div>
        <div style={{ width: 280, height: 1, background: "rgba(126,100,181,0.5)", marginBottom: 32 }} />
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.72)", letterSpacing: "0.3px" }}>
          Human-led coaching. AI-supported growth.
        </div>
        <div style={{ position: "absolute", bottom: 48, fontSize: 18, color: "rgba(255,111,159,0.6)", letterSpacing: "4px" }}>
          AI COACHING COMPANION
        </div>
      </div>
    ),
    { ...size }
  );
}