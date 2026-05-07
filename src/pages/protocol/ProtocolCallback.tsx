import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ensureCanonicalOrigin } from '@/utils/canonicalOrigin';
import '@/styles/portal-theme.css';

export default function ProtocolCallback() {
  const nav = useNavigate();
  const [status, setStatus] = useState<'exchanging' | 'upserting' | 'done' | 'error' | 'timeout'>('exchanging');
  const [msg, setMsg] = useState('Signing you in…');
  
  // Ensure canonical origin on mount
  useEffect(() => {
    ensureCanonicalOrigin();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (status !== 'done') {
        setStatus('timeout');
        setMsg('Connection timeout. Please try again.');
      }
    }, 10000);

    const handleCallback = async () => {
      try {
        setMsg('Verifying Twitch credentials…');
        
        // Exchange the code for a session (PKCE flow)
        const { error: exchError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (exchError) {
          console.error('Exchange error:', exchError);
          throw new Error(exchError.message || 'Failed to exchange authorization code. Please try again.');
        }

        // Get the authenticated user
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const user = userData?.user;
        if (!user) throw new Error('No user returned from Supabase.');

        // Extract Twitch metadata
        const meta: any = user.user_metadata || {};
        const identities: any[] = (user.identities as any[]) || [];
        const twitchIdentity = identities.find((i: any) => i.provider === 'twitch') || {};
        const tdata: any = twitchIdentity.identity_data || {};

        const twitch_id = meta.provider_id || tdata.sub || meta.sub || user.id;
        const twitch_login = meta.preferred_username || meta.user_name || tdata.preferred_username || 'twitch_user';
        const display_name = meta.name || meta.display_name || tdata.name || twitch_login;

        // Upsert protocol profile
        setStatus('upserting');
        setMsg('Syncing your Protocol profile…');

        const { error: upsertError } = await supabase
          .from('protocol_profiles')
          .upsert(
            {
              id: user.id,
              twitch_id,
              twitch_login,
              display_name,
              email: user.email || null,
              platform: 'PS5',
              role: 'PG',
              modes: ['Park'],
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
              updated_at: new Date().toISOString()
            },
            { onConflict: 'id' }
          );

        if (upsertError) throw upsertError;

        setStatus('done');
        
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('protocol_profiles')
          .select('published')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.published) {
          nav('/protocol/find', { replace: true });
        } else {
          nav('/protocol/onboarding', { replace: true });
        }
      } catch (e: any) {
        console.error('Callback error:', e);
        
        // Provide helpful error messages based on error type
        let errorMsg = 'Sign-in failed. Please try again.';
        
        if (e?.message?.includes('code') && e?.message?.includes('verifier')) {
          errorMsg = 'Authentication error: Cross-domain issue detected. Please clear your browser cache and try again.';
        } else if (e?.message) {
          errorMsg = e.message;
        }
        
        setMsg(errorMsg);
        setStatus('error');
      } finally {
        window.clearTimeout(timer);
      }
    };

    handleCallback();
  }, [nav, status]);

  const retry = async () => {
    await supabase.auth.signOut();
    window.location.assign('/protocol/auth');
  };

  return (
    <main className="portal-wrapper" data-page="protocol-callback">
      <section className="auth-card glass enter" aria-live="polite">
        <h2 className="portal-title">
          {status === 'exchanging' || status === 'upserting' ? 'Verifying Twitch…' : 'Authentication'}
        </h2>
        <p className="portal-sub">{msg}</p>
        
        {(status === 'exchanging' || status === 'upserting') && (
          <div className="flex justify-center my-6" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--neon-blue)]"></div>
          </div>
        )}
        
        {(status === 'error' || status === 'timeout') && (
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {status === 'timeout' 
                ? '⏱️ Connection timed out. This might be a network issue or a configuration problem.' 
                : '❌ ' + msg}
            </div>
            <button 
              className="twitch-login w-full" 
              onClick={retry}
              aria-label="Retry login"
            >
              <span>Retry Login</span>
            </button>
            <p className="text-xs text-center text-neutral-400">
              Still having issues? Contact{' '}
              <a 
                href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || 'streamersupport@planetcuhz.com'}`}
                className="text-cyan-400 hover:text-cyan-300"
              >
                support
              </a>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
