-- Add track_type column to tracks table
-- This migration adds better track categorization for DAW-style organization

-- Add track_type column with predefined types
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS track_type TEXT DEFAULT 'instrument'
CHECK (track_type IN ('vocal', 'bass', 'drums', 'guitar', 'piano', 'synth', 'strings', 'brass', 'woodwind', 'percussion', 'fx', 'instrument'));

-- Update existing tracks to have a track_type based on their instrument name
UPDATE public.tracks
SET track_type = CASE
  WHEN LOWER(instrument) LIKE '%vocal%' OR LOWER(instrument) LIKE '%voice%' THEN 'vocal'
  WHEN LOWER(instrument) LIKE '%bass%' THEN 'bass'
  WHEN LOWER(instrument) LIKE '%drum%' OR LOWER(instrument) LIKE '%kick%' OR LOWER(instrument) LIKE '%snare%' OR LOWER(instrument) LIKE '%hat%' THEN 'drums'
  WHEN LOWER(instrument) LIKE '%guitar%' THEN 'guitar'
  WHEN LOWER(instrument) LIKE '%piano%' OR LOWER(instrument) LIKE '%keys%' THEN 'piano'
  WHEN LOWER(instrument) LIKE '%synth%' THEN 'synth'
  WHEN LOWER(instrument) LIKE '%string%' OR LOWER(instrument) LIKE '%violin%' OR LOWER(instrument) LIKE '%cello%' THEN 'strings'
  WHEN LOWER(instrument) LIKE '%brass%' OR LOWER(instrument) LIKE '%trumpet%' OR LOWER(instrument) LIKE '%trombone%' THEN 'brass'
  WHEN LOWER(instrument) LIKE '%flute%' OR LOWER(instrument) LIKE '%clarinet%' OR LOWER(instrument) LIKE '%sax%' THEN 'woodwind'
  WHEN LOWER(instrument) LIKE '%perc%' THEN 'percussion'
  WHEN LOWER(instrument) LIKE '%fx%' OR LOWER(instrument) LIKE '%effect%' THEN 'fx'
  ELSE 'instrument'
END
WHERE track_type IS NULL OR track_type = 'instrument';

-- Add icon column to store emoji or icon identifier
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🎵';

-- Update icons based on track_type
UPDATE public.tracks
SET icon = CASE track_type
  WHEN 'vocal' THEN '🎤'
  WHEN 'bass' THEN '🎸'
  WHEN 'drums' THEN '🥁'
  WHEN 'guitar' THEN '🎸'
  WHEN 'piano' THEN '🎹'
  WHEN 'synth' THEN '🎛️'
  WHEN 'strings' THEN '🎻'
  WHEN 'brass' THEN '🎺'
  WHEN 'woodwind' THEN '🎷'
  WHEN 'percussion' THEN '🥁'
  WHEN 'fx' THEN '✨'
  ELSE '🎵'
END
WHERE icon IS NULL OR icon = '🎵';

-- Create index for track_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_tracks_type ON public.tracks(track_type);

-- Add comment to explain the column
COMMENT ON COLUMN public.tracks.track_type IS 'Type of track: vocal, bass, drums, guitar, piano, synth, strings, brass, woodwind, percussion, fx, instrument';
COMMENT ON COLUMN public.tracks.icon IS 'Emoji or icon identifier for visual representation';
