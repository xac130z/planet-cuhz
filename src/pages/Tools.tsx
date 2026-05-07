import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Wrench, TrendingUp, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const mockMilestones = [
  { label: "Reach Pro 1", completed: true },
  { label: "Unlock All Badges", completed: true },
  { label: "Hit Elite 1", completed: false },
  { label: "Reach Legend", completed: false }
];

export default function Tools() {
  const [buildQuery, setBuildQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<any[]>([]);

  const handleGenerateLogos = async () => {
    setIsGenerating(true);
    setGeneratedLogos([]);
    toast.info("Starting logo generation... This may take a few minutes.");

    try {
      const { data, error } = await supabase.functions.invoke('generate-all-partner-logos');

      if (error) throw error;

      if (data.logos) {
        setGeneratedLogos(data.logos);
        toast.success(`Successfully generated ${data.count} logos!`);
      }
    } catch (error: any) {
      console.error('Logo generation error:', error);
      toast.error(error.message || 'Failed to generate logos');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLogo = (logo: any) => {
    const link = document.createElement('a');
    link.href = logo.imageData;
    link.download = logo.filename;
    link.click();
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main id="pcz-tools" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Player Tools
            </h1>
            <p className="text-gray-300">
              AI-powered assistance for your 2K journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Partner Logo Generator */}
            <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm col-span-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-electric-cyan" />
                  Cosmic Partner Logo Generator
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Generate all partner logos with Planet CUHZ cosmic theme
                </CardDescription>
                <Badge variant="outline" className="w-fit">Admin Tool</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGenerateLogos}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating Logos...' : 'Generate All Partner Logos'}
                </Button>
                
                {generatedLogos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Generated Logos ({generatedLogos.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {generatedLogos.map((logo) => (
                        <div key={logo.id} className="space-y-2">
                          <div className="bg-deep-space/50 p-2 rounded border border-electric-cyan/20">
                            <img 
                              src={logo.imageData} 
                              alt={`${logo.name} logo`}
                              className="w-full h-auto"
                            />
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadLogo(logo)}
                            className="w-full text-xs"
                          >
                            Download {logo.name}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="bg-cosmic-purple/30 p-4 rounded-lg border border-electric-cyan/20">
                      <p className="text-sm text-gray-300">
                        💾 Download each logo and save to <code className="text-electric-cyan">/public/partners/</code> folder
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Build Assistant */}
            <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-electric-cyan" />
                  AI Build Assistant
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Get optimal build recommendations based on your playstyle
                </CardDescription>
                <Badge variant="outline" className="w-fit">Pro Feature</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  id="pcz-build-assistant-input"
                  placeholder="Describe your playstyle and position... (e.g., 'I want a 6'5 PG that can shoot and defend')"
                  value={buildQuery}
                  onChange={(e) => setBuildQuery(e.target.value)}
                  rows={4}
                />
                <Button id="pcz-build-assistant" className="w-full">
                  Get Build Recommendations
                </Button>
                <div className="bg-cosmic-purple/30 p-4 rounded-lg border border-electric-cyan/20">
                  <p className="text-sm text-gray-300">
                    AI will analyze current meta, your preferences, and suggest optimal attribute splits, badges, and takeovers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Crew Progress Tracker */}
            <Card className="bg-cosmic-purple/20 border-electric-cyan/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-electric-cyan" />
                  Crew Progress Tracker
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor your journey to Legend
                </CardDescription>
                <Badge variant="outline" className="w-fit">Pro Feature</Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Overall Progress</span>
                    <span className="text-electric-cyan font-semibold">45%</span>
                  </div>
                  <Progress id="pcz-crew-progress" value={45} className="h-3" />
                </div>

                <div id="pcz-milestones">
                  <h4 className="text-white font-semibold mb-3">Milestones</h4>
                  <div className="space-y-2">
                    {mockMilestones.map((milestone, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2"
                      >
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          milestone.completed 
                            ? 'bg-electric-cyan border-electric-cyan' 
                            : 'border-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          milestone.completed 
                            ? 'text-gray-300 line-through' 
                            : 'text-white'
                        }`}>
                          {milestone.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-cosmic-purple/30 p-4 rounded-lg border border-electric-cyan/20">
                  <p className="text-sm text-gray-300">
                    Track your rep gains, win streaks, and milestone achievements with personalized insights.
                  </p>
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