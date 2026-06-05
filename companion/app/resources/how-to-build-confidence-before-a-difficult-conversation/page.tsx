import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import ArticleLayout from "@/components/ArticleLayout";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "How to Build Confidence Before a Difficult Conversation",
  description:
    "Practical steps to ground yourself, clarify your intention and speak your truth — even when it feels uncomfortable. A coaching guide.",
  alternates: {
    canonical:
      "https://companionai.coach/resources/how-to-build-confidence-before-a-difficult-conversation",
  },
  openGraph: {
    title: "How to Build Confidence Before a Difficult Conversation",
    description:
      "Practical steps to ground yourself, clarify your intention and speak your truth — even when it feels uncomfortable.",
    url: "https://companionai.coach/resources/how-to-build-confidence-before-a-difficult-conversation",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Build Confidence Before a Difficult Conversation",
  description:
    "Practical steps to ground yourself, clarify your intention and speak your truth before a difficult conversation.",
  author: { "@type": "Person", name: "Danè de Klerk", url: "https://companionai.coach/about-dane" },
  publisher: { "@type": "Organization", name: "Companion by Danè", url: "https://companionai.coach" },
  url: "https://companionai.coach/resources/how-to-build-confidence-before-a-difficult-conversation",
  datePublished: "2026-05-23",
  dateModified: "2026-05-23",
};

export default function DifficultConversationPage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <Navbar />
      <ArticleLayout
        breadcrumbLabel="Confidence before a difficult conversation"
        breadcrumbHref="/resources/how-to-build-confidence-before-a-difficult-conversation"
      >
        <h1>How to build confidence before a difficult conversation</h1>

        <div className="answer-block">
          <p>
            <strong>Short answer:</strong> Before a difficult conversation,
            ground yourself by getting clear on your intention (not just your
            outcome), naming what you&apos;re feeling, and identifying the one
            thing you most need to say. Confidence in these moments isn&apos;t
            the absence of nerves — it&apos;s the presence of clarity.
          </p>
        </div>

        <p>
          Difficult conversations have something in common: they matter to you.
          You&apos;re not nervous about conversations you don&apos;t care about.
          The nerves are a signal that something real is at stake — your
          relationships, your integrity, your sense of self.
        </p>
        <p>
          The goal is not to eliminate the nerves. It&apos;s to build enough
          clarity and grounding that the nerves don&apos;t run the show.
        </p>

        <h2>Step 1: Clarify your intention — not just your outcome</h2>
        <p>
          Most people prepare for difficult conversations by thinking about what
          they want the other person to do: apologise, change, agree, back down.
          This framing puts you in a passive position — waiting for someone else
          to give you what you need.
        </p>
        <p>
          Try a different question: <em>What do I want to bring to this
          conversation?</em>
        </p>
        <p>
          An outcome is something the other person controls. An intention is
          something you control. You can intend to be honest, grounded, direct
          and respectful — regardless of how the other person responds.
        </p>
        <p>
          <em>Example:</em> Instead of &ldquo;I want my manager to acknowledge
          my contribution,&rdquo; try &ldquo;I intend to clearly describe the
          work I did and how I felt about not being recognised.&rdquo; The first
          depends on them. The second depends on you.
        </p>

        <h2>Step 2: Name what you&apos;re feeling — without being controlled by it</h2>
        <p>
          Before a difficult conversation, take five minutes to check in with
          yourself. What are you actually feeling? Write it down if it helps.
        </p>
        <p>
          Common emotions before a difficult conversation: fear of conflict,
          anger at injustice, sadness about a relationship change, anxiety about
          being misunderstood, shame about needing to raise something.
        </p>
        <p>
          Naming the emotion has a grounding effect. When you can say &ldquo;I
          feel anxious because I&apos;m afraid of being dismissed,&rdquo; you
          have a little more distance from the anxiety. You are not the emotion —
          you are the person experiencing it.
        </p>

        <h2>Step 3: Identify the one thing you most need to say</h2>
        <p>
          Difficult conversations can easily spiral into too many things at
          once: the original issue, everything that came before it, everything
          that might come after it, and everything you&apos;ve been holding back
          for months.
        </p>
        <p>
          Before the conversation, ask yourself: <em>If I could only say one
          thing, what is the most important thing to say?</em>
        </p>
        <p>
          This doesn&apos;t mean you only say one thing. It means you have a
          clear centre to return to if the conversation goes off track or gets
          heated.
        </p>

        <h2>Step 4: Ground your body</h2>
        <p>
          Confidence is not purely mental. It lives in the body too. In the
          minutes before a difficult conversation, your body may be in a mild
          stress response — heart rate elevated, breath shallow, shoulders
          tight.
        </p>
        <p>Simple grounding practices that work:</p>
        <ul>
          <li>Take three slow, deliberate breaths before you begin</li>
          <li>Feel your feet on the floor — weight, pressure, steadiness</li>
          <li>Soften your shoulders if they&apos;ve crept up</li>
          <li>Notice one thing you can see in the room</li>
        </ul>
        <p>
          These are not tricks to fake confidence. They are ways of bringing
          your nervous system back to a place where you can think and speak
          clearly.
        </p>

        <h2>Step 5: Give yourself permission to be imperfect</h2>
        <p>
          One reason people freeze before difficult conversations is the
          pressure to say it perfectly. The right words, the right tone, the
          right response to whatever the other person might say.
        </p>
        <p>
          That pressure is a trap. Perfect conversations don&apos;t exist. What
          matters is that you show up with honesty and care — not that you
          execute a flawless script.
        </p>
        <p>
          Give yourself permission to stumble, to pause, to say &ldquo;I need a
          moment to think.&rdquo; These are signs of self-awareness, not
          weakness.
        </p>

        <h2>After the conversation</h2>
        <p>
          Whatever the outcome, take a few minutes afterwards to reflect. What
          did you do well? What would you do differently? What did the
          conversation tell you about yourself?
        </p>
        <p>
          Growth in how you navigate difficult conversations is cumulative. Each
          one teaches you something — if you pause long enough to notice.
        </p>

        <p>
          <Link href="/ai-coaching-companion">
            The AI companion can help you prepare for and reflect on difficult
            conversations →
          </Link>
        </p>
      </ArticleLayout>
      <Footer />
    </>
  );
}
