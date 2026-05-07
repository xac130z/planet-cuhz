
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProtocolPromoPanel } from "@/components/ProtocolPromoPanel";
import { StreamerSpotlight } from "@/components/StreamerSpotlight";
import { StorySection } from "@/components/StorySection";
import { CosmicGrimoire } from "@/components/CosmicGrimoire";
import { Team } from "@/components/Team";
import PartnersMarquee from "@/components/PartnersMarquee";
import { Community } from "@/components/Community";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Neon Cosmic Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/5 via-transparent to-electric-cyan/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-electric-cyan/3 via-transparent to-electric-purple/3"></div>
      </div>
      
      <Header />
      <div className="pt-16 sm:pt-20">
        <Hero />
        <ProtocolPromoPanel />
        <StreamerSpotlight />
        <StorySection />
        <CosmicGrimoire />
        <Team />
        <PartnersMarquee />
        <Community />
      </div>

    </div>
  );
};

export default Index;
