
-- Fix 1: Remove user-facing SELECT policies on twitch_tokens (keep service_role only)
DROP POLICY IF EXISTS "Users can view their own tokens" ON public.twitch_tokens;
DROP POLICY IF EXISTS "Users can view their own twitch tokens" ON public.twitch_tokens;
DROP POLICY IF EXISTS "Admins can view all tokens" ON public.twitch_tokens;

-- Fix 2: Replace permissive INSERT on security_audit_logs with service_role only
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_logs;

CREATE POLICY "Only service role can insert audit logs"
ON public.security_audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);
