import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UsageReport, UsageMetricsSummary, UserActivity, FeatureUsageStat, DailyTrendPoint, TopUserStat } from '../types';

export const fetchReportsFromSupabase = async (): Promise<UsageReport[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('reports').select('*').order('generated_at', { ascending: false });
    if (error || !data) return null;
    return data.map((row) => ({
      id: row.id,
      title: row.title,
      projectId: row.project_id || 'all',
      dateRange: (row.date_range as any) || '30d',
      startDate: row.start_date || undefined,
      endDate: row.end_date || undefined,
      generatedAt: row.generated_at,
      createdBy: row.created_by,
      summary: (row.summary as unknown as UsageMetricsSummary) || {
        totalEvents: 0,
        totalUsers: 0,
        activeProjectsCount: 1,
        topFeature: 'None',
        avgEventsPerUser: 0,
        featureStats: [],
        dailyTrends: [],
        topUsers: [],
      },
      notes: row.notes || '',
    }));
  } catch {
    return null;
  }
};

export const saveReportToSupabase = async (report: UsageReport): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('reports').upsert({
      id: report.id,
      title: report.title,
      project_id: report.projectId === 'all' ? null : report.projectId,
      date_range: report.dateRange,
      start_date: report.startDate || null,
      end_date: report.endDate || null,
      generated_at: report.generatedAt,
      created_by: report.createdBy,
      summary: report.summary as any,
      notes: report.notes || null,
    });
    return !error;
  } catch {
    return false;
  }
};

export const deleteReportFromSupabase = async (reportId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('reports').delete().eq('id', reportId);
    return !error;
  } catch {
    return false;
  }
};

export const aggregateUsageMetrics = (activities: UserActivity[]): UsageMetricsSummary => {
  const totalEvents = activities.length;
  const uniqueUsers = new Set(activities.map((a) => a.userId));
  const uniqueProjects = new Set(activities.map((a) => a.projectId));

  const featureCounts: Record<string, { count: number; users: Set<string> }> = {};
  const dailyCounts: Record<string, { count: number; users: Set<string> }> = {};
  const userCounts: Record<string, { count: number; email: string; lastActive: string }> = {};

  activities.forEach((act) => {
    if (!featureCounts[act.featureName]) {
      featureCounts[act.featureName] = { count: 0, users: new Set() };
    }
    featureCounts[act.featureName].count++;
    featureCounts[act.featureName].users.add(act.userId);

    const dateStr = act.timestamp ? act.timestamp.split('T')[0] : new Date().toISOString().split('T')[0];
    if (!dailyCounts[dateStr]) {
      dailyCounts[dateStr] = { count: 0, users: new Set() };
    }
    dailyCounts[dateStr].count++;
    dailyCounts[dateStr].users.add(act.userId);

    if (!userCounts[act.userId]) {
      userCounts[act.userId] = { count: 0, email: act.userEmail || act.userId, lastActive: act.timestamp };
    }
    userCounts[act.userId].count++;
    if (new Date(act.timestamp) > new Date(userCounts[act.userId].lastActive)) {
      userCounts[act.userId].lastActive = act.timestamp;
    }
  });

  const featureStats: FeatureUsageStat[] = Object.entries(featureCounts)
    .map(([featureName, data]) => ({
      featureName,
      actionCount: data.count,
      uniqueUsersCount: data.users.size,
      percentageShare: totalEvents > 0 ? (data.count / totalEvents) * 100 : 0,
    }))
    .sort((a, b) => b.actionCount - a.actionCount);

  const dailyTrends: DailyTrendPoint[] = Object.entries(dailyCounts)
    .map(([date, data]) => ({
      date,
      eventCount: data.count,
      activeUsers: data.users.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const topUsers: TopUserStat[] = Object.entries(userCounts)
    .map(([userId, data]) => ({
      userId,
      userEmail: data.email,
      actionCount: data.count,
      lastActive: data.lastActive,
    }))
    .sort((a, b) => b.actionCount - a.actionCount)
    .slice(0, 10);

  return {
    totalEvents,
    totalUsers: uniqueUsers.size,
    activeProjectsCount: uniqueProjects.size || 1,
    topFeature: featureStats[0]?.featureName || 'None',
    avgEventsPerUser: uniqueUsers.size > 0 ? Number((totalEvents / uniqueUsers.size).toFixed(1)) : 0,
    featureStats,
    dailyTrends,
    topUsers,
  };
};
