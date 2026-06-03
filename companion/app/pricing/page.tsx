import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import StructuredData from "@/components/StructuredData";
import type { FAQItem } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "Pricing | Companion by Danè Coaching Plans",
  description:
    "Flexible coaching plans starting free. Explore Companion by Danè's packages — from a free starter journey to human coaching with Danè. All prices in ZAR.",
  alternates: { canonical: "https://companionai.coach/pricing" },
  openGraph: {
    title: "Pricing | Companion by Danè Coaching Plans",
    description:
      "Flexible coaching plans starting free. Explore Companion by Danè's packages — from a free starter journey to human coaching with Danè. All prices in ZAR.",
    url: "https://companionai.coach/pricing",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const plans = [
  {
    name: "Free",
    price: "R0",
    priceNote: "/month",
    featured: false,
    badge: null,
    description: "Try the companion — no card required. One voice session a day to get you started.",
    features: [
      "1 voice session per day (3 minutes)",
      "5 text conversations per month",
      "Transcripts saved automatically",
    ],
    cta: "Start free",
    href: "/auth/signup",
  },
  {
    name: "Grow",
    price: "R349",
    priceNote: "/month",
    featured: true,
    badge: "Most popular",
    description: "The full companion experience — more voice time, unlimited text and a monthly human check-in with Danè.",
    features: [
      "6 voice sessions per month (20 min/day)",
      "Unlimited text conversations",
      "Full transcripts, summaries and ratings",
      "Share conversations with Danè",
      "Monthly check-in with Danè",
    ],
    cta: "Choose Grow",
    href: "/auth/signup",
  },
  {
    name: "Business",
    price: "R699",
    priceNote: "/month",
    featured: false,
    badge: null,
    description: "Maximum voice access, priority with Danè and deeper coaching integration for serious growth.",
    features: [
      "15 voice sessions per month (30 min/day)",
      "Unlimited text conversations",
      "Everything in Grow",
      "Priority in Danè's calendar",
      "Danè reviews shared conversations before sessions",
    ],
    cta: "Choose Business",
    href: "/auth/signup",
  },
];

const offerList = plans.map((p) => ({
  "@type": "Offer",
  name: p.name,
  priceCurrency: "ZAR",
  price: p.price.replace("R", ""),
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    priceCurrency: "ZAR",
    price: p.price.replace("R", ""),
    billingDuration: "P1M",
  },
  description: p.description,
  url: "https://companionai.coach/pricing",
}));

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Companion by Danè — Coaching Plans",
  description:
    "Human-led AI-supported coaching subscription plans for confidence, clarity and personal growth.",
  brand: {
    "@type": "Brand",
    name: "Companion by Danè",
  },
  offers: offerList,
  url: "https://companionai.coach/pricing",
};

const pricingFaqs: FAQItem[] = [
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes. Monthly plans can be cancelled before the next billing cycle with no penalty. There are no lock-in contracts.",
  },
  {
    question: "Are prices in South African Rand?",
    answer:
      "Yes — all prices listed are in ZAR (South African Rand). The platform is available globally; billing in other currencies will be clarified at launch.",
  },
  {
    question: "Why is the free voice session only 3 minutes?",
    answer:
      "The 3-minute limit exists so that everyone can experience a real voice conversation with the companion without needing a card. It's enough time to feel how the coaching dynamic works. Grow and Business plans extend this to 20 or 30 minutes per day with multiple sessions per month.",
  },
  {
    question: "What happens when I hit my voice or text limit?",
    answer:
      "The companion shows you a friendly message explaining your limit and when it resets. Voice limits reset daily at midnight; monthly text and session counts reset on the first of each month. You can upgrade any time from your portal to get more access immediately.",
  },
  {
    question: "How does 'Share conversations with Danè' work?",
    answer:
      "On Grow and Business plans, you can mark any text or voice conversation as shared. Danè can then read the transcript and any summary before your check-in, so your session time is spent going deeper rather than catching up. You choose what to share — nothing is visible to Danè unless you explicitly share it.",
  },
  {
    question: "What does Danè see, and what stays private?",
    answer:
      "By default, all your conversations are private to you. Danè only sees conversations you have explicitly shared, your ratings and colour tags (if you add them), and any notes you choose to include. Journal entries are always private and are never shared.",
  },
  {
    question: "What is the monthly check-in with Danè?",
    answer:
      "Grow and Business members get a monthly video or audio check-in with Danè — a focused 15–20 minute session to review your progress, adjust your focus and set intentions for the month ahead. Danè may review your shared conversations beforehand so the time is spent going deeper.",
  },
  {
    question: "Is there a team or company plan?",
    answer:
      "The Business plan works well for individuals with high coaching needs. For team packages or bespoke arrangements, contact us to discuss what would work best for your organisation.",
  },
];

export default function PricingPage() {
  return (
    <>
      <StructuredData data={productSchema} />
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "Pricing", href: "/pricing" }]} />

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6 md:pt-14">
        <span className="block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-4">
          Packages
        </span>
        <h1
          className="font-poppins font-bold text-plum-dark heading-tight mb-4 max-w-2xl"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
        >
          Plans that grow with you
        </h1>
        <p className="font-inter text-muted text-lg leading-relaxed max-w-xl mb-10">
          Start free. Add human coaching when you&apos;re ready. All plans
          include AI companion access and are available online.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col bg-white rounded-4xl p-7 shadow-soft"
              style={{
                border: plan.featured ? "2px solid #4B2E83" : "1px solid #E8E1F7",
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
                  <h2 className="font-poppins font-bold text-plum-dark text-xl heading-tight mb-1">
                    {plan.name}
                  </h2>
                  <p className="font-inter text-muted text-xs leading-relaxed mb-3">
                    {plan.description}
                  </p>
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
                    <li key={feat} className="flex items-start gap-2.5 font-inter text-sm text-muted">
                      <span aria-hidden="true" style={{ color: "#FF6F9F" }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-auto w-full text-center font-inter font-semibold text-sm py-2.5 rounded-2xl transition-colors duration-200 ${
                    plan.featured
                      ? "bg-plum-dark text-white hover:bg-plum shadow-soft"
                      : "border border-mist text-plum-dark bg-cloud hover:border-lavender"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="font-inter text-muted text-xs text-center pb-4">
          Human-led. AI-supported. Not therapy or crisis support.{" "}
          <Link href="/faq" className="underline">
            Read the FAQ
          </Link>
        </p>
      </section>

      <FAQSection
        faqs={pricingFaqs}
        heading="Pricing questions answered"
        eyebrow="FAQ"
        withSchema={true}
      />

      <CTASection
        heading="Not sure which plan is right for you?"
        body="Start with the free plan and experience the companion for yourself. You can upgrade whenever you're ready — no card required to begin."
        primaryLabel="Start free"
        primaryHref="/auth/signup"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
        microcopy="Free plan includes 1 voice session per day and 5 text conversations per month."
      />
      <Footer />
    </>
  );
}
