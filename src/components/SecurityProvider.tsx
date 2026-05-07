import React, { createContext, useContext } from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';

interface SecurityContextType {
  isAuthenticated: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function useSecurityContext() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
}

interface SecurityProviderProps {
  children: React.ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const { isAuthenticated } = useSecureAuth();

  return (
    <SecurityContext.Provider
      value={{
        isAuthenticated
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}