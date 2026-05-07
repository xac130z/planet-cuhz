import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useProfileCount } from "@/hooks/useProfileCount";

export default function Protocol() {
  const { count, loading: countLoading } = useProfileCount();
  const features = [
    "Chemistry-based Squad Finder",
    "Player-for-hire marketplace (escrow-ready)",
    "Streamer coaches & 1:1 build consulting",
    "AI Build Assistant (Optional Tool)",
    "Alerts when your match is ready"
  ];

  const founder = {
    id: "pcz-founder-run",
    name: "Run_itsz_xac130z",
    title: "Founder • Top 10 Region 2K26",
    description: "Elite Park & Rec specialist"
  };

  const corePartners = [
    {
      id: "pcz-partner-four",
      name: "Four-A-Reason",
      title: "PSN • Legend x2 • Top 100 Rep",
      description: "Build optimization expert"
    },
    {
      id: "pcz-partner-rico",
      name: "Rico2ez",
      title: "Xbox • Pro-Am Veteran",
      description: "Team strategy consultant"
    }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Hero Section */}
          <section id="pcz-protocol-hero" className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 holographic-text">
              Find your 5. Build smarter. Rep faster.
            </h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
              Verified, AI-powered squad finder, hire marketplace, and coach network by Planet Cuhz.
            </p>
            
            {/* Dynamic Squad Count Badge */}
            {!countLoading && count !== null && count > 0 && (
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-primary font-semibold">{count} Squad Members Active</span>
              </div>
            )}

            <div id="pcz-protocol-cta-row" className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" id="pcz-join-free">
                <a href="/protocol/auth">Join Free</a>
              </Button>
              <Button asChild size="lg" variant="outline" id="pcz-see-deals">
                <a href="/protocol/assembly-request">See Deals</a>
              </Button>
            </div>
          </section>

          {/* Features Section */}
          <section id="pcz-protocol-features" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 holographic-text">What's Included</h2>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-electric-cyan flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Founder Section */}
          <section id="pcz-protocol-founder" className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 holographic-text">Meet Our Founder</h2>
            <div className="max-w-md mx-auto">
              <Card id={founder.id} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary text-2xl">{founder.name}</CardTitle>
                  <CardDescription className="text-lg">{founder.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg">{founder.description}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Core Partners Section */}
          <section id="pcz-protocol-partners" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 holographic-text">Core Partners</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {corePartners.map((partner) => (
                <Card key={partner.id} id={partner.id} className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary">{partner.name}</CardTitle>
                    <CardDescription>{partner.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{partner.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
