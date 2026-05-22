"use client";

import { motion } from "framer-motion";

const VP = { once: true, margin: "-60px" };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const plans = [
  {
    name: "Start",
    price: "Free",
    priceNote: "",
    featured: false,
    badge: null,
    features: [
      "Limited AI companion access",
      "Discover your superpower exercise",
      "Once-off 10-min welcome check-in with Danè",
      "Limited weekly slots",
    ],
    cta: "Start free",
    ctaStyle: "ghost",
    href: "#start",
  },
  {
    name: "Explorer",
    price: "R99",
    priceNote: "/mo",
    featured: false,
    badge: null,
    features: [
      "AI companion access",
      "Guided reflection journeys",
      "Confidence and voice prompts",
      "Monthly progress summary",
    ],
    cta: "Join waitlist",
    ctaStyle: "ghost",
    href: "#start",
  },
  {
    name: "Grow",
    price: "R249",
    priceNote: "/mo",
    featured: true,
    badge: "Best start",
    features: [
      "Everything in Explorer",
      "Monthly 10–15 min Danè check-in",
      "Personal focus theme",
      "Priority early access",
    ],
    cta: "Choose Grow",
    ctaStyle: "primary",
    href: "#start",
  },
  {
    name: "Voice",
    price: "Custom",
    priceNote: "",
    featured: false,
    badge: null,
    features: [
      "AI companion",
      "Monthly human coaching session",
      "Personal development focus",
      "Ideal for serious growth",
    ],
    cta: "Request info",
    ctaStyle: "ghost",
    href: "#start",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.5 }}
        className="mb-3"
      >
        <span className="font-inter font-semibold text-lavender uppercase tracking-widest text-xs">
          Packages
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="font-poppins font-bold text-plum-dark heading-tight mb-7 max-w-2xl"
        style={{ fontSize: "clamp(28px, 3.5vw, 46px)" }}
      >
        More Danè time in the startup phase. More trust from day one.
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VP}
            className="relative flex flex-col bg-white rounded-4xl p-7 shadow-soft"
            style={{
              border: plan.featured
                ? "2px solid #4B2E83"
                : "1px solid #E8E1F7",
            }}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="font-inter font-semibold text-white text-xs px-3.5 py-1.5 rounded-full bg-plum-dark shadow-soft whitespace-nowrap">
                  ⭐ {plan.badge}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-5 flex-1">
              <div>
                <h3 className="font-poppins font-bold text-plum-dark text-xl heading-tight mb-3">
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1">
                  <span
                    className="font-poppins font-bold text-plum-dark heading-tight"
                    style={{ fontSize: "32px" }}
                  >
                    {plan.price}
                  </span>
                  {plan.priceNote && (
                    <span className="font-inter text-muted text-sm mb-1.5">
                      {plan.priceNote}
                    </span>
                  )}
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2.5 font-inter text-sm text-muted"
                  >
                    <span
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: "#FF6F9F" }}
                    >
                      ✓
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`mt-auto w-full text-center font-inter font-semibold text-sm py-2.5 rounded-2xl transition-colors duration-200 ${
                  plan.ctaStyle === "primary"
                    ? "bg-plum-dark text-white hover:bg-plum shadow-soft"
                    : "border border-mist text-plum-dark bg-cloud hover:border-lavender"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
