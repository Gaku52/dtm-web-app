-- Support decimal BPM values
-- Change tempo from INTEGER to DECIMAL(5,2) to support values like 120.50 BPM

ALTER TABLE public.projects
ALTER COLUMN tempo TYPE DECIMAL(5,2);

-- Update the check constraint to allow decimal values
ALTER TABLE public.projects
DROP CONSTRAINT IF EXISTS projects_tempo_check;

ALTER TABLE public.projects
ADD CONSTRAINT projects_tempo_check
CHECK (tempo >= 40.00 AND tempo <= 300.00);

-- Add comment
COMMENT ON COLUMN public.projects.tempo IS 'Tempo in BPM (beats per minute), supports decimal values like 120.50';
