
-- Add Twitch integration fields to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN twitch_name TEXT,
ADD COLUMN character_prompt TEXT,
ADD COLUMN energy_word TEXT;

-- Add twitter_handle field to user_profiles for consistency
ALTER TABLE user_profiles 
ADD COLUMN twitter_handle TEXT;
