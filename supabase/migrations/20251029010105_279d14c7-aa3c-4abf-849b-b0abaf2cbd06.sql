-- Fix Security Definer View issue by setting security_invoker to true
-- This ensures the view respects the querying user's RLS policies

-- First, check if the view exists and alter it to use SECURITY INVOKER
ALTER VIEW IF EXISTS public.protocol_public_profiles SET (security_invoker = true);

-- If the view doesn't exist or needs to be recreated, create it with proper security
DROP VIEW IF EXISTS public.protocol_public_profiles;

CREATE VIEW public.protocol_public_profiles 
WITH (security_invoker = true)
AS
SELECT
  id,
  display_name,
  twitch_login,
  twitch_url,
  overall_rating,
  win_percentage,
  height_in,
  weight_lb,
  role,
  archetype_primary,
  archetype_secondary,
  hand,
  modes,
  playstyle,
  bio,
  discord,
  twitter,
  platform,
  psn,
  xbox,
  region,
  timezone,
  availability,
  mic,
  verified,
  competitive_level,
  languages,
  created_at
FROM public.protocol_profiles
WHERE published = true;

-- Grant appropriate permissions
GRANT SELECT ON public.protocol_public_profiles TO authenticated;
GRANT SELECT ON public.protocol_public_profiles TO anon;