export const ROUTES = {
  root: '/',
  dashboard: '/dashboard',
  reports: '/reports',
  reportDetail: '/reports/:id',
  activityExplorer: '/explorer',
  projects: '/projects',
  ingestGuide: '/ingest',
  login: '/login',
} as const;

export type RouteKey = keyof typeof ROUTES;
