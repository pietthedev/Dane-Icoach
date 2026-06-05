import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import ArticleLayout from "@/components/ArticleLayout";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "How to Find Your Voice — A Practical Coaching Guide",
  description:
    "What does it really mean to 'find your voice'? A practical coaching guide with reflection exercises to help you speak more clearly, confidently and authentically.",
  alternates: { canonical: "https://companionai.coach/resources/how-to-find-your-voice" },
  openGraph: {
    title: "How to Find Your Voice — A Practical Coaching Guide",
    description:
      "What does it mean to find your voice? A practical guide with reflection exercises for speaking more clearly and confidently.",
    url: "https://companionai.coach/resources/how-to-find-your-voice",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Find Your Voice — A Practical Coaching Guide",
  description:
    "What does it really mean to find your voice? Reflection exercises for speaking more clearly and confidently.",
  author: { "@type": "Person", name: "Danè de Klerk", url: "https://companionai.coach/about-dane" },
  publisher: { "@type": "Organization", name: "Companion by Danè", url: "https://companionai.coach" },
  url: "https://companionai.coach/resources/how-to-find-your-voice",
  datePublished: "2026-05-23",
  dateModified: "2026-05-23",
};

export default function HowToFindYourVoicePage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <Navbar />
      <ArticleLayout
        breadcrumbLabel="How to find your voice"
        breadcrumbHref="/resources/how-to-find-your-voice"
      >
        <h1>How to find your voice</h1>

        <div className="answer-block">
          <p>
            <strong>Short answer:</strong> Finding your voice means learning to
            speak from a place of honesty and self-awareness — not performing
            confidence, but expressing what is genuinely true for you. It starts
            with knowing what you think and feel, and building the trust that
            what you have to say matters.
          </p>
        </div>

        <p>
          &ldquo;Find your voice&rdquo; is a phrase used so often it can start
          to feel hollow. But for many people — those who hold back in meetings,
          who over-explain their decisions, who shrink in conversations they care
          about — it describes something very real.
        </p>
        <p>
          Finding your voice is not about becoming louder, more assertive or
          more confident in a performing sense. It is about becoming more honest.
          More clear. More willing to let what is true for you be visible to
          others.
        </p>

        <h2>What &ldquo;voice&rdquo; really means</h2>
        <p>
          In a coaching context, &ldquo;voice&rdquo; has layers:
        </p>
        <ul>
          <li>
            <strong>The inner voice</strong> — how clearly you hear your own
            thoughts, needs and values
          </li>
          <li>
            <strong>The expressed voice</strong> — how honestly and clearly you
            communicate those things to others
          </li>
          <li>
            <strong>The embodied voice</strong> — how your body supports or
            undermines what you are trying to say
          </li>
        </ul>
        <p>
          Most people focus on the expressed voice — how to speak up, what words
          to use. But it&apos;s hard to speak clearly to others if you
          haven&apos;t first been honest with yourself. Finding your voice starts
          inside.
        </p>

        <h2>Why people lose their voice</h2>
        <p>
          No one is born silent. Children are famously unafraid to say what they
          think. Voice gets lost gradually — through experiences that taught us
          it was safer to hold back.
        </p>
        <p>Common patterns:</p>
        <ul>
          <li>Being told your opinions were wrong, silly or inappropriate</li>
          <li>
            Learning that speaking up led to conflict, rejection or
            embarrassment
          </li>
          <li>Working in environments where certain voices were consistently
            devalued</li>
          <li>
            Internalising the belief that your perspective is less valid than
            others&apos;
          </li>
        </ul>
        <p>
          These patterns are learned. Which means they can be unlearned — though
          it takes time, patience and practice.
        </p>

        <h2>Reflection exercises for finding your voice</h2>

        <h3>1. The unsent letter</h3>
        <p>
          Think of a situation where you held back something you genuinely
          needed to say. Write a letter to the person involved — one you
          won&apos;t send — saying exactly what you would have liked to say,
          without editing yourself.
        </p>
        <p>
          Notice what comes up. What did you hold back? Why? What does it feel
          like to say it now, even on paper?
        </p>

        <h3>2. Finish the sentence</h3>
        <p>
          Complete these prompts without thinking too hard:
        </p>
        <ul>
          <li>Something I rarely say out loud is...</li>
          <li>When I hold back, it&apos;s usually because I&apos;m afraid of...</li>
          <li>My perspective matters because...</li>
          <li>The last time I spoke up and it went well was...</li>
        </ul>
        <p>
          Don&apos;t analyse the answers immediately. Just notice what your honest
          first responses are.
        </p>

        <h3>3. The smallest brave thing</h3>
        <p>
          Finding your voice doesn&apos;t require a grand gesture. It is built
          through small moments of honesty, repeated.
        </p>
        <p>
          This week, identify one small situation where you could say something
          true that you would normally hold back. Not a confrontation. Just one
          honest thing. Notice what it feels like.
        </p>

        <h3>4. Speak to understand, not to impress</h3>
        <p>
          Many people hold back because they feel their contribution needs to be
          perfect, insightful or impressive before it&apos;s worth saying.
        </p>
        <p>
          Try a different goal: speak to understand, not to impress. Ask the
          question you genuinely have. Say the observation you&apos;re sitting
          with. Contribution doesn&apos;t need to be polished to be valuable.
        </p>

        <h2>The role of self-trust in finding your voice</h2>
        <p>
          Behind most silences is a lack of self-trust. The quiet belief that
          your instincts, perspectives and contributions might be wrong, less
          valuable or unwelcome.
        </p>
        <p>
          Building self-trust is a gradual process. It comes from taking small
          risks and noticing that you survive them. From being honest in low-stakes
          situations and finding that the world doesn&apos;t end. From tracking
          the moments when your voice actually made a difference.
        </p>
        <p>
          <Link href="/resources/self-trust-coaching-exercises">
            Read: Self-trust coaching exercises →
          </Link>
        </p>
        <p>
          <Link href="/ai-coaching-companion">
            The AI companion offers daily prompts specifically designed to help
            you find and strengthen your voice →
          </Link>
        </p>
      </ArticleLayout>
      <Footer />
    </>
  );
}
