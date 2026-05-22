"use client";

import { motion } from "framer-motion";
import ImagePlaceholder from "../ImagePlaceholder";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const VP = { once: true, margin: "-60px" };

const cards = [
  {
    icon: "🧠",
    title: "Find your voice",
    body: "Through guided reflection, discover the confidence already inside you.",
  },
  {
    icon: "✦",
    title: "AI-supported clarity",
    body: "Your companion is available between sessions to help you process, reflect and stay on track.",
  },
  {
    icon: "🎯",
    title: "Action with accountability",
    body: "Turn insight into action with personalised steps and weekly progress reflection.",
  },
];

const pillTags = [
  "Find your voice",
  "Trust yourself",
  "Discover your superpower",
  "Clarity",
  "Confidence",
  "Action",
];

export default function Promise() {
  return (
    <section id="coaching" className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VP}
        variants={fadeUp}
        className="mb-3"
      >
        <span className="font-inter font-semibold text-lavender uppercase tracking-widest text-xs">
          How it works
        </span>
      </motion.div>

      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={VP}
        variants={fadeUp}
        className="font-poppins font-bold text-plum-dark heading-tight mb-7"
        style={{ fontSize: "clamp(28px, 3.5vw, 46px)" }}
      >
        Human coaching. AI clarity. Real transformation.
      </motion.h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VP}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        {cards.map((card) => (
          <motion.div
            key={card.title}
            variants={fadeUp}
            className="bg-white rounded-4xl p-7 shadow-soft border border-mist flex flex-col gap-4"
          >
            <span
              className="text-3xl w-12 h-12 flex items-center justify-center rounded-2xl bg-mist"
              style={{ color: card.icon === "✦" ? "#FF6F9F" : undefined }}
            >
              {card.icon}
            </span>
            <h3 className="font-poppins font-bold text-plum-dark text-lg heading-tight">
              {card.title}
            </h3>
            <p className="font-inter text-muted text-sm leading-relaxed">
              {card.body}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VP}
        variants={fadeUp}
        className="rounded-[34px] overflow-hidden grid md:grid-cols-2 gap-0"
        style={{
          background:
            "linear-gradient(135deg, #2E1A47 0%, #3D2468 60%, #4B2E83 100%)",
        }}
      >
        <div className="p-8 md:p-10 flex flex-col justify-center gap-5">
          <h2
            className="font-poppins font-bold text-white heading-tight"
            style={{ fontSize: "clamp(22px, 2.8vw, 36px)" }}
          >
            Human-led coaching. AI-supported growth.
          </h2>
          <p
            className="font-inter text-white text-sm leading-relaxed"
            style={{ opacity: 0.78 }}
          >
            Danè brings her coaching expertise to every session. Between those
            sessions, your AI companion keeps the momentum going — with
            reflective prompts, gentle check-ins and a space that&apos;s always
            available to you.
          </p>
          <div className="flex flex-wrap gap-2">
            {pillTags.map((tag) => (
              <span
                key={tag}
                className="font-inter font-medium text-xs px-3.5 py-1.5 rounded-full text-white border"
                style={{
                  borderColor: "rgba(255,111,159,0.45)",
                  background: "rgba(255,111,159,0.12)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px]">
          <ImagePlaceholder
            src="/images/about-coaching.svg"
            alt="Danè — Coaching in Action"
            label="Danè — Coaching in Action"
            fill
            className="absolute inset-0 rounded-r-[34px]"
          />
        </div>
      </motion.div>
    </section>
  );
}
