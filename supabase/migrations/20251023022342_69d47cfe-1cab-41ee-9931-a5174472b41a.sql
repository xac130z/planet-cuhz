-- Make character-uploads bucket private for user-uploaded content
-- This adds defense-in-depth on top of existing RLS policies
-- The bucket contains user-uploaded files that should not be publicly accessible

UPDATE storage.buckets 
SET public = false 
WHERE id = 'character-uploads';

-- Note: cuhz-characters and partner-logos buckets remain public as they contain
-- intentionally public gaming assets (AI-generated characters and brand logos)
-- that are meant to be displayed throughout the application