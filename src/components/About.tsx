
import { Sparkles } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-22 sm:py-28 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/5 via-transparent to-hot-pink/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-electric-cyan/3 via-transparent to-electric-purple/3"></div>
      </div>
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-11">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-11 lg:gap-17 items-center">
          <div>
            <h2 className="text-hierarchy-h2 text-electric-cyan holographic-text mb-8">The Story of CUHZ</h2>
            
            <p className="text-hierarchy-body text-electric-blue/90 mb-8">
              It started simple: "cousin" became "cuz," then evolved into "cuhz" in our family. What began as household slang grew into something bigger, a way to show love and belonging.
            </p>
            
            <p className="text-hierarchy-body text-electric-purple/90 mb-8">
              We realized "cuhz" represents universal connection. We're all family. That's how Planet Cuhz was born, a creator-first AI platform where strangers become siblings and collaborators become lifelong friends.
            </p>
            
            <div className="bg-gradient-to-r from-electric-purple/20 to-electric-cyan/20 p-6 rounded-lg border border-electric-purple/30 animate-glow mb-8">
              <p className="text-hierarchy-body text-white font-medium text-center">
                <span className="text-electric-cyan font-semibold">Our Mission:</span> Deliver real utility today through our live platform, AI-powered tools, and creator collaboration features. No empty promises, just pure innovation and genuine community.
              </p>
            </div>
            
            <p className="text-hierarchy-body text-hot-pink font-medium">
              Ready to experience next-gen creator tools, cuhz? Join our thriving ecosystem with live features, AI-powered tools, and powerful collaboration features. 🚀
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-cosmic-purple/30 to-electric-blue/30 p-8 lg:p-11 rounded-2xl electric-pulse border border-electric-cyan/50">
            <h3 className="text-hierarchy-h3 font-display font-semibold flex items-center text-electric-cyan mb-6">
              <Sparkles className="w-7 h-7 mr-4 text-electric-cyan animate-glow" />
              Our Live Ecosystem
            </h3>
            <ul className="space-y-4 text-white">
              <li className="text-hierarchy-body">
                <strong className="text-electric-cyan font-semibold">Platform Features:</strong> Live tools, AI-powered matching, and premium features (token-gating coming soon).
              </li>
              <li className="text-hierarchy-body">
                <strong className="text-electric-purple font-semibold">Universal Matchmaking:</strong> AI-powered matching for creators, streamers, and teams.
              </li>
              <li className="text-hierarchy-body">
                <strong className="text-hot-pink font-semibold">Twitch Streamer Hub:</strong> AI moderation, analytics, and marketing automation.
              </li>
              <li className="text-hierarchy-body">
                <strong className="text-electric-blue font-semibold">Tournament of Power:</strong> Community-driven AI tools ranking system.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
