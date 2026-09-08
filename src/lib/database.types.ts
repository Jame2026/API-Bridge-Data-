export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bridges: {
        Row: {
          id: string;
          uuid: string;
          name: string;
          service: string;
          category: string;
          tag: string;
          method: string;
          endpoint: string;
          auth_type: string;
          secret_token: string | null;
          sync_interval: string;
          cron_expression: string;
          last_sync: string | null;
          records_synced: number;
          status: 'healthy' | 'degraded' | 'paused' | 'failed';
          status_text: string | null;
          cluster: string;
          query_params: Json;
          headers: Json;
          pagination_strategy: string;
          pagination_note: string | null;
          throttling_rate: string;
          throttling_note: string | null;
          cache_snapshots: boolean;
          max_retries: number;
          backoff_ceiling: string;
          timeout_ms: number;
          auto_retry_429: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          uuid?: string;
          name: string;
          service: string;
          category: string;
          tag?: string;
          method?: string;
          endpoint: string;
          auth_type?: string;
          secret_token?: string | null;
          sync_interval?: string;
          cron_expression?: string;
          last_sync?: string | null;
          records_synced?: number;
          status?: 'healthy' | 'degraded' | 'paused' | 'failed';
          status_text?: string | null;
          cluster?: string;
          query_params?: Json;
          headers?: Json;
          pagination_strategy?: string;
          pagination_note?: string | null;
          throttling_rate?: string;
          throttling_note?: string | null;
          cache_snapshots?: boolean;
          max_retries?: number;
          backoff_ceiling?: string;
          timeout_ms?: number;
          auto_retry_429?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bridges']['Insert']>;
        Relationships: [];
      };
      sync_activity_logs: {
        Row: {
          id: string;
          timestamp: string;
          status_code: number;
          status_text: string;
          bridge_name: string;
          records_count: number;
          payload_size: string;
          latency_ms: number;
          is_blocked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          timestamp?: string;
          status_code: number;
          status_text: string;
          bridge_name: string;
          records_count?: number;
          payload_size?: string;
          latency_ms?: number;
          is_blocked?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['sync_activity_logs']['Insert']>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          timestamp: string;
          actor: string;
          action: string;
          target: string;
          status: 'SUCCESS' | 'WARN' | 'BLOCKED' | 'FAILED';
          ip_address: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          timestamp?: string;
          actor: string;
          action: string;
          target: string;
          status?: 'SUCCESS' | 'WARN' | 'BLOCKED' | 'FAILED';
          ip_address?: string;
          details?: Json;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
        Relationships: [];
      };
      schema_mappings: {
        Row: {
          id: string;
          bridge_id: string | null;
          source_key: string;
          target_type: string;
          output_field: string;
          transform_rule: string;
          sample_value: string;
          state: 'valid' | 'warning' | 'computed' | 'masked';
          constraint_rule: string | null;
          detected_ingress_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          bridge_id?: string | null;
          source_key: string;
          target_type: string;
          output_field: string;
          transform_rule?: string;
          sample_value?: string;
          state?: 'valid' | 'warning' | 'computed' | 'masked';
          constraint_rule?: string | null;
          detected_ingress_type?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['schema_mappings']['Insert']>;
        Relationships: [
          {
            foreignKeyName: "schema_mappings_bridge_id_fkey";
            columns: ["bridge_id"];
            isOneToOne: false;
            referencedRelation: "bridges";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
