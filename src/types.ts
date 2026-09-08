export type NavView =
  | 'dashboard'
  | 'reports'
  | 'activity-explorer'
  | 'projects'
  | 'ingest-guide';

export type UserRole = 'admin' | 'auditor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  environment: 'production' | 'staging' | 'development';
  baseUrl: string;
  icon: string;
  color: string;
  dbUrl?: string;
  dbKey?: string;
  modules?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ActionCategory =
  | 'login'
  | 'feature_used'
  | 'item_created'
  | 'export_run'
  | 'page_view'
  | 'session_start'
  | 'settings_change'
  | 'database_record'
  | 'other';

export interface UserActivity {
  id: string;
  projectId: string;
  featureName: string;
  userId: string;
  userEmail?: string;
  actionType: ActionCategory | string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface FeatureUsageStat {
  featureName: string;
  count: number;
  percentage: number;
  uniqueUsers: number;
  actionCount?: number;
  percentageShare?: number;
  uniqueUsersCount?: number;
}

export interface DailyTrendPoint {
  date: string;
  formattedDate?: string;
  eventCount: number;
  userCount?: number;
  activeUsers?: number;
}

export interface TopUserStat {
  userId: string;
  userEmail: string;
  actionCount: number;
  lastActive: string;
  primaryProject?: string;
}

export interface UsageMetricsSummary {
  totalEvents: number;
  totalUsers: number;
  activeProjectsCount: number;
  topFeature: string;
  avgEventsPerUser: number;
  featureStats: FeatureUsageStat[];
  dailyTrends: DailyTrendPoint[];
  topUsers: TopUserStat[];
}

export interface UsageReport {
  id: string;
  title: string;
  projectId: string;
  dateRange: 'today' | '7d' | '30d' | '90d' | 'all' | 'custom';
  startDate?: string;
  endDate?: string;
  generatedAt: string;
  createdBy: string;
  summary: UsageMetricsSummary;
  notes?: string;
}

export interface ReportFilter {
  projectId: string;
  featureName?: string;
  userId?: string;
  actionType?: string;
  dateRange: 'today' | '7d' | '30d' | '90d' | 'all';
}
