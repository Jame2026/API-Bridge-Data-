import { BridgePipeline, SyncActivityLog, ConnectorTemplate, SchemaMapping, TabularRecord } from '../types';

export const INITIAL_BRIDGES: BridgePipeline[] = [
  {
    id: 'shopify-orders',
    uuid: 'brg_shp_99214a',
    name: 'Shopify Store Orders',
    service: 'shopify',
    category: 'ecommerce',
    tag: 'E-COMM',
    method: 'GET',
    endpoint: 'https://acme-global.myshopify.com/admin/api/2024-01/orders.json',
    authType: 'Bearer Token',
    secretToken: 'demo_shp_token_sample_99ab',
    syncInterval: 'Every 15 min',
    cronExpression: '*/15 * * * *',
    lastSync: '4m ago',
    recordsSynced: 2450,
    status: 'healthy',
    statusText: 'Healthy',
    cluster: 'aws-us-east-1a-edge (Primary)',
    queryParams: [
      { id: '1', key: 'status', value: 'any' },
      { id: '2', key: 'limit', value: '250' },
      { id: '3', key: 'updated_at_min', value: '{{last_sync_timestamp_iso}}', dynamic: true },
      { id: '4', key: 'fields', value: 'id,created_at,currency,current_total_price,email,financial_status,fulfillment_status' }
    ],
    headers: [
      { id: 'h1', key: 'Content-Type', value: 'application/json' },
      { id: 'h2', key: 'X-Shopify-Access-Token', value: 'demo_shp_token_sample_99ab', isSecret: true },
      { id: 'h3', key: 'User-Agent', value: 'APIDataBridge-Worker/2.4' }
    ],
    paginationStrategy: 'Link Header (Cursor RFC-5988)',
    paginationNote: 'Extract rel="next" URL until page_info cursor exhausted',
    throttlingRate: '4 requests / sec',
    throttlingNote: 'Shopify bucket limit: 40/40 calls with 2 req/sec restore',
    cacheSnapshots: true,
    maxRetries: 5,
    backoffCeiling: '32 seconds',
    timeoutMs: 8000,
    autoRetry429: true
  },
  {
    id: 'zendesk-tickets',
    uuid: 'brg_znd_38472f',
    name: 'Zendesk Support Tickets',
    service: 'zendesk',
    category: 'desk',
    tag: 'DESK',
    method: 'GET',
    endpoint: 'https://acme-support.zendesk.com/api/v2/incremental/tickets.json',
    authType: 'OAuth 2.0 (PKCE)',
    secretToken: 'znd_tok_84920492837492019482',
    syncInterval: 'Hourly',
    cronExpression: '0 * * * *',
    lastSync: '12m ago',
    recordsSynced: 120,
    status: 'healthy',
    statusText: 'Healthy',
    cluster: 'aws-us-east-1a-edge (Primary)',
    queryParams: [
      { id: 'z1', key: 'start_time', value: '{{last_sync_epoch_unix}}', dynamic: true }
    ],
    headers: [
      { id: 'zh1', key: 'Accept', value: 'application/json' },
      { id: 'zh2', key: 'Authorization', value: 'Bearer znd_oauth_token_active', isSecret: true }
    ],
    paginationStrategy: 'Cursor-based (after_cursor)',
    paginationNote: 'Inspect after_cursor until end_of_stream flag is true',
    throttlingRate: '10 requests / sec',
    throttlingNote: 'Zendesk High-volume add-on: 700 req/min',
    cacheSnapshots: true,
    maxRetries: 3,
    backoffCeiling: '16 seconds',
    timeoutMs: 6000,
    autoRetry429: true
  },
  {
    id: 'hubspot-deals',
    uuid: 'brg_hub_19482b',
    name: 'HubSpot CRM Deals',
    service: 'hubspot',
    category: 'pipeline',
    tag: 'PIPELINE',
    method: 'POST',
    endpoint: 'https://api.hubapi.com/crm/v3/objects/deals/search',
    authType: 'API Key (Vault)',
    secretToken: 'demo_hubspot_token_sample',
    syncInterval: 'Every 6 hours',
    cronExpression: '0 */6 * * *',
    lastSync: '42m ago',
    recordsSynced: 890,
    status: 'healthy',
    statusText: 'Healthy',
    cluster: 'aws-us-east-1a-edge (Primary)',
    queryParams: [],
    headers: [
      { id: 'hb1', key: 'Content-Type', value: 'application/json' },
      { id: 'hb2', key: 'Authorization', value: 'Bearer demo_hubspot_token_sample', isSecret: true }
    ],
    paginationStrategy: 'Offset pagination (paging.next.after)',
    paginationNote: 'Search endpoint batch size: 100 deals per call',
    throttlingRate: '15 requests / sec',
    throttlingNote: 'HubSpot API limit: 100 requests per 10 seconds',
    cacheSnapshots: true,
    maxRetries: 4,
    backoffCeiling: '20 seconds',
    timeoutMs: 10000,
    autoRetry429: true
  },
  {
    id: 'stripe-events',
    uuid: 'brg_str_90241e',
    name: 'Stripe Revenue Events',
    service: 'stripe',
    category: 'stream',
    tag: 'STREAM',
    method: 'GET',
    endpoint: 'https://api.stripe.com/v1/balance_transactions',
    authType: 'Restricted Secret Key',
    secretToken: 'demo_stripe_restricted_token_sample',
    syncInterval: 'Webhook + Catchup',
    cronExpression: '*/5 * * * *',
    lastSync: 'Just now',
    recordsSynced: 14200,
    status: 'healthy',
    statusText: 'Healthy',
    cluster: 'aws-us-east-1b-replica (Secondary)',
    queryParams: [
      { id: 'st1', key: 'limit', value: '100' },
      { id: 'st2', key: 'created[gte]', value: '{{last_sync_epoch_unix}}', dynamic: true }
    ],
    headers: [
      { id: 'sth1', key: 'Authorization', value: 'Bearer demo_stripe_restricted_token_sample', isSecret: true },
      { id: 'sth2', key: 'Stripe-Version', value: '2023-10-16' }
    ],
    paginationStrategy: 'Starting_after pointer',
    paginationNote: 'Inspect has_more flag and assign last object id to starting_after',
    throttlingRate: '25 requests / sec',
    throttlingNote: 'Stripe standard read rate: 100 req/sec peak',
    cacheSnapshots: true,
    maxRetries: 5,
    backoffCeiling: '32 seconds',
    timeoutMs: 5000,
    autoRetry429: true
  },
  {
    id: 'jira-issues',
    uuid: 'brg_jir_47291a',
    name: 'Jira Cloud Issues',
    service: 'jira',
    category: 'devops',
    tag: 'RATE LIMIT',
    method: 'POST',
    endpoint: 'https://acme-corp.atlassian.net/rest/api/3/search',
    authType: 'Basic (API Token)',
    secretToken: 'dev-ops-sync@acme.com:demo_atlassian_token_sample',
    syncInterval: 'Every 30 min',
    cronExpression: '*/30 * * * *',
    lastSync: '2m ago',
    recordsSynced: 0,
    status: 'degraded',
    statusText: 'Degraded / Backoff',
    cluster: 'aws-us-east-1a-edge (Primary)',
    queryParams: [],
    headers: [
      { id: 'jh1', key: 'Content-Type', value: 'application/json' },
      { id: 'jh2', key: 'Authorization', value: 'Basic ZGV2LW9wcy1zeW5jQGFjbWUuY29tOmRlbW9fdG9rZW4=', isSecret: true }
    ],
    paginationStrategy: 'startAt + maxResults',
    paginationNote: 'Incremental query using updated >= -30m JQL',
    throttlingRate: '1 request / sec',
    throttlingNote: 'Atlassian rate limit exceeded: Retry-After 120s received',
    cacheSnapshots: false,
    maxRetries: 6,
    backoffCeiling: '60 seconds',
    timeoutMs: 12000,
    autoRetry429: true
  },
  {
    id: 'github-events',
    uuid: 'brg_git_55928c',
    name: 'GitHub Developer Events',
    service: 'github',
    category: 'devops',
    tag: 'DEVOPS',
    method: 'GET',
    endpoint: 'https://api.github.com/orgs/acme-engineering/events',
    authType: 'Bearer Token',
    secretToken: 'demo_github_pat_sample_9938',
    syncInterval: 'Every 10 min',
    cronExpression: '*/10 * * * *',
    lastSync: '8m ago',
    recordsSynced: 430,
    status: 'healthy',
    statusText: 'Healthy',
    cluster: 'aws-us-east-1a-edge (Primary)',
    queryParams: [
      { id: 'gh1', key: 'per_page', value: '100' }
    ],
    headers: [
      { id: 'ghh1', key: 'Accept', value: 'application/vnd.github+json' },
      { id: 'ghh2', key: 'Authorization', value: 'Bearer demo_github_pat_sample_9938', isSecret: true },
      { id: 'ghh3', key: 'X-GitHub-Api-Version', value: '2022-11-28' }
    ],
    paginationStrategy: 'Link Header (page=2)',
    paginationNote: 'Header RFC-5988 rel="next"',
    throttlingRate: '5 requests / sec',
    throttlingNote: 'GitHub enterprise limit: 5,000 req/hour',
    cacheSnapshots: true,
    maxRetries: 3,
    backoffCeiling: '15 seconds',
    timeoutMs: 5000,
    autoRetry429: true
  },
  {
    id: 'salesforce-customers',
    uuid: 'brg_sfc_77192d',
    name: 'Salesforce Customer Sync',
    service: 'custom_rest',
    category: 'custom',
    tag: 'CRM',
    method: 'GET',
    endpoint: 'https://acme.my.salesforce.com/services/data/v59.0/query',
    authType: 'OAuth 2.0 (PKCE)',
    secretToken: '00D80000000xxxx!AQ0AQG78_938402948201',
    syncInterval: 'Every 2 hours',
    cronExpression: '0 */2 * * *',
    lastSync: '1h ago',
    recordsSynced: 1540,
    status: 'healthy',
    statusText: 'Healthy',
    cluster: 'aws-us-east-1a-edge (Primary)',
    queryParams: [
      { id: 'sf1', key: 'q', value: 'SELECT Id,Name,Email,AnnualRevenue,LastModifiedDate FROM Account WHERE LastModifiedDate >= LAST_N_DAYS:1' }
    ],
    headers: [
      { id: 'sfh1', key: 'Authorization', value: 'Bearer 00D80000000xxxx!AQ0AQG78_938402948201', isSecret: true },
      { id: 'sfh2', key: 'Sforce-Query-Options', value: 'batchSize=2000' }
    ],
    paginationStrategy: 'nextRecordsUrl cursor',
    paginationNote: 'QueryLocator cursor traversal',
    throttlingRate: '5 requests / sec',
    throttlingNote: 'Daily API Limit: 100,000 calls per 24 hours',
    cacheSnapshots: true,
    maxRetries: 4,
    backoffCeiling: '30 seconds',
    timeoutMs: 15000,
    autoRetry429: true
  },
  {
    id: 'snowflake-sink',
    uuid: 'brg_snw_11094f',
    name: 'Snowflake Warehouse Sink',
    service: 'custom_rest',
    category: 'pipeline',
    tag: 'SINK',
    method: 'POST',
    endpoint: 'https://xy12345.us-east-1.snowflakecomputing.com/api/v2/statements',
    authType: 'Bearer Token',
    secretToken: 'eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkExMjhHQ00ifQ...',
    syncInterval: 'Hourly',
    cronExpression: '0 * * * *',
    lastSync: '35m ago',
    recordsSynced: 84900,
    status: 'healthy',
    statusText: 'Healthy',
    cluster: 'aws-us-east-1a-edge (Primary)',
    queryParams: [],
    headers: [
      { id: 'snh1', key: 'Content-Type', value: 'application/json' },
      { id: 'snh2', key: 'Authorization', value: 'Bearer eyJhbGciOiJSU0EtT0FFUCIs...', isSecret: true }
    ],
    paginationStrategy: 'Result partitions iterator',
    paginationNote: 'Partition index chunks',
    throttlingRate: '20 requests / sec',
    throttlingNote: 'Warehouse XS compute tier auto-scaling',
    cacheSnapshots: true,
    maxRetries: 3,
    backoffCeiling: '20 seconds',
    timeoutMs: 25000,
    autoRetry429: true
  }
];

