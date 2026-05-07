
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CosmicBreadcrumb } from '@/components/ui/cosmic-breadcrumb';
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import { MessageCircle, HelpCircle, Mail, Users, Home } from 'lucide-react';

const faqs = [
  {
    question: "What is Planet CUHZ?",
    answer: "Planet CUHZ is a cosmic platform for creators and communities. We're building tools and experiences to connect cosmic travelers across the digital universe."
  },
  {
    question: "How can I get started?",
    answer: "Join our CUHZUNITY on X (Twitter) to stay updated on platform features, connect with fellow cosmic travelers, and be part of our growing community!"
  },
  {
    question: "What is the CUHZmunity?",
    answer: "The CUHZmunity is our vibrant community of cosmic travelers. Join us on X (Twitter) for discussions, updates, and cosmic vibes!"
  },
  {
    question: "How does CUHZ Voice work?",
    answer: "CUHZ Voice is our Discord server dedicated to voice-only conversations. No text chat - just pure cosmic voice interactions!"
  }
];

const supportChannels = [
  {
    title: "CUHZUNITY Support",
    description: "Get help from our amazing CUHZUNITY",
    icon: "Users",
    iconComponent: Users,
    link: "https://x.com/i/communities/1933710165359923481",
    label: "Join CUHZUNITY"
  },
  {
    title: "Direct Contact",
    description: "Follow us for updates and direct messages",
    icon: "MessageCircle",
    iconComponent: MessageCircle,
    link: "https://x.com/PlanetCuhz",
    label: "Follow on X"
  },
  {
    title: "Voice Support",
    description: "Voice-only cosmic conversations",
    icon: "Discord",
    iconComponent: FaDiscord,
    link: "https://discord.gg/eNxDKkxQdN",
    label: "CUHZ Voice"
  }
];

export default function HelpSupport() {
  const breadcrumbItems = [
    {
      label: "Planet CUHZ",
      href: "/",
      isActive: false
    },
    {
      label: "Help & Support",
      isActive: true
    }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      {/* Navigation Header */}
      <header 
        className="relative bg-gradient-to-r from-[#232323]/95 via-[#2A1B3D]/95 to-[#232323]/95 backdrop-blur-xl border-b-2 border-[#8A2BE2]/50 shadow-2xl mt-32"
        role="banner"
      >
        {/* Cosmic Background Effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#8A2BE2]/10 via-[#B3A369]/5 to-[#8A2BE2]/10"
          style={{ animation: 'shine 8s linear infinite' }}
          aria-hidden="true"
        />
        
        <div className="relative z-10 flex items-center justify-between py-6 px-6 lg:px-8">
          {/* Enhanced Breadcrumb Navigation */}
          <nav 
            className="flex items-center min-h-[44px]" 
            role="navigation" 
            aria-label="Breadcrumb navigation"
          >
            <div className="flex items-center space-x-3">
              <Home 
                className="w-5 h-5 text-[#B3A369] flex-shrink-0" 
                aria-hidden="true"
              />
              <CosmicBreadcrumb 
                items={breadcrumbItems}
                className="hidden sm:block"
              />
              {/* Mobile simplified breadcrumb */}
              <div className="sm:hidden text-[#F1F5F9] font-bold text-lg">
                Help & Support
              </div>
            </div>
          </nav>

          {/* Enhanced Navigation Tab */}
          <nav role="navigation" aria-label="Main navigation">
            <div 
              className="relative font-bold px-8 py-4 rounded-xl transition-all duration-300 overflow-hidden group min-h-[44px] flex items-center justify-center bg-gradient-to-r from-[#B3A369] via-[#A0A0A0] to-[#B3A369] text-[#232323] shadow-lg"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shine 4s linear infinite',
                boxShadow: '0 4px 20px rgba(179,163,105,0.4), 0 0 30px rgba(179,163,105,0.3)'
              }}
              role="button"
              tabIndex={0}
              aria-current="page"
              aria-label="Help & Support - Current section"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#B3A369]/20 via-transparent to-[#A0A0A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              <span className="relative z-10 font-display tracking-wide text-base sm:text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Help & Support
              </span>
            </div>
          </nav>
        </div>
        
        <style>{`
          @keyframes shine {
            from { backgroundPosition: 200% 0; }
            to { backgroundPosition: -200% 0; }
          }
        `}</style>
      </header>
      
      <main className="pt-0 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-[#1C1C1C] via-[#2A1B3D] to-[#1C1C1C]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-[#B3A369] mb-6">
              Help & Support
            </h1>
            <p className="text-xl text-[#A0A0A0] max-w-3xl mx-auto">
              Welcome to our cosmic support center. Find answers, get help, and connect with the CUHZUNITY.
            </p>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-16 bg-[#1C1C1C]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#B3A369] text-center mb-12">
              Get Support
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {supportChannels.map((channel, index) => {
                const IconComponent = channel.iconComponent;
                return (
                  <Card key={index} className="bg-[#232323] border-[#B3A369]/30 hover:border-[#B3A369]/60 transition-all duration-300">
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <IconComponent className="w-12 h-12 text-[#B3A369]" />
                      </div>
                      <CardTitle className="text-[#F1F5F9]">{channel.title}</CardTitle>
                      <CardDescription className="text-[#A0A0A0]">
                        {channel.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button
                        asChild
                        className="bg-gradient-to-r from-[#B3A369] to-[#CD7F32] hover:from-[#CD7F32] hover:to-[#B3A369] text-[#1C1C1C] font-bold"
                      >
                        <a href={channel.link} target="_blank" rel="noopener noreferrer">
                          {channel.label}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-[#232323]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#B3A369] text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-[#1C1C1C] border border-[#B3A369]/30 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-[#F1F5F9] hover:text-[#B3A369] transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#A0A0A0] pt-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Discord Voice Note */}
        <section className="py-12 bg-[#1C1C1C] border-t border-[#CD7F32]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-[#5865F2]/20 via-[#5865F2]/10 to-[#5865F2]/20 rounded-lg p-8 max-w-2xl mx-auto border border-[#5865F2]/30">
              <p className="text-[#5865F2] font-bold text-lg animate-pulse">
                💎 Discord is for voice-only cosmic conversations - no text chat!
              </p>
              <p className="text-[#A0A0A0] mt-2">
                Our Discord server is designed for pure voice interactions to create deeper cosmic connections.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
