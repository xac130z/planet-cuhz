import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function StreamerSpotlight() {
  const streamers = [
    {
      name: "Run_itsz_xac130z",
      title: "Top 10 Region 2K26",
      psn: "RuN_iTsZ_xAc130z",
      url: "https://tr.ee/w-laR7OOz2"
    },
    {
      name: "Four-A-Reason",
      title: "Legend x2 • Top 100 Rep",
      psn: "Four-A-Reason",
      url: "https://twitch.tv/fourareason4"
    }
  ];
  
  return (
    <section className="py-8 bg-cosmic-purple/10">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-6 holographic-text">Watch Our Streamers Live</h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {streamers.map(s => (
            <Card key={s.name} className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">{s.name}</CardTitle>
                <CardDescription>{s.title}</CardDescription>
                <p className="text-electric-cyan/80 text-sm mt-2">PSN: {s.psn}</p>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    Watch Live
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
