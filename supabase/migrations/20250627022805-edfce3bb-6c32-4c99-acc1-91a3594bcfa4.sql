
-- Add missing astrology_level field to user_profiles table (if not already added)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS astrology_level TEXT;

-- Add spiritual practices fields for complete spiritual profile (if not already added)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS spiritual_practices TEXT[],
ADD COLUMN IF NOT EXISTS meditation_styles TEXT[];

-- Create RLS policies for character uploads bucket (skip if already exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can upload their own files'
    ) THEN
        CREATE POLICY "Users can upload their own files" ON storage.objects 
        FOR INSERT WITH CHECK (bucket_id = 'character-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can view their own files'
    ) THEN
        CREATE POLICY "Users can view their own files" ON storage.objects 
        FOR SELECT USING (bucket_id = 'character-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;

-- Create RLS policies for generated characters bucket (skip if already exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can view generated characters'
    ) THEN
        CREATE POLICY "Users can view generated characters" ON storage.objects 
        FOR SELECT USING (bucket_id = 'cuhz-characters');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'System can insert generated characters'
    ) THEN
        CREATE POLICY "System can insert generated characters" ON storage.objects 
        FOR INSERT WITH CHECK (bucket_id = 'cuhz-characters');
    END IF;
END $$;
