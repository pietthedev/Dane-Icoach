"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const bubbleVariant = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const VP = { once: true, margin: "-60px" };

const messages = [
  {
    role: "ai",
    text: "Hi, I'm here to support you. What's on your mind today?",
  },
  {
    role: "user",
    text: "I feel stuck and not confident before a difficult conversation.",
  },
  {
    role: "ai",
    text: "Let's slow it down. What outcome would feel grounded, honest and respectful for you?",
  },
  { role: "user", text: "I want to speak up without sounding defensive." },
  {
    role: "ai",
    text: "Good. Let's explore what you want to say, what is triggering you, and what your strongest voice sounds like.",
  },
];

export default function Demo() {
  return (
    <section id="demo" className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* LEFT — Chat mockup */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={fadeUp}
          className="bg-white rounded-[30px] shadow-strong overflow-hidden flex flex-col"
          style={{ minHeight: "480px" }}
        >
          {/* Chat header */}
          <div
            className="px-5 py-4 flex items-center gap-3 border-b border-mist"
            style={{ background: "#FDFCFF" }}
          >
            <div className="w-9 h-9 rounded-xl bg-mist flex items-center justify-center">
              <span className="text-lg" style={{ color: "#FF6F9F" }}>
                ✦
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-poppins font-bold text-plum-dark text-sm">
                Companion by Danè
              </span>
              <span
                className="font-inter text-muted"
                style={{ fontSize: "11px" }}
              >
                AI Coaching Companion
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="font-inter text-xs text-muted">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 px-5 py-5 flex flex-col gap-3 overflow-hidden">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={VP}
              className="flex flex-col gap-3"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  variants={bubbleVariant}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="font-inter text-sm leading-relaxed px-4 py-2.5 max-w-[80%]"
                    style={{
                      borderRadius:
                        msg.role === "ai"
                          ? "6px 18px 18px 18px"
                          : "18px 6px 18px 18px",
                      background:
                        msg.role === "ai"
                          ? "#F6F0FB"
                          : "linear-gradient(135deg, #4B2E83, #2E1A47)",
                      color: msg.role === "ai" ? "#2E2A36" : "#fff",
                    }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Input bar */}
          <div className="px-5 py-4 border-t border-mist">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-mist bg-cloud">
              <span className="font-inter text-muted text-sm flex-1 select-none">
                Message your companion...
              </span>
              <button
                className="w-8 h-8 rounded-xl bg-plum-dark flex items-center justify-center flex-shrink-0"
                aria-label="Send"
                disabled
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                  <path
                    d="M2 7h10M7 2l5 5-5 5"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Reflection card */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VP}
          variants={fadeUp}
          className="flex flex-col gap-5 pt-0"
        >
          <span className="font-inter font-semibold text-lavender uppercase tracking-widest text-xs">
            Today&apos;s reflection
          </span>

          <h3
            className="font-poppins font-bold text-plum-dark heading-tight"
            style={{ fontSize: "clamp(22px, 2.5vw, 30px)" }}
          >
            What is one small step you can take towards your superpower today?
          </h3>

          <div className="bg-white rounded-4xl p-7 shadow-soft border border-mist flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-inter font-semibold text-plum-dark text-sm">
                  Progress this week
                </span>
                <span className="font-inter font-semibold text-lavender text-sm">
                  65%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-mist overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "65%",
                    background: "linear-gradient(90deg, #4B2E83, #7E64B5)",
                  }}
                />
              </div>
            </div>

            <p className="font-inter text-muted text-sm leading-relaxed">
              Confidence, clarity and self-trust are built through small moments
              of reflection. Every prompt you answer, every insight you log, is
              a step forward.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {["Confidence", "Clarity", "Self-trust"].map((tag) => (
                <span
                  key={tag}
                  className="font-inter font-medium text-xs px-3 py-1.5 rounded-full bg-mist text-lavender"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-4xl p-6"
            style={{
              background: "linear-gradient(135deg, #F3D7E6, #E8E1F7)",
            }}
          >
            <p className="font-inter text-ink text-sm leading-relaxed">
              <span className="font-semibold text-plum-dark">
                ✦ Daily prompt:{" "}
              </span>
              Describe one moment this week when you spoke your truth. How did
              it feel?
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
