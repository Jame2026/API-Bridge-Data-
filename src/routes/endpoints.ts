export const API_ENDPOINTS = {
  projects: '/projects',
  userActivities: '/user_activities',
  reports: '/reports',
  metrics: '/metrics/summary',
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    session: '/auth/session',
  },
} as const;
