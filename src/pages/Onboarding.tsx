import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    position: "",
    roleType: "",
    playstyle: "",
    schedule: [] as string[],
    region: "",
    platform: "",
    hasMic: false,
    goals: "",
    grindLevel: "",
    timezone: ""
  });

  const handleSubmit = () => {
    // Validate all required fields
    if (!formData.position || !formData.roleType || !formData.playstyle || 
        formData.schedule.length === 0 || !formData.region || !formData.platform ||
        !formData.goals || !formData.grindLevel || !formData.timezone) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    // Save to Supabase (placeholder)
    toast({
      title: "Profile Saved!",
      description: "Profile saved successfully!"
    });
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main id="pcz-onboarding" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Define Your Crew DNA
            </h1>
            <p className="text-lg text-gray-300">
              Set up your player profile
            </p>
          </div>

          <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Player Profile</CardTitle>
              <CardDescription className="text-gray-300">
                All fields are required for optimal matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white">Position *</Label>
                <Select onValueChange={(value) => setFormData({...formData, position: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pg">Point Guard</SelectItem>
                    <SelectItem value="sg">Shooting Guard</SelectItem>
                    <SelectItem value="sf">Small Forward</SelectItem>
                    <SelectItem value="pf">Power Forward</SelectItem>
                    <SelectItem value="c">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Role Type *</Label>
                <Select onValueChange={(value) => setFormData({...formData, roleType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scorer">Scorer</SelectItem>
                    <SelectItem value="playmaker">Playmaker</SelectItem>
                    <SelectItem value="defender">Defender</SelectItem>
                    <SelectItem value="rebounder">Rebounder</SelectItem>
                    <SelectItem value="sharpshooter">Sharpshooter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Playstyle *</Label>
                <Input 
                  placeholder="e.g., Fast-paced, ball movement, defensive"
                  onChange={(e) => setFormData({...formData, playstyle: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-white">Schedule (Select all that apply) *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {["Weekday Mornings", "Weekday Evenings", "Weekend Days", "Weekend Nights"].map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox 
                        id={time}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, schedule: [...formData.schedule, time]});
                          } else {
                            setFormData({...formData, schedule: formData.schedule.filter(s => s !== time)});
                          }
                        }}
                      />
                      <label htmlFor={time} className="text-sm text-gray-300 cursor-pointer">
                        {time}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white">Region *</Label>
                <Select onValueChange={(value) => setFormData({...formData, region: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="na-east">NA East</SelectItem>
                    <SelectItem value="na-west">NA West</SelectItem>
                    <SelectItem value="eu">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="oce">Oceania</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Platform *</Label>
                <Select onValueChange={(value) => setFormData({...formData, platform: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ps">PlayStation</SelectItem>
                    <SelectItem value="xbox">Xbox</SelectItem>
                    <SelectItem value="pc">PC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mic"
                  onCheckedChange={(checked) => setFormData({...formData, hasMic: checked as boolean})}
                />
                <label htmlFor="mic" className="text-gray-300 cursor-pointer">
                  I have a working microphone *
                </label>
              </div>

              <div>
                <Label className="text-white">Goals *</Label>
                <Textarea 
                  placeholder="What are you looking to achieve? (e.g., hit Legend, improve defense, find consistent squad)"
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label className="text-white">Grind Level *</Label>
                <Select onValueChange={(value) => setFormData({...formData, grindLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grind level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual - Play for fun</SelectItem>
                    <SelectItem value="rep">Rep Grinder - Consistent progression</SelectItem>
                    <SelectItem value="comp">Competitive - High-level play</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Timezone *</Label>
                <Select onValueChange={(value) => setFormData({...formData, timezone: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="cst">CST</SelectItem>
                    <SelectItem value="mst">MST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                    <SelectItem value="cet">CET</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                id="pcz-save-profile"
                onClick={handleSubmit}
                className="w-full"
              >
                Save & Get Matches
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}