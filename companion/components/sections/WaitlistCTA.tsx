"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";

const VP = { once: true, margin: "-60px" };

const options = [
  { value: "", label: "I am interested in..." },
  { value: "Free starter journey", label: "Free starter journey" },
  { value: "Monthly coaching companion", label: "Monthly coaching companion" },
  { value: "Human coaching with Danè", label: "Human coaching with Danè" },
  { value: "Team or company package", label: "Team or company package" },
];

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistCTA() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, interest }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setStatus("error");
    }
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
          {/* Left copy */}
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

          {/* Right: form / success / error */}
          <div className="mt-8 md:mt-0">
            {status === "success" ? (
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
                  <label htmlFor="waitlist-name" className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    id="waitlist-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    autoComplete="given-name"
                    disabled={status === "loading"}
                    className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-lavender transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="waitlist-email" className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    disabled={status === "loading"}
                    className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-lavender transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="waitlist-interest" className="font-inter font-semibold text-plum-dark text-xs uppercase tracking-wide">
                    Interest
                  </label>
                  <select
                    id="waitlist-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    disabled={status === "loading"}
                    className="font-inter text-sm text-ink border border-mist rounded-2xl px-4 py-3 bg-cloud focus:outline-none focus:border-lavender transition-colors appearance-none disabled:opacity-60"
                  >
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Consent checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    id="waitlist-consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    disabled={status === "loading"}
                    className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-mist accent-plum-dark disabled:opacity-60 cursor-pointer"
                  />
                  <label
                    htmlFor="waitlist-consent"
                    className="font-inter text-xs text-muted leading-relaxed cursor-pointer"
                  >
                    I agree to be contacted about Companion by Danè and
                    understand this is a coaching service, not therapy or
                    emergency support.
                  </label>
                </div>

                {/* Error message */}
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-inter text-xs rounded-xl px-3 py-2.5 text-center"
                    style={{
                      color: "#c0392b",
                      background: "#fdf0ef",
                      border: "1px solid #f5c6c2",
                    }}
                  >
                    {errorMsg}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full font-inter font-semibold text-sm text-white py-3.5 rounded-2xl bg-plum-dark hover:bg-plum transition-colors duration-200 shadow-soft mt-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    "Join early access"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
