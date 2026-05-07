
import { Sparkles } from 'lucide-react';
import { FaTwitter, FaDiscord } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="py-12 bg-gradient-to-r from-deep-space via-cosmic-purple to-deep-space border-t border-electric-cyan/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <a href="/" className="flex items-center justify-center space-x-2 mb-6">
          <img 
            src="/lovable-uploads/42e443a0-b26a-4cd9-811f-e1a5b66462c7.png" 
            alt="Planet CUHZ Logo"
            className="w-6 h-6 object-contain brand-glow"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.footer-fallback-logo')) {
                const fallback = document.createElement('span');
                fallback.className = 'footer-fallback-logo text-2xl';
                fallback.textContent = '🌌';
                parent.appendChild(fallback);
              }
            }}
          />
          <span className="text-xl font-display font-bold holographic-text">Planet CUHZ</span>
        </a>
        
        {/* Quick Links Section */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-electric-cyan mb-4">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a 
              href="/whitepaper"
              className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow"
            >
              📄 Whitepaper
            </a>
            <a href="/protocol" className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow">
              🎮 Protocol
            </a>
            <a href="/community" className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow">
              👥 Community
            </a>
            <a href="/about" className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow">
              ℹ️ About
            </a>
            <a href="/team" className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow">
              ⭐ Team
            </a>
            <a href="/partners" className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow">
              🤝 Partners
            </a>
            <a href="/press-kit" className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow">
              📰 Press Kit
            </a>
            <a href="/changelog" className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow">
              📋 Changelog
            </a>
            <a href="/legal" className="bg-cosmic-purple/60 px-4 py-2 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 text-sm font-medium hover:text-shadow-glow">
              ⚖️ Legal
            </a>
          </div>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-6">
          <a 
            href="https://x.com/PlanetCuhz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center space-x-2 bg-cosmic-purple/60 px-4 py-3 rounded-full text-white hover:text-electric-cyan hover:bg-electric-cyan/10 border border-electric-cyan/50 transition-all duration-300 hover:scale-105 electric-pulse"
          >
            <FaTwitter className="w-5 h-5" />
            <span className="font-medium">Follow us on X</span>
          </a>
          
          <a 
            href="https://x.com/i/communities/1933710165359923481" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center space-x-2 bg-cosmic-purple/60 px-4 py-3 rounded-full text-white hover:text-electric-blue hover:bg-electric-blue/10 border border-electric-blue/50 transition-all duration-300 hover:scale-105 electric-pulse"
          >
            <FaTwitter className="w-5 h-5" />
            <span className="font-medium">Join CUHZUNITY</span>
          </a>
          
          <a 
            href="https://discord.gg/eNxDKkxQdN"
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center space-x-2 bg-cosmic-purple/60 px-4 py-3 rounded-full text-white hover:text-electric-purple hover:bg-electric-purple/10 border border-electric-purple/50 transition-all duration-300 hover:scale-105 electric-pulse"
          >
            <FaDiscord className="w-5 h-5" />
            <span className="font-medium">CUHZ Voice (Discord)</span>
          </a>
        </div>
        
        <p className="text-xs text-electric-purple mb-4 font-medium">
          💎 Discord is for voice-only cosmic conversations - no text chat!
        </p>
        
        {/* Help & Support Link */}
        <div className="mb-6">
          <a 
            href="/help-support"
            className="inline-flex items-center space-x-2 text-electric-cyan hover:text-electric-yellow transition-colors duration-300 font-medium hover:text-shadow-glow"
          >
            <span>Need Help? Visit our Support Center</span>
          </a>
        </div>
        
        <p>&copy; {new Date().getFullYear()} Planet CUHZ. All rights reserved.</p>
        
        {/* Beta Features Notice */}
        <div className="mb-6 p-4 bg-gradient-to-r from-electric-yellow/10 to-neon-orange/10 border border-electric-yellow/30 rounded-xl max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-electric-yellow mb-2 flex items-center gap-2">
            ⚠️ Beta Features Notice
          </h3>
          <p className="text-sm text-electric-cyan font-medium leading-relaxed">
            Some features of Planet Cuhz are in active development. Beta-labeled tools may experience bugs, incomplete functionality, or visual glitches. We appreciate your patience and community input as we refine the experience.
          </p>
        </div>
        
        <p className="text-sm mt-2 text-electric-purple">
          Planet Cuhz is a creator-focused platform providing AI tools and community features.
        </p>
      </div>
    </footer>
  );
}
