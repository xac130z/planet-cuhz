import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Team } from "@/components/Team";

export default function TeamPage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 holographic-text">
            Our Team
          </h1>
          <p className="text-xl text-muted-foreground">
            Meet the cosmic crew behind Planet Cuhz
          </p>
        </div>
        
        <Team />
      </main>

      <Footer />
    </div>
  );
}
