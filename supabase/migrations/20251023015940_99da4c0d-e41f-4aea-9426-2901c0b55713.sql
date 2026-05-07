-- Fix security definer view by setting security_invoker to true
-- This ensures the view respects RLS policies of the querying user
-- instead of bypassing them with superuser privileges

ALTER VIEW protocol_public_profiles
SET (security_invoker = true);