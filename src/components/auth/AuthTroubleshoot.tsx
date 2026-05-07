import { supabase } from '@/integrations/supabase/client';

export default function AuthTroubleshoot() {
  const recoverSession = async () => {
    try {
      // Non-destructive PKCE/session reset for stuck users
      // Clear only PKCE temporary keys, not user data
      const keysToRemove = Object.keys(localStorage).filter(
        k => k.includes('supabase.auth') || k.includes('code_verifier') || k.includes('pkce')
      );
      
      keysToRemove.forEach(k => {
        console.log('Clearing PKCE key:', k);
        localStorage.removeItem(k);
      });

      // Try to refresh the session if there's a valid refresh token
      try {
        await supabase.auth.refreshSession();
      } catch {
        // If refresh fails, it's okay - user will just need to sign in again
      }
    } catch (e) {
      console.error('Recovery error:', e);
    }
    
    // Redirect to auth page to restart clean
    window.location.href = '/protocol/auth';
  };

  return (
    <details className="mt-6 text-sm text-neutral-400 max-w-md mx-auto">
      <summary className="cursor-pointer hover:text-neutral-300 transition-colors">
        Having trouble signing in?
      </summary>
      <div className="mt-3 space-y-2 pl-4 border-l-2 border-neutral-700">
        <p>
          If you see "code / code verifier" errors:
        </p>
        <button
          onClick={recoverSession}
          className="text-cyan-400 hover:text-cyan-300 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 rounded px-1"
        >
          Recover Session & Retry
        </button>
        <p className="text-xs text-neutral-500">
          This clears temporary OAuth data and restarts the login flow cleanly.
        </p>
      </div>
    </details>
  );
}
