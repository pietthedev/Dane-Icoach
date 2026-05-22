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
    name: "Start",
    price: "Free",
    priceNote: "",
    featured: false,
    badge: null,
    description: "Try the companion and discover your superpower — no card required.",
    features: [
      "Limited AI companion access",
      "Discover your superpower exercise",
      "Once-off 10-min welcome check-in with Danè",
      "Limited weekly slots",
    ],
    cta: "Start free",
    href: "/#start",
  },
  {
    name: "Explorer",
    price: "R99",
    priceNote: "/mo",
    featured: false,
    badge: null,
    description: "Build a daily reflection habit with guided journeys and prompts.",
    features: [
      "AI companion access",
      "Guided reflection journeys",
      "Confidence and voice prompts",
      "Monthly progress summary",
    ],
    cta: "Join waitlist",
    href: "/#start",
  },
  {
    name: "Grow",
    price: "R249",
    priceNote: "/mo",
    featured: true,
    badge: "Best start",
    description: "The full companion experience, with a monthly human check-in from Danè.",
    features: [
      "Everything in Explorer",
      "Monthly 10–15 min Danè check-in",
      "Personal focus theme",
      "Priority early access",
    ],
    cta: "Choose Grow",
    href: "/#start",
  },
  {
    name: "Voice",
    price: "Custom",
    priceNote: "",
    featured: false,
    badge: null,
    description: "Deeper human coaching combined with AI support — for serious personal growth.",
    features: [
      "AI companion",
      "Monthly human coaching session",
      "Personal development focus",
      "Ideal for serious growth",
    ],
    cta: "Request info",
    href: "/#start",
  },
];

const offerList = plans
  .filter((p) => p.price !== "Free" && p.price !== "Custom")
  .map((p) => ({
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
    question: "What happens after the free trial?",
    answer:
      "The Start plan is permanently free with limited access. To continue with full companion access and guided journeys, you can upgrade to Explorer or Grow.",
  },
  {
    question: "What is the welcome check-in?",
    answer:
      "The 10-minute welcome check-in is a brief human call with Danè — available on the Start and Grow plans. It helps you get oriented, set an initial intention and understand how to make the most of your journey.",
  },
  {
    question: "Is there a team or company plan?",
    answer:
      "Yes. The Voice tier can be adapted for teams and companies. Contact us to discuss a package tailored to your organisation's needs.",
  },
  {
    question: "What does 'priority early access' mean?",
    answer:
      "During the launch phase, access is being rolled out gradually. Grow plan members get priority placement in the queue and first access to new features.",
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
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
        body="Start with the free plan and experience the companion for yourself. You can upgrade whenever you're ready."
        primaryLabel="Start free"
        primaryHref="/#start"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
        microcopy="Limited early-access welcome check-ins available."
      />
      <Footer />
    </>
  );
}
