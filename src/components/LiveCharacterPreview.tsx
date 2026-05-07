
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';

const PREVIEW_CHARACTERS = [
  {
    id: 1,
    name: "Cosmic Guardian Maya",
    aura: "fire",
    image: "/lovable-uploads/1ac1aa02-49a2-47a8-ac84-c58ca505cefc.png",
    description: "Divine protector with blazing fire aura"
  },
  {
    id: 2,
    name: "Neon Streamer Alex",
    aura: "neon",
    image: "/lovable-uploads/1ac1aa02-49a2-47a8-ac84-c58ca505cefc.png",
    description: "Electric gaming energy with cyber vibes"
  },
  {
    id: 3,
    name: "Ice Mystic Luna",
    aura: "ice",
    image: "/lovable-uploads/1ac1aa02-49a2-47a8-ac84-c58ca505cefc.png",
    description: "Crystalline wisdom with frozen essence"
  },
  {
    id: 4,
    name: "Godly Oracle Zara",
    aura: "godly",
    image: "/lovable-uploads/1ac1aa02-49a2-47a8-ac84-c58ca505cefc.png",
    description: "Majestic divine presence with golden light"
  }
];

export function LiveCharacterPreview() {
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!isRotating) return;

    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % PREVIEW_CHARACTERS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isRotating]);

  const character = PREVIEW_CHARACTERS[currentCharacter];

  const handleManualRotate = () => {
    setCurrentCharacter((prev) => (prev + 1) % PREVIEW_CHARACTERS.length);
    setIsRotating(false);
    setTimeout(() => setIsRotating(true), 10000); // Resume auto-rotation after 10s
  };

  return (
    <div className="bg-gradient-to-br from-[#232323] via-[#1a1a2e] to-[#16213e] rounded-2xl p-8 border border-[#8A2BE2]/30 shadow-xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B3A369]/20 to-[#8A2BE2]/20 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-[#B3A369]" />
          <span className="text-[#B3A369] font-semibold text-sm">Live Character Preview</span>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#B3A369] to-[#8A2BE2] bg-clip-text text-transparent mb-2">
          Your Future CUHZ Character
        </h3>
        <p className="text-[#A0A0A0]">See what your cosmic identity could look like</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Character Preview */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-[#8A2BE2] to-[#B3A369] shadow-lg">
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div className={`absolute -inset-2 rounded-full opacity-50 blur-sm transition-all duration-1000 ${
            character.aura === 'fire' ? 'bg-red-500/30' :
            character.aura === 'neon' ? 'bg-cyan-400/30' :
            character.aura === 'ice' ? 'bg-blue-400/30' :
            'bg-yellow-500/30'
          }`}></div>
        </div>

        {/* Character Info */}
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-xl font-bold text-[#F1F5F9] mb-2">{character.name}</h4>
          <p className="text-[#A0A0A0] mb-4">{character.description}</p>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <span className="text-sm text-[#B3A369]">Aura:</span>
            <span className={`text-sm font-semibold capitalize ${
              character.aura === 'fire' ? 'text-red-400' :
              character.aura === 'neon' ? 'text-cyan-400' :
              character.aura === 'ice' ? 'text-blue-400' :
              'text-yellow-400'
            }`}>
              {character.aura} ✨
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleManualRotate}
            variant="outline"
            size="sm"
            className="border-[#8A2BE2]/50 text-[#8A2BE2] hover:bg-[#8A2BE2]/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Next
          </Button>
          <div className="flex gap-1">
            {PREVIEW_CHARACTERS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentCharacter 
                    ? 'bg-[#B3A369]' 
                    : 'bg-[#444]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-6 pt-6 border-t border-[#444]">
        <Button
          onClick={() => window.location.href = '/protocol'}
          className="bg-gradient-to-r from-[#B3A369] to-[#8A2BE2] text-[#232323] font-bold px-8 py-3 text-lg hover:shadow-lg transition-all duration-300"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Create Your Character
        </Button>
        <p className="text-xs text-[#A0A0A0] mt-2">
          Generate unlimited variations with AI ✨
        </p>
      </div>
    </div>
  );
}
