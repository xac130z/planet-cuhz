import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useInView } from "@/hooks/useInView";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/* ─── ANIMATED COUNTER ─── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref}>
      <span className="stat-number gradient-text">{count.toLocaleString()}{suffix}</span>
    </div>
  );
}

/* ─── HERO SECTION ─── */
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-blue/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-plasma-purple/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />

      <div className="container relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle/50 bg-surface/50 backdrop-blur-sm mb-8 animate-fade-up">
          <span className="live-dot" />
          <span className="text-xs font-medium text-muted-text">NBA 2K Protocol — Now Live</span>
        </div>

        <h1 className="text-display-lg lg:text-display-xl font-display text-balance mb-6 animate-fade-up delay-100" style={{ opacity: 0 }}>
          Find Your 5.{" "}
          <span className="gradient-text-blue">Build Smarter.</span>{" "}
          Rep Faster.
        </h1>

        <p className="text-lg lg:text-xl text-muted-text max-w-2xl mx-auto mb-10 animate-fade-up delay-200" style={{ opacity: 0 }}>
          AI-powered squad matching, coaching, and engagement tools for NBA 2K players and Twitch streamers. From "cousin" to "cuhz."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300" style={{ opacity: 0 }}>
          <Link to="/protocol/auth" className="btn-primary text-base px-8 py-3.5">
            Get Started — Free
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a href="https://discord.gg/5rFRaeBuHn" target="_blank" rel="noopener noreferrer" className="btn-ghost text-base px-8 py-3.5">
            Join Discord
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURE PILLARS ─── */
const PILLARS = [
  {
    icon: "🏀",
    title: "2K Protocol",
    description: "AI-driven squad finder with chemistry scoring, position matching, and automated team assembly for NBA 2K.",
    href: "/protocol",
    gradient: "from-cosmic-blue/20 to-transparent",
  },
  {
    icon: "🤖",
    title: "Cuhz Bot",
    description: "Smart Twitch bot with AI mood detection, CUHZ points, auto-shoutouts, and live stream awareness across 6+ channels.",
    href: "/bot",
    gradient: "from-plasma-purple/20 to-transparent",
  },
  {
    icon: "⚡",
    title: "Chain Generator",
    description: "Create custom CUHZ chain PFPs with AI styling. Rainbow, Gold, Iced, and more. Connected to your Twitch identity.",
    href: "https://cuhz-bot-dashboard-846.created.app",
    gradient: "from-chain-gold/20 to-transparent",
  },
];

function FeaturePillars() {
  const { ref, isInView } = useInView();

  return (
    <section className="section-padding" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-display-md font-display gradient-text-blue mb-4">
            The Creator Ecosystem
          </h2>
          <p className="text-lg text-muted-text max-w-xl mx-auto">
            Three integrated platforms — one cosmic family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => (
            <a
              key={pillar.title}
              href={pillar.href}
              className={`glass-card p-8 group cursor-pointer ${isInView ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                {pillar.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-bright-text mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-text leading-relaxed">
                {pillar.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-cosmic-blue opacity-0 group-hover:opacity-100 transition-opacity">
                Explore
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STATS BAR ─── */
const STATS = [
  { value: 2400, suffix: "+", label: "Players Matched" },
  { value: 6, suffix: "", label: "Twitch Channels" },
  { value: 50, suffix: "K+", label: "CUHZ Points Earned" },
  { value: 11, suffix: "", label: "Power Tiers" },
];

function StatsBar() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-16 border-y border-border-subtle/30 bg-surface/30" ref={ref}>
      <div className="container">
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 text-center ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
          {STATS.map((stat) => (
            <div key={stat.label}>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-muted-text mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SOCIAL PROOF ─── */
const TESTIMONIALS = [
  {
    quote: "The squad finder actually matched me with players that play my style. Chemistry is real.",
    name: "Four-A-Reason",
    handle: "@fourareason4",
    role: "Streamer · Premium Channel",
  },
  {
    quote: "Cuhz Bot runs my chat automatically when I'm live. The mood detection is crazy accurate.",
    name: "Rico2EZ",
    handle: "@rico2ez",
    role: "Streamer · Premium Channel",
  },
  {
    quote: "From cousin to cuhz — this community is different. The tools actually help you grow.",
    name: "VGX Mahni",
    handle: "@vgxmahni",
    role: "Community Member",
  },
];

function SocialProof() {
  const { ref, isInView } = useInView();

  return (
    <section className="section-padding" ref={ref}>
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-display-md font-display text-bright-text mb-4">
            The <span className="gradient-text">Cuhzunity</span> Speaks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`glass-card p-8 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <p className="text-bright-text leading-relaxed mb-6 text-sm">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-cosmic flex items-center justify-center text-white font-display font-bold text-xs">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm text-bright-text">{t.name}</p>
                  <p className="text-xs text-muted-text">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA SECTION ─── */
function CTASection() {
  const { ref, isInView } = useInView();

  return (
    <section className="section-padding" ref={ref}>
      <div className="container">
        <div className={`relative rounded-3xl overflow-hidden p-12 lg:p-20 text-center ${isInView ? 'animate-scale-in' : 'opacity-0'}`}>
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-cosmic opacity-10" />
          <div className="absolute inset-0 border border-cosmic-blue/20 rounded-3xl" />

          <div className="relative z-10">
            <h2 className="text-display-md lg:text-display-lg font-display text-bright-text mb-4">
              Ready to join the{" "}
              <span className="gradient-text-blue">Cuhzunity</span>?
            </h2>
            <p className="text-lg text-muted-text max-w-lg mx-auto mb-8">
              Free to start. No crypto required. Just find your crew and start winning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/protocol/auth" className="btn-primary text-base px-8 py-3.5">
                Join Free
              </Link>
              <a href="https://discord.gg/5rFRaeBuHn" target="_blank" rel="noopener noreferrer" className="btn-ghost text-base px-8 py-3.5">
                Discord Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PAGE ─── */
export default function Index() {
  return (
    <div className="min-h-screen bg-void">
      <Header />
      <main>
        <Hero />
        <FeaturePillars />
        <StatsBar />
        <SocialProof />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