export const INITIAL_LOGS: SyncActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '14:22:08.412',
    statusCode: 200,
    statusText: '200 OK',
    bridgeName: 'Shopify Store Orders',
    recordsCount: 250,
    payloadSize: '184.2 KB',
    latencyMs: 142
  },
  {
    id: 'log-2',
    timestamp: '14:20:15.890',
    statusCode: 429,
    statusText: '429 RATE',
    bridgeName: 'Jira Cloud Issues',
    recordsCount: 0,
    payloadSize: '0.4 KB',
    latencyMs: 64,
    isBlocked: true
  },
  {
    id: 'log-3',
    timestamp: '14:18:44.201',
    statusCode: 200,
    statusText: '200 OK',
    bridgeName: 'Stripe Revenue Events',
    recordsCount: 100,
    payloadSize: '68.9 KB',
    latencyMs: 112
  },
  {
    id: 'log-4',
    timestamp: '14:15:02.114',
    statusCode: 201,
    statusText: '201 OK',
    bridgeName: 'HubSpot CRM Deals',
    recordsCount: 45,
    payloadSize: '32.1 KB',
    latencyMs: 198
  },
  {
    id: 'log-5',
    timestamp: '14:12:30.985',
    statusCode: 200,
    statusText: '200 OK',
    bridgeName: 'Zendesk Support Tickets',
    recordsCount: 12,
    payloadSize: '18.4 KB',
    latencyMs: 135
  },
  {
    id: 'log-6',
    timestamp: '14:10:00.003',
    statusCode: 200,
    statusText: '200 OK',
    bridgeName: 'Shopify Store Orders',
    recordsCount: 198,
    payloadSize: '152.0 KB',
    latencyMs: 139
  }
];

