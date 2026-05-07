import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Stepper } from './Stepper';
import { CANONICAL_ORIGIN, ensureCanonicalOrigin } from '@/utils/canonicalOrigin';
import AuthTroubleshoot from '@/components/auth/AuthTroubleshoot';

const OAUTH_TIMEOUT_MS = 10000;

export const AuthCard: React.FC = () => {
  const [connecting, setConnecting] = useState(false);
  const [timeoutHit, setTimeoutHit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure we're on canonical origin for OAuth
    ensureCanonicalOrigin();
  }, []);

  useEffect(() => {
    if (!connecting) return;
    
    const timer = setTimeout(() => {
      setTimeoutHit(true);
    }, OAUTH_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [connecting]);

  const handleTwitchLogin = async () => {
    try {
      // Ensure we're on canonical origin before starting OAuth
      if (!ensureCanonicalOrigin()) {
        return; // Will redirect, don't proceed
      }
      
      setConnecting(true);
      setTimeoutHit(false);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: { 
          scopes: 'user:read:email',
          redirectTo: `${CANONICAL_ORIGIN}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (e) {
      console.error('Twitch OAuth error:', e);
      setConnecting(false);
      setTimeoutHit(false);
      alert('Twitch sign-in failed. Please check your connection and try again.');
    }
  };

  return (
    <section className={`auth-card glass ${mounted ? 'enter' : ''}`} role="main" aria-labelledby="portal-title">
      <div className="card-glow" aria-hidden="true" />
      
      <h1 id="portal-title" className="portal-title">
        NBA 2K PROTOCOL
        <span className="year-badge">2K26</span>
      </h1>
      
      <Stepper active="AUTH" />
      
      <p className="portal-sub">
        Twitch-first teammate finder. Access your squad network.
      </p>

      <button
        className={`twitch-login ${connecting ? 'loading' : ''}`}
        onClick={handleTwitchLogin}
        disabled={connecting}
        aria-label="Continue with Twitch"
      >
        <img 
          src="/assets/brands/twitch.svg" 
          alt="" 
          className="twitch-icon"
          width="24"
          height="24"
        />
        <span>{connecting ? 'Connecting to Twitch…' : 'Continue with Twitch'}</span>
        {connecting && <span className="spinner" aria-hidden="true" />}
      </button>

      {timeoutHit && connecting && (
        <div className="timeout-msg" role="alert">
          ⚠️ Connection taking longer than expected. Try refreshing.
        </div>
      )}

      <div className="phase-info" role="note">
        <strong>Phase 1:</strong> Twitch authentication only. Email and phone added during onboarding.
      </div>

      <footer className="support-footer">
        <p className="help-text">
          Need help?{' '}
          <a 
            href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL || 'streamersupport@planetcuhz.com'}`}
            className="support-link"
          >
            {import.meta.env.VITE_SUPPORT_EMAIL || 'streamersupport@planetcuhz.com'}
          </a>
        </p>
        <p className="twitch-signup">
          Don't have Twitch?{' '}
          <a 
            href="https://www.twitch.tv/signup" 
            target="_blank" 
            rel="noopener noreferrer"
            className="support-link"
          >
            Create account
          </a>
        </p>
      </footer>

      <AuthTroubleshoot />
    </section>
  );
};
