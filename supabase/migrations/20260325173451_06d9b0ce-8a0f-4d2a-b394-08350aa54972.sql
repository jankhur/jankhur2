-- Create site_settings table
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings" ON public.site_settings
  FOR SELECT TO public USING (true);

-- Seed default copyright
INSERT INTO public.site_settings (key, value) VALUES ('copyright', '© Jan Khür');

-- Add copyright column to all image tables
ALTER TABLE public.landing_images ADD COLUMN copyright text;
ALTER TABLE public.editorial_images ADD COLUMN copyright text;
ALTER TABLE public.journey_images ADD COLUMN copyright text;
ALTER TABLE public.notes_images ADD COLUMN copyright text;

-- Backfill all existing images
UPDATE public.landing_images SET copyright = '© Jan Khür' WHERE copyright IS NULL;
UPDATE public.editorial_images SET copyright = '© Jan Khür' WHERE copyright IS NULL;
UPDATE public.journey_images SET copyright = '© Jan Khür' WHERE copyright IS NULL;
UPDATE public.notes_images SET copyright = '© Jan Khür' WHERE copyright IS NULL;