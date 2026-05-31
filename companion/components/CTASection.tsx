"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface CTASectionProps {
  heading?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  microcopy?: string;
}

export default function CTASection({
  heading = "Ready to find your voice?",
  body = "Join early access and be among the first to experience Companion by Danè — human-led coaching with an AI companion that's always in your corner.",
  primaryLabel = "Join early access",
  primaryHref = "/#start",
  secondaryLabel = "See how it works",
  secondaryHref = "/#coaching",
  microcopy = "Limited early-access welcome check-ins available.",
}: CTASectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="rounded-[34px] overflow-hidden p-8 md:p-12 text-center flex flex-col items-center gap-5"
        style={{
          background:
            "linear-gradient(135deg, #2E1A47 0%, #3D2468 60%, #4B2E83 100%)",
        }}
      >
        <h2
          className="font-poppins font-bold text-white heading-tight max-w-xl"
          style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
        >
          {heading}
        </h2>
        <p
          className="font-inter text-sm leading-relaxed max-w-lg"
          style={{ color: "rgba(255,255,255,0.78)" }}
        >
          {body}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={primaryHref}
            className="font-inter font-semibold text-sm text-plum-dark px-6 py-3 rounded-full bg-white hover:bg-cloud transition-colors duration-200 shadow-soft"
          >
            {primaryLabel}
          </Link>
          {secondaryLabel && (
            <Link
              href={secondaryHref || "/"}
              className="font-inter font-semibold text-sm text-white px-6 py-3 rounded-full border border-white/30 hover:border-white/60 transition-colors duration-200"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
        {microcopy && (
          <p
            className="font-inter text-xs"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {microcopy}
          </p>
        )}
      </motion.div>
    </section>
  );
}
