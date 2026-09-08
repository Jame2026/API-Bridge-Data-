import { BridgePipeline, SyncActivityLog, ConnectorTemplate, SchemaMapping, TabularRecord } from '../types';

/**
 * INITIAL EMPTY STATE
 * No mock data: The application connects purely to your own live project system,
 * APIs, and Supabase database.
 */
export const INITIAL_BRIDGES: BridgePipeline[] = [];

export const INITIAL_LOGS: SyncActivityLog[] = [];

export const INITIAL_SCHEMA_MAPPINGS: SchemaMapping[] = [];

export const INITIAL_TABULAR_RECORDS: TabularRecord[] = [];

export const RAW_JSON_PAYLOAD_SAMPLE: Record<string, any> = {};

export const CONNECTOR_TEMPLATES: ConnectorTemplate[] = [
  {
    id: 'tpl-custom',
    title: 'Custom REST / GraphQL API',
    version: 'Engine v2.4',
    category: 'custom',
    description: 'Connect your own backend application, microservice, internal API, webhook, or GraphQL server.',
    protocols: ['REST', 'GraphQL', 'Webhooks'],
    avgPoll: 'Configurable',
    rateLimit: 'User Defined',
    icon: 'tune',
    accentColor: '#8083ff',
    defaultEndpoint: 'https://api.yourdomain.com/v1/data',
    defaultAuth: 'Bearer Token',
    defaultName: 'My Application Pipeline',
    scopes: [
      {
        id: 'cu-sc-1',
        name: 'Full Read Access',
        rawScopes: 'read:all',
        description: 'Primary data ingestion scope.',
        required: true,
        checked: true
      },
      {
        id: 'cu-sc-2',
        name: 'Incremental Sync Events',
        rawScopes: 'events:read',
        description: 'Capture updated and inserted records since last sync epoch.',
        checked: true
      }
    ]
  },
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
  }
];
