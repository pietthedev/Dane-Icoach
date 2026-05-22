import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Promise from "@/components/sections/Promise";
import Journey from "@/components/sections/Journey";
import Demo from "@/components/sections/Demo";
import Pricing from "@/components/sections/Pricing";
import Trust from "@/components/sections/Trust";
import WaitlistCTA from "@/components/sections/WaitlistCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
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
  );
}