export const INITIAL_SCHEMA_MAPPINGS: SchemaMapping[] = [
  {
    id: 'sm-1',
    sourceKey: '$.orders[*].id',
    targetType: 'Integer',
    outputField: 'order_id',
    transformRule: 'ToBigInt()',
    sampleValue: '5519827102',
    state: 'valid',
    constraint: 'PRIMARY KEY NOT NULL',
    detectedIngressType: 'Int64'
  },
  {
    id: 'sm-2',
    sourceKey: '$.orders[*].created_at',
    targetType: 'ISO-8601',
    outputField: 'created_at_utc',
    transformRule: 'ParseISO() → UTC',
    sampleValue: '"2025-02-14T14:19:42Z"',
    state: 'valid',
    constraint: 'TIMESTAMPTZ NOT NULL',
    detectedIngressType: 'ISOString'
  },
  {
    id: 'sm-3',
    sourceKey: '$.orders[*].current_total_price',
    targetType: 'Decimal/Currency',
    outputField: 'total_amount_usd',
    transformRule: 'ToDecimal(2, ROUND_HALF_UP)',
    sampleValue: '271.33',
    state: 'valid',
    constraint: 'NUMERIC(12,2) NOT NULL',
    detectedIngressType: 'FloatString'
  },
  {
    id: 'sm-4',
    sourceKey: '$.orders[*].email',
    targetType: 'String',
    outputField: 'customer_email',
    transformRule: 'Lowercase() → MaskPII(SHA256)',
    sampleValue: '"jane.doe@enterprise-retail.com"',
    state: 'masked',
    constraint: 'VARCHAR(255) INDEXED',
    detectedIngressType: 'EmailString'
  },
  {
    id: 'sm-5',
    sourceKey: '$.orders[*].currency',
    targetType: 'Enum',
    outputField: 'currency_code',
    transformRule: 'Uppercase() → ValidateISO4217',
    sampleValue: '"USD"',
    state: 'valid',
    constraint: 'CHAR(3) DEFAULT "USD"',
    detectedIngressType: 'String'
  },
  {
    id: 'sm-6',
    sourceKey: '$.orders[*].financial_status',
    targetType: 'Enum',
    outputField: 'payment_status',
    transformRule: 'MapValues({ paid: "SETTLED", pending: "OPEN" })',
    sampleValue: '"paid" → "SETTLED"',
    state: 'valid',
    constraint: 'VARCHAR(32) NOT NULL',
    detectedIngressType: 'String'
  },
  {
    id: 'sm-7',
    sourceKey: '$.orders[*].fulfillment_status',
    targetType: 'Enum',
    outputField: 'shipping_status',
    transformRule: 'DefaultIfNull("UNFULFILLED")',
    sampleValue: 'null → "UNFULFILLED"',
    state: 'valid',
    constraint: 'VARCHAR(32)',
    detectedIngressType: 'NullableString'
  },
  {
    id: 'sm-8',
    sourceKey: '$.orders[*].line_items.length',
    targetType: 'Computed',
    outputField: 'total_item_count',
    transformRule: 'Count($.orders[*].line_items)',
    sampleValue: '1',
    state: 'computed',
    constraint: 'INT4 CHECK (total_item_count >= 0)',
    detectedIngressType: 'ArrayCount'
  },
  {
    id: 'sm-9',
    sourceKey: '$.orders[*].cart_token',
    targetType: 'String',
    outputField: 'session_cart_token',
    transformRule: 'TrimWhitespace()',
    sampleValue: '"c1-a83f98c21344"',
    state: 'valid',
    constraint: 'VARCHAR(64)',
    detectedIngressType: 'String'
  },
  {
    id: 'sm-10',
    sourceKey: '$.orders[*].checkout_id',
    targetType: 'Integer',
    outputField: 'checkout_ref_id',
    transformRule: 'ToBigInt()',
    sampleValue: '99283411',
    state: 'valid',
    constraint: 'INT8',
    detectedIngressType: 'Int64'
  },
  {
    id: 'sm-11',
    sourceKey: '$.orders[*].customer_locale',
    targetType: 'String',
    outputField: 'buyer_locale',
    transformRule: 'NormalizeLocale()',
    sampleValue: '"en-US"',
    state: 'valid',
    constraint: 'VARCHAR(10)',
    detectedIngressType: 'String'
  },
  {
    id: 'sm-12',
    sourceKey: '$.orders[*].buyer_accepts_marketing',
    targetType: 'Boolean',
    outputField: 'opt_in_marketing',
    transformRule: 'ToBoolean()',
    sampleValue: 'true',
    state: 'valid',
    constraint: 'BOOLEAN DEFAULT FALSE',
    detectedIngressType: 'Boolean'
  },
  {
    id: 'sm-13',
    sourceKey: '$.orders[*].browser_ip',
    targetType: 'String',
    outputField: 'client_ip_hash',
    transformRule: 'Hash(Salt=ENV.IP_SALT)',
    sampleValue: '"192.0.2.1" → "e9c1...481b"',
    state: 'masked',
    constraint: 'VARCHAR(64)',
    detectedIngressType: 'IPAddress'
  },
  {
    id: 'sm-14',
    sourceKey: '$.orders[*].current_total_discounts',
    targetType: 'Decimal/Currency',
    outputField: 'discount_amount_usd',
    transformRule: 'ToDecimal(2)',
    sampleValue: '0.00',
    state: 'valid',
    constraint: 'NUMERIC(10,2)',
    detectedIngressType: 'FloatString'
  },
  {
    id: 'sm-15',
    sourceKey: '$.orders[*].current_total_tax',
    targetType: 'Decimal/Currency',
    outputField: 'tax_amount_usd',
    transformRule: 'ToDecimal(2)',
    sampleValue: '21.83',
    state: 'valid',
    constraint: 'NUMERIC(10,2)',
    detectedIngressType: 'FloatString'
  },
  {
    id: 'sm-16',
    sourceKey: '$.orders[*].app_id',
    targetType: 'Integer',
    outputField: 'channel_app_id',
    transformRule: 'ToInteger()',
    sampleValue: '1354745',
    state: 'valid',
    constraint: 'INT4',
    detectedIngressType: 'Int32'
  },
  {
    id: 'sm-17',
    sourceKey: '$.orders[*].confirmed',
    targetType: 'Boolean',
    outputField: 'is_confirmed',
    transformRule: 'ToBoolean()',
    sampleValue: 'true',
    state: 'valid',
    constraint: 'BOOLEAN',
    detectedIngressType: 'Boolean'
  },
  {
    id: 'sm-18',
    sourceKey: '$.orders[*].admin_graphql_api_id',
    targetType: 'String',
    outputField: 'shopify_gid',
    transformRule: 'DirectCopy()',
    sampleValue: '"gid://shopify/Order/5519827102"',
    state: 'valid',
    constraint: 'VARCHAR(128)',
    detectedIngressType: 'URIString'
  }
];

