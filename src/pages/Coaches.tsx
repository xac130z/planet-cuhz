import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from 'lucide-react';

const coaches = [
  {
    id: "pcz-coach-run",
    name: "Run_itsz_xac130z",
    title: "Elite Grinder",
    specialties: ["Top 10 region 2K26", "2K11 Top 5", "Efficient grinder"],
    bio: "Elite-level player with consistent top regional rankings. Specializes in efficient rep grinding and competitive play.",
    watchId: "pcz-watch-run"
  },
  {
    id: "pcz-coach-four",
    name: "Four-A-Reason",
    title: "Legend Coach",
    specialties: ["Legend x2", "Top 100 rep", "Streamer coach"],
    bio: "Two-time Legend with top 100 rep experience. Active streamer who teaches through live gameplay.",
    watchId: "pcz-watch-four"
  },
  {
    id: "pcz-coach-rico",
    name: "Rico_Santana",
    title: "Defensive Specialist",
    specialties: ["2K21 Legend lock/PG", "8-10 steals avg", "50+ pts PG"],
    bio: "Elite two-way player known for lockdown defense and scoring prowess. Specializes in guard builds and defensive strategies.",
    watchId: "pcz-watch-rico"
  }
];

export default function Coaches() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Your Coaches
            </h1>
            <p className="text-lg text-gray-300">
              Learn from the best in the game
            </p>
          </div>

          <div id="pcz-coaches-grid" className="grid md:grid-cols-3 gap-8">
            {coaches.map((coach) => (
              <Card 
                key={coach.id}
                id={coach.id}
                className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{coach.name}</CardTitle>
                  <CardDescription className="text-electric-cyan font-semibold">
                    {coach.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{coach.bio}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {coach.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    id={coach.watchId}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch Live
                  </Button>
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