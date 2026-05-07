import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CANONICAL_ORIGIN, ensureCanonicalOrigin } from '@/utils/canonicalOrigin';

type Props = {
  onStart: () => void;
  connecting: boolean;
};

export const TwitchSignInButton: React.FC<Props> = ({ onStart, connecting }) => {
  const handleClick = async () => {
    try {
      // Ensure we're on canonical origin before starting OAuth
      if (!ensureCanonicalOrigin()) {
        return; // Will redirect, don't proceed
      }
      
      onStart();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitch',
        options: { 
          scopes: 'user:read:email',
          redirectTo: `${CANONICAL_ORIGIN}/auth/callback`
          // Note: No force_verify to avoid extra prompts for existing users
        }
      });
      if (error) throw error;
    } catch (e) {
      console.error('Twitch OAuth error:', e);
      alert('Twitch sign-in failed. Please check your Supabase Twitch provider settings.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`twitch-btn ${connecting ? 'is-loading' : ''}`}
      aria-label="Continue with Twitch"
      disabled={connecting}
    >
      <img
        src="/assets/brands/twitch.svg"
        alt=""
        width="20"
        height="20"
        aria-hidden="true"
        className="twitch-icon"
      />
      <span className="twitch-text">
        {connecting ? 'Connecting…' : 'Continue with Twitch'}
      </span>
      {connecting && <span className="spinner" aria-hidden="true" />}
    </button>
  );
};
