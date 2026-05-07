-- Create protocol_profiles table (separate from user_profiles)
CREATE TABLE IF NOT EXISTS public.protocol_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Twitch integration (auto-filled from auth metadata)
  twitch_id TEXT UNIQUE,
  twitch_login TEXT UNIQUE,
  twitch_url TEXT,
  
  -- Step 1: Basics
  display_name TEXT NOT NULL,
  email TEXT,
  region TEXT CHECK (region IN ('NA-East','NA-West','EU','Asia','SA','Oceania','Other')),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  languages TEXT[] DEFAULT '{}',
  
  -- Step 2: Accounts
  platform TEXT CHECK (platform IN ('PSN','Xbox','PC','Switch')) NOT NULL,
  psn TEXT,
  xbox TEXT,
  discord TEXT,
  twitter TEXT,
  
  -- Step 3: 2K Build
  role TEXT CHECK (role IN ('PG','SG','SF','PF','C')) NOT NULL,
  modes TEXT[] NOT NULL DEFAULT '{}',
  playstyle TEXT[] DEFAULT '{}',
  archetype_primary TEXT,
  archetype_secondary TEXT,
  height_in INTEGER CHECK (height_in >= 65 AND height_in <= 85),
  weight_lb INTEGER CHECK (weight_lb >= 150 AND weight_lb <= 300),
  hand TEXT CHECK (hand IN ('Left','Right')),
  badges JSONB DEFAULT '{}'::JSONB,
  overall_rating INTEGER CHECK (overall_rating >= 60 AND overall_rating <= 99),
  win_percentage DECIMAL(5,2) CHECK (win_percentage >= 0 AND win_percentage <= 100),
  experience_years INTEGER CHECK (experience_years >= 0 AND experience_years <= 20),
  competitive_level TEXT CHECK (competitive_level IN ('casual','competitive','elite')),
  
  -- Step 4: Availability
  availability JSONB DEFAULT '{}'::JSONB,
  mic BOOLEAN DEFAULT TRUE,
  
  -- Step 5: Contact
  phone TEXT,
  preferred_contact TEXT CHECK (preferred_contact IN ('email','sms','discord','both','none')) DEFAULT 'email',
  allow_contact BOOLEAN DEFAULT TRUE NOT NULL,
  consent_comms BOOLEAN DEFAULT TRUE,
  
  -- Step 6: Review & Publish
  bio TEXT CHECK (char_length(bio) <= 500),
  verified BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.protocol_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Owner can manage their own profile
CREATE POLICY "protocol_profiles_owner_select"
  ON public.protocol_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "protocol_profiles_owner_insert"
  ON public.protocol_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "protocol_profiles_owner_update"
  ON public.protocol_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "protocol_profiles_owner_delete"
  ON public.protocol_profiles FOR DELETE
  USING (auth.uid() = id);

-- Public View: Only published profiles, excludes sensitive fields (email, phone)
CREATE OR REPLACE VIEW public.protocol_public_profiles AS
SELECT
  id,
  display_name,
  twitch_login,
  twitch_url,
  region,
  timezone,
  languages,
  platform,
  psn,
  xbox,
  discord,
  twitter,
  role,
  modes,
  playstyle,
  archetype_primary,
  archetype_secondary,
  height_in,
  weight_lb,
  hand,
  overall_rating,
  win_percentage,
  competitive_level,
  availability,
  mic,
  bio,
  verified,
  created_at
FROM public.protocol_profiles
WHERE published = TRUE AND allow_contact = TRUE;

-- Grant SELECT on public view to anon and authenticated users
GRANT SELECT ON public.protocol_public_profiles TO anon, authenticated;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_protocol_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER protocol_profiles_updated_at
  BEFORE UPDATE ON public.protocol_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_protocol_profiles_updated_at();

-- Indexes for performance
CREATE INDEX idx_protocol_profiles_published ON public.protocol_profiles(published) WHERE published = TRUE;
CREATE INDEX idx_protocol_profiles_role ON public.protocol_profiles(role) WHERE published = TRUE;
CREATE INDEX idx_protocol_profiles_platform ON public.protocol_profiles(platform) WHERE published = TRUE;
CREATE INDEX idx_protocol_profiles_region ON public.protocol_profiles(region) WHERE published = TRUE;