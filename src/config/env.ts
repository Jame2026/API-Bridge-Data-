export const ENV = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Internal Usage Data & Reporting Tool',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
