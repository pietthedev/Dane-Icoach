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

const cards = [
  {
    icon: "🛡",
    title: "Designed for reflection",
    body: "The companion helps users think through situations. It is not positioned as therapy, crisis support or medical advice.",
  },
  {
    icon: "🤝",
    title: "Human support built in",
    body: "Danè remains part of the journey through welcome calls, check-ins and paid human coaching touchpoints.",
  },
  {
    icon: "🔒",
    title: "Privacy by design",
    body: "Personal reflections are handled with care and clear consent before any anonymised insights are used.",
  },
  {
    icon: "💬",
    title: "No judgement",
    body: "The tone is warm, curious and supportive. The companion listens, asks better questions and helps you discover your own answers.",
  },
];

export default function Trust() {
  return (
    <section id="trust" className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VP}
        variants={fadeUp}
        className="mb-3"
      >
        <span className="font-inter font-semibold text-lavender uppercase tracking-widest text-xs">
          Trust and care
        </span>
      </motion.div>

      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={VP}
        variants={fadeUp}
        className="font-poppins font-bold text-plum-dark heading-tight mb-7 max-w-xl"
        style={{ fontSize: "clamp(28px, 3.5vw, 46px)" }}
      >
        A safe space to pause, reflect and reset.
      </motion.h2>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={VP}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {cards.map((card) => (
          <motion.div
            key={card.title}
            variants={fadeUp}
            className="bg-white rounded-4xl p-7 shadow-soft border border-mist flex flex-col gap-4"
          >
            <span className="text-3xl w-12 h-12 flex items-center justify-center rounded-2xl bg-mist">
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
    </section>
  );
}
