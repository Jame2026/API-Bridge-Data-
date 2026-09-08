import { UsageReport, UserActivity } from '../types';

export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  if (!rows || rows.length === 0) return;

  const resolvedHeaders =
    headers ||
    (Object.keys(rows[0]).map((k) => ({
      key: k as keyof T,
      label: k.toUpperCase(),
    })) as { key: keyof T; label: string }[]);

  const headerLine = resolvedHeaders.map((h) => `"${h.label}"`).join(',');

  const dataLines = rows.map((row) => {
    return resolvedHeaders
      .map((h) => {
        const val = row[h.key];
        if (val === null || val === undefined) return '""';
        if (typeof val === 'object') {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportReportToCsv(report: UsageReport): void {
  const rows = report.summary.featureStats.map((feat) => ({
    ReportTitle: report.title,
    ProjectScope: report.projectId,
    DateRange: report.dateRange,
    FeatureName: feat.featureName,
    ActionCount: feat.actionCount,
    UniqueUsers: feat.uniqueUsersCount,
    PercentageShare: `${feat.percentageShare.toFixed(1)}%`,
    GeneratedAt: report.generatedAt,
    CreatedBy: report.createdBy,
  }));
  exportToCsv(`UsageReport_${report.id}`, rows);
}

export function exportActivitiesToCsv(activities: UserActivity[]): void {
  const rows = activities.map((act) => ({
    ID: act.id,
    ProjectID: act.projectId,
    Feature: act.featureName,
    ActionType: act.actionType,
    UserID: act.userId,
    UserEmail: act.userEmail || '',
    Timestamp: act.timestamp,
    Metadata: JSON.stringify(act.metadata || {}),
  }));
  exportToCsv(`ActivityLogs_${Date.now()}`, rows);
}

export function printReportPdf(): void {
  window.print();
}