export const INITIAL_TABULAR_RECORDS: TabularRecord[] = [
  {
    order_id: '5519827102',
    invoice_number: '#14092',
    revenue_amount: '$271.33 USD',
    timestamp: '2025-02-14 14:19:42 UTC',
    customer_email: 'j***e@enterprise-retail.com',
    item_count: 1,
    shipping_state: 'Processing'
  },
  {
    order_id: '5519827101',
    invoice_number: '#14091',
    revenue_amount: '$1,894.00 USD',
    timestamp: '2025-02-14 14:18:11 UTC',
    customer_email: 'm***r@cloudsystems.io',
    item_count: 4,
    shipping_state: 'Fulfilled'
  },
  {
    order_id: '5519827100',
    invoice_number: '#14090',
    revenue_amount: '$84.20 USD',
    timestamp: '2025-02-14 14:15:33 UTC',
    customer_email: 's***h@apexdata.org',
    item_count: 2,
    shipping_state: 'Fulfilled'
  },
  {
    order_id: '5519827099',
    invoice_number: '#14089',
    revenue_amount: '$430.50 USD',
    timestamp: '2025-02-14 14:12:05 UTC',
    customer_email: 'b***n@matrixlogistics.co',
    item_count: 3,
    shipping_state: 'Pending'
  },
  {
    order_id: '5519827098',
    invoice_number: '#14088',
    revenue_amount: '$129.99 USD',
    timestamp: '2025-02-14 14:09:50 UTC',
    customer_email: 'k***l@zenithcorp.net',
    item_count: 1,
    shipping_state: 'Fulfilled'
  },
  {
    order_id: '5519827097',
    invoice_number: '#14087',
    revenue_amount: '$520.00 USD',
    timestamp: '2025-02-14 14:02:18 UTC',
    customer_email: 'a***x@globalventures.us',
    item_count: 2,
    shipping_state: 'Processing'
  }
];

