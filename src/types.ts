export type NavView =
  | 'overview-bridges'
  | 'connect-auth'
  | 'fetch-inspector'
  | 'reports-analytics'
  | 'endpoint-registry'
  | 'audit-logs';

export type BridgeStatus = 'healthy' | 'degraded' | 'paused' | 'failed';

export interface QueryParam {
  id: string;
  key: string;
  value: string;
  dynamic?: boolean;
}

export interface HeaderInjection {
  id: string;
  key: string;
  value: string;
  isSecret?: boolean;
}

export interface BridgePipeline {
  id: string;
  uuid: string;
  name: string;
  service: 'shopify' | 'zendesk' | 'hubspot' | 'stripe' | 'jira' | 'github' | 'custom_rest' | 'graphql';
  category: 'ecommerce' | 'desk' | 'pipeline' | 'stream' | 'devops' | 'custom';
  tag: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  authType: 'Bearer Token' | 'OAuth 2.0 (PKCE)' | 'API Key (Vault)' | 'Restricted Secret Key' | 'Basic (API Token)';
  secretToken: string;
  syncInterval: string;
  cronExpression: string;
  lastSync: string;
  recordsSynced: number;
  status: BridgeStatus;
  statusText?: string;
  cluster: string;
  queryParams: QueryParam[];
  headers: HeaderInjection[];
  paginationStrategy: string;
  paginationNote: string;
  throttlingRate: string;
  throttlingNote: string;
  cacheSnapshots: boolean;
  maxRetries: number;
  backoffCeiling: string;
  timeoutMs: number;
  autoRetry429: boolean;
}

export interface SyncActivityLog {
  id: string;
  timestamp: string;
  statusCode: number;
  statusText: string;
  bridgeName: string;
  recordsCount: number;
  payloadSize: string;
  latencyMs: number;
  isBlocked?: boolean;
}

export interface TemplateScope {
  id: string;
  name: string;
  rawScopes: string;
  description: string;
  required?: boolean;
  badge?: string;
  piiLevel?: string;
  checked: boolean;
}

export interface ConnectorTemplate {
  id: string;
  title: string;
  version: string;
  category: 'all' | 'ecommerce' | 'crm' | 'devops' | 'support' | 'custom';
  description: string;
  protocols: string[];
  avgPoll: string;
  rateLimit: string;
  icon: string;
  accentColor: string;
  defaultEndpoint: string;
  defaultAuth: string;
  defaultName: string;
  scopes: TemplateScope[];
}

export interface SchemaMapping {
  id: string;
  sourceKey: string;
  targetType: 'Integer' | 'String' | 'Decimal/Currency' | 'ISO-8601' | 'Computed' | 'Enum' | 'Boolean';
  outputField: string;
  transformRule: string;
  sampleValue: string;
  state: 'valid' | 'warning' | 'computed' | 'masked';
  constraint?: string;
  detectedIngressType?: string;
}

export interface TabularRecord {
  order_id: string;
  invoice_number: string;
  revenue_amount: string;
  timestamp: string;
  customer_email: string;
  item_count: number;
  shipping_state: 'Fulfilled' | 'Processing' | 'Pending' | 'Cancelled';
}

export interface DiagnosticFailure {
  handshakeLatencyMs: number;
  statusCode: number;
  statusText: string;
  schemaConflictsCount: number;
  upstreamQuotaUsed: number;
  upstreamQuotaMax: number;
  missingScope: string;
  typeMismatchCol: string;
  typeMismatchExpected: string;
  typeMismatchReceived: string;
}
