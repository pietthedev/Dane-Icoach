import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Resources | Coaching Guides & Articles",
  description:
    "Practical guides on AI coaching, integral coaching, confidence, self-trust and finding your voice. Written to be genuinely useful, not generic.",
  alternates: { canonical: "https://companionai.coach/resources" },
  openGraph: {
    title: "Resources | Coaching Guides & Articles",
    description:
      "Practical guides on AI coaching, integral coaching, confidence, self-trust and finding your voice.",
    url: "https://companionai.coach/resources",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const articles = [
  {
    slug: "what-is-ai-coaching",
    title: "What is AI coaching?",
    description:
      "A clear, honest explanation of AI coaching — what it is, how it differs from a chatbot and how it fits alongside human coaching.",
    tag: "AI Coaching",
    readTime: "4 min read",
  },
  {
    slug: "what-is-integral-coaching",
    title: "What is integral coaching?",
    description:
      "Integral coaching explained in plain English — head, heart and body working together for lasting personal growth.",
    tag: "Methodology",
    readTime: "5 min read",
  },
  {
    slug: "how-to-build-confidence-before-a-difficult-conversation",
    title: "How to build confidence before a difficult conversation",
    description:
      "Practical steps to ground yourself, clarify your intention and speak your truth — even when it feels uncomfortable.",
    tag: "Confidence",
    readTime: "6 min read",
  },
  {
    slug: "how-to-find-your-voice",
    title: "How to find your voice",
    description:
      "What it really means to 'find your voice' — and the small, honest practices that help you speak more clearly and confidently.",
    tag: "Voice & Confidence",
    readTime: "5 min read",
  },
  {
    slug: "self-trust-coaching-exercises",
    title: "Self-trust coaching exercises",
    description:
      "Five reflection exercises to build self-trust — the kind of trust that helps you make decisions, take action and believe in yourself.",
    tag: "Self-trust",
    readTime: "6 min read",
  },
  {
    slug: "ai-coaching-vs-human-coaching",
    title: "AI coaching vs human coaching — what's the difference?",
    description:
      "An honest comparison of AI coaching and human coaching — what each does well, where the limits are and why they work best together.",
    tag: "AI Coaching",
    readTime: "5 min read",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "Resources", href: "/resources" }]} />

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-4 md:pt-14">
        <span className="block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-4">
          Resources
        </span>
        <h1
          className="font-poppins font-bold text-plum-dark heading-tight mb-4 max-w-2xl"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
        >
          Practical guides for growth
        </h1>
        <p className="font-inter text-muted text-lg leading-relaxed max-w-xl">
          Honest, useful writing on AI coaching, integral coaching, confidence,
          self-trust and finding your voice. No filler. No fluff.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/resources/${article.slug}`}
              className="group bg-white rounded-[28px] p-7 border border-mist shadow-soft flex flex-col gap-4 hover:border-lavender transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-inter font-semibold text-xs px-3 py-1.5 rounded-full bg-mist text-lavender">
                  {article.tag}
                </span>
                <span className="font-inter text-xs text-muted">
                  {article.readTime}
                </span>
              </div>
              <h2 className="font-poppins font-bold text-plum-dark text-lg heading-tight group-hover:text-plum transition-colors">
                {article.title}
              </h2>
              <p className="font-inter text-muted text-sm leading-relaxed flex-1">
                {article.description}
              </p>
              <span className="font-inter font-semibold text-sm text-lavender group-hover:text-plum transition-colors">
                Read article →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CTASection
        heading="Ready to put this into practice?"
        body="Join early access and experience Companion by Danè — human-led coaching with an AI companion that's always in your corner."
        secondaryLabel="Explore pricing"
        secondaryHref="/pricing"
      />
      <Footer />
    </>
  );
}
