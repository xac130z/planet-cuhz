-- Security Enhancement Migration
-- This migration implements comprehensive security improvements

-- 1. Create wallet ownership verification function
CREATE OR REPLACE FUNCTION public.verify_wallet_ownership(p_wallet_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    profile_exists boolean;
BEGIN
    -- Check if the current authenticated user owns this wallet address
    SELECT EXISTS(
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() AND user_id::text = p_wallet_address
    ) INTO profile_exists;
    
    RETURN profile_exists;
END;
$$;

-- 2. Create audit logging table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    wallet_address text,
    ip_address inet,
    user_agent text,
    success boolean NOT NULL DEFAULT true,
    error_message text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow viewing own audit logs
CREATE POLICY "Users can view their own audit logs"
ON public.security_audit_logs
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert audit logs (for edge functions)
CREATE POLICY "System can insert audit logs"
ON public.security_audit_logs
FOR INSERT
WITH CHECK (true);

-- 3. Enhanced RLS policies for commands table
-- Drop existing policies and recreate with better security
DROP POLICY IF EXISTS "Users can create their own commands" ON public.commands;

-- New policy with wallet ownership verification
CREATE POLICY "Users can create commands for owned wallets"
ON public.commands
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = commands.user_profile_id 
        AND user_profiles.user_id = auth.uid()
    )
    AND (
        commands.wallet_address IS NULL 
        OR public.verify_wallet_ownership(commands.wallet_address)
    )
);

-- 4. Enhanced RLS policies for votes table  
DROP POLICY IF EXISTS "Users can create their own votes" ON public.votes;

CREATE POLICY "Users can create their own votes"
ON public.votes  
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = votes.user_profile_id 
        AND user_profiles.user_id = auth.uid()
    )
);

-- 5. Enhanced RLS policies for game_logs table
DROP POLICY IF EXISTS "Users can create their own game logs" ON public.game_logs;

CREATE POLICY "Users can create their own game logs"
ON public.game_logs
FOR INSERT  
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_profiles.id = game_logs.user_profile_id 
        AND user_profiles.user_id = auth.uid()
    )
);

-- 6. Create function for secure rate limiting tracking
CREATE TABLE IF NOT EXISTS public.rate_limit_tracking (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier text NOT NULL, -- IP address or user ID
    action_type text NOT NULL,
    request_count integer NOT NULL DEFAULT 1,
    window_start timestamp with time zone NOT NULL DEFAULT now(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(identifier, action_type, window_start)
);

-- Enable RLS on rate limiting
ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limiting data
CREATE POLICY "System manages rate limiting"
ON public.rate_limit_tracking
FOR ALL
USING (false); -- No direct access from client

-- 7. Create function for server-side rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier text,
    p_action_type text,
    p_max_requests integer DEFAULT 10,
    p_window_minutes integer DEFAULT 15
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    current_window timestamp with time zone;
    request_count integer;
BEGIN
    -- Calculate current window start (round down to window boundary)
    current_window := date_trunc('minute', now()) - 
                     (EXTRACT(minute FROM now())::integer % p_window_minutes) * interval '1 minute';
    
    -- Get current request count for this window
    SELECT COALESCE(request_count, 0) INTO request_count
    FROM public.rate_limit_tracking
    WHERE identifier = p_identifier 
    AND action_type = p_action_type 
    AND window_start = current_window;
    
    -- Check if under limit
    IF request_count < p_max_requests THEN
        -- Increment counter
        INSERT INTO public.rate_limit_tracking (identifier, action_type, request_count, window_start)
        VALUES (p_identifier, p_action_type, 1, current_window)
        ON CONFLICT (identifier, action_type, window_start)
        DO UPDATE SET 
            request_count = rate_limit_tracking.request_count + 1,
            updated_at = now();
        
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;

-- 8. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_action text,
    p_resource_type text,
    p_resource_id text DEFAULT NULL,
    p_wallet_address text DEFAULT NULL,
    p_success boolean DEFAULT true,
    p_error_message text DEFAULT NULL,
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    INSERT INTO public.security_audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        wallet_address,
        success,
        error_message,
        metadata
    ) VALUES (
        auth.uid(),
        p_action,
        p_resource_type,
        p_resource_id,
        p_wallet_address,
        p_success,
        p_error_message,
        p_metadata
    );
END;
$$;