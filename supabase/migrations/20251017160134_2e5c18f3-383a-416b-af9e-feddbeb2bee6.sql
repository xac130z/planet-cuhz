-- Ensure user_profiles table has all necessary fields for NBA 2K Protocol
-- The table already exists, so we'll add any missing columns

-- Add any missing columns if they don't exist
DO $$ 
BEGIN
  -- Add onboarding_status if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_profiles' AND column_name='onboarding_status') THEN
    ALTER TABLE user_profiles ADD COLUMN onboarding_status text DEFAULT 'pending';
  END IF;

  -- Add handles jsonb if missing (for gaming handles)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_profiles' AND column_name='handles') THEN
    ALTER TABLE user_profiles ADD COLUMN handles jsonb DEFAULT '{}'::jsonb;
  END IF;

  -- Add profile jsonb if missing (stores full onboarding data)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_profiles' AND column_name='profile') THEN
    ALTER TABLE user_profiles ADD COLUMN profile jsonb DEFAULT '{}'::jsonb;
  END IF;

  -- Add email and phone for contact preferences
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_profiles' AND column_name='email') THEN
    ALTER TABLE user_profiles ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_profiles' AND column_name='phone') THEN
    ALTER TABLE user_profiles ADD COLUMN phone text;
  END IF;

  -- Add preferred_contact and consent_comms for notifications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_profiles' AND column_name='preferred_contact') THEN
    ALTER TABLE user_profiles ADD COLUMN preferred_contact text DEFAULT 'email';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='user_profiles' AND column_name='consent_comms') THEN
    ALTER TABLE user_profiles ADD COLUMN consent_comms boolean DEFAULT true;
  END IF;
END $$;

-- Create index on onboarding_status for quick lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_status 
ON user_profiles(onboarding_status);

-- Create index on user_id for faster lookups (likely already exists but ensure it)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id 
ON user_profiles(user_id);

-- Add comment documenting the profile jsonb structure
COMMENT ON COLUMN user_profiles.profile IS 
'Stores full onboarding data in format: {global: {display_name, email, phone, timezone, region, languages, mic, preferred_contact, consent_comms, handles, share_handles, interests, spiritual, availability}, nba2k: {platform, allowsCrossplay, positions, overall, winPct, playStyle, gameModes, competitiveLevel}}';