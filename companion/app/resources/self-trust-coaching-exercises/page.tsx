import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import ArticleLayout from "@/components/ArticleLayout";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "5 Self-Trust Coaching Exercises That Actually Work",
  description:
    "Practical coaching exercises for building self-trust — the kind that helps you make decisions, take action and believe in yourself. No fluff, no quick fixes.",
  alternates: { canonical: "https://companionai.coach/resources/self-trust-coaching-exercises" },
  openGraph: {
    title: "5 Self-Trust Coaching Exercises That Actually Work",
    description:
      "Practical coaching exercises for building self-trust — the kind that helps you make decisions, take action and believe in yourself.",
    url: "https://companionai.coach/resources/self-trust-coaching-exercises",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "5 Self-Trust Coaching Exercises That Actually Work",
  description:
    "Practical exercises for building self-trust — making decisions, taking action and believing in yourself.",
  author: { "@type": "Person", name: "Danè de Klerk", url: "https://companionai.coach/about-dane" },
  publisher: { "@type": "Organization", name: "Companion by Danè", url: "https://companionai.coach" },
  url: "https://companionai.coach/resources/self-trust-coaching-exercises",
  datePublished: "2026-05-23",
  dateModified: "2026-05-23",
};

export default function SelfTrustExercisesPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <Navbar />
      <ArticleLayout
        breadcrumbLabel="Self-trust coaching exercises"
        breadcrumbHref="/resources/self-trust-coaching-exercises"
      >
        <h1>5 self-trust coaching exercises that actually work</h1>

        <div className="answer-block">
          <p>
            <strong>Short answer:</strong> Self-trust is built through small,
            repeated acts of honesty with yourself — noticing when you know
            something, following through on your word to yourself and
            acknowledging when you made a good call. These exercises help you
            practise exactly that.
          </p>
        </div>

        <p>
          Self-trust is not a personality trait you either have or you
          don&apos;t. It is a relationship — with yourself — that you build
          through experience and attention.
        </p>
        <p>
          People with strong self-trust aren&apos;t people who never doubt
          themselves. They are people who have learned to take their own
          instincts seriously, follow through on their commitments to themselves
          and recover when they get things wrong.
        </p>
        <p>
          These five exercises support that process. They are adapted from the
          coaching methodology at the heart of Companion by Danè.
        </p>

        <h2>Exercise 1: The instinct journal</h2>
        <p>
          For one week, keep a simple record of your instinctive reactions —
          the gut feelings you had before your analytical mind stepped in.
        </p>
        <p>
          Each day, note:
        </p>
        <ul>
          <li>One moment when you had a strong instinct about something</li>
          <li>What you actually did (followed it or overrode it)</li>
          <li>What happened as a result</li>
        </ul>
        <p>
          At the end of the week, look back. How often were your instincts
          useful? How often did you override them unnecessarily? This builds
          evidence for your own inner knowing.
        </p>

        <h2>Exercise 2: Keep one small promise to yourself</h2>
        <p>
          Self-trust is built the same way trust with others is built: through
          reliability over time. The problem is, we break small promises to
          ourselves constantly — and each time we do, it quietly erodes our
          sense that we can be counted on by ourselves.
        </p>
        <p>
          Choose one small, specific commitment this week. Not a goal — a
          promise. Something like: I will go for a 15-minute walk on Tuesday
          morning. Or: I will say no to something I don&apos;t have capacity
          for this week.
        </p>
        <p>
          Make it achievable. Follow through. Notice how it feels to keep your
          word to yourself.
        </p>

        <h2>Exercise 3: The evidence audit</h2>
        <p>
          When self-trust is low, we often have a distorted view of our own
          track record. We remember failures in detail and discount successes.
        </p>
        <p>
          Spend 20 minutes writing down:
        </p>
        <ul>
          <li>Five decisions you made in the last year that you are glad you made</li>
          <li>Three times you handled a difficult situation better than you expected</li>
          <li>Two things you know about yourself that are genuinely true and positive</li>
        </ul>
        <p>
          This isn&apos;t self-flattery. It is an honest audit. The goal is
          accuracy — not a highlight reel, not a list of failures. Just a
          clearer picture of what you actually do well.
        </p>

        <h2>Exercise 4: The self-referral check-in</h2>
        <p>
          Before asking for advice or validation from someone else, practise
          asking yourself first.
        </p>
        <p>
          When you face a decision — big or small — pause and ask: <em>What do
          I actually think about this? What does my gut say?</em>
        </p>
        <p>
          You don&apos;t have to act on your first answer. And seeking external
          perspective is healthy. But the habit of consulting yourself first
          builds the muscle of self-reference — which is the foundation of
          self-trust.
        </p>

        <h2>Exercise 5: The recovery reflection</h2>
        <p>
          Self-trust doesn&apos;t mean never getting things wrong. It means
          trusting that you can handle it when you do.
        </p>
        <p>
          After any situation that didn&apos;t go as you hoped, sit with three
          questions:
        </p>
        <ol>
          <li>What happened, honestly?</li>
          <li>What did I do that I can learn from?</li>
          <li>What would I do differently — and what would I do the same?</li>
        </ol>
        <p>
          The goal is not to judge yourself. It is to meet yourself with the
          same honest, curious care you would offer a friend.
        </p>

        <h2>Why self-trust matters for coaching</h2>
        <p>
          In coaching, self-trust is foundational. It is what allows you to
          make decisions without needing constant external validation. To hold
          your ground in difficult conversations. To act even when you
          can&apos;t be certain of the outcome.
        </p>
        <p>
          Building it is quiet, cumulative work. But each small act of
          self-honesty and self-follow-through makes the next one a little
          easier.
        </p>
        <p>
          <Link href="/how-to-find-your-voice">
            Related: How to find your voice →
          </Link>
        </p>
        <p>
          <Link href="/ai-coaching-companion">
            The AI companion offers daily self-trust reflection prompts
            as part of the Companion by Danè experience →
          </Link>
        </p>
      </ArticleLayout>
      <Footer />
    </>
  );
}