export const RAW_JSON_PAYLOAD_SAMPLE = {
  orders: [
    {
      id: 5519827102,
      admin_graphql_api_id: "gid://shopify/Order/5519827102",
      app_id: 1354745,
      browser_ip: "192.0.2.1",
      buyer_accepts_marketing: true,
      cancel_reason: null,
      cancelled_at: null,
      cart_token: "c1-a83f98c21344",
      checkout_id: 99283411,
      checkout_token: "b9012a9e2f498c118a9947810",
      closed_at: null,
      confirmed: true,
      contact_email: "jane.doe@enterprise-retail.com",
      created_at: "2025-02-14T14:19:42-05:00",
      currency: "USD",
      current_subtotal_price: "249.50",
      current_total_discounts: "0.00",
      current_total_price: "271.33",
      current_total_tax: "21.83",
      customer_locale: "en-US",
      discount_codes: [],
      email: "jane.doe@enterprise-retail.com",
      financial_status: "paid",
      fulfillment_status: "unfulfilled",
      line_items: [
        {
          id: 14092,
          admin_graphql_api_id: "gid://shopify/LineItem/14092",
          fulfillable_quantity: 1,
          fulfillment_service: "manual",
          gift_card: false,
          grams: 450,
          name: "Enterprise Cloud Node v2 - Rack Mount",
          price: "249.50",
          product_exists: true,
          product_id: 884019283,
          quantity: 1,
          requires_shipping: true,
          sku: "ECN-V2-RACK",
          taxable: true,
          title: "Enterprise Cloud Node v2",
          total_discount: "0.00",
          variant_id: 4892019482,
          variant_title: "16-Core / 64GB RAM"
        }
      ],
      shipping_address: {
        first_name: "Jane",
        last_name: "Doe",
        address1: "742 Evergreen Terrace",
        city: "Springfield",
        province: "Oregon",
        country: "United States",
        zip: "97477",
        country_code: "US",
        province_code: "OR"
      },
      tags: "Enterprise, B2B, Priority-Air"
    }
  ]
};

