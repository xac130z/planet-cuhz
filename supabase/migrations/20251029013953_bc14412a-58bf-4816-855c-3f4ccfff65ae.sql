-- Add UPDATE and DELETE policies for storage buckets

-- character-uploads bucket policies
CREATE POLICY "Users can delete own character uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'character-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own character uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'character-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'character-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- cuhz-characters bucket policies
CREATE POLICY "Users can delete own cuhz characters"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cuhz-characters' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own cuhz characters"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cuhz-characters' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'cuhz-characters' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- partner-logos bucket policies (admin only)
CREATE POLICY "Admins can delete partner logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'partner-logos' AND
  is_admin()
);

CREATE POLICY "Admins can update partner logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'partner-logos' AND
  is_admin()
)
WITH CHECK (
  bucket_id = 'partner-logos' AND
  is_admin()
);