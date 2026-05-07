import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BetaDisclaimerProps {
  title?: string;
  message: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function BetaDisclaimer({ 
  title, 
  message, 
  className, 
  variant = 'default' 
}: BetaDisclaimerProps) {
  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-start gap-2 p-3 bg-gradient-to-r from-electric-yellow/10 to-neon-orange/10 border border-electric-yellow/30 rounded-lg',
        className
      )}>
        <AlertTriangle className="w-4 h-4 text-electric-yellow flex-shrink-0 mt-0.5" />
        <p className="text-sm text-electric-cyan font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      'p-4 bg-gradient-to-br from-electric-yellow/10 via-neon-orange/10 to-electric-purple/10 border border-electric-yellow/30 rounded-xl backdrop-blur-sm',
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-electric-yellow/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-electric-yellow" />
        </div>
        <div className="flex-1">
          {title && (
            <h4 className="font-bold text-electric-yellow mb-2">{title}</h4>
          )}
          <p className="text-electric-cyan font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}