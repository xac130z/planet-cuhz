
import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CosmicBreadcrumb } from '@/components/ui/cosmic-breadcrumb';
import { Home, Trophy, ExternalLink, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const TournamentOfPower = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const breadcrumbItems = [
    {
      label: "Planet CUHZ",
      href: "/",
      isActive: false
    },
    {
      label: "Tournament of Power",
      isActive: true
    }
  ];

  const allWarriors = [
    // SSS Tier - Legendary (10,000+)
    { rank: 1, name: "GPT-4 Turbo", category: "Foundation LLM", website: "https://openai.com", rating: "4.9★", powerLevel: "SSS 10500", description: "Ultra Instinct AI - The pinnacle of reasoning", tier: "SSS" },
    
    // S+ Tier - Apex (9,600-9,999)
    { rank: 2, name: "OpenAI GPT-4o", category: "Foundation LLM", website: "https://openai.com", rating: "4.9★", powerLevel: "S+ 9800", description: "Multimodal Mastery", tier: "S+" },
    { rank: 3, name: "Anthropic Claude 3 Opus", category: "Foundation LLM", website: "https://www.anthropic.com", rating: "4.8★", powerLevel: "S+ 9700", description: "Constitutional AI Champion", tier: "S+" },
    { rank: 4, name: "Google Gemini 1.5 Pro", category: "Foundation LLM", website: "https://ai.google.dev", rating: "4.7★", powerLevel: "S+ 9650", description: "Multimodal Fusion Master", tier: "S+" },
    
    // S Tier - Elite (8,500-9,599)
    { rank: 5, name: "Midjourney v7", category: "Image Generation", website: "https://www.midjourney.com", rating: "4.8★", powerLevel: "S 9300", description: "Artistic Visualization God", tier: "S" },
    { rank: 6, name: "GitHub Copilot", category: "Code Assistant", website: "https://github.com/features/copilot", rating: "4.7★", powerLevel: "S 9200", description: "Code Sensei Supreme", tier: "S" },
    { rank: 7, name: "DALL-E 3", category: "Image Generation", website: "https://openai.com/dall-e-3", rating: "4.6★", powerLevel: "S 9100", description: "Creative Vision Master", tier: "S" },
    { rank: 8, name: "Runway ML Gen-3", category: "Video Generation", website: "https://runwayml.com", rating: "4.5★", powerLevel: "S 9000", description: "Video Creation Titan", tier: "S" },
    { rank: 9, name: "ElevenLabs Voice AI", category: "Voice & Audio", website: "https://elevenlabs.io", rating: "4.7★", powerLevel: "S 8900", description: "Voice Synthesis Master", tier: "S" },
    { rank: 10, name: "Cursor AI", category: "Code Assistant", website: "https://cursor.sh", rating: "4.6★", powerLevel: "S 8800", description: "AI-First Code Editor", tier: "S" },
    { rank: 11, name: "Perplexity AI", category: "Research & Analysis", website: "https://www.perplexity.ai", rating: "4.5★", powerLevel: "S 8700", description: "Search & Research Warrior", tier: "S" },
    { rank: 12, name: "Claude 3 Sonnet", category: "Foundation LLM", website: "https://www.anthropic.com", rating: "4.4★", powerLevel: "S 8600", description: "Balanced Reasoning Expert", tier: "S" },
    { rank: 13, name: "Stable Diffusion XL", category: "Image Generation", website: "https://stability.ai", rating: "4.3★", powerLevel: "S 8500", description: "Open-Source Art Champion", tier: "S" },
    
    // A+ Tier - Advanced Elite (8,000-8,499)
    { rank: 14, name: "ChatGPT Plus", category: "Foundation LLM", website: "https://openai.com", rating: "4.5★", powerLevel: "A+ 8400", description: "Conversational AI Master", tier: "A+" },
    { rank: 15, name: "Adobe Firefly", category: "Image Generation", website: "https://www.adobe.com/products/firefly.html", rating: "4.2★", powerLevel: "A+ 8300", description: "Creative Suite Integrated", tier: "A+" },
    { rank: 16, name: "Replit Ghostwriter", category: "Code Assistant", website: "https://replit.com", rating: "4.1★", powerLevel: "A+ 8200", description: "Collaborative Coding Spirit", tier: "A+" },
    { rank: 17, name: "Notion AI", category: "Productivity", website: "https://www.notion.so/product/ai", rating: "4.0★", powerLevel: "A+ 8100", description: "Workspace Intelligence", tier: "A+" },
    { rank: 18, name: "Pika Labs", category: "Video Generation", website: "https://pika.art", rating: "4.3★", powerLevel: "A+ 8000", description: "Video Animation Prodigy", tier: "A+" },
    
    // A Tier - Advanced (7,500-7,999)
    { rank: 19, name: "Gemini Pro", category: "Foundation LLM", website: "https://ai.google.dev", rating: "4.2★", powerLevel: "A 7900", description: "Google's AI Powerhouse", tier: "A" },
    { rank: 20, name: "Claude 3 Haiku", category: "Foundation LLM", website: "https://www.anthropic.com", rating: "4.1★", powerLevel: "A 7800", description: "Lightning Fast Reasoning", tier: "A" },
    { rank: 21, name: "Copilot X", category: "Code Assistant", website: "https://github.com/features/preview/copilot-x", rating: "4.0★", powerLevel: "A 7700", description: "Next-Gen Code Companion", tier: "A" },
    { rank: 22, name: "Luma AI Dream Machine", category: "Video Generation", website: "https://lumalabs.ai", rating: "4.2★", powerLevel: "A 7600", description: "3D Video Creation Wizard", tier: "A" },
    { rank: 23, name: "Whisper", category: "Voice & Audio", website: "https://openai.com/research/whisper", rating: "4.3★", powerLevel: "A 7500", description: "Speech Recognition Master", tier: "A" },
    
    // B+ Tier - Skilled Elite (7,000-7,499)
    { rank: 24, name: "Leonardo AI", category: "Image Generation", website: "https://leonardo.ai", rating: "4.0★", powerLevel: "B+ 7400", description: "Creative Art Specialist", tier: "B+" },
    { rank: 25, name: "Jasper AI", category: "Content Creation", website: "https://www.jasper.ai", rating: "3.9★", powerLevel: "B+ 7300", description: "Marketing Content Warrior", tier: "B+" },
    { rank: 26, name: "Copy.ai", category: "Content Creation", website: "https://www.copy.ai", rating: "3.8★", powerLevel: "B+ 7200", description: "Copywriting Champion", tier: "B+" },
    { rank: 27, name: "Synthesia", category: "Video Generation", website: "https://www.synthesia.io", rating: "4.1★", powerLevel: "B+ 7100", description: "AI Video Presenter", tier: "B+" },
    { rank: 28, name: "Murf AI", category: "Voice & Audio", website: "https://murf.ai", rating: "3.9★", powerLevel: "B+ 7000", description: "Voice-Over Virtuoso", tier: "B+" },
    
    // B Tier - Skilled (6,500-6,999)
    { rank: 29, name: "Grammarly", category: "Writing Assistant", website: "https://www.grammarly.com", rating: "4.2★", powerLevel: "B 6900", description: "Writing Enhancement Expert", tier: "B" },
    { rank: 30, name: "Canva AI", category: "Design", website: "https://www.canva.com", rating: "4.0★", powerLevel: "B 6800", description: "Design Automation Ace", tier: "B" },
    { rank: 31, name: "Writesonic", category: "Content Creation", website: "https://writesonic.com", rating: "3.7★", powerLevel: "B 6700", description: "Content Generation Guru", tier: "B" },
    { rank: 32, name: "QuillBot", category: "Writing Assistant", website: "https://quillbot.com", rating: "3.8★", powerLevel: "B 6600", description: "Paraphrasing Prodigy", tier: "B" },
    { rank: 33, name: "Descript", category: "Audio Editing", website: "https://www.descript.com", rating: "4.1★", powerLevel: "B 6500", description: "Audio Editing Wizard", tier: "B" },
    
    // C+ Tier - Competent (6,000-6,499)
    { rank: 34, name: "Loom AI", category: "Video Tools", website: "https://www.loom.com", rating: "3.9★", powerLevel: "C+ 6400", description: "Screen Recording Enhanced", tier: "C+" },
    { rank: 35, name: "Otter.ai", category: "Transcription", website: "https://otter.ai", rating: "4.0★", powerLevel: "C+ 6300", description: "Meeting Transcription Master", tier: "C+" },
    { rank: 36, name: "Tome", category: "Presentation", website: "https://tome.app", rating: "3.8★", powerLevel: "C+ 6200", description: "AI Presentation Builder", tier: "C+" },
    { rank: 37, name: "Gamma", category: "Presentation", website: "https://gamma.app", rating: "3.7★", powerLevel: "C+ 6100", description: "Slide Generation Specialist", tier: "C+" },
    { rank: 38, name: "Pictory", category: "Video Generation", website: "https://pictory.ai", rating: "3.6★", powerLevel: "C+ 6000", description: "Video Content Creator", tier: "C+" },
    
    // C Tier - Competent (5,500-5,999)
    { rank: 39, name: "Simplified AI", category: "Design", website: "https://simplified.com", rating: "3.5★", powerLevel: "C 5900", description: "All-in-One Design Tool", tier: "C" },
    { rank: 40, name: "Brandmark", category: "Logo Design", website: "https://brandmark.io", rating: "3.6★", powerLevel: "C 5800", description: "Logo Creation Specialist", tier: "C" },
    { rank: 41, name: "Rytr", category: "Content Creation", website: "https://rytr.me", rating: "3.4★", powerLevel: "C 5700", description: "Budget Content Writer", tier: "C" },
    { rank: 42, name: "Sudowrite", category: "Creative Writing", website: "https://www.sudowrite.com", rating: "3.7★", powerLevel: "C 5600", description: "Fiction Writing Assistant", tier: "C" },
    { rank: 43, name: "Wordtune", category: "Writing Assistant", website: "https://www.wordtune.com", rating: "3.8★", powerLevel: "C 5500", description: "Writing Enhancement Tool", tier: "C" },
    
    // D+ Tier - Developing (5,000-5,499)
    { rank: 44, name: "Article Forge", category: "Content Creation", website: "https://www.articleforge.com", rating: "3.2★", powerLevel: "D+ 5400", description: "Automated Article Writer", tier: "D+" },
    { rank: 45, name: "ContentBot", category: "Content Creation", website: "https://contentbot.ai", rating: "3.3★", powerLevel: "D+ 5300", description: "Content Generation Bot", tier: "D+" },
    { rank: 46, name: "Peppertype", category: "Content Creation", website: "https://www.peppertype.ai", rating: "3.1★", powerLevel: "D+ 5200", description: "Marketing Content Assistant", tier: "D+" },
    { rank: 47, name: "ShortlyAI", category: "Writing Assistant", website: "https://www.shortlyai.com", rating: "3.4★", powerLevel: "D+ 5100", description: "Short-Form Writing Aid", tier: "D+" },
    { rank: 48, name: "Headlime", category: "Content Creation", website: "https://headlime.com", rating: "3.0★", powerLevel: "D+ 5000", description: "Headline Generator", tier: "D+" },
    
    // D Tier - Developing (4,500-4,999)
    { rank: 49, name: "Anyword", category: "Content Creation", website: "https://anyword.com", rating: "3.2★", powerLevel: "D 4800", description: "Performance-Driven Copy", tier: "D" },
    { rank: 50, name: "Closers Copy", category: "Content Creation", website: "https://www.closerscopy.com", rating: "3.1★", powerLevel: "D 4500", description: "Sales Copy Specialist", tier: "D" }
  ];

  const tierColors = {
    "SSS": "from-red-400 via-yellow-400 to-red-400",
    "S+": "from-yellow-400 to-orange-500",
    "S": "from-purple-400 to-pink-500",
    "A+": "from-blue-400 to-cyan-500",
    "A": "from-green-400 to-emerald-500",
    "B+": "from-indigo-400 to-purple-500",
    "B": "from-gray-400 to-gray-500",
    "C+": "from-yellow-600 to-orange-600",
    "C": "from-gray-500 to-gray-600",
    "D+": "from-red-600 to-red-700",
    "D": "from-gray-600 to-gray-700"
  };

  const categories = [
    "Foundation LLM", "Image Generation", "Code Assistant", "Video Generation", 
    "Voice & Audio", "Research & Analysis", "Content Creation", "Writing Assistant",
    "Design", "Productivity", "Transcription", "Presentation", "Audio Editing",
    "Video Tools", "Logo Design", "Creative Writing"
  ];

  const getTierColor = (powerLevel: string) => {
    const tier = powerLevel.split(' ')[0];
    return tierColors[tier as keyof typeof tierColors] || "from-gray-400 to-gray-500";
  };

  const filteredWarriors = useMemo(() => {
    return allWarriors.filter(warrior => {
      const matchesSearch = warrior.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           warrior.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           warrior.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = selectedTier === 'all' || warrior.tier === selectedTier;
      const matchesCategory = selectedCategory === 'all' || warrior.category === selectedCategory;
      
      return matchesSearch && matchesTier && matchesCategory;
    });
  }, [searchTerm, selectedTier, selectedCategory, allWarriors]);

  const groupedWarriors = useMemo(() => {
    const groups: { [key: string]: typeof allWarriors } = {};
    filteredWarriors.forEach(warrior => {
      if (!groups[warrior.tier]) {
        groups[warrior.tier] = [];
      }
      groups[warrior.tier].push(warrior);
    });
    return groups;
  }, [filteredWarriors]);

  const tierOrder = ['SSS', 'S+', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D'];
  const tierDescriptions = {
    'SSS': 'Legendary - The Ultimate AI Powers (10,000+)',
    'S+': 'Apex - Cutting-Edge Excellence (9,600-9,999)',
    'S': 'Elite - Industry Leaders (8,500-9,599)',
    'A+': 'Advanced Elite - Premium Solutions (8,000-8,499)',
    'A': 'Advanced - Reliable Performers (7,500-7,999)',
    'B+': 'Skilled Elite - Quality Tools (7,000-7,499)',
    'B': 'Skilled - Dependable Options (6,500-6,999)',
    'C+': 'Competent - Solid Choices (6,000-6,499)',
    'C': 'Competent - Basic Reliability (5,500-5,999)',
    'D+': 'Developing - Emerging Tools (5,000-5,499)',
    'D': 'Developing - Entry Level (4,500-4,999)'
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      {/* Navigation Header */}
      <header 
        className="relative bg-gradient-to-r from-[#232323]/95 via-[#2A1B3D]/95 to-[#232323]/95 backdrop-blur-xl border-b-2 border-[#8A2BE2]/50 shadow-2xl mt-32"
        role="banner"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#8A2BE2]/10 via-[#B3A369]/5 to-[#8A2BE2]/10" />
        
        <div className="relative z-10 flex items-center justify-between py-6 px-6 lg:px-8">
          <nav className="flex items-center min-h-[44px]" role="navigation">
            <div className="flex items-center space-x-3">
              <Home className="w-5 h-5 text-[#B3A369] flex-shrink-0" />
              <CosmicBreadcrumb items={breadcrumbItems} className="hidden sm:block" />
              <div className="sm:hidden text-[#F1F5F9] font-bold text-lg">Tournament of Power</div>
            </div>
          </nav>

          <nav role="navigation">
            <div className="relative font-bold px-8 py-4 rounded-xl bg-gradient-to-r from-[#B3A369] via-[#A0A0A0] to-[#B3A369] text-[#232323] shadow-lg">
              <span className="relative z-10 font-display tracking-wide text-base sm:text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Tournament of Power
              </span>
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-0">
        {/* Hero Section */}
        <section className="relative py-20 px-6 lg:px-8 bg-gradient-to-br from-[#1C1C1C] via-[#2A1B3D] to-[#1C1C1C]">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-[#B3A369] mb-6">
              2025 AI Tournament of Power
            </h1>
            <p className="text-xl md:text-2xl text-[#F1F5F9] mb-8 max-w-4xl mx-auto">
              The Ultimate Battle Royale of 50 Artificial Intelligence Warriors
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-[#B3A369] border-[#B3A369]">
                50 AI Warriors
              </Badge>
              <Badge variant="outline" className="text-[#B3A369] border-[#B3A369]">
                11 Power Tiers
              </Badge>
              <Badge variant="outline" className="text-[#B3A369] border-[#B3A369]">
                16 Categories
              </Badge>
            </div>
          </div>
        </section>

        {/* Search and Filter Controls */}
        <section className="py-8 px-6 lg:px-8 bg-[#232323]/30">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-5 h-5 text-[#A0A0A0]" />
                <Input
                  placeholder="Search AI warriors, categories, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#2A1B3D]/80 border-[#8A2BE2]/30 text-[#F1F5F9] placeholder-[#A0A0A0]"
                />
              </div>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-full md:w-48 bg-[#2A1B3D]/80 border-[#8A2BE2]/30 text-[#F1F5F9]">
                  <SelectValue placeholder="Filter by Tier" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A1B3D] border-[#8A2BE2]/30">
                  <SelectItem value="all">All Tiers</SelectItem>
                  {tierOrder.map(tier => (
                    <SelectItem key={tier} value={tier}>{tier} Tier</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64 bg-[#2A1B3D]/80 border-[#8A2BE2]/30 text-[#F1F5F9]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A1B3D] border-[#8A2BE2]/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Warriors by Tier */}
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#B3A369] mb-4">Complete Tournament Roster</h2>
              <p className="text-lg text-[#A0A0A0] max-w-3xl mx-auto">
                {filteredWarriors.length} of 50 AI warriors displayed
              </p>
            </div>

            {tierOrder.map(tier => {
              const warriors = groupedWarriors[tier];
              if (!warriors || warriors.length === 0) return null;

              return (
                <div key={tier} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`inline-block px-6 py-3 rounded-full text-2xl font-bold bg-gradient-to-r ${tierColors[tier as keyof typeof tierColors]} text-white shadow-lg`}>
                      {tier} TIER
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#F1F5F9]">{tierDescriptions[tier as keyof typeof tierDescriptions]}</h3>
                      <p className="text-[#A0A0A0]">{warriors.length} warriors in this tier</p>
                    </div>
                  </div>

                  <div className="grid gap-6 max-w-6xl mx-auto">
                    {warriors.map((warrior) => (
                      <div key={warrior.rank} className="bg-gradient-to-r from-[#2A1B3D]/80 to-[#232323]/80 p-6 rounded-lg border border-[#8A2BE2]/30 hover:border-[#B3A369]/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl font-bold text-[#B3A369]">#{warrior.rank}</div>
                            <div>
                              <h4 className="text-xl font-bold text-[#F1F5F9]">{warrior.name}</h4>
                              <p className="text-[#A0A0A0] text-sm">{warrior.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getTierColor(warrior.powerLevel)} text-white mb-2`}>
                              {warrior.powerLevel}
                            </div>
                            <div className="text-[#B3A369] text-sm">{warrior.rating}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[#A0A0A0] italic flex-1">{warrior.description}</p>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-[#8A2BE2]/50 text-[#B3A369] hover:bg-[#8A2BE2]/20 ml-4"
                          >
                            <a href={warrior.website} target="_blank" rel="noopener noreferrer">
                              Visit <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredWarriors.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-[#F1F5F9] mb-2">No Warriors Found</h3>
                <p className="text-[#A0A0A0] mb-4">Try adjusting your search or filter criteria</p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTier('all');
                    setSelectedCategory('all');
                  }}
                  className="bg-gradient-to-r from-[#B3A369] to-[#CD7F32] hover:from-[#CD7F32] hover:to-[#B3A369] text-[#1C1C1C] font-bold"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Tournament Stats */}
        <section className="py-16 px-6 lg:px-8 bg-[#232323]/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-[#B3A369] mb-12 text-center">Tournament Statistics</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#2A1B3D]/80 p-6 rounded-lg border border-[#8A2BE2]/30 text-center">
                <div className="text-3xl font-bold text-[#B3A369] mb-2">50</div>
                <p className="text-[#F1F5F9] font-medium">Total Warriors</p>
              </div>
              <div className="bg-[#2A1B3D]/80 p-6 rounded-lg border border-[#8A2BE2]/30 text-center">
                <div className="text-3xl font-bold text-[#B3A369] mb-2">11</div>
                <p className="text-[#F1F5F9] font-medium">Power Tiers</p>
              </div>
              <div className="bg-[#2A1B3D]/80 p-6 rounded-lg border border-[#8A2BE2]/30 text-center">
                <div className="text-3xl font-bold text-[#B3A369] mb-2">16</div>
                <p className="text-[#F1F5F9] font-medium">Categories</p>
              </div>
              <div className="bg-[#2A1B3D]/80 p-6 rounded-lg border border-[#8A2BE2]/30 text-center">
                <div className="text-3xl font-bold text-[#B3A369] mb-2">10.5K</div>
                <p className="text-[#F1F5F9] font-medium">Max Power Level</p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Home Section */}
        <section className="py-16 px-6 lg:px-8 bg-[#232323]/50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#B3A369] mb-8">Ready to Explore More?</h2>
            <p className="text-xl text-[#F1F5F9] mb-8 max-w-2xl mx-auto">
              Discover the Planet CUHZ ecosystem and join our cosmic family of AI enthusiasts.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-[#B3A369] to-[#CD7F32] hover:from-[#CD7F32] hover:to-[#B3A369] text-[#1C1C1C] font-bold px-8 py-4 text-lg"
            >
              <a href="/">Return to Planet CUHZ</a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TournamentOfPower;
