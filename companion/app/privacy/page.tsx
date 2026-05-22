import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustNotice from "@/components/TrustNotice";

export const metadata: Metadata = {
  title: "Privacy Policy | Companion by Danè",
  description:
    "How Companion by Danè handles your personal data, coaching reflections and privacy. POPIA-aware, consent-driven and transparent.",
  alternates: { canonical: "https://companionai.coach/privacy" },
  openGraph: {
    title: "Privacy Policy | Companion by Danè",
    description:
      "How Companion by Danè handles your personal data, coaching reflections and privacy.",
    url: "https://companionai.coach/privacy",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function PrivacyPage() {
  const updated = "23 May 2026";

  return (
    <>
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "Privacy Policy", href: "/privacy" }]} />

      <article className="max-w-3xl mx-auto px-6 py-10 md:py-14">
        <span className="block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-4">
          Legal
        </span>
        <h1
          className="font-poppins font-bold text-plum-dark heading-tight mb-4"
          style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
        >
          Privacy Policy
        </h1>
        <p className="font-inter text-muted text-sm mb-8">
          Last updated: {updated}
        </p>

        <div className="prose-companion">

          <h2>Who we are</h2>
          <p>
            Companion by Danè is a coaching and personal growth platform
            operated by Danè de Klerk. For questions about this policy, contact
            us at{" "}
            <a href="mailto:dane@companionai.coach">dane@companionai.coach</a>.
          </p>

          <h2>What personal data we may collect</h2>
          <p>When you use this website or join the waitlist, we may collect:</p>
          <ul>
            <li>Your name and email address (from the waitlist form)</li>
            <li>Your interest or coaching focus area (optional, from the form)</li>
            <li>Basic usage data through analytics (if enabled — see below)</li>
            <li>
              Coaching reflections and responses you share with the AI companion
              (when the platform is live)
            </li>
          </ul>

          <h2>Why we collect it</h2>
          <ul>
            <li>
              <strong>Waitlist data</strong> — to contact you about early access
              and platform updates, and to understand which coaching services
              interest you.
            </li>
            <li>
              <strong>Coaching reflections</strong> — to power the AI
              companion&apos;s responses and personalise your coaching journey.
            </li>
            <li>
              <strong>Analytics</strong> — to understand how the website is
              used so we can improve it. We use privacy-aware analytics only.
            </li>
          </ul>

          <h2>How coaching reflections are handled</h2>
          <p>
            Coaching reflections you share with the AI companion are treated
            with the same confidentiality as a human coaching session. We will
            not sell, share or publicly disclose your personal reflections.
          </p>
          <p>
            If anonymised, aggregated insights are ever used to improve the
            platform, this will only happen with your explicit consent and in a
            form that cannot identify you.
          </p>

          <h2>AI processing</h2>
          <p>
            The AI companion uses AI language model technology to process your
            inputs and generate responses. Your conversations with the companion
            may be processed by AI systems. We take steps to minimise data
            retention and protect your privacy in this process.
          </p>
          <p>
            The AI companion does not make medical, psychological or legal
            determinations about you. It is a reflection support tool only.
          </p>

          <h2>Data sharing</h2>
          <p>
            We do not sell your personal data. We may share limited data with
            trusted service providers who help us operate the platform (for
            example, email delivery or database infrastructure), subject to
            appropriate data processing agreements.
          </p>

          <h2>Your rights (POPIA and general)</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Unsubscribe from communications at any time</li>
          </ul>
          <p>
            To exercise any of these rights, contact{" "}
            <a href="mailto:dane@companionai.coach">dane@companionai.coach</a>.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            This website may use minimal analytics to understand traffic
            patterns. No advertising trackers or third-party marketing cookies
            are used by default. If analytics are enabled, only aggregated,
            privacy-respecting data is collected.
          </p>

          <h2>Children</h2>
          <p>
            This service is intended for adults aged 18 and over. We do not
            knowingly collect data from children.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy as the platform evolves. Significant
            changes will be communicated to registered users by email. The date
            at the top of this page will always reflect the latest version.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about privacy?{" "}
            <Link href="/contact" className="underline text-plum-dark">
              Contact us
            </Link>{" "}
            or email{" "}
            <a href="mailto:dane@companionai.coach">dane@companionai.coach</a>.
          </p>
        </div>
      </article>

      <TrustNotice />
      <Footer />
    </>
  );
}
