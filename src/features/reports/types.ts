export * from '../../types';

export interface GenerateReportFormValues {
  title: string;
  projectId: string;
  dateRange: 'today' | '7d' | '30d' | '90d' | 'all';
  notes?: string;
  createdBy: string;
}
