import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustNotice from "@/components/TrustNotice";

export const metadata: Metadata = {
  title: "Terms of Service | Companion by Danè",
  description:
    "Terms of service for Companion by Danè — coaching service scope, AI companion limitations, subscriptions, cancellation and acceptable use.",
  alternates: { canonical: "https://companionai.coach/terms" },
  openGraph: {
    title: "Terms of Service | Companion by Danè",
    description:
      "Terms of service for Companion by Danè — coaching service scope, AI companion limitations, subscriptions and cancellation.",
    url: "https://companionai.coach/terms",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function TermsPage() {
  const updated = "23 May 2026";

  return (
    <>
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "Terms of Service", href: "/terms" }]} />

      <article className="max-w-3xl mx-auto px-6 py-10 md:py-14">
        <span className="block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-4">
          Legal
        </span>
        <h1
          className="font-poppins font-bold text-plum-dark heading-tight mb-4"
          style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
        >
          Terms of Service
        </h1>
        <p className="font-inter text-muted text-sm mb-8">
          Last updated: {updated}
        </p>

        <div className="prose-companion">

          <h2>1. Overview</h2>
          <p>
            Companion by Danè is a coaching and personal growth platform
            operated by Danè de Klerk. By using this website or platform, you
            agree to these terms. If you do not agree, please do not use the
            service.
          </p>

          <h2>2. What this service is</h2>
          <p>
            Companion by Danè provides coaching and personal growth support
            through a combination of human coaching sessions with Danè de Klerk
            and an AI-powered reflection companion. The service is designed for
            adults seeking to build confidence, clarity, self-trust and
            purposeful action.
          </p>

          <h2>3. What this service is not</h2>
          <p>
            <strong>
              This service is not therapy, psychiatry, psychology, medical
              advice, crisis intervention or emergency mental-health support.
            </strong>
          </p>
          <p>
            The AI companion and human coaching sessions do not constitute a
            therapeutic or clinical relationship. Nothing in this service should
            be interpreted as a diagnosis, treatment plan or clinical
            recommendation.
          </p>
          <p>
            If you are experiencing a mental-health crisis, thoughts of
            self-harm or harm to others, or any emergency, please contact your
            local emergency services or a qualified mental-health professional
            immediately.
          </p>

          <h2>4. AI companion limitations</h2>
          <p>The AI companion:</p>
          <ul>
            <li>Is an automated tool and not a human being</li>
            <li>
              May produce inaccurate, incomplete or contextually inappropriate
              responses
            </li>
            <li>Should not be relied upon for critical decisions</li>
            <li>Is not a substitute for professional advice of any kind</li>
            <li>
              Does not retain memory between sessions unless the platform
              explicitly supports this feature
            </li>
          </ul>

          <h2>5. Subscriptions and payment</h2>
          <p>
            Paid plans are billed monthly in South African Rand (ZAR) unless
            otherwise stated. By subscribing, you authorise recurring charges
            at the stated plan price until cancelled.
          </p>
          <p>
            Prices are subject to change with reasonable notice. You will be
            informed of any pricing changes before they take effect.
          </p>

          <h2>6. Cancellation</h2>
          <p>
            You may cancel your subscription at any time. Cancellation takes
            effect at the end of the current billing period. No partial refunds
            are issued for unused portions of the current billing month unless
            otherwise agreed.
          </p>

          <h2>7. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              Use the service to harass, threaten or harm yourself or others
            </li>
            <li>Attempt to manipulate or misuse the AI companion</li>
            <li>Share false information that could mislead others</li>
            <li>
              Use the service for any unlawful purpose or in violation of
              applicable law
            </li>
            <li>
              Attempt to reverse-engineer, scrape or extract proprietary content
              from the platform
            </li>
          </ul>

          <h2>8. Intellectual property</h2>
          <p>
            All content, design, coaching methodology and materials on this
            platform remain the intellectual property of Danè de Klerk and
            Companion by Danè. You may not reproduce, distribute or resell any
            content without written permission.
          </p>

          <h2>9. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Companion by Danè and Danè
            de Klerk accept no liability for any loss, harm or damage arising
            from your use of this service, including any reliance on AI
            companion responses.
          </p>

          <h2>10. Changes to these terms</h2>
          <p>
            We may update these terms as the platform evolves. Continued use of
            the service after updates constitutes acceptance of the revised
            terms. Significant changes will be communicated to registered users.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about these terms?{" "}
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
