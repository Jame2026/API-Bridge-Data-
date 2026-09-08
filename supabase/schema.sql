-- ==============================================================================
-- SUPABASE DATABASE SCHEMA: INTERNAL USAGE DATA & REPORTING TOOL
-- Purpose: Extract, aggregate, and report user activity across internal projects & features
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROJECTS TABLE (Your Internal Systems & Applications)
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  environment TEXT NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'staging', 'development')),
  base_url TEXT DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'folder',
  color TEXT NOT NULL DEFAULT '#8083ff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. USER ACTIVITIES TABLE (Internal Event Log: user actions on projects & features)
CREATE TABLE IF NOT EXISTS public.user_activities (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  action_type TEXT NOT NULL DEFAULT 'feature_used',
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. USAGE REPORTS TABLE (Stored Report Snapshots for Internal Review)
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  project_id TEXT DEFAULT 'all',
  date_range TEXT NOT NULL DEFAULT '30d',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_by TEXT NOT NULL DEFAULT 'Admin',
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_activities_project_ts ON public.user_activities(project_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_email ON public.user_activities(user_email);
CREATE INDEX IF NOT EXISTS idx_activities_feature ON public.user_activities(feature_name);
CREATE INDEX IF NOT EXISTS idx_activities_action ON public.user_activities(action_type);
CREATE INDEX IF NOT EXISTS idx_activities_ts ON public.user_activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_reports_project ON public.reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_generated ON public.reports(generated_at DESC);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Projects policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow public access to projects') THEN
    CREATE POLICY "Allow public access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- User activities policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_activities' AND policyname = 'Allow public access to user_activities') THEN
    CREATE POLICY "Allow public access to user_activities" ON public.user_activities FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- Reports policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Allow public access to reports') THEN
    CREATE POLICY "Allow public access to reports" ON public.reports FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
