-- DTM Web App - Storage Buckets Setup
-- Created: 2025-11-07
-- Description: Create storage buckets for audio files

-- ============================================================
-- STORAGE BUCKET 1: sound-library (Public)
-- ============================================================

-- Create public bucket for sound library
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sound-library',
  'sound-library',
  true,  -- Public bucket
  52428800,  -- 50MB in bytes
  ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can read files from sound-library
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sound-library');

-- Storage policy: Only authenticated users can upload
CREATE POLICY "Authenticated users can upload sound files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'sound-library'
    AND auth.role() = 'authenticated'
  );

-- Storage policy: Only authenticated users can update their own files
CREATE POLICY "Users can update own sound files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'sound-library'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: Only authenticated users can delete their own files
CREATE POLICY "Users can delete own sound files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'sound-library'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- STORAGE BUCKET 2: user-uploads (Private)
-- ============================================================

-- Create private bucket for user uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  false,  -- Private bucket
  10485760,  -- 10MB in bytes
  ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Users can only view their own uploads
CREATE POLICY "Users can view own uploads"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: Users can upload to their own folder
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: Users can update their own files
CREATE POLICY "Users can update own uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: Users can delete their own files
CREATE POLICY "Users can delete own uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Storage buckets created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Buckets:';
  RAISE NOTICE '  1. sound-library (Public, 50MB limit)';
  RAISE NOTICE '  2. user-uploads (Private, 10MB limit)';
  RAISE NOTICE '';
  RAISE NOTICE 'Storage policies configured for security.';
END $$;