export const CONNECTOR_TEMPLATES: ConnectorTemplate[] = [
  {
    id: 'tpl-shopify',
    title: 'Shopify Admin API',
    version: 'v2024-01',
    category: 'ecommerce',
    description: 'Pull orders, products, inventory changes, and customer transactions via GraphQL and REST Admin APIs with cursor pagination.',
    protocols: ['REST', 'GraphQL', 'Webhooks'],
    avgPoll: '5-15 min',
    rateLimit: '40 calls / 2 req/s refill',
    icon: 'shopping_bag',
    accentColor: '#4edea3',
    defaultEndpoint: 'https://{store_name}.myshopify.com/admin/api/2024-01/orders.json',
    defaultAuth: 'Bearer Token (Custom App Token)',
    defaultName: 'Shopify Store Orders',
    scopes: [
      {
        id: 'sc-1',
        name: 'Orders & Transactions',
        rawScopes: 'read_orders, read_all_orders',
        description: 'Read-only access to customer sales, line items, and fulfillment history.',
        required: true,
        checked: true
      },
      {
        id: 'sc-2',
        name: 'Customer Personally Identifiable Information (PII)',
        rawScopes: 'read_customers',
        description: 'Includes buyer full names, shipping addresses, phone numbers, and emails.',
        badge: 'High Sensitivity PII',
        piiLevel: 'high',
        checked: true
      },
      {
        id: 'sc-3',
        name: 'Inventory & Stock Locations',
        rawScopes: 'read_inventory, read_locations',
        description: 'Track multi-warehouse inventory levels and item replenishment.',
        checked: false
      },
      {
        id: 'sc-4',
        name: 'Fulfillments & Logistics Carrier Data',
        rawScopes: 'read_fulfillments, read_shipping',
        description: 'Inspect tracking numbers, transit events, and customs papers.',
        checked: true
      }
    ]
  },
  {
    id: 'tpl-salesforce',
    title: 'Salesforce CRM Platform',
    version: 'v59.0 REST/SOQL',
    category: 'crm',
    description: 'Synchronize Accounts, Opportunities, Contacts, and custom object records with high-performance bulk query support.',
    protocols: ['SOQL', 'REST', 'Bulk v2'],
    avgPoll: '15-60 min',
    rateLimit: '100k calls / 24h',
    icon: 'cloud_sync',
    accentColor: '#7bd0ff',
    defaultEndpoint: 'https://{instance}.my.salesforce.com/services/data/v59.0/query',
    defaultAuth: 'OAuth 2.0 (PKCE / JWT Bearer)',
    defaultName: 'Salesforce CRM Pipeline',
    scopes: [
      {
        id: 'sf-sc-1',
        name: 'Standard CRM Objects',
        rawScopes: 'api, id',
        description: 'Access Account, Lead, and Opportunity records.',
        required: true,
        checked: true
      },
      {
        id: 'sf-sc-2',
        name: 'Offline Refresh Access',
        rawScopes: 'refresh_token, offline_access',
        description: 'Allows background automated cron synchronization.',
        required: true,
        checked: true
      }
    ]
  },
  {
    id: 'tpl-stripe',
    title: 'Stripe Billing & Ledger',
    version: 'v1 / 2023-10-16',
    category: 'ecommerce',
    description: 'High-frequency transaction streaming, balance changes, invoices, and payment intents with webhook catch-up.',
    protocols: ['REST', 'Event Stream'],
    avgPoll: 'Real-time Webhook',
    rateLimit: '100 req/sec',
    icon: 'credit_card',
    accentColor: '#c0c1ff',
    defaultEndpoint: 'https://api.stripe.com/v1/balance_transactions',
    defaultAuth: 'Restricted Secret Key',
    defaultName: 'Stripe Financial Ledger',
    scopes: [
      {
        id: 'str-sc-1',
        name: 'Charges & Balance Transactions',
        rawScopes: 'rak_charges_read, rak_balance_read',
        description: 'Ingest all settlement ledgers and transaction fees.',
        required: true,
        checked: true
      },
      {
        id: 'str-sc-2',
        name: 'Customer Payment Methods',
        rawScopes: 'rak_customers_read',
        description: 'Masked card brands, expiry years, and customer tokens.',
        checked: true
      }
    ]
  },
  {
    id: 'tpl-zendesk',
    title: 'Zendesk Support Ticketing',
    version: 'v2 Incremental Export',
    category: 'support',
    description: 'Export support tickets, satisfaction scores, ticket comments, and SLA breaches using cursor pagination.',
    protocols: ['REST Incremental'],
    avgPoll: '5-15 min',
    rateLimit: '700 req/min',
    icon: 'headset_mic',
    accentColor: '#ffb4ab',
    defaultEndpoint: 'https://{subdomain}.zendesk.com/api/v2/incremental/tickets.json',
    defaultAuth: 'OAuth 2.0 PKCE',
    defaultName: 'Zendesk Support Tickets',
    scopes: [
      {
        id: 'zn-sc-1',
        name: 'Tickets & Ticket Audits',
        rawScopes: 'read:tickets',
        description: 'Access ticket summaries, priorities, and audit timelines.',
        required: true,
        checked: true
      }
    ]
  },
  {
    id: 'tpl-jira',
    title: 'Jira Cloud / Atlassian',
    version: 'REST v3',
    category: 'devops',
    description: 'Ingest sprints, Epics, user stories, worklogs, and issue changelogs via JQL search pagination.',
    protocols: ['REST', 'JQL'],
    avgPoll: '15-30 min',
    rateLimit: 'Adaptive Rate Limit',
    icon: 'task_alt',
    accentColor: '#7bd0ff',
    defaultEndpoint: 'https://{domain}.atlassian.net/rest/api/3/search',
    defaultAuth: 'Basic (Email + API Token)',
    defaultName: 'Jira Sprint & Issue Sync',
    scopes: [
      {
        id: 'jr-sc-1',
        name: 'Read Jira Project Data',
        rawScopes: 'read:jira-work',
        description: 'Read issues, comments, worklogs, and attachments.',
        required: true,
        checked: true
      }
    ]
  },
  {
    id: 'tpl-custom',
    title: 'Custom Generic REST / GraphQL',
    version: 'Engine v2.4',
    category: 'custom',
    description: 'Connect any proprietary HTTP REST, Webhook, or GraphQL API with custom header injection and pagination logic.',
    protocols: ['REST', 'GraphQL', 'gRPC-Web'],
    avgPoll: 'Configurable',
    rateLimit: 'User Defined',
    icon: 'tune',
    accentColor: '#c0c1ff',
    defaultEndpoint: 'https://api.internal.enterprise.com/v1/stream',
    defaultAuth: 'Custom Injection Header',
    defaultName: 'Enterprise Custom Pipeline',
    scopes: [
      {
        id: 'cu-sc-1',
        name: 'Full Read Access',
        rawScopes: 'read:*',
        description: 'Universal ingestion scope.',
        required: true,
        checked: true
      }
    ]
  }
];
