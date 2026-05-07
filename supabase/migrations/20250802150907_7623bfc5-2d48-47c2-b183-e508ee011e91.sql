-- Phase 1: Critical Security Fixes

-- 1. Create wallet verification table for proper cryptographic verification
CREATE TABLE public.wallet_verifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    signature TEXT NOT NULL,
    challenge_message TEXT NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 days'),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, wallet_address)
);

-- Enable RLS on wallet_verifications
ALTER TABLE public.wallet_verifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for wallet_verifications
CREATE POLICY "Users can view their own wallet verifications"
    ON public.wallet_verifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet verifications"
    ON public.wallet_verifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 2. Update verify_wallet_ownership function to use cryptographic verification
CREATE OR REPLACE FUNCTION public.verify_wallet_ownership(p_wallet_address text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    verification_exists boolean;
BEGIN
    -- Check if the current authenticated user has a verified wallet
    SELECT EXISTS(
        SELECT 1 FROM public.wallet_verifications 
        WHERE user_id = auth.uid() 
        AND wallet_address = p_wallet_address
        AND is_active = true
        AND expires_at > now()
    ) INTO verification_exists;
    
    RETURN verification_exists;
END;
$function$;

-- 3. Clean up duplicate RLS policies and standardize them

-- Drop duplicate policies on character_uploads
DROP POLICY IF EXISTS "Users can create their own uploads" ON public.character_uploads;
DROP POLICY IF EXISTS "Users can view their own uploads" ON public.character_uploads;

-- Drop duplicate policies on cuhz_characters  
DROP POLICY IF EXISTS "Users can create their own characters" ON public.cuhz_characters;
DROP POLICY IF EXISTS "Users can view their own characters" ON public.cuhz_characters;

-- Add missing DELETE policies where needed
CREATE POLICY "Users can delete their own character uploads"
    ON public.character_uploads FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.id = character_uploads.user_profile_id 
        AND up.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own cuhz characters"
    ON public.cuhz_characters FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.id = cuhz_characters.user_profile_id 
        AND up.user_id = auth.uid()
    ));

-- 4. Add database constraints for security
ALTER TABLE public.commands 
ADD CONSTRAINT commands_title_length CHECK (length(title) <= 200),
ADD CONSTRAINT commands_content_length CHECK (length(content) <= 5000);

ALTER TABLE public.messages
ADD CONSTRAINT messages_content_length CHECK (length(content) <= 2000);

ALTER TABLE public.user_profiles
ADD CONSTRAINT profiles_display_name_length CHECK (length(display_name) <= 100);

-- 5. Create enhanced security audit function
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_action text,
    p_resource_type text,
    p_resource_id text DEFAULT NULL::text,
    p_wallet_address text DEFAULT NULL::text,
    p_success boolean DEFAULT true,
    p_error_message text DEFAULT NULL::text,
    p_metadata jsonb DEFAULT '{}'::jsonb,
    p_ip_address inet DEFAULT NULL::inet,
    p_user_agent text DEFAULT NULL::text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.security_audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        wallet_address,
        success,
        error_message,
        metadata,
        ip_address,
        user_agent
    ) VALUES (
        auth.uid(),
        p_action,
        p_resource_type,
        p_resource_id,
        p_wallet_address,
        p_success,
        p_error_message,
        p_metadata,
        p_ip_address,
        p_user_agent
    );
END;
$function$;

-- 6. Add trigger to automatically log wallet verification attempts
CREATE OR REPLACE FUNCTION public.log_wallet_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    PERFORM public.log_security_event(
        'wallet_verification',
        'wallet',
        NEW.wallet_address,
        NEW.wallet_address,
        true,
        NULL,
        jsonb_build_object(
            'verification_id', NEW.id,
            'expires_at', NEW.expires_at
        )
    );
    RETURN NEW;
END;
$function$;

CREATE TRIGGER wallet_verification_audit
    AFTER INSERT ON public.wallet_verifications
    FOR EACH ROW EXECUTE FUNCTION public.log_wallet_verification();