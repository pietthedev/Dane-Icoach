import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import TrustNotice from "@/components/TrustNotice";
import CTASection from "@/components/CTASection";
import type { FAQItem } from "@/components/FAQSection";

export const metadata: Metadata = {
  title: "FAQ | Companion by Danè — Common Questions Answered",
  description:
    "Questions about AI coaching, integral coaching, privacy, pricing and how Companion by Danè works. Honest answers — no jargon.",
  alternates: { canonical: "https://companionai.coach/faq" },
  openGraph: {
    title: "FAQ | Companion by Danè — Common Questions Answered",
    description:
      "Questions about AI coaching, integral coaching, privacy, pricing and how Companion by Danè works. Honest answers — no jargon.",
    url: "https://companionai.coach/faq",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const generalFaqs: FAQItem[] = [
  {
    question: "What is Companion by Danè?",
    answer:
      "Companion by Danè is a human-led, AI-supported coaching platform. It combines Danè de Klerk's coaching expertise with an always-on AI companion that supports clients between sessions. The focus is on confidence, clarity, self-trust and purposeful action. It is a coaching and personal growth service — not therapy, medical advice or crisis support.",
  },
  {
    question: "Is this AI therapy?",
    answer:
      "No. This is not therapy. Companion by Danè is a coaching and reflection support service. It does not diagnose, treat or manage mental-health conditions. If you are experiencing significant psychological distress, please consult a qualified clinical professional such as a psychologist or psychiatrist.",
  },
  {
    question: "Is this a replacement for a human coach?",
    answer:
      "No. The AI companion is a between-session support tool — it helps you reflect, stay on track and explore your thinking. Danè remains the human coaching anchor. The AI companion extends the reach of that human relationship; it does not replace it.",
  },
  {
    question: "How does the AI companion work?",
    answer:
      "The AI companion engages you through reflective prompts, guided journeys and conversational support. It asks questions rather than giving answers, helping you process situations, build awareness and identify small meaningful steps. It is available between coaching sessions, at any time.",
  },
  {
    question: "What can I talk to the companion about?",
    answer:
      "You can explore topics like confidence, self-trust, difficult conversations, finding your voice, setting intentions, understanding your strengths and preparing for coaching sessions. The companion is designed for personal growth reflection — not crisis support, medical topics or urgent situations.",
  },
  {
    question: "What happens in the free plan?",
    answer:
      "The free Start plan includes limited AI companion access, the 'Discover your superpower' exercise, and a once-off 10-minute welcome check-in with Danè. Availability for the welcome check-in is limited during the early access phase.",
  },
  {
    question: "How does the 10-minute welcome check-in work?",
    answer:
      "The welcome check-in is a brief human call with Danè, available on the Start and Grow plans. It's designed to help you get oriented, set an initial intention and understand how to make the most of your coaching journey. Slots are available and limited — you'll be able to book through the platform once you've joined.",
  },
  {
    question: "Is my information private?",
    answer:
      "Yes. Personal reflections are handled with care and clear consent. No anonymised insights are used without your knowledge. The platform is designed with privacy as a principle, not an afterthought. Read the full Privacy Policy for details on how your data is handled.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Yes. Monthly plans can be cancelled at any time before the next billing date. There are no lock-in contracts or cancellation fees.",
  },
  {
    question: "Is this suitable for companies or teams?",
    answer:
      "Yes. The Voice tier and team packages can be tailored for organisations. If you're interested in coaching for your team, contact us to discuss a custom arrangement.",
  },
  {
    question: "What is integral coaching?",
    answer:
      "Integral coaching is a whole-person methodology that works with thinking (head), feeling (heart) and action (body) together. Rather than focusing on performance outcomes alone, it explores the beliefs, emotions and behaviours that shape how you show up — creating more grounded, lasting change. Learn more on the Integral Coaching page.",
  },
  {
    question: "How is this different from a normal chatbot?",
    answer:
      "A standard chatbot typically responds to queries with pre-programmed or generative answers. The AI companion is purpose-built for coaching reflection — it asks questions, surfaces patterns and supports growth. It is backed by Danè's coaching methodology and designed to complement human coaching sessions, not replace conversational search.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "FAQ", href: "/faq" }]} />

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-4 md:pt-14">
        <span className="block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-4">
          FAQ
        </span>
        <h1
          className="font-poppins font-bold text-plum-dark heading-tight mb-4 max-w-2xl"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
        >
          Questions, honestly answered
        </h1>
        <p className="font-inter text-muted text-lg leading-relaxed max-w-xl">
          No jargon. No vague promises. Just clear answers about what Companion
          by Danè is, how it works and who it&apos;s for.
        </p>
      </section>

      <FAQSection
        faqs={generalFaqs}
        heading="All questions"
        eyebrow="Answers"
        withSchema={true}
      />

      <TrustNotice />

      <section className="max-w-7xl mx-auto px-6 py-8">
        <p className="font-inter text-muted text-sm">
          Still have a question?{" "}
          <Link href="/contact" className="text-plum-dark font-semibold underline">
            Get in touch
          </Link>
          {" "}or explore{" "}
          <Link href="/pricing" className="text-plum-dark font-semibold underline">
            pricing
          </Link>
          {" "}and{" "}
          <Link href="/resources" className="text-plum-dark font-semibold underline">
            resources
          </Link>
          .
        </p>
      </section>

      <CTASection
        heading="Ready to start?"
        body="Join early access and experience Companion by Danè — human-led coaching with an AI companion that's always in your corner."
        secondaryLabel="Explore pricing"
        secondaryHref="/pricing"
        microcopy="Limited early-access welcome check-ins available."
      />
      <Footer />
    </>
  );
}
