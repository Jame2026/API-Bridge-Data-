import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from './reports.api';
import { UsageReport } from '../../../types';

export const REPORTS_QUERY_KEY = ['reports'] as const;

export function useReportsQuery() {
  return useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: reportsApi.getReports,
  });
}

export function useCreateReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportsApi.createReport,
    onSuccess: (newReport) => {
      queryClient.setQueryData<UsageReport[]>(REPORTS_QUERY_KEY, (prev) =>
        prev ? [newReport, ...prev] : [newReport]
      );
    },
  });
}

export function useDeleteReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportsApi.deleteReport,
    onSuccess: (deletedId) => {
      queryClient.setQueryData<UsageReport[]>(REPORTS_QUERY_KEY, (prev) =>
        prev ? prev.filter((r) => r.id !== deletedId) : []
      );
    },
  });
}
