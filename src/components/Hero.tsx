import { Button } from '@/components/ui/button';
import { ComingSoonButton } from '@/components/ComingSoonButton';
import { FaTwitter, FaDiscord } from 'react-icons/fa';

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space py-8 sm:py-12">
      {/* Neon Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 via-electric-purple/5 to-electric-cyan/10 animate-pulse"></div>
      
      <div className="relative z-10 text-center px-8 sm:px-12 lg:px-16 max-w-6xl mx-auto">
        {/* Single Primary Logo - Optimized Size */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center">
            <img
              src="/lovable-uploads/42e443a0-b26a-4cd9-811f-e1a5b66462c7.png"
              alt="Planet CUHZ Logo"
              className="w-full h-full object-contain animate-float brand-glow"
              style={{
                filter: 'drop-shadow(0 0 20px hsl(195, 100%, 50%, 0.6)) drop-shadow(0 0 40px hsl(270, 100%, 50%, 0.4)) drop-shadow(0 0 60px hsl(180, 100%, 50%, 0.3))'
              }}
              onError={(e) => {
                console.log('Hero logo failed to load:', e.currentTarget.src);
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.hero-fallback-logo')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'hero-fallback-logo text-6xl sm:text-8xl animate-float';
                  fallback.textContent = '🌌';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Brand Name - Holographic Gradient */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight mb-6 sm:mb-8 holographic-text electric-pulse">
          Planet CUHZ
        </h1>

        {/* Neon Subtitle */}
        <div className="mb-12 relative">
          <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-wide max-w-4xl mx-auto text-electric-cyan text-shadow-glow">
            Creator-First AI Platform
          </p>
          
          {/* Electric Accent Line */}
          <div className="flex justify-center mt-6">
            <div className="w-32 h-1 bg-gradient-to-r from-electric-blue via-electric-cyan to-cosmic-white rounded-full animate-glow"></div>
          </div>
        </div>

        {/* Value Statement */}
        <div className="max-w-5xl mx-auto space-y-8 mb-16">
          <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
            From "cousin" to "cuhz", join the most welcoming creator community. 
            <span className="text-electric-yellow font-bold block mt-2 text-shadow-glow">AI-powered tools for streamers, gamers, and creators.</span>
          </p>
        </div>

        {/* Primary CTA - Join Discord */}
        <div className="flex flex-col items-center mb-12">
          <Button
            onClick={() => window.open('https://discord.gg/eNxDKkxQdN', '_blank')}
            size="lg"
            className="bg-gradient-to-r from-electric-purple to-electric-blue hover:from-electric-blue hover:to-electric-purple text-white font-bold px-12 sm:px-16 py-6 text-xl rounded-xl transition-all duration-300 hover:scale-105 ring-2 ring-electric-purple/50 shadow-[0_0_20px_rgba(138,43,226,0.5),inset_0_0_20px_rgba(138,43,226,0.2)] hover:shadow-[0_0_40px_rgba(138,43,226,0.8),inset_0_0_30px_rgba(138,43,226,0.3)] hover:ring-electric-purple"
          >
            <FaDiscord className="w-6 h-6 mr-3" />
            🎮 Join Our Discord
          </Button>
          
          <p className="text-electric-purple font-semibold mt-4 text-lg text-shadow-glow">
            ✨ Connect with the CUHZ Community! ✨
          </p>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-6 justify-center items-center flex-wrap">
          <ComingSoonButton
            feature="Portal Access"
            description="We're working on fixing some technical issues with the Portal. Join our Discord to stay updated!"
            variant="outline"
            className="border-2 border-electric-cyan/50 text-electric-cyan hover:bg-electric-cyan/10 hover:border-electric-cyan px-6 py-3 text-lg font-semibold transition-all duration-300"
          >
            🚀 Join the Portal
          </ComingSoonButton>
          <Button
            onClick={() => window.open('https://twitter.com/PlanetCUHZ', '_blank')}
            variant="outline"
            className="border-2 border-electric-cyan/50 text-electric-cyan hover:bg-electric-cyan/10 hover:border-electric-cyan px-6 py-3 text-lg font-semibold transition-all duration-300"
          >
            <FaTwitter className="w-5 h-5 mr-2" />
            Follow on X
          </Button>
        </div>
      </div>
    </section>
  );
}
