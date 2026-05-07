import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Changelog() {
  const releases = [
    {
      date: "2025-10-11",
      version: "NBA 2K Protocol Launch",
      changes: [
        "Added Squad Finder with chemistry-based matching",
        "Added Team Assembly Concierge service",
        "Added 7-Game Hire marketplace with escrow",
        "Added Coaching Sprint bookings",
        "Launched Founders Premium program"
      ]
    },
    {
      date: "2025-09-15",
      version: "Community Features",
      changes: [
        "Launched platform with live features",
        "Added daily limits and achievements",
        "Integrated Twitch streaming",
        "Added user profiles and onboarding"
      ]
    },
    {
      date: "2025-08-01",
      version: "Platform Launch",
      changes: [
        "Initial launch of Planet Cuhz",
        "Basic authentication system",
        "Cosmic design system implementation",
        "Whitepaper and roadmap published"
      ]
    }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 holographic-text text-center">
            Changelog
          </h1>

          <div className="space-y-6">
            {releases.map((release, idx) => (
              <Card key={idx} className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">{release.version}</CardTitle>
                  <CardDescription>{release.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {release.changes.map((change, changeIdx) => (
                      <li key={changeIdx} className="flex items-start gap-2">
                        <span className="text-electric-cyan">•</span>
                        <span className="text-muted-foreground">{change}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
