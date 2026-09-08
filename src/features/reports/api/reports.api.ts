import { UsageReport } from '../../../types';
import { API_ENDPOINTS } from '../../../routes/endpoints';
import { INITIAL_REPORTS } from '../../../data/mockData';
import { fetchReportsFromSupabase, saveReportToSupabase, deleteReportFromSupabase } from '../../../lib/supabase';

export const reportsApi = {
  getReports: async (): Promise<UsageReport[]> => {
    const remote = await fetchReportsFromSupabase();
    if (remote && remote.length > 0) return remote;
    return INITIAL_REPORTS;
  },

  createReport: async (report: UsageReport): Promise<UsageReport> => {
    await saveReportToSupabase(report);
    return report;
  },

  deleteReport: async (id: string): Promise<string> => {
    await deleteReportFromSupabase(id);
    return id;
  },
};
