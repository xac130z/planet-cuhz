import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Sparkles } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
}

export function ComingSoonModal({ isOpen, onClose, feature, description }: ComingSoonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#232323] to-[#2A1B3D] border-[#8A2BE2]/50 text-[#F1F5F9] max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Clock className="w-16 h-16 text-[#B3A369]" />
              <Sparkles className="w-6 h-6 text-[#8A2BE2] absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#B3A369] to-[#8A2BE2] bg-clip-text text-transparent">
            {feature} Coming Soon!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-[#A0A0A0]">
            {description || `We're working hard to bring you an amazing ${feature.toLowerCase()} experience.`}
          </p>
          
          <div className="bg-[#8A2BE2]/20 rounded-lg p-4 border border-[#8A2BE2]/30">
            <p className="text-[#B3A369] font-semibold text-sm">
              ✨ Stay tuned for updates on our social channels!
            </p>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#B3A369] to-[#8A2BE2] text-[#232323] font-bold hover:opacity-90"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
