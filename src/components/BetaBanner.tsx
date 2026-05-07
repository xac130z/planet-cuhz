
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Check if user has dismissed banner before
    const dismissed = localStorage.getItem('beta-banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      return;
    }

    // Trigger slide-down animation
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const handleDismiss = () => {
    setIsAnimated(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('beta-banner-dismissed', 'true');
    }, 300);
  };

  const handleDiscordClick = () => {
    window.open('https://discord.gg/eNxDKkxQdN', '_blank');
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[70] bg-gradient-to-r from-[#8A2BE2] via-[#B3A369] to-[#8A2BE2] shadow-lg border-b border-[#FFD700]/30 transition-transform duration-300 ${
        isAnimated ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Beta indicator and message */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-white animate-pulse" />
              <span className="text-white font-bold text-sm sm:text-base uppercase tracking-wide">
                BETA TESTING
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <p className="text-white text-sm sm:text-base font-medium">
              <span className="hidden sm:inline">Website in Beta Testing - </span>
              Help us improve!
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleDiscordClick}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 font-semibold transition-all duration-200 flex items-center gap-2 px-3 sm:px-4 py-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Give Feedback on</span>
            <span className="sm:hidden">Feedback</span>
            <span className="font-bold">Discord</span>
          </Button>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="text-white hover:text-[#FFD700] transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
