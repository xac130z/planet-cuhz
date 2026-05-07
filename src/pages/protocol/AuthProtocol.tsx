import { PortalBackground } from '@/components/protocol/PortalBackground';
import { FrequencyScanner } from '@/components/protocol/FrequencyScanner';
import { Button } from '@/components/ui/button';
import { Lock, Wrench } from 'lucide-react';
import '@/styles/portal-theme.css';

export default function AuthProtocol() {
  return (
    <main className="portal-wrapper">
      <PortalBackground />
      <FrequencyScanner />
      
      <div className="portal-auth-card">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Lock className="w-20 h-20 text-[#B3A369]" />
              <Wrench className="w-8 h-8 text-[#8A2BE2] absolute -bottom-2 -right-2" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#B3A369] to-[#8A2BE2] bg-clip-text text-transparent">
            Portal Under Maintenance
          </h1>
          
          <p className="text-[#A0A0A0] text-lg max-w-md mx-auto">
            We're working on fixing some technical issues with the Portal. 
            The authentication system will be back online soon!
          </p>
          
          <div className="space-y-6 max-w-md mx-auto">
            <p className="text-[#B3A369] font-semibold text-lg">
              ✨ Join Our Community While You Wait
            </p>
            
            {/* Primary Discord CTA with glow */}
            <Button
              onClick={() => window.open('https://discord.gg/eNxDKkxQdN', '_blank')}
              size="lg"
              className="w-full bg-gradient-to-r from-[#B3A369] to-[#8A2BE2] text-white font-bold text-xl py-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(179,163,105,0.5)] hover:shadow-[0_0_50px_rgba(179,163,105,0.8)] animate-pulse"
            >
              🎮 Join Discord Community
            </Button>
            
            {/* Secondary X button */}
            <Button
              onClick={() => window.open('https://twitter.com/PlanetCUHZ', '_blank')}
              variant="ghost"
              size="sm"
              className="w-full text-[#A0A0A0] hover:text-[#B3A369] transition-colors"
            >
              or Follow on X →
            </Button>
          </div>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="ghost"
            className="text-[#A0A0A0] hover:text-[#B3A369]"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
