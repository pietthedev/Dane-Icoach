"use client";

interface LogoProps {
  variant?: "full" | "compact";
  onDark?: boolean;
  className?: string;
}

export default function Logo({
  variant = "full",
  onDark = false,
  className = "",
}: LogoProps) {
  const wordmarkColor = onDark ? "#FFFFFF" : "#2E1A47";

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <LogoMark size={36} onDark={onDark} />
        <div className="flex flex-col leading-none">
          <span
            className="font-poppins font-bold"
            style={{ fontSize: "15px", letterSpacing: "-0.02em", color: wordmarkColor }}
          >
            Companion
          </span>
          <span
            style={{
              fontStyle: "italic",
              fontFamily: "Georgia, serif",
              color: "#FF6F9F",
              fontSize: "11px",
            }}
          >
            by Danè
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <LogoMark size={52} onDark={onDark} />
      <span
        className="font-poppins font-bold"
        style={{ fontSize: "20px", letterSpacing: "-0.02em", color: wordmarkColor }}
      >
        Companion
      </span>
      <span
        style={{
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#FF6F9F",
          fontSize: "14px",
        }}
      >
        by Danè
      </span>
      <span
        className="uppercase tracking-widest"
        style={{
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: onDark ? "rgba(255,255,255,0.5)" : "#6E667A",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        AI Coaching Companion
      </span>
    </div>
  );
}

function LogoMark({ size = 40, onDark = false }: { size?: number; onDark?: boolean }) {
  const strokeColor = onDark ? "#FFFFFF" : "#2E1A47";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylised C letterform */}
      <path
        d="M38 16.5C35.2 10.5 29 7 22 7C12.6 7 5 14.6 5 24C5 33.4 12.6 41 22 41C29 41 35.2 37.5 38 31.5"
        stroke={strokeColor}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Diamond sparkle — plum (or lavender on dark) */}
      <path
        d="M30 20L32 24L30 28L28 24Z"
        fill={onDark ? "#B9A7E6" : "#4B2E83"}
      />
      {/* Diamond sparkle — pink accent, offset */}
      <path
        d="M33.5 17L35.5 21.5L33.5 26L31.5 21.5Z"
        fill="#FF6F9F"
        opacity="0.9"
      />
      {/* Small star dot */}
      <circle cx="29.5" cy="24" r="1.4" fill="#FF6F9F" />
    </svg>
  );
}
