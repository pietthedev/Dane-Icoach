"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  eyebrow: string;
  heading: string;
  lead: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function PageHero({
  eyebrow,
  heading,
  lead,
  ctaLabel,
  ctaHref,
}: PageHeroProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-10 pb-12 md:pt-14 md:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <span className="inline-block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-4">
          {eyebrow}
        </span>
        <h1
          className="font-poppins font-bold text-plum-dark heading-tight mb-5"
          style={{ fontSize: "clamp(32px, 4.5vw, 58px)" }}
        >
          {heading}
        </h1>
        <p className="font-inter text-muted text-lg leading-relaxed mb-6 max-w-2xl">
          {lead}
        </p>
        {ctaLabel && ctaHref && (
          <a
            href={ctaHref}
            className="inline-flex font-inter font-semibold text-sm text-white px-6 py-3 rounded-full bg-plum-dark hover:bg-plum transition-colors duration-200 shadow-soft"
          >
            {ctaLabel}
          </a>
        )}
      </motion.div>
    </section>
  );
}
