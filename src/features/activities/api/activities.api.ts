import { UserActivity } from '../../../types';
import { fetchUserActivitiesFromSupabase, insertUserActivityToSupabase } from '../../../lib/supabase';
import { extractProjectModules } from '../../../services/dataExtractor';
import { INITIAL_PROJECTS } from '../../../data/mockData';

const STORAGE_KEY = 'app_activities_storage';

// Known legacy static prefixes to purge
const STATIC_MOCK_PREFIXES = ['act_hrm_br_0', 'act_hrm_att_0', 'act_hrm_leave_0', 'act_unt_0'];

function isDynamicRecord(act: UserActivity): boolean {
  if (!act || !act.id) return false;
  return !STATIC_MOCK_PREFIXES.some((prefix) => act.id.startsWith(prefix));
}

export const activitiesApi = {
  getActivities: async (): Promise<UserActivity[]> => {
    const remote = await fetchUserActivitiesFromSupabase();
    if (remote && remote.length > 0) {
      const dynamicRemote = remote.filter(isDynamicRecord);
      if (dynamicRemote.length > 0) return dynamicRemote;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const dynamicOnly = parsed.filter(isDynamicRecord);
          if (dynamicOnly.length > 0) {
            if (dynamicOnly.length !== parsed.length) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(dynamicOnly));
            }
            return dynamicOnly;
          }
        }
      } catch (e) {
        console.warn('Failed to parse local activities:', e);
      }
    }

    // Auto-extract live dynamic records on initial load if cache is empty
    try {
      const hrmProject = INITIAL_PROJECTS[0];
      if (hrmProject?.dbUrl && hrmProject?.dbKey) {
        const extraction = await extractProjectModules(hrmProject);
        if (extraction.totalExtracted > 0) {
          const liveActivities = extraction.results
            .filter((r) => r.status === 'success')
            .flatMap((r) => r.activities);

          localStorage.setItem(STORAGE_KEY, JSON.stringify(liveActivities));
          return liveActivities;
        }
      }
    } catch (err) {
      console.warn('Initial live extraction fallback error:', err);
    }

    return [];
  },

  logActivity: async (activity: UserActivity): Promise<UserActivity> => {
    if (!isDynamicRecord(activity)) return activity;
    await insertUserActivityToSupabase(activity).catch(() => {});
    const existing = await activitiesApi.getActivities();
    const updated = [activity, ...existing.filter((a) => a.id !== activity.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return activity;
  },

  logActivitiesBatch: async (newActivities: UserActivity[]): Promise<UserActivity[]> => {
    const dynamicOnly = newActivities.filter(isDynamicRecord);
    if (dynamicOnly.length === 0) return [];

    for (const act of dynamicOnly) {
      await insertUserActivityToSupabase(act).catch(() => {});
    }

    const existing = await activitiesApi.getActivities();
    const newIds = new Set(dynamicOnly.map((a) => a.id));
    const filtered = existing.filter((a) => !newIds.has(a.id));
    const updated = [...dynamicOnly, ...filtered];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return dynamicOnly;
  },
};
