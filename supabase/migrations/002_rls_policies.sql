-- DTM Web App - Row Level Security Policies
-- Created: 2025-11-06
-- Description: Secure access to data based on user authentication

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS TABLE POLICIES
-- ============================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can view public profiles (for collaboration features - v2)
CREATE POLICY "Users can view public profiles"
  ON public.users
  FOR SELECT
  USING (true);

-- ============================================================
-- PROJECTS TABLE POLICIES
-- ============================================================

-- Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view public projects
CREATE POLICY "Users can view public projects"
  ON public.projects
  FOR SELECT
  USING (is_public = true);

-- Users can create their own projects
CREATE POLICY "Users can create own projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRACKS TABLE POLICIES
-- ============================================================

-- Users can view tracks in their own projects
CREATE POLICY "Users can view own project tracks"
  ON public.tracks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tracks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can view tracks in public projects
CREATE POLICY "Users can view public project tracks"
  ON public.tracks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tracks.project_id
      AND projects.is_public = true
    )
  );

-- Users can create tracks in their own projects
CREATE POLICY "Users can create tracks in own projects"
  ON public.tracks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tracks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can update tracks in their own projects
CREATE POLICY "Users can update own project tracks"
  ON public.tracks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tracks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete tracks in their own projects
CREATE POLICY "Users can delete own project tracks"
  ON public.tracks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = tracks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================
-- NOTES TABLE POLICIES
-- ============================================================

-- Users can view notes in their own project tracks
CREATE POLICY "Users can view own project notes"
  ON public.notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = notes.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can view notes in public projects
CREATE POLICY "Users can view public project notes"
  ON public.notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = notes.track_id
      AND projects.is_public = true
    )
  );

-- Users can create notes in their own projects
CREATE POLICY "Users can create notes in own projects"
  ON public.notes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = notes.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can update notes in their own projects
CREATE POLICY "Users can update own project notes"
  ON public.notes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = notes.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete notes in their own projects
CREATE POLICY "Users can delete own project notes"
  ON public.notes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = notes.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================
-- PROJECT SNAPSHOTS POLICIES
-- ============================================================

-- Users can view snapshots of their own projects
CREATE POLICY "Users can view own project snapshots"
  ON public.project_snapshots
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_snapshots.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can create snapshots of their own projects
CREATE POLICY "Users can create snapshots of own projects"
  ON public.project_snapshots
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_snapshots.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete snapshots of their own projects
CREATE POLICY "Users can delete own project snapshots"
  ON public.project_snapshots
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_snapshots.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================
-- EFFECTS TABLE POLICIES
-- ============================================================

-- Users can view effects in their own project tracks
CREATE POLICY "Users can view own track effects"
  ON public.effects
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = effects.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can create effects in their own project tracks
CREATE POLICY "Users can create effects in own tracks"
  ON public.effects
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = effects.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can update effects in their own project tracks
CREATE POLICY "Users can update own track effects"
  ON public.effects
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = effects.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete effects in their own project tracks
CREATE POLICY "Users can delete own track effects"
  ON public.effects
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = effects.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================
-- AUTOMATION TABLE POLICIES
-- ============================================================

-- Users can view automation in their own project tracks
CREATE POLICY "Users can view own track automation"
  ON public.automation
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = automation.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can create automation in their own project tracks
CREATE POLICY "Users can create automation in own tracks"
  ON public.automation
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = automation.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can update automation in their own project tracks
CREATE POLICY "Users can update own track automation"
  ON public.automation
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = automation.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete automation in their own project tracks
CREATE POLICY "Users can delete own track automation"
  ON public.automation
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tracks
      JOIN public.projects ON projects.id = tracks.project_id
      WHERE tracks.id = automation.track_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================================
-- HELPER FUNCTION: Check if user owns project
-- ============================================================
CREATE OR REPLACE FUNCTION public.user_owns_project(project_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = project_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Row Level Security policies created successfully!';
  RAISE NOTICE 'Database is now secure and ready for use.';
END $$;
