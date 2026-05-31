import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "#2E1A47",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 10.5C22.1 7 18.7 5 15 5C9.5 5 5 9.5 5 15C5 20.5 9.5 25 15 25C18.7 25 22.1 23 24 19.5"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M20 13L21.3 15.5L20 18L18.7 15.5Z" fill="#7E64B5" />
          <path d="M22 11L23.3 14L22 17L20.7 14Z" fill="#FF6F9F" opacity="0.95" />
          <circle cx="19.8" cy="15.5" r="1" fill="#FF6F9F" />
        </svg>
      </div>
    ),
    { ...size }
  );
}