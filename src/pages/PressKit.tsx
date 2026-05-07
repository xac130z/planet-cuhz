import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PressKit() {
  const brandColors = [
    { name: "Deep Space", hex: "#0A0A1A", var: "--deep-space" },
    { name: "Cosmic Purple", hex: "#1A0B2E", var: "--cosmic-purple" },
    { name: "Electric Blue", hex: "#00BFFF", var: "--electric-blue" },
    { name: "Electric Cyan", hex: "#00EAFF", var: "--electric-cyan" },
    { name: "Electric Yellow", hex: "#FFD700", var: "--electric-yellow" },
    { name: "Neon Orange", hex: "#FF4500", var: "--neon-orange" },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 holographic-text text-center">
            Press Kit
          </h1>

          {/* Logo Section */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
            <CardHeader>
              <CardTitle>Logo & Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-8 bg-background/50 rounded-lg mb-4">
                <img 
                  src="/cuhz-logo.png" 
                  alt="Planet Cuhz Logo" 
                  className="max-w-xs"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Logo available in PNG format
              </p>
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {brandColors.map((color) => (
                  <div key={color.name} className="text-center">
                    <div 
                      className="w-full h-24 rounded-lg mb-2 border border-primary/20"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="font-semibold">{color.name}</p>
                    <p className="text-sm text-muted-foreground">{color.hex}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Boilerplate */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mb-8">
            <CardHeader>
              <CardTitle>About Planet Cuhz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Planet Cuhz is a creator-first AI platform connecting gamers, streamers, and creators 
                through verified squads, coaching, and AI-powered tools. Born from cosmic culture and 
                powered by community, we're building the future of gaming collaboration with NBA 2K Protocol—a 
                verified, AI-powered squad finder, hire marketplace, and coach network designed to help 
                players find their perfect 5, build smarter, and rep faster.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Press Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For press inquiries, please contact:{" "}
                <a href="mailto:press@planetcuhz.com" className="text-primary hover:underline">
                  press@planetcuhz.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
