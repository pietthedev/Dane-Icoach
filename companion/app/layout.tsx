import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const BASE_URL = "https://companionai.coach";

export const viewport: Viewport = {
  themeColor: "#4B2E83",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Companion by Danè | AI Coaching Companion for Confidence & Clarity",
    template: "%s | Companion by Danè",
  },
  description:
    "Human-led coaching with an always-on AI companion. Build confidence, clarity, self-trust and purposeful action with Companion by Danè.",
  keywords: [
    "AI coaching companion",
    "AI coach",
    "online coaching",
    "integral coaching",
    "confidence coaching",
    "self-trust coaching",
    "personal growth coaching",
    "human-led AI coaching",
    "coaching companion",
    "AI-supported coaching",
    "online coach South Africa",
  ],
  authors: [{ name: "Danè de Klerk", url: `${BASE_URL}/about-dane` }],
  creator: "Danè de Klerk",
  publisher: "Companion by Danè",
  alternates: {
    canonical: BASE_URL,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Companion",
  },
  openGraph: {
    title: "Companion by Danè | AI Coaching Companion for Confidence & Clarity",
    description:
      "Human-led coaching with an always-on AI companion. Build confidence, clarity, self-trust and purposeful action with Companion by Danè.",
    url: BASE_URL,
    siteName: "Companion by Danè",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Companion by Danè — AI Coaching Companion for Confidence & Clarity",
      },
    ],
    type: "website",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Companion by Danè | AI Coaching Companion for Confidence & Clarity",
    description:
      "Human-led coaching with an always-on AI companion. Build confidence, clarity, self-trust and purposeful action with Companion by Danè.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Webmaster verification — populate via environment variables
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION && {
        other: { "msvalidate.01": [process.env.NEXT_PUBLIC_BING_VERIFICATION] },
      }),
    },
  }),
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        {children}

        {/* Google Analytics 4 — only loads when NEXT_PUBLIC_GA_ID is set */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
