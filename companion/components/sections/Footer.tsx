import Link from "next/link";
import Logo from "../Logo";

const footerLinks = {
  Platform: [
    { label: "About Danè", href: "/about-dane" },
    { label: "AI Coaching Companion", href: "/ai-coaching-companion" },
    { label: "Integral Coaching", href: "/integral-coaching" },
    { label: "Pricing", href: "/pricing" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Resources", href: "/resources" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#2E1A47" }} role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top row */}
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo variant="compact" onDark />
            <p
              className="font-inter text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Human-led coaching with an always-on AI companion. Built for
              reflection, confidence and purposeful growth.
            </p>
            <p className="font-inter text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              Not therapy or crisis support.
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p
                className="font-inter font-semibold text-xs uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-inter text-sm transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p
            className="font-inter text-sm text-center"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            © {new Date().getFullYear()} Companion by Danè. Human-led coaching, AI-supported.
          </p>
          <p
            className="font-inter text-sm text-center"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontStyle: "italic",
            }}
          >
            Find your voice. Trust yourself. Discover your superpower.
          </p>
        </div>
      </div>
    </footer>
  );
}
