import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ProtocolAssemblyRequest() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [skillTier, setSkillTier] = useState("");
  const [region, setRegion] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const roles = ["PG", "SG", "Lock", "PF", "C"];

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a team assembly request.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const availabilityWindows = formData.get("availability");
      const discordPsn = formData.get("discord-psn");
      const budgetNotes = formData.get("budget-notes");
      const deadline = formData.get("deadline");

      if (
        selectedRoles.length === 0 ||
        !skillTier ||
        !region ||
        !platform ||
        typeof availabilityWindows !== "string" ||
        !availabilityWindows.trim() ||
        typeof discordPsn !== "string" ||
        !discordPsn.trim() ||
        typeof deadline !== "string" ||
        !deadline.trim()
      ) {
        toast({
          title: "Missing Required Fields",
          description: "Please complete all required fields before submitting.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('team-build-request', {
        body: {
          buyer_id: user.id,
          desired_roles: selectedRoles,
          skill_tiers: skillTier,
          region,
          platform,
          availability_windows: availabilityWindows.trim(),
          discord_psn: discordPsn.trim(),
          budget_notes: typeof budgetNotes === "string" ? budgetNotes.trim() : "",
          deadline: deadline.trim(),
        },
      });

      if (error) throw error;

      const requestId =
        data && typeof data === "object" && "id" in data && typeof data.id === "string"
          ? data.id.substring(0, 8)
          : "submitted";

      toast({
        title: "Request Submitted!",
        description: `Request #${requestId} submitted. We target 48h delivery.`,
      });
      
      // Reset form
      (e.currentTarget as HTMLFormElement).reset();
      setSelectedRoles([]);
      setSkillTier("");
      setRegion("");
      setPlatform("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit request. Please try again.";
      console.error('Team build request error:', error);
      toast({
        title: "Submission Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <Card id="pcz-assembly-request" className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl holographic-text">Team Assembly Request</CardTitle>
              <CardDescription>We'll find your perfect 5 within 48 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Desired Roles */}
                <div>
                  <Label className="text-base mb-3 block">Desired Roles *</Label>
                  <div className="flex gap-4 flex-wrap">
                    {roles.map(role => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`role-${role}`}
                          checked={selectedRoles.includes(role)}
                          onCheckedChange={() => handleRoleToggle(role)}
                        />
                        <label htmlFor={`role-${role}`} className="cursor-pointer">
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Tiers */}
                <div>
                  <Label htmlFor="skill-tiers">Skill Tiers *</Label>
                  <Select value={skillTier} onValueChange={setSkillTier}>
                    <SelectTrigger id="skill-tiers">
                      <SelectValue placeholder="Select skill tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (1-80)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (80-90)</SelectItem>
                      <SelectItem value="advanced">Advanced (90-95)</SelectItem>
                      <SelectItem value="elite">Elite (95+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Region */}
                <div>
                  <Label htmlFor="region">Region *</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="na-east">NA East</SelectItem>
                      <SelectItem value="na-west">NA West</SelectItem>
                      <SelectItem value="eu">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="oceania">Oceania</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform */}
                <div>
                  <Label htmlFor="platform">Platform *</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ps5">PlayStation 5</SelectItem>
                      <SelectItem value="xbox">Xbox Series X/S</SelectItem>
                      <SelectItem value="pc">PC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Windows */}
                <div>
                  <Label htmlFor="availability">Availability Windows *</Label>
                  <Input 
                    id="availability"
                    name="availability"
                    placeholder="e.g., Weekdays 6-10pm EST"
                    required
                  />
                </div>

                {/* Discord/PSN */}
                <div>
                  <Label htmlFor="discord-psn">Discord/PSN *</Label>
                  <Input 
                    id="discord-psn"
                    name="discord-psn"
                    placeholder="Your gamertag or Discord username"
                    required
                  />
                </div>

                {/* Budget Notes */}
                <div>
                  <Label htmlFor="budget-notes">Budget Notes</Label>
                  <Textarea 
                    id="budget-notes"
                    name="budget-notes"
                    placeholder="Any budget constraints or preferences..."
                    rows={3}
                  />
                </div>

                {/* Deadline */}
                <div>
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input 
                    id="deadline"
                    name="deadline"
                    type="date"
                    required
                  />
                </div>

                <Button 
                  id="pcz-assembly-submit"
                  type="submit" 
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
