import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface SecureAuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useSecureAuth() {
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          if (session?.user) {
            // Log authentication events for security monitoring
            await supabase.functions.invoke('log-security-event', {
              body: {
                action: `auth_${event}`,
                resource_type: 'authentication',
                success: true,
                metadata: {
                  user_id: session.user.id,
                  email: session.user.email
                }
              }
            });
          }

          setAuthState({
            user: session?.user ?? null,
            session,
            isAuthenticated: !!session?.user,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Auth state change error:', error);
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Authentication error occurred'
          }));
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            isAuthenticated: !!session?.user,
            isLoading: false,
            error: null
          });
        }
      } catch (error: any) {
        if (mounted) {
          setAuthState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Failed to initialize authentication'
          });
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });

    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to sign out';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Sign Out Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    signOut,
    clearError
  };
}