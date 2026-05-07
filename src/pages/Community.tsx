import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StorySection } from "@/components/StorySection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Community() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20">
        {/* JOIN OUR CUHZUNITY section */}
        <StorySection />

        {/* Social Links */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-8 holographic-text">
              Connect With Us
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <CardHeader>
                  <CardTitle>Discord</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Join our cosmic community</p>
                  <Button asChild className="w-full">
                    <a href="https://discord.gg/eNxDKkxQdN" target="_blank" rel="noopener noreferrer">
                      Join Discord
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <CardHeader>
                  <CardTitle>Twitter/X</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Follow for updates</p>
                  <Button asChild className="w-full">
                    <a href="https://twitter.com/planetcuhz" target="_blank" rel="noopener noreferrer">
                      Follow Us
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center">
                <CardHeader>
                  <CardTitle>Twitch</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Watch live streams</p>
                  <Button asChild className="w-full">
                    <a href="https://www.twitch.tv/fourareason4" target="_blank" rel="noopener noreferrer">
                      Watch Live
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Communities (Placeholder) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cosmic-purple/10">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-8 holographic-text">
              Featured Communities
            </h2>
            <p className="text-center text-muted-foreground">
              Coming soon: Discover other cosmic communities in the Planet Cuhz universe
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
