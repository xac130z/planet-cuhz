-- Fix Function Search Path Mutable Security Finding
-- Add SET search_path to functions missing it

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()
  );
$$;

-- Fix is_banned function
CREATE OR REPLACE FUNCTION public.is_banned(p_user uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ban_list b
    WHERE b.user_id = p_user
      AND (b.expires_at IS NULL OR b.expires_at > now())
  );
$$;

-- Fix auto_flag_profanity function
CREATE OR REPLACE FUNCTION public.auto_flag_profanity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  bad boolean := false;
  txt text;
BEGIN
  txt := coalesce(NEW.title,'') || ' ' || coalesce(NEW.notes,'');
  -- naive checks; replace with your list
  IF txt ~* '(\\bf+u+c*k+\\b|\\bsh+i+t+\\b|\\bass+\\b)' THEN
    bad := true;
  END IF;

  IF bad THEN
    INSERT INTO public.content_flags (listing_id, reporter_id, reason, details, status)
    VALUES (NEW.id, NEW.user_id, 'profanity', 'Auto-flagged by profanity filter', 'open');
  END IF;

  RETURN NEW;
END $function$;

-- Fix update_protocol_profiles_updated_at function
CREATE OR REPLACE FUNCTION public.update_protocol_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;