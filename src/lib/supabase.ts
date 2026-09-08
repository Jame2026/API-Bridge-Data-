import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import type { BridgePipeline, SyncActivityLog } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks whether valid Supabase environment credentials are provided.
 */
export const isSupabaseConfigured = (): boolean => {
  const validUrl = Boolean(rawUrl && rawUrl.startsWith('https://') && !rawUrl.includes('your-project-ref'));
  const validKey = Boolean(rawAnonKey && rawAnonKey.length > 20 && !rawAnonKey.includes('your-anon-key'));
  return validUrl && validKey;
};

// Safe fallback credentials during initial local setup to avoid breaking client initialization
const supabaseUrl = isSupabaseConfigured() ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured() ? rawAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Test connectivity with Supabase project.
 */
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase credentials missing or set to placeholder values in .env.local (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)',
    };
  }

  const start = performance.now();
  try {
    // Attempt a light query to verify network connectivity and anon key authorization
    const { error } = await supabase.from('bridges').select('id', { count: 'exact', head: true });
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      // If table doesn't exist yet, we still know authentication and host reached
      if (error.code === '42P01') {
        return {
          success: true,
          message: `Connected to Supabase (${latencyMs}ms), but the 'bridges' table does not exist yet. Run supabase/schema.sql in the SQL Editor.`,
          latencyMs,
        };
      }
      return {
        success: false,
        message: `Supabase error (${error.code || 'UNKNOWN'}): ${error.message}`,
        latencyMs,
      };
    }

    return {
      success: true,
      message: `Successfully connected to Supabase (${latencyMs}ms)`,
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: false,
      message: `Connection failed: ${err?.message || 'Network error'}`,
      latencyMs,
    };
  }
};

/**
 * Fetch all Bridge Pipelines from Supabase.
 */
export const fetchBridgesFromSupabase = async (): Promise<BridgePipeline[] | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('bridges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Error fetching bridges from Supabase:', error);
      return null;
    }

    return data.map((row) => ({
      id: row.id,
      uuid: row.uuid,
      name: row.name,
      service: row.service as BridgePipeline['service'],
      category: row.category as BridgePipeline['category'],
      tag: row.tag,
      method: row.method as BridgePipeline['method'],
      endpoint: row.endpoint,
      authType: row.auth_type as BridgePipeline['authType'],
      secretToken: row.secret_token || '',
      syncInterval: row.sync_interval,
      cronExpression: row.cron_expression,
      lastSync: row.last_sync || 'Never',
      recordsSynced: row.records_synced,
      status: row.status,
      statusText: row.status_text || undefined,
      cluster: row.cluster,
      queryParams: (row.query_params as any) || [],
      headers: (row.headers as any) || [],
      paginationStrategy: row.pagination_strategy,
      paginationNote: row.pagination_note || '',
      throttlingRate: row.throttling_rate,
      throttlingNote: row.throttling_note || '',
      cacheSnapshots: row.cache_snapshots,
      maxRetries: row.max_retries,
      backoffCeiling: row.backoff_ceiling,
      timeoutMs: row.timeout_ms,
      autoRetry429: row.auto_retry_429,
    }));
  } catch (err) {
    console.error('Supabase fetchBridges error:', err);
    return null;
  }
};

/**
 * Upsert a Bridge Pipeline into Supabase.
 */
export const upsertBridgeToSupabase = async (bridge: BridgePipeline): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const row = {
      id: bridge.id,
      uuid: bridge.uuid,
      name: bridge.name,
      service: bridge.service,
      category: bridge.category,
      tag: bridge.tag,
      method: bridge.method,
      endpoint: bridge.endpoint,
      auth_type: bridge.authType,
      secret_token: bridge.secretToken || null,
      sync_interval: bridge.syncInterval,
      cron_expression: bridge.cronExpression,
      last_sync: bridge.lastSync,
      records_synced: bridge.recordsSynced,
      status: bridge.status,
      status_text: bridge.statusText || null,
      cluster: bridge.cluster,
      query_params: bridge.queryParams as any,
      headers: bridge.headers as any,
      pagination_strategy: bridge.paginationStrategy,
      pagination_note: bridge.paginationNote,
      throttling_rate: bridge.throttlingRate,
      throttling_note: bridge.throttlingNote,
      cache_snapshots: bridge.cacheSnapshots,
      max_retries: bridge.maxRetries,
      backoff_ceiling: bridge.backoffCeiling,
      timeout_ms: bridge.timeoutMs,
      auto_retry_429: bridge.autoRetry429,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('bridges').upsert(row);
    if (error) {
      console.error('Supabase upsertBridge error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase upsertBridge error:', err);
    return false;
  }
};

/**
 * Log a sync activity event to Supabase.
 */
export const recordSyncActivityToSupabase = async (log: SyncActivityLog): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from('sync_activity_logs').insert({
      id: log.id,
      timestamp: log.timestamp,
      status_code: log.statusCode,
      status_text: log.statusText,
      bridge_name: log.bridgeName,
      records_count: log.recordsCount,
      payload_size: log.payloadSize,
      latency_ms: log.latencyMs,
      is_blocked: log.isBlocked ?? false,
    });

    if (error) {
      console.warn('Supabase recordSyncActivity error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase recordSyncActivity error:', err);
    return false;
  }
};

/**
 * Fetch recent sync activity logs from Supabase.
 */
export const fetchSyncLogsFromSupabase = async (limit = 50): Promise<SyncActivityLog[] | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('sync_activity_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.warn('Error fetching sync logs from Supabase:', error);
      return null;
    }

    return data.map((row) => ({
      id: row.id,
      timestamp: row.timestamp,
      statusCode: row.status_code,
      statusText: row.status_text,
      bridgeName: row.bridge_name,
      recordsCount: row.records_count,
      payloadSize: row.payload_size,
      latencyMs: row.latency_ms,
      isBlocked: row.is_blocked,
    }));
  } catch (err) {
    console.error('Supabase fetchSyncLogs error:', err);
    return null;
  }
};
