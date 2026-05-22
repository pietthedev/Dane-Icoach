import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Contact | Companion by Danè",
  description:
    "Get in touch with Companion by Danè — for early access, team packages, coaching enquiries or general questions. We'd love to hear from you.",
  alternates: { canonical: "https://companionai.coach/contact" },
  openGraph: {
    title: "Contact | Companion by Danè",
    description:
      "Get in touch with Companion by Danè — for early access, team packages, coaching enquiries or general questions.",
    url: "https://companionai.coach/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <Breadcrumbs crumbs={[{ label: "Contact", href: "/contact" }]} />

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-4 md:pt-14">
        <span className="block font-inter font-semibold text-lavender uppercase tracking-widest text-xs mb-4">
          Get in touch
        </span>
        <h1
          className="font-poppins font-bold text-plum-dark heading-tight mb-4 max-w-xl"
          style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
        >
          We&apos;d love to hear from you
        </h1>
        <p className="font-inter text-muted text-lg leading-relaxed max-w-lg">
          Whether you&apos;re curious about early access, interested in a team
          package or just want to ask a question — reach out. Danè or a team
          member will get back to you.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact options */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[28px] p-7 border border-mist shadow-soft flex flex-col gap-3">
              <span aria-hidden="true" className="text-2xl">✉️</span>
              <h2 className="font-poppins font-bold text-plum-dark text-lg heading-tight">
                Email us
              </h2>
              <p className="font-inter text-muted text-sm leading-relaxed">
                For general enquiries, early access questions or coaching
                information:
              </p>
              <a
                href="mailto:dane@companionai.coach"
                className="font-inter font-semibold text-plum-dark text-sm hover:text-plum transition-colors"
              >
                dane@companionai.coach
              </a>
            </div>

            <div className="bg-white rounded-[28px] p-7 border border-mist shadow-soft flex flex-col gap-3">
              <span aria-hidden="true" className="text-2xl">🏢</span>
              <h2 className="font-poppins font-bold text-plum-dark text-lg heading-tight">
                Team & company packages
              </h2>
              <p className="font-inter text-muted text-sm leading-relaxed">
                Interested in coaching for your team or organisation? We offer
                custom packages for businesses. Get in touch to discuss.
              </p>
              <a
                href="mailto:dane@companionai.coach?subject=Team%20Package%20Enquiry"
                className="font-inter font-semibold text-plum-dark text-sm hover:text-plum transition-colors"
              >
                Enquire about team packages →
              </a>
            </div>

            <div className="bg-white rounded-[28px] p-7 border border-mist shadow-soft flex flex-col gap-3">
              <span aria-hidden="true" className="text-2xl">⏱</span>
              <h2 className="font-poppins font-bold text-plum-dark text-lg heading-tight">
                Response time
              </h2>
              <p className="font-inter text-muted text-sm leading-relaxed">
                We aim to respond within 1–2 business days. During the early
                access phase, response times may be slightly longer as we grow.
              </p>
            </div>
          </div>

          {/* Early access CTA */}
          <div className="flex flex-col gap-5">
            <div
              className="rounded-[34px] p-8 flex flex-col gap-5"
              style={{
                background:
                  "linear-gradient(135deg, #2E1A47 0%, #4B2E83 100%)",
              }}
            >
              <span className="font-inter font-semibold text-xs uppercase tracking-widest" style={{ color: "#FF6F9F" }}>
                Ready to start?
              </span>
              <h2
                className="font-poppins font-bold text-white heading-tight"
                style={{ fontSize: "clamp(20px, 2.5vw, 30px)" }}
              >
                Join early access
              </h2>
              <p className="font-inter text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                Be among the first to experience Companion by Danè. Get access
                to the AI companion and a free welcome check-in with Danè.
              </p>
              <Link
                href="/#start"
                className="inline-flex font-inter font-semibold text-sm text-plum-dark px-6 py-3 rounded-full bg-white hover:bg-cloud transition-colors duration-200 shadow-soft w-fit"
              >
                Join early access
              </Link>
              <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                Limited early-access welcome check-ins available.
              </p>
            </div>

            <div className="bg-white rounded-[28px] p-6 border border-mist shadow-soft">
              <p className="font-inter text-muted text-sm leading-relaxed">
                Looking for answers first?{" "}
                <Link href="/faq" className="text-plum-dark font-semibold underline">
                  Browse the FAQ
                </Link>
                ,{" "}
                <Link href="/pricing" className="text-plum-dark font-semibold underline">
                  explore pricing
                </Link>
                {" "}or{" "}
                <Link href="/about-dane" className="text-plum-dark font-semibold underline">
                  learn about Danè
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        heading="Human-led. AI-supported."
        body="Coaching that reflects, supports and challenges — at your pace, on your terms."
        primaryLabel="Join early access"
        primaryHref="/#start"
        secondaryLabel={undefined}
        microcopy="Not therapy or crisis support. For emergencies, contact local services."
      />
      <Footer />
    </>
  );
}
