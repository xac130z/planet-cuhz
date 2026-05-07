import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ComingSoonModal } from './ComingSoonModal';

interface ComingSoonButtonProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function ComingSoonButton({ 
  children, 
  feature, 
  description, 
  className,
  variant = "default",
  size = "default",
  style,
  onClick
}: ComingSoonButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    setShowModal(true);
  };

  return (
    <>
      <Button 
        onClick={handleClick}
        className={className}
        variant={variant}
        size={size}
        style={style}
      >
        {children}
      </Button>
      
      <ComingSoonModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature={feature}
        description={description}
      />
    </>
  );
}
