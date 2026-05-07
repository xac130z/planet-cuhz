import { Button } from "@/components/ui/button";
import { ComingSoonButton } from "@/components/ComingSoonButton";

export function ProtocolPromoPanel() {
  return (
    <section id="pcz-protocol-panel" className="py-12 bg-gradient-to-br from-electric-blue/10 via-cosmic-purple/5 to-electric-cyan/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 holographic-text">NBA 2K Protocol</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground">
          Find your 5. Build smarter. Rep faster — AI squad finder, team assembly, and coaching for 2K players by Planet Cuhz.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg" id="pcz-cta-protocol-learn" data-testid="protocol-hero-cta-learn">
            <a href="/protocol">Learn More</a>
          </Button>
          <ComingSoonButton 
            feature="Portal Access" 
            description="The Portal is temporarily unavailable while we fix some technical issues. Check our Discord for updates!"
            size="lg" 
            variant="outline"
          >
            See Deals
          </ComingSoonButton>
        </div>
      </div>
    </section>
  );
}
