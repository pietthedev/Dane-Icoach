import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import TrustNotice from "@/components/TrustNotice";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "AI Coaching Companion | What It Is & How It Works",
  description:
    "An AI coaching companion supports your growth between human sessions — with reflection prompts, gentle check-ins and a space that's always available. Learn how Companion by Danè works.",
  alternates: { canonical: "https://companionai.coach/ai-coaching-companion" },
  openGraph: {
    title: "AI Coaching Companion | What It Is & How It Works",
    description:
      "An AI coaching companion supports your growth between human sessions — with reflection prompts, gentle check-ins and a space that's always available. Learn how Companion by Danè works.",
    url: "https://companionai.coach/ai-coaching-companion",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Coaching Companion",
  serviceType: "AI-Supported Coaching",
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
    "An always-on AI coaching companion that supports reflection, confidence and clarity between human coaching sessions.",
  url: "https://companionai.coach/ai-coaching-companion",
};

const canDo = [
  "Help you reflect on a situation before or after a difficult conversation",
  "Ask thoughtful questions to help you unpack what you're feeling",
  "Offer guided prompts to explore your confidence, voice and goals",
  "Track your weekly progress and surface useful patterns",
  "Stay available at any time — quiet mornings, uncertain evenings, in-between moments",
  "Help you prepare for coaching sessions with Danè",
  "Remind you of your personal focus theme and growth intentions",
];

const cannotDo = [
  "Replace human coaching, therapy or clinical mental-health support",
  "Diagnose, treat or manage mental-health conditions",
  "Provide medical, legal or financial advice",
  "Intervene in a crisis or emergency situation",
  "Form a personal relationship or emotional bond",
  "Guarantee outcomes or results",
];

export default function AICoachingCompanionPage() {
  return (
    <>
      <StructuredData data={serviceSchema} />
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "AI Coaching Companion", href: "/ai-coaching-companion" }]} />
      <PageHero
        eyebrow="AI Coaching Companion"
        heading="A reflection partner that's always available"
        lead="An AI coaching companion is a digital support partner that helps you think, reflect and stay on track between human coaching sessions. It's not a chatbot. It's not a therapist. It's a thoughtful companion for your growth."
      />

      {/* Direct answer block for AI search */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div
          className="rounded-[24px] p-6 border-l-4"
          style={{ background: "#F6F0FB", borderColor: "#4B2E83" }}
        >
          <p className="font-inter font-semibold text-plum-dark text-sm mb-1">
            What is an AI coaching companion?
          </p>
          <p className="font-inter text-muted text-sm leading-relaxed">
            An AI coaching companion is a digital reflection partner that helps
            you process thoughts, explore goals and stay accountable between
            human coaching sessions. Companion by Danè combines this always-on
            support with human-led coaching touchpoints — so you have both the
            depth of a real coach and the availability of an AI partner.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="mb-3">
          <span className="font-inter font-semibold text-lavender uppercase tracking-widest text-xs">
            How it works
          </span>
        </div>
        <h2
          className="font-poppins font-bold text-plum-dark heading-tight mb-6 max-w-xl"
          style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
        >
          Between sessions, your companion keeps the momentum going
        </h2>
        <p className="font-inter text-muted text-base leading-relaxed max-w-2xl mb-8">
          Growth doesn&apos;t only happen in a coaching session. It happens in
          the quiet moment before a hard conversation. In the reflection after a
          difficult day. In the small decisions you make when no one else is
          watching. The AI companion is there for those moments.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Reflect",
              body: "Daily prompts invite you to pause and check in with yourself — your confidence, your clarity, your goals.",
            },
            {
              step: "02",
              title: "Explore",
              body: "Ask questions, share what's on your mind, work through situations at your own pace.",
            },
            {
              step: "03",
              title: "Act",
              body: "Turn insight into small, grounded steps. Your companion helps you identify what to do next.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-4xl p-7 shadow-soft border border-mist flex flex-col gap-4 relative overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute -top-3 -right-2 font-poppins font-bold text-mist select-none pointer-events-none"
                style={{ fontSize: "72px", lineHeight: 1, opacity: 0.7 }}
              >
                {item.step}
              </span>
              <div className="w-10 h-10 rounded-xl bg-plum-dark flex items-center justify-center">
                <span className="font-poppins font-bold text-white text-sm">
                  {item.step}
                </span>
              </div>
              <h3 className="font-poppins font-bold text-plum-dark text-xl heading-tight">
                {item.title}
              </h3>
              <p className="font-inter text-muted text-sm leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Can / Cannot */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <h2
          className="font-poppins font-bold text-plum-dark heading-tight mb-8 max-w-xl"
          style={{ fontSize: "clamp(24px, 3vw, 38px)" }}
        >
          What the companion can — and cannot — do
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[28px] p-7 border border-mist shadow-soft">
            <p className="font-inter font-semibold text-plum-dark text-sm mb-4 flex items-center gap-2">
              <span aria-hidden="true" style={{ color: "#FF6F9F" }}>✓</span>
              It can help you
            </p>
            <ul className="flex flex-col gap-3">
              {canDo.map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-inter text-sm text-muted">
                  <span aria-hidden="true" style={{ color: "#FF6F9F", flexShrink: 0, marginTop: "2px" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-[28px] p-7 border border-mist shadow-soft">
            <p className="font-inter font-semibold text-plum-dark text-sm mb-4 flex items-center gap-2">
              <span aria-hidden="true" style={{ color: "#6E667A" }}>✕</span>
              It cannot
            </p>
            <ul className="flex flex-col gap-3">
              {cannotDo.map((item) => (
                <li key={item} className="flex items-start gap-2.5 font-inter text-sm text-muted">
                  <span aria-hidden="true" style={{ color: "#6E667A", flexShrink: 0, marginTop: "2px" }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div
          className="rounded-[34px] p-8 md:p-10"
          style={{ background: "linear-gradient(135deg, #F3D7E6, #E8E1F7)" }}
        >
          <span className="font-inter font-semibold text-xs uppercase tracking-widest mb-3 block" style={{ color: "#4B2E83" }}>
            Privacy & safety
          </span>
          <h2
            className="font-poppins font-bold text-plum-dark heading-tight mb-4 max-w-xl"
            style={{ fontSize: "clamp(22px, 2.8vw, 34px)" }}
          >
            Your reflections, handled with care
          </h2>
          <p className="font-inter text-ink text-base leading-relaxed max-w-2xl mb-4">
            Personal reflections are handled with care and clear consent. No
            anonymised insights are used without your knowledge. The companion
            is designed for reflection, not surveillance.
          </p>
          <p className="font-inter text-ink text-sm leading-relaxed max-w-2xl">
            Read our full{" "}
            <a href="/privacy" className="underline text-plum-dark font-medium">
              Privacy Policy
            </a>{" "}
            to understand how your data is handled.
          </p>
        </div>
      </section>

      <TrustNotice />
      <CTASection
        heading="Experience the AI companion for yourself"
        body="Join early access and get a free welcome check-in with Danè, plus access to the AI companion that supports you between sessions."
        secondaryLabel="Learn about integral coaching"
        secondaryHref="/integral-coaching"
      />
      <Footer />
    </>
  );
}
