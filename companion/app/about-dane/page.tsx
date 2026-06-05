import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "About Danè | Human-Led Coaching Behind Companion",
  description:
    "Meet Danè de Klerk — the coach and founder behind Companion by Danè. Human-led coaching, integral approach, and a belief that every person has a voice worth finding.",
  alternates: { canonical: "https://companionai.coach/about-dane" },
  openGraph: {
    title: "About Danè | Human-Led Coaching Behind Companion",
    description:
      "Meet Danè de Klerk — the coach and founder behind Companion by Danè. Human-led coaching, integral approach, and a belief that every person has a voice worth finding.",
    url: "https://companionai.coach/about-dane",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Danè de Klerk",
  jobTitle: "Coach",
  description:
    "Danè de Klerk is the founder and coach behind Companion by Danè, a human-led AI-supported coaching platform focused on confidence, clarity, self-trust and personal growth.",
  url: "https://companionai.coach/about-dane",
  worksFor: {
    "@type": "OnlineBusiness",
    name: "Companion by Danè",
    url: "https://companionai.coach",
  },
};

const pillars = [
  {
    icon: "🧠",
    title: "Head — thinking clearly",
    body: "Understanding your patterns, beliefs and narratives so you can choose differently.",
  },
  {
    icon: "❤️",
    title: "Heart — feeling honestly",
    body: "Acknowledging what you feel without being controlled by it.",
  },
  {
    icon: "🌱",
    title: "Body — acting purposefully",
    body: "Turning insight into grounded, intentional action in the real world.",
  },
];

const values = [
  "Coaching is a conversation, not a prescription.",
  "Reflection is the beginning of change.",
  "Your voice matters — and it can be found.",
  "Human support and AI support work best together.",
  "Trust is built through small, honest steps.",
];

export default function AboutDanePage() {
  return (
    <>
      <StructuredData data={personSchema} />
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "About Danè", href: "/about-dane" }]} />
      <PageHero
        eyebrow="About Danè"
        heading="The human behind the companion"
        lead="Companion by Danè was built on a simple belief: every person has a voice worth finding, a confidence worth building, and a superpower waiting to be uncovered. Danè de Klerk is the coach behind the platform."
      />

      {/* Who Danè is */}
      <section className="max-w-7xl mx-auto px-6 pb-10 md:pb-14">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-5">
            <h2
              className="font-poppins font-bold text-plum-dark heading-tight"
              style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
            >
              A coaching approach rooted in reflection
            </h2>
            <p className="font-inter text-muted text-base leading-relaxed">
              Danè de Klerk is a coach with a deep commitment to the integral
              coaching methodology — a whole-person approach that works with
              head, heart and body together. Rather than giving answers, Danè
              asks better questions, creating a space where clients can pause,
              reflect, and discover their own clarity.
            </p>
            <p className="font-inter text-muted text-base leading-relaxed">
              This platform grew from a conviction that meaningful growth
              shouldn&apos;t only happen in a 60-minute session. It should be
              available between sessions too — in quiet moments, difficult
              mornings and uncertain conversations. That&apos;s where the AI
              companion comes in.
            </p>
            <p className="font-inter text-muted text-base leading-relaxed">
              Danè remains the human anchor of every journey. The AI companion
              supports reflection between sessions — it never replaces the human
              relationship.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="rounded-[30px] p-7 flex flex-col gap-5"
              style={{
                background:
                  "linear-gradient(135deg, #2E1A47 0%, #4B2E83 100%)",
              }}
            >
              <span className="font-inter font-semibold text-xs uppercase tracking-widest" style={{ color: "#FF6F9F" }}>
                Coaching philosophy
              </span>
              <blockquote className="font-poppins font-bold text-white heading-tight" style={{ fontSize: "clamp(18px, 2.2vw, 26px)" }}>
                &ldquo;When you understand yourself better, you don&apos;t just
                perform better — you live more fully.&rdquo;
              </blockquote>
              <p className="font-inter text-sm" style={{ color: "rgba(255,255,255,0.65)", fontStyle: "italic" }}>
                — Danè de Klerk
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-mist shadow-soft">
              <p className="font-inter font-semibold text-plum-dark text-sm mb-3">
                What Danè believes about coaching:
              </p>
              <ul className="flex flex-col gap-2.5">
                {values.map((v) => (
                  <li key={v} className="flex items-start gap-2.5 font-inter text-sm text-muted">
                    <span aria-hidden="true" style={{ color: "#FF6F9F", flexShrink: 0, marginTop: "2px" }}>✓</span>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Integral approach */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="mb-3">
          <span className="font-inter font-semibold text-lavender uppercase tracking-widest text-xs">
            The approach
          </span>
        </div>
        <h2
          className="font-poppins font-bold text-plum-dark heading-tight mb-7 max-w-xl"
          style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
        >
          Integral coaching — head, heart and body
        </h2>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white rounded-4xl p-7 shadow-soft border border-mist flex flex-col gap-4"
            >
              <span aria-hidden="true" className="text-3xl w-12 h-12 flex items-center justify-center rounded-2xl bg-mist">
                {pillar.icon}
              </span>
              <h3 className="font-poppins font-bold text-plum-dark text-lg heading-tight">
                {pillar.title}
              </h3>
              <p className="font-inter text-muted text-sm leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[28px] p-7 border border-mist shadow-soft max-w-2xl">
          <p className="font-inter text-muted text-base leading-relaxed">
            Integral coaching is not about fixing what&apos;s broken. It&apos;s
            about understanding what&apos;s already there — and helping it grow.
            The approach honours the whole person: your thinking, your feeling
            and your doing. Sessions create a safe space to explore all three,
            without judgement.
          </p>
          <p className="font-inter text-muted text-base leading-relaxed mt-4">
            Coaching is not therapy. It does not diagnose, treat or manage
            mental-health conditions. If you need clinical support, please
            consult a qualified psychologist or mental-health professional.
          </p>
        </div>
      </section>

      {/* Human-led + AI-supported model */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div
          className="rounded-[34px] p-8 md:p-10"
          style={{ background: "linear-gradient(135deg, #F3D7E6, #E8E1F7)" }}
        >
          <span className="font-inter font-semibold text-xs uppercase tracking-widest mb-3 block" style={{ color: "#4B2E83" }}>
            Why human-led matters
          </span>
          <h2
            className="font-poppins font-bold text-plum-dark heading-tight mb-4 max-w-2xl"
            style={{ fontSize: "clamp(22px, 2.8vw, 36px)" }}
          >
            Always available. Never replacing the human relationship.
          </h2>
          <p className="font-inter text-ink text-base leading-relaxed max-w-2xl">
            The AI companion is a reflection partner — available between
            sessions, always patient, always private. But it is Danè who holds
            the human coaching relationship. She brings context, care, lived
            experience and professional coaching skill to every interaction.
            Together, the human and AI elements create something more powerful
            than either could alone: continuity, depth and real growth.
          </p>
        </div>
      </section>

      <CTASection
        heading="Ready to start your journey with Danè?"
        body="Join early access and be among the first to experience Companion by Danè — human-led coaching with an AI companion that's always in your corner."
        secondaryLabel="Explore the approach"
        secondaryHref="/integral-coaching"
      />
      <Footer />
    </>
  );
}
