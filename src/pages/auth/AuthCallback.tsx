import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<'verifying' | 'error'>('verifying');
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session (PKCE flow)
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          console.error('Exchange error:', error);
          throw error;
        }

        // Get the authenticated user
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData.user?.id;
        if (!uid) throw new Error('No user after exchange');

        // Check if user has a profile (existing user vs new user)
        // Try protocol_profiles first (main table for protocol users)
        const { data: prof } = await supabase
          .from('protocol_profiles')
          .select('id, published')
          .eq('id', uid)
          .maybeSingle();

        // Route based on profile status
        if (prof?.published) {
          // Existing user with published profile -> go to finder
          nav('/protocol/find', { replace: true });
        } else if (prof && !prof.published) {
          // User started onboarding but didn't publish -> continue onboarding
          nav('/protocol/onboarding', { replace: true });
        } else {
          // New user -> start onboarding
          nav('/protocol/onboarding', { replace: true });
        }
      } catch (e: any) {
        console.error('Callback error:', e);
        setMsg(e?.message ?? 'Login failed. Please retry.');
        setPhase('error');
      }
    };

    handleCallback();
  }, [nav]);

  if (phase === 'verifying') {
    return (
      <main className="portal-wrapper" data-page="auth-callback">
        <section className="auth-card glass enter" role="main" aria-busy="true" aria-live="polite">
          <h1 className="portal-title">Verifying Twitch…</h1>
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--neon-blue)]" aria-hidden="true"></div>
          </div>
          <p className="portal-sub">One moment while we complete your sign in.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="portal-wrapper" data-page="auth-callback">
      <section className="auth-card glass enter" role="main" aria-live="assertive">
        <h1 className="portal-title">Login Error</h1>
        <p className="portal-sub text-red-400">{msg}</p>
        <a 
          href="/protocol/auth" 
          className="twitch-login mt-6 inline-block"
        >
          <span>Retry Login</span>
        </a>
      </section>
    </main>
  );
}

