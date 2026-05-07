-- Drop the old 7-parameter version of log_security_event
-- Keep only the 9-parameter version with full IP and user agent tracking
DROP FUNCTION IF EXISTS public.log_security_event(text, text, text, text, boolean, text, jsonb);

-- The 9-parameter version with ip_address and user_agent remains
-- This ensures all security audit logs include complete client context