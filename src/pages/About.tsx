import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CosmicGrimoire } from "@/components/CosmicGrimoire";

export default function About() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Mission Statement */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 holographic-text">
              About Planet Cuhz
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A creator-first AI platform bringing cosmic culture to verified squads, 
              empowering gamers and streamers to build, grow, and thrive together.
            </p>
          </div>
        </section>

        {/* The Story of CUHZ (Cosmic Chronicles) */}
        <CosmicGrimoire />
      </main>

      <Footer />
    </div>
  );
}
