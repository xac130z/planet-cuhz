import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Users, Wrench, Trophy, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();

  // Mock plan status - in production this would come from Stripe
  const userPlan = "free" as "free" | "pro" | "premium";

  const quickLinks = [
    { label: "Tools", href: "/tools", icon: Wrench },
    { label: "Coaches", href: "/coaches", icon: Trophy },
    { label: "Account", href: "/account", icon: Settings }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main id="pcz-dashboard" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {profile?.display_name || 'Player'}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Current Plan:</span>
              <Badge 
                id="pcz-plan-badge" 
                variant={userPlan === "premium" ? "default" : "outline"}
                className="uppercase"
              >
                {userPlan}
              </Badge>
            </div>
          </div>

          {userPlan === "free" && (
            <Card 
              id="pcz-upgrade-cta" 
              className="mb-8 bg-gradient-to-r from-electric-cyan/20 to-electric-purple/20 border-electric-cyan/30"
            >
              <CardHeader>
                <CardTitle className="text-white">Unlock Premium Features</CardTitle>
                <CardDescription className="text-gray-300">
                  Get AI-powered squad matching, build consulting, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/plans')}>
                  View Plans
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card 
                  key={link.href}
                  className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm cursor-pointer hover:border-electric-cyan/60 transition-all"
                  onClick={() => navigate(link.href)}
                >
                  <CardHeader className="text-center">
                    <Icon className="w-12 h-12 text-electric-cyan mx-auto mb-2" />
                    <CardTitle className="text-white">{link.label}</CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">No recent activity yet. Complete your onboarding to get started!</p>
              </CardContent>
            </Card>

            <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Squads Joined:</span>
                  <span className="text-white">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Matches Played:</span>
                  <span className="text-white">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Profile Complete:</span>
                  <span className="text-white">0%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}