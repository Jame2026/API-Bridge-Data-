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

export interface UserActivity {
  id: string;
  projectId: string;
  featureName: string;
  userId: string;
  userEmail?: string;
  actionType: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface FeatureUsageStat {
  featureName: string;
  actionCount: number;
  uniqueUsersCount: number;
  percentageShare: number;
}

export interface DailyTrendPoint {
  date: string;
  eventCount: number;
  activeUsers: number;
}

export interface TopUserStat {
  userId: string;
  userEmail: string;
  actionCount: number;
  lastActive: string;
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
  dateRange: 'today' | '7d' | '30d' | '90d' | 'custom' | 'all';
  startDate?: string;
  endDate?: string;
  generatedAt: string;
  createdBy: string;
  summary: UsageMetricsSummary;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'auditor' | 'viewer';
}
