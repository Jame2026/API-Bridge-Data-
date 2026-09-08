import { Project, UserActivity } from '../types';

export interface ModuleExtractionResult {
  module: string;
  status: 'success' | 'error';
  rowCount: number;
  error?: string;
  activities: UserActivity[];
}

export const ALL_SYSTEM_MODULES = [
  'branches',
  'document_folders',
  'attendance_records',
  'employees',
  'leave_requests',
  'payroll_runs',
  'payroll_records',
  'task_activities',
  'tasks',
  'candidates',
  'job_postings',
  'it_assets',
  'it_tickets',
  'performance_reviews',
  'training_courses',
  'user_role_assignments',
  'app_roles',
  'app_usage_logs',
  'audit_logs',
];

export async function extractProjectModules(
  project: Project
): Promise<{ success: boolean; results: ModuleExtractionResult[]; totalExtracted: number }> {
  if (!project.dbUrl || !project.dbKey) {
    return { success: false, results: [], totalExtracted: 0 };
  }

  const results: ModuleExtractionResult[] = [];
  const cleanBaseUrl = project.dbUrl.replace(/\/+$/, '');

  const inputModules = Array.from(
    new Set([...(project.modules || []), ...ALL_SYSTEM_MODULES])
  );

  const targetModules: string[] = [];
  for (const raw of inputModules) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (lower === 'all modules' || lower === 'all' || lower === '*') {
      targetModules.push(...ALL_SYSTEM_MODULES);
    } else {
      targetModules.push(trimmed.replace(/\s+/g, '_'));
    }
  }

  const uniqueModules = Array.from(new Set(targetModules));

  for (const moduleName of uniqueModules) {
    try {
      const endpoint = `${cleanBaseUrl}/rest/v1/${moduleName}?select=*&limit=200`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          apikey: project.dbKey,
          Authorization: `Bearer ${project.dbKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status} ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData?.message) errMessage = errData.message;
        } catch {}
        results.push({
          module: moduleName,
          status: 'error',
          rowCount: 0,
          error: errMessage,
          activities: [],
        });
        continue;
      }

      const rows: any[] = await response.json();
      if (!Array.isArray(rows)) {
        results.push({
          module: moduleName,
          status: 'error',
          rowCount: 0,
          error: 'Returned data is not a table row array',
          activities: [],
        });
        continue;
      }

      // Filter out soft-deleted records in HRMsystem
      const activeRows = rows.filter((row) => !row.deleted_at && row.status !== 'deleted');

      // Convert real active database rows into dynamic UserActivity telemetry
      const activities: UserActivity[] = activeRows.map((row, idx) => {
        const rowId = row.id || row._id || `row_${idx}_${Date.now()}`;
        const timestamp =
          row.created_at ||
          row.timestamp ||
          row.date ||
          row.updated_at ||
          new Date().toISOString();

        const userId =
          row.name ||
          row.label ||
          row.employee_id ||
          row.user_id ||
          row.created_by ||
          row.manager_name ||
          `rec_${rowId}`;

        const userEmail =
          row.user_email ||
          row.email ||
          (typeof row.manager_name === 'string' && row.manager_name.includes('@')
            ? row.manager_name
            : undefined);

        const isPinexBranch =
          typeof row.name === 'string' && row.name.toLowerCase().includes('pinex');

        const metadata = {
          ...row,
          ...(isPinexBranch ? { branch_type: 'sub_branch', affiliated_group: 'Pinex Agro' } : {}),
        };

        return {
          id: `act_${project.id}_${moduleName}_${rowId}`,
          projectId: project.id,
          featureName: moduleName,
          actionType: 'database_record',
          userId: String(userId),
          userEmail: userEmail ? String(userEmail) : undefined,
          metadata,
          timestamp: String(timestamp),
        };
      });

      results.push({
        module: moduleName,
        status: 'success',
        rowCount: activities.length,
        activities,
      });
    } catch (err: any) {
      results.push({
        module: moduleName,
        status: 'error',
        rowCount: 0,
        error: err.message || 'Network fetch failed',
        activities: [],
      });
    }
  }

  const totalExtracted = results.reduce((acc, r) => acc + r.rowCount, 0);
  return {
    success: results.some((r) => r.status === 'success'),
    results,
    totalExtracted,
  };
}
