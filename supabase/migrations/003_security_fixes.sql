-- DTM Web App - Security Fixes
-- Created: 2025-11-07
-- Description: Fix security vulnerabilities in RLS policies

-- ============================================================
-- FIX 1: Remove dangerous "view all users" policy
-- ============================================================

-- Drop the insecure policy that allows anyone to view all users
DROP POLICY IF EXISTS "Users can view public profiles" ON public.users;

-- Replace with secure policy: only authenticated users can view other profiles
-- (This is still needed for future collaboration features)
CREATE POLICY "Authenticated users can view profiles"
  ON public.users
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- FIX 2: Add public project viewing for effects
-- ============================================================

-- Users can view effects in public projects
CREATE POLICY "Users can view public project effects"
  ON public.effects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = effects.track_id
      AND projects.is_public = true
    )
  );

-- ============================================================
-- FIX 3: Add public project viewing for automation
-- ============================================================

-- Users can view automation in public projects
CREATE POLICY "Users can view public project automation"
  ON public.automation
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = automation.track_id
      AND projects.is_public = true
    )
  );

-- ============================================================
-- ADDITIONAL SECURITY: Add email masking function (optional)
-- ============================================================

-- Function to mask email addresses for privacy
CREATE OR REPLACE FUNCTION public.mask_email(email TEXT)
RETURNS TEXT AS $$
DECLARE
  parts TEXT[];
  username TEXT;
  domain TEXT;
BEGIN
  IF email IS NULL THEN
    RETURN NULL;
  END IF;

  parts := string_to_array(email, '@');
  IF array_length(parts, 1) != 2 THEN
    RETURN '***';
  END IF;

  username := parts[1];
  domain := parts[2];

  -- Show first 2 chars and last char of username
  IF length(username) <= 3 THEN
    RETURN substring(username, 1, 1) || '***@' || domain;
  ELSE
    RETURN substring(username, 1, 2) || '***' || substring(username, length(username), 1) || '@' || domain;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON POLICY "Authenticated users can view profiles" ON public.users
  IS 'Secure policy: Only authenticated users can view profiles (not anonymous)';

COMMENT ON POLICY "Users can view public project effects" ON public.effects
  IS 'Allow viewing effects in public projects for transparency';

COMMENT ON POLICY "Users can view public project automation" ON public.automation
  IS 'Allow viewing automation in public projects for transparency';

COMMENT ON FUNCTION public.mask_email(TEXT)
  IS 'Masks email addresses for privacy: user@example.com -> us***r@example.com';

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Security fixes applied successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes made:';
  RAISE NOTICE '  1. Fixed user profile visibility (was: anyone, now: authenticated only)';
  RAISE NOTICE '  2. Added public project viewing for effects';
  RAISE NOTICE '  3. Added public project viewing for automation';
  RAISE NOTICE '  4. Added email masking utility function';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Database security improved!';
END $$;
