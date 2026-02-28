-- ============================================================
--  PatelTales Stories — Supabase Setup
--  Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================


-- 1. Stories table
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stories (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  image_url  TEXT,
  published  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for the common query pattern (published stories, newest first)
CREATE INDEX IF NOT EXISTS idx_stories_published_created
  ON public.stories (published, created_at DESC);


-- 2. Row Level Security
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Anyone can read published stories (the public website)
CREATE POLICY "Public can read published stories"
  ON public.stories
  FOR SELECT
  USING (published = true);

-- Inserts are allowed via the anon key
-- (the submit page is protected by the secret URL key)
CREATE POLICY "Allow story inserts"
  ON public.stories
  FOR INSERT
  WITH CHECK (true);

-- No public updates or deletes — manage stories via the Supabase dashboard
-- (you can add an update/delete policy later if needed)


-- 3. Storage bucket for images
-- ─────────────────────────────────────────────────────────────
-- Creates a public bucket (uploaded images are readable without auth)
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-images', 'story-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public reads of images
CREATE POLICY "Public can read story images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'story-images');

-- Allow uploads via the anon key (admin page is gate-protected)
CREATE POLICY "Allow story image uploads"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'story-images');


-- ============================================================
--  Done! Copy your Project URL and anon key from:
--  Supabase Dashboard → Project Settings → API
--  then paste them into js/config.js
-- ============================================================
