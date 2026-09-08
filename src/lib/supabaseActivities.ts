import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserActivity } from '../types';

export const fetchUserActivitiesFromSupabase = async (filters?: {
  projectId?: string;
  featureName?: string;
  userId?: string;
  actionType?: string;
  limit?: number;
}): Promise<UserActivity[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    let query = supabase.from('user_activities').select('*').order('timestamp', { ascending: false });
    if (filters?.projectId && filters.projectId !== 'all') {
      query = query.eq('project_id', filters.projectId);
    }
    if (filters?.featureName) query = query.eq('feature_name', filters.featureName);
    if (filters?.userId) query = query.eq('user_id', filters.userId);
    if (filters?.actionType) query = query.eq('action_type', filters.actionType);
    query = query.limit(filters?.limit || 500);

    const { data, error } = await query;
    if (error || !data) return null;

    return data.map((row) => ({
      id: row.id,
      projectId: row.project_id,
      featureName: row.feature_name,
      userId: row.user_id,
      userEmail: row.user_email,
      actionType: row.action_type,
      metadata: (row.metadata as Record<string, any>) || {},
      timestamp: row.timestamp,
    }));
  } catch {
    return null;
  }
};

export const insertUserActivityToSupabase = async (activity: UserActivity): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('user_activities').insert({
      id: activity.id,
      project_id: activity.projectId,
      feature_name: activity.featureName,
      user_id: activity.userId,
      user_email: activity.userEmail,
      action_type: activity.actionType,
      metadata: activity.metadata || {},
      timestamp: activity.timestamp || new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};
