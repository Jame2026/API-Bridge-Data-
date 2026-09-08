-- ==============================================================================
-- SUPABASE DATABASE SCHEMA: API DATA BRIDGE PLATFORM
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BRIDGES TABLE
CREATE TABLE IF NOT EXISTS public.bridges (
  id TEXT PRIMARY KEY,
  uuid UUID NOT NULL DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'custom',
  tag TEXT NOT NULL DEFAULT 'v1',
  method TEXT NOT NULL DEFAULT 'GET',
  endpoint TEXT NOT NULL,
  auth_type TEXT NOT NULL DEFAULT 'Bearer Token',
  secret_token TEXT,
  sync_interval TEXT NOT NULL DEFAULT '15m',
  cron_expression TEXT NOT NULL DEFAULT '*/15 * * * *',
  last_sync TEXT DEFAULT 'Never',
  records_synced BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'degraded', 'paused', 'failed')),
  status_text TEXT,
  cluster TEXT NOT NULL DEFAULT 'us-east-cluster-01',
  query_params JSONB NOT NULL DEFAULT '[]'::jsonb,
  headers JSONB NOT NULL DEFAULT '[]'::jsonb,
  pagination_strategy TEXT NOT NULL DEFAULT 'Link Header (RFC 5988)',
  pagination_note TEXT,
  throttling_rate TEXT NOT NULL DEFAULT '10 req / sec',
  throttling_note TEXT,
  cache_snapshots BOOLEAN NOT NULL DEFAULT true,
  max_retries INTEGER NOT NULL DEFAULT 3,
  backoff_ceiling TEXT NOT NULL DEFAULT '60s',
  timeout_ms INTEGER NOT NULL DEFAULT 15000,
  auto_retry_429 BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. SYNC ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.sync_activity_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status_code INTEGER NOT NULL,
  status_text TEXT NOT NULL,
  bridge_name TEXT NOT NULL,
  records_count INTEGER NOT NULL DEFAULT 0,
  payload_size TEXT NOT NULL DEFAULT '0 KB',
  latency_ms INTEGER NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SCHEMA MAPPINGS TABLE
CREATE TABLE IF NOT EXISTS public.schema_mappings (
  id TEXT PRIMARY KEY,
  bridge_id TEXT REFERENCES public.bridges(id) ON DELETE CASCADE,
  source_key TEXT NOT NULL,
  target_type TEXT NOT NULL,
  output_field TEXT NOT NULL,
  transform_rule TEXT DEFAULT 'Direct Pass-through',
  sample_value TEXT DEFAULT '',
  state TEXT NOT NULL DEFAULT 'valid' CHECK (state IN ('valid', 'warning', 'computed', 'masked')),
  constraint_rule TEXT,
  detected_ingress_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'WARN', 'BLOCKED', 'FAILED')),
  ip_address TEXT DEFAULT '127.0.0.1',
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. INDEXES FOR HIGH-THROUGHPUT TELEMETRY
CREATE INDEX IF NOT EXISTS idx_bridges_service ON public.bridges(service);
CREATE INDEX IF NOT EXISTS idx_bridges_status ON public.bridges(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_timestamp ON public.sync_activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_bridge ON public.sync_activity_logs(bridge_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.bridges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schema_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read & write access for authenticated users & anon clients (adjust for strict multi-tenant auth if needed)
DO $$
BEGIN
  -- Bridges policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bridges' AND policyname = 'Allow public read access to bridges') THEN
    CREATE POLICY "Allow public read access to bridges" ON public.bridges FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bridges' AND policyname = 'Allow public insert/update to bridges') THEN
    CREATE POLICY "Allow public insert/update to bridges" ON public.bridges FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- Sync logs policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sync_activity_logs' AND policyname = 'Allow public read access to sync logs') THEN
    CREATE POLICY "Allow public read access to sync logs" ON public.sync_activity_logs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sync_activity_logs' AND policyname = 'Allow public insert to sync logs') THEN
    CREATE POLICY "Allow public insert to sync logs" ON public.sync_activity_logs FOR INSERT WITH CHECK (true);
  END IF;

  -- Schema mappings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schema_mappings' AND policyname = 'Allow public access to schema mappings') THEN
    CREATE POLICY "Allow public access to schema mappings" ON public.schema_mappings FOR ALL USING (true) WITH CHECK (true);
  END IF;

  -- Audit logs policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Allow public access to audit logs') THEN
    CREATE POLICY "Allow public access to audit logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 8. SEED INITIAL DEMO BRIDGES (Optional)
INSERT INTO public.bridges (
  id, uuid, name, service, category, tag, method, endpoint, auth_type,
  sync_interval, cron_expression, last_sync, records_synced, status, status_text, cluster
) VALUES
(
  'bridge-shopify-orders',
  '9f83a21a-4d76-4d10-bf92-8051a66a1a01',
  'Shopify Store Orders Ingest',
  'shopify',
  'ecommerce',
  'v2024.1',
  'GET',
  'https://mystore.myshopify.com/admin/api/2024-01/orders.json',
  'Bearer Token',
  '5m',
  '*/5 * * * *',
  '2m ago',
  48291,
  'healthy',
  'All shards operational',
  'us-east-cluster-01'
),
(
  'bridge-zendesk-tickets',
  '28a9947f-85d1-4db5-9e6b-cf848e028b02',
  'Zendesk Support High Priority Tickets',
  'zendesk',
  'desk',
  'v2',
  'GET',
  'https://acmesupport.zendesk.com/api/v2/tickets.json',
  'OAuth 2.0 (PKCE)',
  '15m',
  '*/15 * * * *',
  '14m ago',
  12850,
  'healthy',
  'OAuth refreshed 1h ago',
  'eu-west-cluster-02'
),
(
  'bridge-jira-cloud',
  '7b1219ee-341a-4fe9-b001-f1110091ca03',
  'Jira Cloud Incident Stream',
  'jira',
  'devops',
  'v3',
  'GET',
  'https://corp-jira.atlassian.net/rest/api/3/search',
  'API Key (Vault)',
  '10m',
  '*/10 * * * *',
  '8m ago',
  6420,
  'degraded',
  '429 Backoff Active (retry in 45s)',
  'us-east-cluster-01'
)
ON CONFLICT (id) DO NOTHING;
