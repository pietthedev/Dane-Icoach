"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { href: "/about-dane", label: "About" },
  { href: "/ai-coaching-companion", label: "Companion" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        height: "76px",
        background: scrolled
          ? "rgba(255,255,255,0.88)"
          : "rgba(255,255,255,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(78,46,131,0.08)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px rgba(46,26,71,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" aria-label="Companion by Danè home">
          <Logo variant="compact" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-inter text-muted hover:text-plum-dark transition-colors duration-200 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="font-inter font-semibold text-sm text-plum-dark px-5 py-2.5 rounded-full border border-plum-dark hover:bg-mist transition-colors duration-200"
          >
            Sign in
          </Link>
          <Link
            href="/#start"
            className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum-dark hover:bg-plum transition-colors duration-200 shadow-soft"
          >
            Join early access
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-mist transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <span
            className={`block w-5 h-0.5 bg-plum-dark transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-plum-dark transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-plum-dark transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
        }}
        aria-hidden={!menuOpen}
      >
        <div className="px-6 py-4 flex flex-col gap-4 border-t border-mist">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-inter text-muted hover:text-plum-dark transition-colors text-sm font-medium py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="font-inter font-semibold text-sm text-plum-dark px-5 py-2.5 rounded-full border border-plum-dark text-center mt-1 hover:bg-mist transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Sign in
          </Link>
          <Link
            href="/#start"
            className="font-inter font-semibold text-sm text-white px-5 py-2.5 rounded-full bg-plum-dark text-center mt-1"
            onClick={() => setMenuOpen(false)}
          >
            Join early access
          </Link>
        </div>
      </div>
    </header>
  );
}