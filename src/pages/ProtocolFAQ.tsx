import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProtocolFAQ() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 holographic-text text-center">
            Protocol FAQ
          </h1>

          <Accordion id="pcz-faq" type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card/50 backdrop-blur-sm border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                How do hires work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Hires use escrow through Stripe. When you book a player, funds are held securely until the contracted games are completed. Once both parties confirm completion, funds are released to the player. This ensures safety for both buyers and sellers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card/50 backdrop-blur-sm border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What are early exit refund rules?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                For 7-game hires, refunds are prorated based on games completed. If you exit after 3 games, you receive a refund for the remaining 4 games. Team Assembly has a full refund guarantee if we can't fill your squad within 48 hours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card/50 backdrop-blur-sm border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What's covered vs. not covered?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Covered: Squad formation, coaching sessions, player hires for gameplay.
                <br /><br />
                NOT covered: Account sales, VC (virtual currency) transactions, real-money trading for in-game items, or anything violating game Terms of Service.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card/50 backdrop-blur-sm border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                How does the safety & ratings system work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                After each hire or coaching session, both parties rate the experience. Ratings are visible on profiles. Players with low ratings or disputes may be removed from the marketplace. All transactions are logged for dispute resolution.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card/50 backdrop-blur-sm border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What are KYC requirements?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Players who want to receive payouts must complete KYC (Know Your Customer) verification through Stripe Connect. This is a standard requirement for marketplace platforms and helps ensure a safe, verified community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-card/50 backdrop-blur-sm border-primary/20 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                How do I book a Coaching Sprint?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Visit the Deals page and select "Book Coaching ($25)". You'll be prompted to choose your preferred coach and schedule a time. Sessions are 30 minutes and include build review, gameplan strategy, and Q&A.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
}
