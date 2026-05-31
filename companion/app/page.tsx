import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Promise from "@/components/sections/Promise";
import Journey from "@/components/sections/Journey";
import Demo from "@/components/sections/Demo";
import Pricing from "@/components/sections/Pricing";
import Trust from "@/components/sections/Trust";
import WaitlistCTA from "@/components/sections/WaitlistCTA";
import Footer from "@/components/sections/Footer";
import StructuredData from "@/components/StructuredData";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "OnlineBusiness",
  name: "Companion by Danè",
  url: "https://companionai.coach",
  logo: "https://companionai.coach/og-image.png",
  description:
    "Human-led coaching with an always-on AI companion. Build confidence, clarity, self-trust and purposeful action with Companion by Danè.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Danè de Klerk",
    url: "https://companionai.coach/about-dane",
    jobTitle: "Coach",
  },
  areaServed: [
    { "@type": "Country", name: "South Africa" },
    { "@type": "AdministrativeArea", name: "Global / Online" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    url: "https://companionai.coach/contact",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "ZAR",
    lowPrice: "0",
    highPrice: "249",
    offerCount: "4",
    url: "https://companionai.coach/pricing",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <main>
        <Navbar />
        <Hero />
        <Promise />
        <Journey />
        <Demo />
        <Pricing />
        <Trust />
        <WaitlistCTA />
        <Footer />
      </main>
    </>
  );
}
