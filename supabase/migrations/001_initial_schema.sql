-- DTM Web App - Initial Database Schema
-- Created: 2025-11-06
-- Description: Creates all tables for the DTM application

-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE (extends Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster username lookups
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tempo INTEGER DEFAULT 120 CHECK (tempo >= 40 AND tempo <= 300),
  time_signature TEXT DEFAULT '4/4',
  key TEXT DEFAULT 'C',
  duration FLOAT DEFAULT 300.0, -- in seconds (5 minutes default)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_opened_at TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_updated_at ON public.projects(updated_at DESC);
CREATE INDEX idx_projects_last_opened ON public.projects(last_opened_at DESC);
CREATE INDEX idx_projects_public ON public.projects(is_public) WHERE is_public = TRUE;

-- ============================================================
-- TRACKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instrument TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  volume INTEGER DEFAULT 80 CHECK (volume >= 0 AND volume <= 100),
  pan INTEGER DEFAULT 0 CHECK (pan >= -100 AND pan <= 100),
  muted BOOLEAN DEFAULT FALSE,
  solo BOOLEAN DEFAULT FALSE,
  armed BOOLEAN DEFAULT FALSE,
  monitor BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  input TEXT DEFAULT 'none',
  output TEXT DEFAULT 'master',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tracks_project_id ON public.tracks(project_id);
CREATE INDEX idx_tracks_order ON public.tracks(project_id, order_index);

-- ============================================================
-- NOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  pitch INTEGER NOT NULL CHECK (pitch >= 0 AND pitch <= 127),
  start_time FLOAT NOT NULL CHECK (start_time >= 0),
  duration FLOAT NOT NULL CHECK (duration > 0),
  velocity INTEGER DEFAULT 100 CHECK (velocity >= 0 AND velocity <= 127),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance (critical for large projects)
CREATE INDEX idx_notes_track_id ON public.notes(track_id);
CREATE INDEX idx_notes_time ON public.notes(track_id, start_time);
CREATE INDEX idx_notes_time_range ON public.notes(track_id, start_time, duration);

-- ============================================================
-- PROJECT SNAPSHOTS TABLE (for auto-save / version history)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.project_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fetching latest snapshots
CREATE INDEX idx_snapshots_project ON public.project_snapshots(project_id, created_at DESC);

-- ============================================================
-- EFFECTS TABLE (for track effects chain)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  effect_type TEXT NOT NULL, -- 'reverb', 'delay', 'compressor', etc.
  order_index INTEGER NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  parameters JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_effects_track_id ON public.effects(track_id, order_index);

-- ============================================================
-- AUTOMATION TABLE (for parameter automation - v2 feature)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.automation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  parameter TEXT NOT NULL, -- 'volume', 'pan', 'effect.reverb.wet', etc.
  time FLOAT NOT NULL CHECK (time >= 0),
  value FLOAT NOT NULL,
  curve TEXT DEFAULT 'linear', -- 'linear', 'exponential', 'bezier'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_automation_track_id ON public.automation(track_id, parameter, time);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO-DELETE OLD SNAPSHOTS FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION delete_old_snapshots()
RETURNS void AS $$
BEGIN
  DELETE FROM public.project_snapshots
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE public.users IS 'User profiles extending Supabase Auth';
COMMENT ON TABLE public.projects IS 'Music projects with composition settings';
COMMENT ON TABLE public.tracks IS 'Individual tracks within a project';
COMMENT ON TABLE public.notes IS 'MIDI notes with timing and velocity';
COMMENT ON TABLE public.project_snapshots IS 'Auto-save snapshots for version history';
COMMENT ON TABLE public.effects IS 'Audio effects chain for tracks';
COMMENT ON TABLE public.automation IS 'Parameter automation over time';

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant access to sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Initial schema created successfully!';
  RAISE NOTICE 'Next step: Run 002_rls_policies.sql to set up Row Level Security';
END $$;
