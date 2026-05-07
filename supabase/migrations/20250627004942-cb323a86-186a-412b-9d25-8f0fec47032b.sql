
-- Create user social verification table
CREATE TABLE public.user_social_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  twitter_handle TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  verification_proof_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_profile_id)
);

-- Create character uploads table for storing proof and profile images
CREATE TABLE public.character_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  upload_type TEXT NOT NULL CHECK (upload_type IN ('cuhzunity_proof', 'profile_img')),
  file_name TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CUHZ characters table
CREATE TABLE public.cuhz_characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  character_theme TEXT NOT NULL CHECK (character_theme IN ('fire', 'neon', 'ice', 'godly', 'random')),
  is_godly_form BOOLEAN NOT NULL DEFAULT false,
  generation_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for character uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('character-uploads', 'character-uploads', true);

-- Create storage bucket for generated characters
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cuhz-characters', 'cuhz-characters', true);

-- RLS Policies for user_social_verification
ALTER TABLE public.user_social_verification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social verification" 
  ON public.user_social_verification 
  FOR SELECT 
  USING (user_profile_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own social verification" 
  ON public.user_social_verification 
  FOR INSERT 
  WITH CHECK (user_profile_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own social verification" 
  ON public.user_social_verification 
  FOR UPDATE 
  USING (user_profile_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  ));

-- RLS Policies for character_uploads
ALTER TABLE public.character_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own uploads" 
  ON public.character_uploads 
  FOR SELECT 
  USING (user_profile_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own uploads" 
  ON public.character_uploads 
  FOR INSERT 
  WITH CHECK (user_profile_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  ));

-- RLS Policies for cuhz_characters
ALTER TABLE public.cuhz_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own characters" 
  ON public.cuhz_characters 
  FOR SELECT 
  USING (user_profile_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own characters" 
  ON public.cuhz_characters 
  FOR INSERT 
  WITH CHECK (user_profile_id IN (
    SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
  ));

-- Storage policies for character-uploads bucket
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'character-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'character-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for cuhz-characters bucket
CREATE POLICY "Public can view generated characters" ON storage.objects
  FOR SELECT USING (bucket_id = 'cuhz-characters');

CREATE POLICY "Service can create characters" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cuhz-characters');

-- Add triggers for updated_at
CREATE TRIGGER update_user_social_verification_updated_at
  BEFORE UPDATE ON public.user_social_verification
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
