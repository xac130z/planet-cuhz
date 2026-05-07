import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ExternalLink, CreditCard, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BetaBadge } from "@/components/ui/beta-badge";
import { BetaDisclaimer } from "@/components/ui/beta-disclaimer";

export default function Account() {
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  
  // Mock subscription data - in production this comes from Stripe
  const subscription = {
    plan: "free",
    status: "active",
    nextBilling: null
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main id="pcz-account" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-4xl font-bold text-white">
              Account Settings
            </h1>
            <BetaBadge size="md" variant="glow" />
          </div>

          <BetaDisclaimer 
            variant="compact"
            message="Account management features are currently in beta. Some functionality may not be available."
            className="mb-8"
          />

          <div className="space-y-6">
            {/* Profile Information */}
            <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Display Name</label>
                  <p className="text-white">{profile?.display_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile?.user_id || 'Not available'}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Management */}
            <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your NBA 2K Protocol subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Current Plan</p>
                    <Badge variant="outline" className="mt-1 uppercase">
                      {subscription.plan}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <Badge variant={subscription.status === "active" ? "default" : "destructive"} className="mt-1">
                      {subscription.status}
                    </Badge>
                  </div>
                </div>

                {subscription.nextBilling && (
                  <div>
                    <p className="text-sm text-gray-400">Next Billing Date</p>
                    <p className="text-white">{subscription.nextBilling}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={() => navigate('/plans')}>
                    Change Plan
                  </Button>
                  <Button 
                    id="pcz-portal-link"
                    data-stripe-portal="true"
                    variant="outline"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Button>
                </div>

                <div className="bg-cosmic-purple/30 p-4 rounded-lg border border-electric-cyan/20">
                  <p className="text-sm text-gray-300">
                    Use the Stripe Customer Portal to update payment methods, view invoices, or cancel your subscription.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Player Profile Settings */}
            <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">2K Player Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate('/onboarding')}>
                  Update Player Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}