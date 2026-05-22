import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          dark: "#2E1A47",
          DEFAULT: "#4B2E83",
        },
        lavender: "#7E64B5",
        mist: "#E8E1F7",
        blush: "#F3D7E6",
        accent: "#FF6F9F",
        muted: "#6E667A",
        cloud: "#FAF9FD",
        ink: "#2E2A36",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "28px",
        "5xl": "38px",
        hero: "38px",
      },
      boxShadow: {
        soft: "0 12px 35px rgba(46,26,71,0.09)",
        strong: "0 22px 70px rgba(46,26,71,0.13)",
        card: "0 8px 24px rgba(46,26,71,0.08)",
      },
      letterSpacing: {
        tightest: "-0.055em",
      },
      lineHeight: {
        tighter: "1.03",
      },
    },
  },
  plugins: [],
};
export default config;
