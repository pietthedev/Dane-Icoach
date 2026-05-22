"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const VP = { once: true, margin: "-60px" };

const steps = [
  {
    number: "01",
    title: "Discover",
    body: "Take the superpower assessment and identify what makes you uniquely powerful.",
  },
  {
    number: "02",
    title: "Reflect",
    body: "Use guided daily prompts to build self-awareness and confidence.",
  },
  {
    number: "03",
    title: "Act",
    body: "Turn insights into small, powerful daily actions.",
  },
  {
    number: "04",
    title: "Grow",
    body: "Check in with Danè for human coaching to deepen your growth.",
  },
];

export default function Journey() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VP}
        variants={fadeUp}
        className="mb-3"
      >
        <span className="font-inter font-semibold text-lavender uppercase tracking-widest text-xs">
          Your journey
        </span>
      </motion.div>

      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={VP}
        variants={fadeUp}
        className="font-poppins font-bold text-plum-dark heading-tight mb-12"
        style={{ fontSize: "clamp(28px, 3.5vw, 46px)" }}
      >
        Four steps to clarity and confidence
      </motion.h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VP}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={fadeUp}
            className="bg-white rounded-4xl p-7 shadow-soft border border-mist flex flex-col gap-5 relative overflow-hidden"
          >
            <span
              className="absolute -top-3 -right-2 font-poppins font-bold text-mist select-none pointer-events-none"
              style={{ fontSize: "72px", lineHeight: 1, opacity: 0.7 }}
              aria-hidden="true"
            >
              {step.number}
            </span>

            <div className="w-10 h-10 rounded-xl bg-plum-dark flex items-center justify-center">
              <span className="font-poppins font-bold text-white text-sm">
                {step.number}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-poppins font-bold text-plum-dark text-xl heading-tight">
                {step.title}
              </h3>
              <p className="font-inter text-muted text-sm leading-relaxed">
                {step.body}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
