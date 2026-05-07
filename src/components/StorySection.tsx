
import React from "react";

// Simple static divider
function SimpleBrandDivider() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-32 h-1 bg-gradient-to-r from-[#8A2BE2] via-[#FFD700] to-[#8A2BE2] rounded-full"></div>
    </div>
  );
}

// Simplified background - no animations
function SimplifiedCosmicBG({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#090b19] via-[#1a1a2e] to-[#16213e] shadow-xl border border-[#8A2BE2]/30 px-0 pt-6 pb-12">
      {/* Static decorative dots - no animation */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.3) 1px, transparent 0)',
          backgroundSize: '80px 80px'
        }}
      ></div>
      {children}
    </div>
  );
}

export function StorySection() {
  return (
    <section id="story" className="relative z-0 mt-8 sm:mt-12 pb-4 md:pb-8">
      <div className="container mx-auto max-w-5xl px-4 sm:px-8 relative z-10">
        <SimplifiedCosmicBG>
          <div className="pt-8 px-4 sm:px-12 relative z-10">
            {/* Text-only title - no logo */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight text-center mb-8 bg-gradient-to-r from-[#8A2BE2] via-[#FFD700] to-[#8A2BE2] bg-clip-text text-transparent">
              Join Our Cuhzunity
            </h2>
            
            {/* Simple static divider */}
            <SimpleBrandDivider />
            
            <div className="text-center mt-4">
              <p className="mx-auto max-w-3xl text-lg md:text-xl font-semibold text-[#F1F5F9] leading-relaxed mb-6">
                Follow us on <span className="text-[#FFD700] font-bold text-xl">@PlanetCUHZ</span> and join the cosmic cuhzunity! 
                <span className="text-[#8A2BE2] font-bold block mt-2">Create content, govern together, and build the future.</span>
              </p>
              
              {/* Live Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-[#8A2BE2]/20 to-[#FFD700]/20 rounded-lg p-4 border border-[#8A2BE2]/30">
                  <h3 className="text-[#FFD700] font-bold text-lg mb-2">Live Features</h3>
                  <p className="text-[#F1F5F9] text-sm">Join us live on Twitch! Watch streams after 5PM EST, Monday - Sunday</p>
                </div>
                <div className="bg-gradient-to-br from-[#00BFFF]/20 to-[#8A2BE2]/20 rounded-lg p-4 border border-[#00BFFF]/30">
                  <h3 className="text-[#00BFFF] font-bold text-lg mb-2">Metaverse Vision</h3>
                  <p className="text-[#F1F5F9] text-sm">As Planet CUHZ grows, we're building our own metaverse world with advanced AI tools and immersive experiences</p>
                </div>
                <div className="bg-gradient-to-br from-[#FFD700]/20 to-[#FF1493]/20 rounded-lg p-4 border border-[#FFD700]/30">
                  <h3 className="text-[#FFD700] font-bold text-lg mb-2">Tournament of Power</h3>
                  <p className="text-[#F1F5F9] text-sm">Compare and rank AI tools with the community</p>
                </div>
              </div>
              
              {/* Single centered CTA button */}
              <div className="flex justify-center items-center mt-8">
                <a
                  href="https://twitter.com/PlanetCUHZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-gradient-to-r from-[#1DA1F2] to-[#0d8bd9] text-white font-bold text-lg rounded-xl shadow-lg hover:opacity-90 transition-opacity duration-300"
                >
                  Follow @PlanetCUHZ
                </a>
              </div>
              
              <p className="text-[#A0A0A0] text-base mt-6 mb-0 max-w-2xl mx-auto leading-relaxed">
                We're all God's children, which makes us cuhzins. <span className="text-[#F1F5F9] font-bold">That's why this family keeps growing.</span>
              </p>
            </div>
          </div>
        </SimplifiedCosmicBG>
      </div>
    </section>
  );
}
