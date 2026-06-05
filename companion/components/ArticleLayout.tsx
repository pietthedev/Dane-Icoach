import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import CTASection from "./CTASection";
import TrustNotice from "./TrustNotice";

interface ArticleLayoutProps {
  breadcrumbLabel: string;
  breadcrumbHref: string;
  children: React.ReactNode;
  showDisclaimer?: boolean;
}

export default function ArticleLayout({
  breadcrumbLabel,
  breadcrumbHref,
  children,
  showDisclaimer = false,
}: ArticleLayoutProps) {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Resources", href: "/resources" },
          { label: breadcrumbLabel, href: breadcrumbHref },
        ]}
      />
      <article className="max-w-3xl mx-auto px-6 py-10 md:py-14">
        <div className="prose-companion">{children}</div>
      </article>
      {showDisclaimer && <TrustNotice />}
      <CTASection
        heading="Take the next step"
        body="Companion by Danè brings human coaching together with an always-on AI companion. Join early access and start your journey."
        secondaryLabel="Explore pricing"
        secondaryHref="/pricing"
      />
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <Link
          href="/resources"
          className="font-inter text-sm text-lavender hover:text-plum-dark transition-colors"
        >
          ← Back to resources
        </Link>
      </div>
    </>
  );
}
