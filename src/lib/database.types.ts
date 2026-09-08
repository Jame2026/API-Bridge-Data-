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
      projects: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          environment: 'production' | 'staging' | 'development';
          base_url: string;
          icon: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          environment?: 'production' | 'staging' | 'development';
          base_url?: string;
          icon?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
        Relationships: [];
      };
      user_activities: {
        Row: {
          id: string;
          project_id: string;
          feature_name: string;
          user_id: string;
          user_email: string;
          action_type: string;
          metadata: Json;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          feature_name: string;
          user_id: string;
          user_email: string;
          action_type?: string;
          metadata?: Json;
          timestamp?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_activities']['Insert']>;
        Relationships: [
          {
            foreignKeyName: "user_activities_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      reports: {
        Row: {
          id: string;
          title: string;
          project_id: string;
          date_range: string;
          start_date: string | null;
          end_date: string | null;
          generated_at: string;
          created_by: string;
          summary: Json;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          project_id?: string;
          date_range?: string;
          start_date?: string | null;
          end_date?: string | null;
          generated_at?: string;
          created_by?: string;
          summary?: Json;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
