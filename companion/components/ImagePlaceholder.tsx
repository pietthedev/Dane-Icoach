"use client";

import Image from "next/image";
import { useState } from "react";

interface ImagePlaceholderProps {
  src: string;
  alt: string;
  label: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

function svgSrc(src: string) {
  return src.replace(/\.(jpg|jpeg|png)$/i, ".svg");
}

export default function ImagePlaceholder({
  src,
  alt,
  label,
  width,
  height,
  fill,
  className = "",
  priority = false,
}: ImagePlaceholderProps) {
  const [errored, setErrored] = useState(false);
  const showBadge = process.env.NODE_ENV !== "production";
  const resolvedSrc = errored ? svgSrc(src) : src;
  const isSvg = resolvedSrc.endsWith(".svg");

  return (
    // When fill=true, let the className control position (don't override with inline style)
    <div
      className={`overflow-hidden ${className}`}
      style={fill ? undefined : { position: "relative", width, height }}
    >
      {/* Gradient background — always visible beneath image */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #E8E1F7 0%, #F3D7E6 100%)",
          zIndex: 0,
        }}
      />

      {fill ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          className="object-cover"
          style={{ zIndex: 1 }}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => !errored && setErrored(true)}
          unoptimized={isSvg}
        />
      ) : (
        <Image
          src={resolvedSrc}
          alt={alt}
          width={width!}
          height={height!}
          className="object-cover w-full h-full"
          style={{ zIndex: 1, position: "relative" }}
          priority={priority}
          onError={() => !errored && setErrored(true)}
          unoptimized={isSvg}
        />
      )}

      {showBadge && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <span
            className="text-white text-center rounded-xl px-3 py-1.5"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "11px",
              lineHeight: "1.4",
              background: "rgba(46,26,71,0.82)",
              backdropFilter: "blur(6px)",
              maxWidth: "90%",
            }}
          >
            📸 {label}
          </span>
        </div>
      )}
    </div>
  );
}
