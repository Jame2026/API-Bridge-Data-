import { Project, UserActivity, UsageReport } from '../types';

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

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj_hrmsystem',
    name: 'HRMsystem',
    slug: 'hrmsystem',
    description: 'Unified HR Management System deployed at hrsystem-quit.onrender.com.',
    environment: 'production',
    baseUrl: 'https://hrsystem-quit.onrender.com',
    icon: 'folder',
    color: '#8083ff',
    dbUrl: 'https://blcvtbzwpwmqkphlcjji.supabase.co',
    dbKey: 'sb_publishable_6YeWRdHxBY8LlVXKLWelsw_Wfb4GSWk',
    modules: ALL_SYSTEM_MODULES,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-08T00:00:00Z',
  },
  {
    id: 'prj_unt_website',
    name: 'Unique Noble Trading (UNT)',
    slug: 'unt-website',
    description: 'Company portal & catalog at unt-website.onrender.com.',
    environment: 'production',
    baseUrl: 'https://unt-website.onrender.com',
    icon: 'language',
    color: '#7bd0ff',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-08T00:00:00Z',
  },
];

export const INITIAL_USER_ACTIVITIES: UserActivity[] = [];
export const INITIAL_REPORTS: UsageReport[] = [];
