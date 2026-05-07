/**
 * Canonical origin utility for OAuth PKCE flow
 * Prevents cross-subdomain redirects that break PKCE code_verifier in localStorage
 */

// Hardcoded canonical origin to prevent PKCE breakage across subdomains
export const CANONICAL_ORIGIN = 'https://cosmic-creator.lovable.app';

/**
 * Ensure we're on the canonical origin before starting OAuth flow
 * Returns false if redirecting to canonical origin, true if already there
 */
export function ensureCanonicalOrigin(): boolean {
  const currentOrigin = window.location.origin;
  
  if (currentOrigin !== CANONICAL_ORIGIN) {
    // Redirect to canonical origin to avoid PKCE breakage
    const canonicalUrl = new URL(window.location.href);
    const canonicalHost = new URL(CANONICAL_ORIGIN);
    
    canonicalUrl.protocol = canonicalHost.protocol;
    canonicalUrl.host = canonicalHost.host;
    
    console.info(`Redirecting to canonical origin: ${CANONICAL_ORIGIN}`);
    window.location.replace(canonicalUrl.toString());
    return false;
  }
  
  return true;
}
