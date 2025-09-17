-- Create storage buckets for file uploads
-- Run this in Supabase SQL editor

-- Main generic uploads (logos, misc)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('uploads','uploads', true, 52428800, ARRAY['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Products images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products','products', true, 52428800, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Testimonials avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('testimonials','testimonials', true, 10485760, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Clients logos (allow svg)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('clients','clients', true, 10485760, ARRAY['image/jpeg','image/png','image/gif','image/webp','image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Services icons (svg, png)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('services','services', true, 5242880, ARRAY['image/svg+xml','image/png'])
ON CONFLICT (id) DO NOTHING;

-- Hero slide images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('hero','hero', true, 10485760, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Color catalogs & size charts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('catalogs','catalogs', true, 52428800, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Project posts images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('projects','projects', true, 52428800, ARRAY['image/jpeg','image/png','image/gif','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Public read access policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read uploads'
  ) THEN
    CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read products'
  ) THEN
    CREATE POLICY "Public read products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read testimonials'
  ) THEN
    CREATE POLICY "Public read testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read clients'
  ) THEN
    CREATE POLICY "Public read clients" ON storage.objects FOR SELECT USING (bucket_id = 'clients');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read services'
  ) THEN
    CREATE POLICY "Public read services" ON storage.objects FOR SELECT USING (bucket_id = 'services');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read hero'
  ) THEN
    CREATE POLICY "Public read hero" ON storage.objects FOR SELECT USING (bucket_id = 'hero');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read catalogs'
  ) THEN
    CREATE POLICY "Public read catalogs" ON storage.objects FOR SELECT USING (bucket_id = 'catalogs');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read projects'
  ) THEN
    CREATE POLICY "Public read projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
  END IF;
END $$;

-- Open write policies (INSERT/UPDATE/DELETE) for anon (public uploads)
DO $$
BEGIN
  -- INSERT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public insert uploads'
  ) THEN
    CREATE POLICY "Public insert uploads" ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('uploads','products','testimonials','clients','services','hero','catalogs','projects'));
  END IF;
  -- UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public update uploads'
  ) THEN
    CREATE POLICY "Public update uploads" ON storage.objects FOR UPDATE
    USING (bucket_id IN ('uploads','products','testimonials','clients','services','hero','catalogs','projects'))
    WITH CHECK (bucket_id IN ('uploads','products','testimonials','clients','services','hero','catalogs','projects'));
  END IF;
  -- DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public delete uploads'
  ) THEN
    CREATE POLICY "Public delete uploads" ON storage.objects FOR DELETE
    USING (bucket_id IN ('uploads','products','testimonials','clients','services','hero','catalogs','projects'));
  END IF;
END $$;


