-- Phase 4: Matching & Squad Assembly Tables
-- Drop existing matches table to recreate with new schema

DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.match_responses CASCADE;

-- Create enums for match types
DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('new','pending_accept','mutual_accept','declined');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE match_type AS ENUM ('nba2k_pair','nba2k_squad5');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Main matches table
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  type match_type NOT NULL,
  member_ids uuid[] NOT NULL,
  score int NOT NULL DEFAULT 0,
  explanation text NOT NULL DEFAULT '',
  position_coverage jsonb NOT NULL DEFAULT '{}'::jsonb,
  scheduled_overlap_minutes int NOT NULL DEFAULT 0,
  status match_status NOT NULL DEFAULT 'new'
);

-- Match responses (accept/decline)
CREATE TABLE public.match_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('accept','decline')),
  UNIQUE (match_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_member_ids ON public.matches USING gin (member_ids);
CREATE INDEX idx_matches_created ON public.matches(created_at DESC);
CREATE INDEX idx_match_responses_match ON public.match_responses(match_id);
CREATE INDEX idx_match_responses_user ON public.match_responses(user_id);

-- Security definer function to check if user is in match
CREATE OR REPLACE FUNCTION public.is_match_member(_match_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.matches
    WHERE id = _match_id
    AND _user_id = ANY(member_ids)
  )
$$;

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches table
CREATE POLICY "Users can view their matches"
  ON public.matches FOR SELECT
  TO authenticated
  USING (auth.uid() = ANY(member_ids));

CREATE POLICY "Service role can manage matches"
  ON public.matches
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- RLS Policies for match_responses table
CREATE POLICY "Users can view their match responses"
  ON public.match_responses FOR SELECT
  TO authenticated
  USING (public.is_match_member(match_id, auth.uid()));

CREATE POLICY "Users can manage their match responses"
  ON public.match_responses
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() AND public.is_match_member(match_id, auth.uid()))
  WITH CHECK (user_id = auth.uid() AND public.is_match_member(match_id, auth.uid()));