"use client";

import { motion } from "framer-motion";
import ImagePlaceholder from "../ImagePlaceholder";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Hero() {
  const line1 = "Your growth,".split(" ");
  const line2 = ["supported."];

  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-20 md:pb-28">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mist text-plum-dark font-inter font-semibold text-sm">
              <span style={{ color: "#FF6F9F" }}>✦</span>
              AI Coaching Companion
            </span>
          </motion.div>

          {/* H1 with staggered words */}
          <div>
            <motion.h1
              className="font-poppins font-bold text-plum-dark heading-tight"
              style={{ fontSize: "clamp(44px, 6vw, 78px)" }}
            >
              <motion.span
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-x-4"
              >
                {line1.map((word, i) => (
                  <motion.span key={i} variants={wordVariant}>
                    {word}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-x-4 mt-1"
              >
                {line2.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordVariant}
                    style={{
                      background:
                        "linear-gradient(90deg, #2E1A47 0%, #7654BF 55%, #FF6F9F 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>
          </div>

          {/* Lead paragraph */}
          <motion.p
            variants={fadeUp}
            className="font-inter text-muted text-lg leading-relaxed max-w-lg"
          >
            Companion by Danè is a human-led coaching experience, powered by an
            always-on AI companion that supports you between sessions — with
            clarity, reflection and purpose.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <a
              href="#start"
              className="font-inter font-semibold text-sm text-white px-6 py-3 rounded-full bg-plum-dark hover:bg-plum transition-colors duration-200 shadow-soft"
            >
              Start Your Journey
            </a>
            <a
              href="#coaching"
              className="font-inter font-semibold text-sm text-plum-dark px-6 py-3 rounded-full bg-white border border-mist hover:border-lavender transition-colors duration-200 shadow-card"
            >
              Learn More
            </a>
          </motion.div>

          {/* Proof badges */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-3 pt-1"
          >
            {[
              { icon: "🤝", label: "Human-led" },
              { icon: "✦", label: "AI-powered" },
              { icon: "🔒", label: "Private & safe" },
            ].map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-mist font-inter text-sm text-ink shadow-card"
              >
                <span style={{ color: "#FF6F9F" }}>{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
          style={{ borderRadius: "38px" }}
        >
          <div
            className="relative overflow-hidden bg-white shadow-strong"
            style={{ borderRadius: "38px", height: "515px" }}
          >
            {/* Portrait */}
            <ImagePlaceholder
              src="/images/hero-portrait.svg"
              alt="Danè — Hero Portrait"
              label="Danè — Portrait (Warm, Natural)"
              fill
              className="absolute inset-0"
              priority
            />

            {/* Floating badge top-right */}
            <div
              className="absolute top-5 right-5 bg-white text-plum-dark font-inter font-semibold text-xs px-3.5 py-2 rounded-2xl shadow-soft flex items-center gap-1.5"
              style={{ zIndex: 5 }}
            >
              <span style={{ color: "#FF6F9F" }}>✦</span>
              AI Coaching Companion
            </div>

            {/* Bottom overlay quote */}
            <div
              className="absolute bottom-0 left-0 right-0 px-6 py-5"
              style={{
                background: "rgba(46,26,71,0.88)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "0 0 30px 30px",
                zIndex: 5,
              }}
            >
              <p
                className="font-inter text-white text-sm leading-relaxed mb-2"
                style={{ opacity: 0.92 }}
              >
                &ldquo;When you understand your AI, you have a companion for
                clarity to support your growth.&rdquo;
              </p>
              <span
                style={{
                  fontStyle: "italic",
                  fontFamily: "Georgia, serif",
                  color: "#FF6F9F",
                  fontSize: "15px",
                }}
              >
                Danè
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
