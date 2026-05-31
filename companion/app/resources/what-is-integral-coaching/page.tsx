import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import ArticleLayout from "@/components/ArticleLayout";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "What Is Integral Coaching? Head, Heart & Body Explained",
  description:
    "Integral coaching is a whole-person approach that works with thinking, feeling and action together. Here's what it means in practice and why it creates lasting change.",
  alternates: { canonical: "https://companionai.coach/resources/what-is-integral-coaching" },
  openGraph: {
    title: "What Is Integral Coaching? Head, Heart & Body Explained",
    description:
      "Integral coaching works with thinking, feeling and action together. Here's what it means in practice.",
    url: "https://companionai.coach/resources/what-is-integral-coaching",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is Integral Coaching? Head, Heart & Body Explained",
  description:
    "Integral coaching is a whole-person approach that works with thinking, feeling and action together.",
  author: { "@type": "Person", name: "Danè de Klerk", url: "https://companionai.coach/about-dane" },
  publisher: { "@type": "Organization", name: "Companion by Danè", url: "https://companionai.coach" },
  url: "https://companionai.coach/resources/what-is-integral-coaching",
  datePublished: "2026-05-23",
  dateModified: "2026-05-23",
};

export default function WhatIsIntegralCoachingPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <Navbar />
      <ArticleLayout
        breadcrumbLabel="What is integral coaching?"
        breadcrumbHref="/resources/what-is-integral-coaching"
      >
        <h1>What is integral coaching? Head, heart and body explained</h1>

        <div className="answer-block">
          <p>
            <strong>Short answer:</strong> Integral coaching is a whole-person
            methodology that works with thinking (head), feeling (heart) and
            action (body) simultaneously. Rather than focusing on performance or
            behaviour change in isolation, it creates lasting growth by
            addressing the beliefs, emotions and habits that shape how you show
            up.
          </p>
        </div>

        <p>
          Most personal development approaches focus on one thing at a time.
          They address your mindset, or your habits, or your emotions — but
          rarely all three together. Integral coaching is different. It
          recognises that lasting change doesn&apos;t come from fixing one
          dimension of yourself. It comes from understanding how all three work
          together — and what happens when they don&apos;t.
        </p>

        <h2>The three dimensions of integral coaching</h2>

        <h3>Head — thinking clearly</h3>
        <p>
          The head dimension explores the stories you tell yourself. The
          assumptions you&apos;ve inherited. The inner narratives that quietly
          run in the background of every decision you make. Integral coaching
          asks: what are you actually thinking — and is that thought serving you?
        </p>
        <p>
          <em>Example:</em> A client who consistently avoids speaking up in
          meetings might discover, through coaching, that they hold a belief
          that their ideas are less valuable than others&apos;. Once that belief
          is made visible, it can be examined — and changed.
        </p>

        <h3>Heart — feeling honestly</h3>
        <p>
          The heart dimension creates space for emotional honesty. Not wallowing
          in feelings, and not suppressing them either — but allowing emotions
          to be present and acknowledged so they can inform rather than override
          your choices.
        </p>
        <p>
          <em>Example:</em> A client preparing for a difficult conversation with
          their manager notices they feel both angry and afraid. Rather than
          acting from the anger or freezing from the fear, integral coaching
          helps them understand what both emotions are signalling — and choose a
          grounded response.
        </p>

        <h3>Body — acting purposefully</h3>
        <p>
          The body dimension is about what you actually do. The small, deliberate
          actions that are aligned with your values and your intentions. It
          bridges the gap between insight and change.
        </p>
        <p>
          <em>Example:</em> A client who understands intellectually that they
          need to set limits with a colleague, but hasn&apos;t done so yet,
          might explore what one small, honest step looks like — and practise
          what it feels like to take it.
        </p>

        <h2>Why integral coaching creates lasting change</h2>
        <p>
          Traditional coaching often focuses on goals, accountability and
          action. That&apos;s valuable. But when the underlying beliefs and
          emotions aren&apos;t addressed, the same patterns tend to return.
        </p>
        <p>
          Integral coaching goes deeper. By working with the whole person —
          not just the goal — it helps people change not just what they do, but
          how they relate to themselves. That kind of change tends to stick.
        </p>

        <h2>How it differs from therapy</h2>
        <p>
          Integral coaching is not therapy. Therapy is a clinical service for
          people dealing with mental-health conditions, psychological distress
          or the effects of trauma — delivered by a licensed clinician.
        </p>
        <p>
          Coaching — including integral coaching — works with healthy,
          functioning adults who want to grow. The focus is forward-facing:
          where do you want to go, what is getting in the way, and how do you
          move through it?
        </p>
        <p>
          If you are experiencing significant psychological distress, please seek
          clinical support. Coaching is not a substitute.
        </p>

        <h2>Integral coaching at Companion by Danè</h2>
        <p>
          <Link href="/about-dane">Danè de Klerk</Link> applies the integral
          coaching methodology in every human session and in the design of the
          AI companion. The reflective prompts the companion offers, the guided
          journeys and the check-in questions are all shaped by the head, heart
          and body framework.
        </p>
        <p>
          <Link href="/integral-coaching">
            Explore the integral coaching approach in more detail →
          </Link>
        </p>
      </ArticleLayout>
      <Footer />
    </>
  );
}
