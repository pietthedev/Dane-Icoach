"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StructuredData from "./StructuredData";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  heading?: string;
  eyebrow?: string;
  withSchema?: boolean;
}

export default function FAQSection({
  faqs,
  heading = "Frequently asked questions",
  eyebrow = "Questions",
  withSchema = true,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      {withSchema && <StructuredData data={schema} />}

      <span className="block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-3">
        {eyebrow}
      </span>
      <h2
        className="font-poppins font-bold text-plum-dark heading-tight mb-8 max-w-2xl"
        style={{ fontSize: "clamp(26px, 3vw, 40px)" }}
      >
        {heading}
      </h2>

      <div className="max-w-3xl flex flex-col divide-y divide-mist">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-start justify-between gap-4 text-left group"
                aria-expanded={isOpen}
              >
                <span className="font-poppins font-semibold text-plum-dark text-base leading-snug group-hover:text-plum transition-colors">
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-mist flex items-center justify-center transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                  style={{ color: "#4B2E83", fontSize: "14px", lineHeight: 1 }}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="font-inter text-muted text-sm leading-relaxed pt-3 pr-8">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
