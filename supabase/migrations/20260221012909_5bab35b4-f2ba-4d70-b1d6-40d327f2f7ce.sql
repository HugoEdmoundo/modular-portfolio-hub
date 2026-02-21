
-- Add logo_url to education and experience
ALTER TABLE public.education ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '';
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '';
