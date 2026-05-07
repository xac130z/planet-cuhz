import React from 'react';
import { cn } from '@/lib/utils';

interface BetaBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glow' | 'pulse';
}

export function BetaBadge({ className, size = 'md', variant = 'default' }: BetaBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-electric-yellow to-neon-orange text-deep-space',
    glow: 'bg-gradient-to-r from-electric-yellow to-neon-orange text-deep-space shadow-lg',
    pulse: 'bg-gradient-to-r from-electric-yellow to-neon-orange text-deep-space opacity-90'
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-bold uppercase tracking-wide border border-electric-cyan/30 shadow-lg',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      ⚠️ BETA
    </span>
  );
}