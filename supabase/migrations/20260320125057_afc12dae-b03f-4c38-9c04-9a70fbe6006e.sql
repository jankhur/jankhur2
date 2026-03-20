
-- Editorial projects
CREATE TABLE public.editorial_projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  thumbnail TEXT NOT NULL,
  year TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true
);

-- Images inside an editorial project
CREATE TABLE public.editorial_images (
  id SERIAL PRIMARY KEY,
  project_slug TEXT NOT NULL REFERENCES public.editorial_projects(slug) ON DELETE CASCADE,
  src TEXT NOT NULL,
  src_large TEXT NOT NULL,
  aspect_ratio NUMERIC NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Journey projects
CREATE TABLE public.journey_projects (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true
);

-- Images inside a journey project
CREATE TABLE public.journey_images (
  id SERIAL PRIMARY KEY,
  project_slug TEXT NOT NULL REFERENCES public.journey_projects(slug) ON DELETE CASCADE,
  src TEXT NOT NULL,
  src_large TEXT NOT NULL,
  aspect_ratio NUMERIC NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Notes images
CREATE TABLE public.notes_images (
  id SERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  src_large TEXT NOT NULL,
  aspect_ratio NUMERIC NOT NULL,
  year TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Landing feed images
CREATE TABLE public.landing_images (
  id SERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  aspect_ratio NUMERIC NOT NULL DEFAULT 1,
  layout TEXT NOT NULL DEFAULT 'center',
  name TEXT,
  year TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true
);

-- Enable RLS on all tables
ALTER TABLE public.editorial_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_images ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (portfolio is public)
CREATE POLICY "Public read editorial_projects" ON public.editorial_projects FOR SELECT USING (true);
CREATE POLICY "Public read editorial_images" ON public.editorial_images FOR SELECT USING (true);
CREATE POLICY "Public read journey_projects" ON public.journey_projects FOR SELECT USING (true);
CREATE POLICY "Public read journey_images" ON public.journey_images FOR SELECT USING (true);
CREATE POLICY "Public read notes_images" ON public.notes_images FOR SELECT USING (true);
CREATE POLICY "Public read landing_images" ON public.landing_images FOR SELECT USING (true);

-- Storage bucket for image uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Authenticated update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Authenticated delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images');
