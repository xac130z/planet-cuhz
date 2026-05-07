# OAuth PKCE Setup Guide

This guide explains how to configure Twitch OAuth with PKCE (Proof Key for Code Exchange) to prevent cross-subdomain authentication errors.

## Problem We're Solving

When OAuth redirects happen across different subdomains (e.g., `cosmic-creator.lovable.app` → `hz-cosmic-creator.lovable.app`), the PKCE `code_verifier` stored in localStorage on the origin domain cannot be accessed on the callback domain. This causes the error:

```
"both auth code and code verifier should be non-empty"
```

## Solution: Canonical Origin

We enforce a single "canonical origin" for the entire OAuth flow (both initiation and callback). If a user lands on a different subdomain, they're automatically redirected to the canonical origin before OAuth starts.

## Configuration Steps

### 1. Set Environment Variable

Create `.env.local` (for development):

```bash
# Development
VITE_CANONICAL_ORIGIN=http://localhost:5173
```

For production, set in your hosting platform:

```bash
# Production (example)
VITE_CANONICAL_ORIGIN=https://planetcuhz.com
```

### 2. Configure Supabase Auth Settings

Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**:

#### Site URL
Set to your production canonical origin:
```
https://planetcuhz.com
```

#### Redirect URLs (Add all these)
```
https://planetcuhz.com/auth/callback
https://planetcuhz.com/protocol/callback
https://cosmic-creator.lovable.app/auth/callback
https://cosmic-creator.lovable.app/protocol/callback
https://hz-cosmic-creator.lovable.app/auth/callback
https://hz-cosmic-creator.lovable.app/protocol/callback
http://localhost:5173/auth/callback
http://localhost:5173/protocol/callback
```

**Note:** Both `/auth/callback` and `/protocol/callback` are supported for backward compatibility.

### 3. Configure Twitch Developer Settings

Go to **Twitch Developer Console** → **Your Application** → **OAuth Redirect URLs**:

Add the Supabase callback URL (NOT your app's callback):
```
https://wjebryxdefcgsxsqomac.supabase.co/auth/v1/callback
```

### 4. Enable Twitch Provider in Supabase

Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Twitch**:

1. Enable Twitch
2. Paste your Twitch Client ID
3. Paste your Twitch Client Secret
4. Save

## How It Works

### Flow Diagram

```
1. User visits any subdomain → Redirected to CANONICAL_ORIGIN
2. User clicks "Continue with Twitch"
   ↓
3. OAuth starts from CANONICAL_ORIGIN (code_verifier saved in localStorage)
   ↓
4. User authorizes on Twitch
   ↓
5. Twitch redirects to Supabase callback
   ↓
6. Supabase redirects to CANONICAL_ORIGIN/auth/callback (or /protocol/callback)
   ↓
7. Callback page reads code_verifier from localStorage (same origin!)
   ↓
8. exchangeCodeForSession() succeeds
   ↓
9. User redirected to /protocol/onboarding or /protocol/find
```

### Session Recovery Feature

If a user gets stuck with PKCE errors, the app provides a "Recover Session" option that:

1. Clears only PKCE temporary keys (code_verifier, etc.) from localStorage
2. Attempts to refresh the session if a valid refresh token exists
3. Redirects to `/protocol/auth` for a clean restart
4. **Does NOT** delete user profile data or other app state

This helps existing users who may have stale PKCE data without forcing them to lose their account.

### Key Files

- **`src/utils/canonicalOrigin.ts`** - Canonical origin utility
- **`src/integrations/supabase/client.ts`** - Supabase client with PKCE config
- **`src/components/protocol/AuthCard.tsx`** - Main auth UI with canonical origin check
- **`src/pages/protocol/ProtocolCallback.tsx`** - OAuth callback handler (full profile sync)
- **`src/pages/auth/AuthCallback.tsx`** - Simplified OAuth callback (for existing users)
- **`src/components/protocol/TwitchSignInButton.tsx`** - Alternative Twitch button
- **`src/components/auth/AuthTroubleshoot.tsx`** - Session recovery component

## Testing

### Local Development

1. Set `VITE_CANONICAL_ORIGIN=http://localhost:5173` in `.env.local`
2. Add both callback URLs to Supabase Redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/protocol/callback`
3. Run `pnpm dev`
4. Visit `http://localhost:5173/protocol/auth`
5. Click "Continue with Twitch"
6. Verify successful login

### Production Testing

1. Set `VITE_CANONICAL_ORIGIN` to your production domain
2. Test on mobile Safari (most common PKCE issue)
3. Test on desktop browsers
4. Clear browser cache between tests to simulate new users

## Common Issues

### "both auth code and code verifier should be non-empty"

**Cause:** Cross-subdomain redirect broke PKCE flow

**Fix:**
1. Verify `VITE_CANONICAL_ORIGIN` is set correctly
2. Use the "Recover Session & Retry" button in the auth UI
3. Clear browser localStorage and cookies manually if issue persists
4. Ensure Supabase Redirect URLs include both `/auth/callback` and `/protocol/callback`
5. Check browser console for redirect loops

### "Connection timeout"

**Cause:** Supabase or Twitch configuration issue

**Fix:**
1. Verify Twitch app has the correct Supabase callback URL
2. Check Twitch app is enabled and published
3. Verify Supabase Twitch provider is enabled with correct credentials
4. Check Supabase logs for errors

### Works on desktop but fails on mobile

**Cause:** Mobile Safari has stricter localStorage/cookie policies

**Fix:**
1. Ensure PKCE flow is enabled (`flowType: 'pkce'` in Supabase client)
2. Use canonical origin (already implemented)
3. Test in Safari private browsing mode
4. Verify redirect URLs don't have typos

## Security Notes

- **PKCE is required** for mobile Safari and progressive web apps
- **Never commit** `.env.local` with secrets to git
- **Always use HTTPS** in production
- **Validate redirect URLs** in Supabase to prevent open redirects
- **Code verifier** is cryptographically random and stored client-side

## Support

If you're still experiencing issues:

1. Check Supabase Edge Function logs
2. Check browser Network tab for failed requests
3. Verify environment variables are loaded (`console.log(import.meta.env.VITE_CANONICAL_ORIGIN)`)
4. Contact support: streamersupport@planetcuhz.com

## Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)
- [Twitch OAuth Documentation](https://dev.twitch.tv/docs/authentication)
