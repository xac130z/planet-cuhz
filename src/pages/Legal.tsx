import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Legal() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 holographic-text text-center">
            Legal
          </h1>

          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="refunds">Refund Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="terms">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    By using Planet Cuhz services, you agree to the following terms:
                  </p>
                  <h3 className="text-primary mt-4">1. Acceptable Use</h3>
                  <p className="text-muted-foreground">
                    Planet Cuhz is for legitimate gaming services including squad formation, 
                    coaching, and player hire for gameplay purposes only.
                  </p>
                  <h3 className="text-primary mt-4">2. Prohibited Activities</h3>
                  <ul className="text-muted-foreground">
                    <li>Account sales or account sharing services</li>
                    <li>Virtual currency (VC) trading or sales</li>
                    <li>Real-money trading for in-game items</li>
                    <li>Any activities violating game Terms of Service</li>
                  </ul>
                  <h3 className="text-primary mt-4">3. User Conduct</h3>
                  <p className="text-muted-foreground">
                    Users must maintain respectful conduct, honor agreements, and participate 
                    in good faith. Violations may result in account suspension or termination.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h3 className="text-primary">Data Collection</h3>
                  <p className="text-muted-foreground">
                    We collect account information, profile data, transaction history, and 
                    usage analytics to provide and improve our services.
                  </p>
                  <h3 className="text-primary mt-4">Data Usage</h3>
                  <p className="text-muted-foreground">
                    Your data is used to match you with squad members, process payments, 
                    and personalize your experience. We never sell your personal information.
                  </p>
                  <h3 className="text-primary mt-4">Data Security</h3>
                  <p className="text-muted-foreground">
                    We use industry-standard encryption and security measures. Payment 
                    processing is handled by Stripe with PCI-DSS compliance.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="refunds">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Refund & Marketplace Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <h3 className="text-primary">7-Game Hires</h3>
                  <p className="text-muted-foreground">
                    Prorated refunds available for early exits. Funds held in escrow until 
                    games completed. Refund = (remaining games / total games) × price.
                  </p>
                  <h3 className="text-primary mt-4">Team Assembly</h3>
                  <p className="text-muted-foreground">
                    Full refund if we cannot assemble your squad within 48 hours. 
                    Once assembly is complete, service is considered delivered.
                  </p>
                  <h3 className="text-primary mt-4">Coaching Sessions</h3>
                  <p className="text-muted-foreground">
                    Refunds available if session is canceled by coach. No refunds after 
                    session has started. Rescheduling available with 24h notice.
                  </p>
                  <h3 className="text-primary mt-4">Dispute Resolution</h3>
                  <p className="text-muted-foreground">
                    Disputes are reviewed case-by-case. Both parties must provide evidence. 
                    Funds held until resolution. Repeated disputes may result in removal 
                    from marketplace.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
