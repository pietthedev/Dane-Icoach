"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";

const VP = { once: true, margin: "-60px" };

const options = [
  { value: "", label: "I am interested in..." },
  { value: "free", label: "Free starter journey" },
  { value: "monthly", label: "Monthly coaching companion" },
  { value: "human", label: "Human coaching with Danè" },
  { value: "team", label: "Team or company package" },
];

export default function WaitlistCTA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  }

  return (
    <section id="start" className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.5 }}
        className="rounded-[34px] overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #2E1A47 0%, #3D2468 60%, #4B2E83 100%)",
        }}
      >
        <div className="grid md:grid-cols-2 gap-0 p-8 md:p-10 items-center">
          <div className="flex flex-col gap-5 md:pr-12">
            <span
              className="font-inter font-semibold uppercase tracking-widest text-xs"
              style={{ color: "#FF6F9F" }}
            >
              Start your journey
            </span>
            <h2
              className="font-poppins font-bold text-white heading-tight"
              style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
            >
              Ready to explore what your voice, confidence and superpower can
              become?
            </h2>
            <p
              className="font-inter text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              Join early access and be among the first to experience Companion
              by Danè — human-led coaching with an AI companion that&apos;s
              always in your corner.
            </p>
          </div>

          <div className="mt-8 md:mt-0">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[28px] p-8 flex flex-col items-center gap-3 text-center shadow-strong"
              >
                <span className="text-4xl">✨</span>
                <h3 className="font-poppins font-bold text-plum-dark text-xl heading-tight">
                  You&apos;re on the list!
                </h3>
                <p
                  className="font-inter text-sm leading-relaxed"
                  style={{ color: "#FF6F9F" }}
                >
                  Thank you — we&apos;ll be in touch soon.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-[28px] p-7 flex flex-col gap-4 shadow-strong"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-lavender transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-lavender transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">
                    Interest
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-lavender transition-colors appearance-none"
                  >
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full font-inter font-semibold text-sm text-white py-3.5 rounded-2xl bg-plum-dark hover:bg-plum transition-colors duration-200 shadow-soft mt-1"
                >
                  Join early access
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
