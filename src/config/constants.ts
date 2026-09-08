export const APP_CONFIG = {
  DEFAULT_PROJECT_ID: 'all',
  DEFAULT_DATE_RANGE: '7d',
  DEFAULT_PAGE_SIZE: 50,
  TOAST_DURATION_MS: 3200,
  AUTO_REFRESH_INTERVAL_MS: 30000,
} as const;

export const DATE_RANGE_OPTIONS = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'All History', value: 'all' },
] as const;

export const ACTION_TYPE_OPTIONS = [
  { label: 'All Action Types', value: 'all' },
  { label: 'Feature Use', value: 'feature_use' },
  { label: 'Page View', value: 'page_view' },
  { label: 'Button Click', value: 'button_click' },
  { label: 'Export Data', value: 'export_data' },
  { label: 'API Call', value: 'api_call' },
  { label: 'Login', value: 'login' },
  { label: 'Item Created', value: 'item_created' },
  { label: 'Export Run', value: 'export_run' },
] as const;
