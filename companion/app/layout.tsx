import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Companion by Danè | AI Coaching Companion",
  description:
    "A human-led coaching experience powered by an always-on AI companion — with clarity, reflection and purpose.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Companion by Danè | AI Coaching Companion",
    description:
      "A human-led coaching experience powered by an always-on AI companion — with clarity, reflection and purpose.",
    url: "https://companionai.coach",
    siteName: "Companion by Danè",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Companion by Danè — AI Coaching Companion",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Companion by Danè | AI Coaching Companion",
    description:
      "A human-led coaching experience powered by an always-on AI companion — with clarity, reflection and purpose.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
