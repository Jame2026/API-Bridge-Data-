import { UserActivity } from '../../../types';
import { INITIAL_USER_ACTIVITIES } from '../../../data/mockData';
import { fetchUserActivitiesFromSupabase, insertUserActivityToSupabase } from '../../../lib/supabase';

export const activitiesApi = {
  getActivities: async (): Promise<UserActivity[]> => {
    const remote = await fetchUserActivitiesFromSupabase();
    if (remote && remote.length > 0) return remote;
    return INITIAL_USER_ACTIVITIES;
  },

  logActivity: async (activity: UserActivity): Promise<UserActivity> => {
    await insertUserActivityToSupabase(activity);
    return activity;
  },
};
