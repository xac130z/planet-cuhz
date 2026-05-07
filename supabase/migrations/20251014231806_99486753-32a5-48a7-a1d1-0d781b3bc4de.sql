-- Phase 3: LFG Complete Schema (Fixed)
-- Add missing columns to lfg_listings
ALTER TABLE public.lfg_listings 
  ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Looking for Squad',
  ADD COLUMN IF NOT EXISTS needed_positions TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS modes TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS allows_crossplay BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMPTZ;

-- Create lfg_applications table
CREATE TABLE IF NOT EXISTS public.lfg_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.lfg_listings(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, applicant_id)
);

-- Enable RLS on lfg_applications
ALTER TABLE public.lfg_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lfg_applications
CREATE POLICY "Applicants can view their own applications"
  ON public.lfg_applications FOR SELECT
  USING (auth.uid() = applicant_id);

CREATE POLICY "Listing owners can view applications"
  ON public.lfg_applications FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.lfg_listings WHERE id = listing_id
    )
  );

CREATE POLICY "Users can create applications"
  ON public.lfg_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Listing owners can update applications"
  ON public.lfg_applications FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.lfg_listings WHERE id = listing_id
    )
  );

-- Add UPDATE/DELETE policies for lfg_listings owners
CREATE POLICY "Users can update own listings"
  ON public.lfg_listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON public.lfg_listings FOR DELETE
  USING (auth.uid() = user_id);

-- Create GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_lfg_listings_modes ON public.lfg_listings USING GIN (modes);
CREATE INDEX IF NOT EXISTS idx_lfg_listings_needed_positions ON public.lfg_listings USING GIN (needed_positions);

-- Create regular index for boosted listings
CREATE INDEX IF NOT EXISTS idx_lfg_listings_boost ON public.lfg_listings (boost_expires_at DESC NULLS LAST);

-- Update trigger for lfg_applications
CREATE TRIGGER update_lfg_applications_updated_at
  BEFORE UPDATE ON public.lfg_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();