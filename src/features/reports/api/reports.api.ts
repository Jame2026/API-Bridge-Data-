import { UsageReport } from '../../../types';
import { fetchReportsFromSupabase, saveReportToSupabase, deleteReportFromSupabase } from '../../../lib/supabase';

const STORAGE_KEY = 'app_reports_storage';

export const reportsApi = {
  getReports: async (): Promise<UsageReport[]> => {
    const remote = await fetchReportsFromSupabase();
    if (remote && remote.length > 0) {
      const dynamicOnly = remote.filter((r) => r.id !== 'rep_hrm_audit');
      if (dynamicOnly.length > 0) return dynamicOnly;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const dynamicOnly = parsed.filter((r) => r.id !== 'rep_hrm_audit');
          if (dynamicOnly.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dynamicOnly));
          }
          return dynamicOnly;
        }
      } catch (e) {
        console.warn('Failed to parse local reports:', e);
      }
    }
    return [];
  },

  createReport: async (report: UsageReport): Promise<UsageReport> => {
    await saveReportToSupabase(report);
    const existing = await reportsApi.getReports();
    const updated = [report, ...existing.filter((r) => r.id !== report.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return report;
  },

  deleteReport: async (id: string): Promise<string> => {
    await deleteReportFromSupabase(id);
    const existing = await reportsApi.getReports();
    const updated = existing.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return id;
  },
};
