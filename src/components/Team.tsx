import { Twitter, Linkedin, Instagram, ExternalLink, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';

interface SocialLink {
  type: "Twitter" | "Twitch" | "Instagram" | "TikTok" | "LinkedIn" | "YouTube";
  label: string;
  url: string;
}

interface CTAButton {
  text: string;
  link: string;
}

interface TeamMember {
  id: string;
  display_name: string;
  tagline: string;
  role: string;
  avatar?: string;
  accent_color: string;
  chain_glow?: boolean;
  social_links: SocialLink[];
  cta_button?: CTAButton;
  layout?: "card-horizontal" | "card-vertical";
}

const teamData: Record<string, TeamMember[]> = {
  leadership: [
    {
      id: "xac130z",
      display_name: "Wilmer Rodriguez",
      tagline: "Founder & Visionary",
      role: "Leadership",
      avatar: "/lovable-uploads/c2445e58-f010-47b7-a75f-bc062f4d3b0b.png",
      accent_color: "#00Eaff",
      chain_glow: true,
      social_links: [
        { type: "Twitter", label: "@xAc130z", url: "https://twitter.com/xAc130z" }
      ],
      layout: "card-horizontal"
    },
    {
      id: "queenac",
      display_name: "Queen AC",
      tagline: "Infinite DevOps Loop",
      role: "DevOps Engineer",
      avatar: "/lovable-uploads/queen-ac-character.png",
      accent_color: "#FFD700",
      chain_glow: true,
      social_links: [],
      layout: "card-horizontal"
    }
  ],
  core: [
    {
      id: "fourareason4",
      display_name: "Four-A-Reason",
      tagline: "CUHZ Live Hype Pilot",
      role: "Lead Content Creator",
      avatar: "/lovable-uploads/f385ac36-4d0c-46f5-ad04-cbb8f646a614.png",
      accent_color: "#FF5AF5",
      chain_glow: true,
      social_links: [
        { type: "Twitch", label: "Watch on Twitch", url: "https://www.twitch.tv/fourareason4" },
        { type: "Instagram", label: "@fourareason4", url: "https://www.instagram.com/fourareason4?igsh=MXU1dDM3YnM1NWdxOQ==" },
        { type: "TikTok", label: "@Fourareason4", url: "https://www.tiktok.com/@Fourareason4" },
        { type: "Twitter", label: "@fourareason4", url: "https://x.com/@fourareason4" },
        { type: "YouTube", label: "Four-A-Reason", url: "https://www.youtube.com/@Four-A-Reason" }
      ],
      cta_button: { text: "Go LIVE with Four-A-Reason", link: "https://www.twitch.tv/fourareason4" },
      layout: "card-vertical"
    },
    {
      id: "mahni",
      display_name: "Mahni",
      tagline: "Story Architect of Planet Cuhz",
      role: "Senior Content Strategist",
      avatar: "/lovable-uploads/a27aa0c6-4646-4a75-98dc-8c1ab0111364.png",
      accent_color: "#FFA500",
      chain_glow: true,
      social_links: [
        { type: "Twitch", label: "LIVE: vgxmahni", url: "https://twitch.tv/vgxmahni" },
        { type: "Twitter", label: "@mahnipeezy1", url: "https://x.com/mahnipeezy1?s=21" },
        { type: "Instagram", label: "@thatgirlmahni_", url: "https://www.instagram.com/thatgirlmahni_" },
        { type: "TikTok", label: "@moneymahni_", url: "https://www.tiktok.com/@moneymahni_" }
      ],
      cta_button: { text: "Catch Mahni LIVE", link: "https://twitch.tv/vgxmahni" },
      layout: "card-vertical"
    },
    {
      id: "rico",
      display_name: "Rico Santana",
      tagline: "Voice of the Crowd",
      role: "Community Facilitator",
      avatar: "/lovable-uploads/8a93cced-6fcc-4497-b494-5ee48fdcbca5.png",
      accent_color: "#21E57B",
      chain_glow: true,
      social_links: [
        { type: "Twitch", label: "LIVE: rico_santanax", url: "https://twitch.tv/rico_santanax" },
        { type: "Instagram", label: "@xxricosantanaxx", url: "https://www.instagram.com/xxricosantanaxx?igsh=MXIzcWpsbW41c3Rvcw==" }
      ],
      cta_button: { text: "Watch Rico LIVE", link: "https://twitch.tv/rico_santanax" },
      layout: "card-vertical"
    }
  ],
  brandAmbassadors: [
    {
      id: "mainmotion",
      display_name: "MainMotion",
      tagline: "Cosmic Stream Navigator",
      role: "Brand Ambassador",
      avatar: "/lovable-uploads/mainmotion-avatar.png",
      accent_color: "#00EAFF",
      chain_glow: true,
      social_links: [
        { type: "Twitch", label: "LIVE: mainmotion1", url: "https://twitch.tv/mainmotion1" }
      ],
      cta_button: { text: "Watch MainMotion LIVE", link: "https://twitch.tv/mainmotion1" },
      layout: "card-vertical"
    },
    {
      id: "queenrogue",
      display_name: "Queen Rogue",
      tagline: "Cosmic Stream Siren",
      role: "Brand Ambassador",
      avatar: "/lovable-uploads/95d8b6cb-fee6-4f6e-8b19-769eadb6b17b.png",
      accent_color: "#9E5BFF",
      chain_glow: true,
      social_links: [
        { type: "Twitch", label: "LIVE: xqu33n_rogu3x", url: "https://twitch.tv/xqu33n_rogu3x" }
      ],
      cta_button: { text: "Watch Queen Rogue LIVE", link: "https://twitch.tv/xqu33n_rogu3x" },
      layout: "card-vertical"
    },
    {
      id: "damewins",
      display_name: "DameWins",
      tagline: "Recruiter & Hype Creator",
      role: "Brand Ambassador",
      avatar: "/lovable-uploads/01671616-eca5-4447-b0e7-2ee2a2b017c1.png",
      accent_color: "#FF4A4A",
      chain_glow: true,
      social_links: [
        { type: "Twitch", label: "LIVE: DameWins", url: "https://twitch.tv/damewins" },
        { type: "Instagram", label: "@damewins", url: "https://www.instagram.com/damewins" }
      ],
      cta_button: { text: "Watch DameWins LIVE", link: "https://twitch.tv/damewins" },
      layout: "card-vertical"
    },
    {
      id: "pluto_4252",
      display_name: "PLANETCUHZxFACE",
      tagline: "TikTok Cosmic Pilot",
      role: "Brand Ambassador",
      avatar: "/lovable-uploads/65536220-b056-4c03-a7c7-beb7dc9909be.png",
      accent_color: "#8A2BE2",
      chain_glow: true,
      social_links: [
        { type: "TikTok", label: "@pluto_4252", url: "https://www.tiktok.com/@pluto_4252" },
        { type: "Instagram", label: "@pluto_4252", url: "https://www.instagram.com/pluto_4252?igsh=cmIyY2RrMGtsc3Ez" }
      ],
      cta_button: { text: "Follow on TikTok", link: "https://www.tiktok.com/@pluto_4252" },
      layout: "card-vertical"
    },
    {
      id: "flex210",
      display_name: "flex210",
      tagline: "Community Guardian",
      role: "Brand Ambassador",
      avatar: "/lovable-uploads/c2cf6afc-8468-492e-9667-ff6948164518.png",
      accent_color: "#00C8FF",
      chain_glow: true,
      social_links: [
        { type: "Instagram", label: "@elgordito_210", url: "https://www.instagram.com/elgordito_210?igsh=MWh4ZGNhOWVuZWZ6NA==" }
      ],
      cta_button: { text: "Follow on Instagram", link: "https://www.instagram.com/elgordito_210?igsh=MWh4ZGNhOWVuZWZ6NA==" },
      layout: "card-vertical"
    },
    {
      id: "hellrell",
      display_name: "hellrell",
      tagline: "Support Specialist",
      role: "Brand Ambassador",
      avatar: "/lovable-uploads/249493b6-60e0-419f-b498-d98b9ccbcd90.png",
      accent_color: "#FF6B6B",
      chain_glow: true,
      social_links: [
        { type: "Instagram", label: "@hell_rell_05", url: "https://www.instagram.com/hell_rell_05?igsh=bmd4M3UzaTRxMDZu" }
      ],
      cta_button: { text: "Follow on Instagram", link: "https://www.instagram.com/hell_rell_05?igsh=bmd4M3UzaTRxMDZu" },
      layout: "card-vertical"
    },
    {
      id: "joefresh",
      display_name: "Joe Fresh",
      tagline: "Hype Catalyst of #Cuhzunity",
      role: "Brand Ambassador",
      avatar: "/lovable-uploads/0a475496-eb38-430b-85f3-6f858dcf97c3.png",
      accent_color: "#45B3FF",
      chain_glow: true,
      social_links: [
        { type: "TikTok", label: "@joeefresh91", url: "https://www.tiktok.com/@joeefresh91" },
        { type: "Instagram", label: "@joeefresh91", url: "https://www.instagram.com/joeefresh91" }
      ],
      cta_button: { text: "Follow Joe Fresh", link: "https://www.tiktok.com/@joeefresh91" },
      layout: "card-vertical"
    },
    {
      id: "edward1chuckk",
      display_name: "Edward1Chuckk",
      tagline: "Cosmic Content Creator",
      role: "Brand Ambassador",
      avatar: "/lovable-uploads/7ce42d91-678b-4311-9db3-5a7cee5e7bb5.png",
      accent_color: "#7C3AED",
      chain_glow: true,
      social_links: [
        { type: "Twitch", label: "LIVE: edward1chuckk", url: "https://twitch.tv/edward1chuckk" }
      ],
      cta_button: { text: "Watch Edward1Chuckk LIVE", link: "https://twitch.tv/edward1chuckk" },
      layout: "card-vertical"
    }
  ],
  advisory: [
    {
      id: "inyacity1",
      display_name: "inyacity1",
      tagline: "Marketing & Investment Advisor",
      role: "Advisor",
      avatar: "/lovable-uploads/inyacity1-avatar.png",
      accent_color: "#FF8C00",
      chain_glow: true,
      social_links: [],
      layout: "card-horizontal"
    },
    {
      id: "ohfuhsho",
      display_name: "©hf©sh© 🏆 (.btc | .sol)",
      tagline: "Vision & Venture Strategist",
      role: "Strategic Advisor",
      avatar: "/lovable-uploads/ohfuhsho-avatar.png",
      accent_color: "#21E57B",
      chain_glow: true,
      social_links: [
        { type: "Twitter", label: "@ohfuhsho", url: "https://x.com/ohfuhsho?s=21" },
        { type: "Instagram", label: "@ohphareel", url: "https://www.instagram.com/ohphareel" }
      ],
      cta_button: { text: "Follow the Alpha", link: "https://x.com/ohfuhsho?s=21" },
      layout: "card-horizontal"
    },
    {
      id: "breezy",
      display_name: "Brian \"Breezy\"",
      tagline: "Capital & Growth Guide",
      role: "Investment Advisor",
      avatar: "/lovable-uploads/breezy-avatar.png",
      accent_color: "#00C8FF",
      chain_glow: true,
      social_links: [
        { type: "Instagram", label: "@breezywoah", url: "https://www.instagram.com/breezywoah" }
      ],
      cta_button: { text: "Follow Breezy", link: "https://www.instagram.com/breezywoah" },
      layout: "card-horizontal"
    }
  ]
};

// Social icon component mapping
function SocialIcon({ type }: { type: SocialLink['type'] }) {
  const iconProps = { className: "w-4 h-4" };
  
  switch (type) {
    case "Twitter": return <Twitter {...iconProps} />;
    case "Twitch": return <Gamepad2 {...iconProps} />;
    case "Instagram": return <Instagram {...iconProps} />;
    case "TikTok": return <ExternalLink {...iconProps} />;
    case "LinkedIn": return <Linkedin {...iconProps} />;
    case "YouTube": return <ExternalLink {...iconProps} />;
    default: return <ExternalLink {...iconProps} />;
  }
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const accentStyle = { 
    '--accent-color': member.accent_color 
  } as React.CSSProperties;
  
  return (
    <div 
      className={`relative bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 
        hover:border-primary/50 transition-all duration-500 group hover:scale-[1.02] 
        hover:shadow-2xl hover:shadow-primary/20 ${member.chain_glow ? 'animate-pulse-glow' : ''}`}
      style={accentStyle}
    >
      {/* Chain glow effect */}
      {member.chain_glow && (
        <div 
          className="absolute inset-0 rounded-xl opacity-20 blur-xl"
          style={{ backgroundColor: member.accent_color }}
        />
      )}
      
      <div className="relative z-10">
        {/* Avatar */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden 
          bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center
          group-hover:scale-110 transition-transform duration-300">
          {member.avatar ? (
            <img 
              src={member.avatar} 
              alt={member.display_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log(`Failed to load avatar for ${member.display_name}: ${member.avatar}`);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-2xl font-bold text-foreground">
              {member.display_name.charAt(0)}
            </span>
          )}
        </div>
        
        {/* Name & Tagline */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-display font-bold text-foreground mb-1">
            {member.display_name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            {member.tagline}
          </p>
        </div>
        
        {/* Role Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
          bg-primary/10 text-primary border border-primary/20 mb-4 w-full justify-center">
          {member.role}
        </div>
        
        {/* Social Links */}
        {member.social_links.length > 0 && (
          <div className="flex justify-center gap-2 mb-4">
            {member.social_links.slice(0, 4).map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border/50 text-muted-foreground 
                  hover:text-primary hover:border-primary/50 hover:bg-primary/5
                  transition-all duration-300"
                title={link.label}
              >
                <SocialIcon type={link.type} />
              </a>
            ))}
          </div>
        )}
        
        {/* CTA Button */}
        {member.cta_button && (
          <div className="text-center">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              <a 
                href={member.cta_button.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {member.cta_button.text}
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamSection({ title, members, columns = 3 }: { title: string; members: TeamMember[]; columns?: number }) {
  const gridCols = columns === 1 ? 'grid-cols-1 max-w-lg' : 
                   columns === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' :
                   'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl';

  return (
    <div className="mb-16">
      <h3 className="text-3xl md:text-4xl font-display font-bold text-primary holographic-text mb-12 text-center">
        {title}
      </h3>
      <div className={`grid ${gridCols} gap-8 mx-auto`}>
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

export function Team() {
  return (
    <section id="team" className="py-20 relative overflow-hidden">
      {/* Simplified cosmic background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background"></div>
        <div className="cosmic-particles"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-6 holographic-text">
            Planet Cuhz Crew
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Meet the innovators, creators, and visionaries building the future of our cosmic ecosystem.
          </p>
        </div>

        {/* Leadership */}
        <TeamSection title="Leadership" members={teamData.leadership} columns={2} />

        {/* Core Team */}
        <TeamSection title="Core Team" members={teamData.core} columns={3} />

        {/* Advisory Board */}
        <TeamSection title="Advisory Board" members={teamData.advisory} columns={3} />

        {/* Brand Ambassadors */}
        <TeamSection title="Brand Ambassadors" members={teamData.brandAmbassadors} columns={3} />

        {/* Brand Ambassador Recruitment CTA */}
        <div className="text-center mt-20">
          <div className="bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-border/50 max-w-3xl mx-auto">
            <h3 className="text-3xl font-display font-bold text-primary mb-4">
              Become a Brand Ambassador
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Ready to represent Planet Cuhz and help grow our cosmic community? Join our amazing team of Brand Ambassadors!
            </p>
            <div className="space-y-4">
              <p className="text-foreground font-semibold">
                🚀 How to Apply:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-primary">
                  <span>💬</span>
                  <span>Join our Discord and message #support</span>
                </div>
                <div className="text-muted-foreground">or</div>
                <div className="flex items-center gap-2 text-primary">
                  <span>📱</span>
                  <span>DM us on social media</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
