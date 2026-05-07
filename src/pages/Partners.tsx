import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PartnersMarquee from "@/components/PartnersMarquee";

export default function Partners() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20">
        <PartnersMarquee />
      </main>

      <Footer />
    </div>
  );
}
