-- Fix Warning-Level Security Issues

-- 1. Add RLS policies for channels table
-- Since the table exists but is not used in the app, add basic policies for future use
CREATE POLICY "Authenticated users can view active channels"
ON public.channels
FOR SELECT
TO authenticated
USING (is_active = true);

-- 2. Restrict lfg_listings to authenticated users only
-- Drop existing public policy and replace with authenticated-only access
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.lfg_listings;

CREATE POLICY "Authenticated users view active listings"
ON public.lfg_listings
FOR SELECT
TO authenticated
USING (status = 'active');