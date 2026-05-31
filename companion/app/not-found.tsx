import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page may have moved, but your next step is still here.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center">
        <span
          className="font-poppins font-bold mb-4"
          style={{ fontSize: "clamp(64px, 12vw, 120px)", color: "#E8E1F7", lineHeight: 1 }}
          aria-hidden="true"
        >
          404
        </span>
        <h1
          className="font-poppins font-bold text-plum-dark heading-tight mb-4"
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
        >
          Page not found
        </h1>
        <p className="font-inter text-muted text-lg leading-relaxed max-w-md mb-8">
          This page may have moved, but your next step is still here.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="font-inter font-semibold text-sm text-white px-6 py-3 rounded-full bg-plum-dark hover:bg-plum transition-colors duration-200 shadow-soft"
          >
            Back home
          </Link>
          <Link
            href="/#start"
            className="font-inter font-semibold text-sm text-plum-dark px-6 py-3 rounded-full bg-white border border-mist hover:border-lavender transition-colors duration-200 shadow-card"
          >
            Join early access
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
