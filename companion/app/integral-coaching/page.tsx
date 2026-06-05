import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Integral Coaching | Head, Heart & Body Approach",
  description:
    "Integral coaching works with your whole self — thinking, feeling and doing. Discover how Danè's approach helps you build clarity, confidence and purposeful action.",
  alternates: { canonical: "https://companionai.coach/integral-coaching" },
  openGraph: {
    title: "Integral Coaching | Head, Heart & Body Approach",
    description:
      "Integral coaching works with your whole self — thinking, feeling and doing. Discover how Danè's approach helps you build clarity, confidence and purposeful action.",
    url: "https://companionai.coach/integral-coaching",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Integral Coaching",
  serviceType: "Coaching",
  provider: {
    "@type": "OnlineBusiness",
    name: "Companion by Danè",
    url: "https://companionai.coach",
  },
  areaServed: [
    { "@type": "Country", name: "South Africa" },
    { "@type": "AdministrativeArea", name: "Global / Online" },
  ],
  description:
    "Integral coaching is a whole-person approach that works with thinking, feeling and action together to create lasting personal growth.",
  url: "https://companionai.coach/integral-coaching",
};

const differences = [
  {
    label: "Coaching",
    description:
      "Works with healthy, capable adults to move forward — exploring goals, building awareness and creating intentional action.",
  },
  {
    label: "Therapy",
    description:
      "A clinical service that addresses mental-health conditions, psychological distress and past trauma, delivered by a licensed clinician.",
  },
  {
    label: "Mentoring",
    description:
      "Shares knowledge and experience from a more senior practitioner. Coaching is non-directive — the client holds their own answers.",
  },
  {
    label: "Consulting",
    description:
      "Provides expert solutions and recommendations. Coaching believes the client already holds the capacity for their own solutions.",
  },
];

export default function IntegralCoachingPage() {
  return (
    <>
      <StructuredData data={serviceSchema} />
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "Integral Coaching", href: "/integral-coaching" }]} />
      <PageHero
        eyebrow="The approach"
        heading="Integral coaching — working with your whole self"
        lead="Integral coaching is not about fixing what's broken. It's about understanding what's already there — your thinking, your feeling, your doing — and helping all three work together."
      />

      {/* Direct answer for AI search */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div
          className="rounded-[24px] p-6 border-l-4"
          style={{ background: "#F6F0FB", borderColor: "#4B2E83" }}
        >
          <p className="font-inter font-semibold text-plum-dark text-sm mb-1">
            What is integral coaching?
          </p>
          <p className="font-inter text-muted text-sm leading-relaxed">
            Integral coaching is a whole-person methodology that works with
            thinking (head), feeling (heart) and action (body) together. Rather
            than focusing on one dimension in isolation, it helps people develop
            awareness across all three areas — creating more lasting, grounded
            and meaningful personal growth.
          </p>
        </div>
      </section>

      {/* Three dimensions */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <span className="block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-3">
          The three dimensions
        </span>
        <h2
          className="font-poppins font-bold text-plum-dark heading-tight mb-7 max-w-xl"
          style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
        >
          Head, heart and body — working as one
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: "🧠",
              label: "Head",
              title: "Thinking clearly",
              body: "Exploring the narratives, beliefs and assumptions that shape how you see yourself and the world. Many coaching breakthroughs begin with a thought that was never examined closely.",
            },
            {
              icon: "❤️",
              label: "Heart",
              title: "Feeling honestly",
              body: "Acknowledging what you feel — without being controlled by it. Integral coaching creates space for emotions to be heard, so they can inform rather than override your choices.",
            },
            {
              icon: "🌱",
              label: "Body",
              title: "Acting purposefully",
              body: "Turning awareness into movement. The body dimension is about grounded, intentional action — small steps that are aligned with what you actually value.",
            },
          ].map((d) => (
            <div
              key={d.label}
              className="bg-white rounded-4xl p-7 shadow-soft border border-mist flex flex-col gap-4"
            >
              <span aria-hidden="true" className="text-3xl w-12 h-12 flex items-center justify-center rounded-2xl bg-mist">
                {d.icon}
              </span>
              <div>
                <span className="font-inter font-semibold text-xs uppercase tracking-widest" style={{ color: "#FF6F9F" }}>
                  {d.label}
                </span>
                <h3 className="font-poppins font-bold text-plum-dark text-xl heading-tight mt-1">
                  {d.title}
                </h3>
              </div>
              <p className="font-inter text-muted text-sm leading-relaxed">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How Danè's approach works */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <h2
          className="font-poppins font-bold text-plum-dark heading-tight mb-5 max-w-xl"
          style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
        >
          How Danè applies the integral approach
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-4">
            <p className="font-inter text-muted text-base leading-relaxed">
              In practice, integral coaching with Danè means sessions are
              conversations, not lectures. Danè doesn&apos;t arrive with a
              fixed script or pre-packaged answers. She arrives with curiosity,
              careful listening and powerful questions designed to help you
              discover your own clarity.
            </p>
            <p className="font-inter text-muted text-base leading-relaxed">
              Sessions explore what you are thinking, what you are feeling and
              what small steps your body is ready to take. The work is slow
              enough to be honest and structured enough to be useful.
            </p>
            <p className="font-inter text-muted text-base leading-relaxed">
              Between sessions, the AI companion supports this same approach —
              offering prompts that reflect the three dimensions, helping you
              stay connected to your growth without needing to wait for the next
              session.
            </p>
          </div>
          <div
            className="rounded-[28px] p-7 flex flex-col gap-5"
            style={{ background: "linear-gradient(135deg, #F3D7E6, #E8E1F7)" }}
          >
            <p className="font-inter font-semibold text-plum-dark text-sm">
              In a typical session you might explore:
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "A story you've been telling yourself that may no longer be true",
                "An emotion that keeps showing up in a particular situation",
                "A decision you've been avoiding — and what's underneath the avoidance",
                "A strength you have but rarely trust yourself to use",
                "A small action that would feel both honest and brave",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-inter text-sm text-ink">
                  <span aria-hidden="true" style={{ color: "#FF6F9F", flexShrink: 0, marginTop: "2px" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Coaching vs other things */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <h2
          className="font-poppins font-bold text-plum-dark heading-tight mb-7 max-w-xl"
          style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
        >
          Coaching is not therapy — and that's important to understand
        </h2>
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {differences.map((d) => (
            <div
              key={d.label}
              className="bg-white rounded-[24px] p-6 border border-mist shadow-soft"
            >
              <p className="font-poppins font-bold text-plum-dark text-base mb-2">
                {d.label}
              </p>
              <p className="font-inter text-muted text-sm leading-relaxed">
                {d.description}
              </p>
            </div>
          ))}
        </div>
        <p className="font-inter text-muted text-sm leading-relaxed max-w-2xl">
          If you are dealing with significant mental-health challenges, trauma or
          crisis, please seek support from a qualified clinical professional.
          Coaching is not a substitute for therapy or medical care.
        </p>
      </section>

      <CTASection
        heading="Explore integral coaching with Danè"
        body="Start with a free welcome check-in and discover how human-led, AI-supported coaching can help you find your voice, build confidence and act with purpose."
        secondaryLabel="Meet Danè"
        secondaryHref="/about-dane"
      />
      <Footer />
    </>
  );
}
