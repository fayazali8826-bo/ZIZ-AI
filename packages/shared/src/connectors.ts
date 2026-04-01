import type { ConnectorDefinition } from './types'

export const CONNECTORS: ConnectorDefinition[] = [
  // ── MESSAGING ────────────────────────────────────────────────────
  {
    id: 'slack', name: 'Slack', category: 'messaging', icon: 'SL',
    color: '#4A154B', popular: true,
    description: 'Send messages to channels and users, create channels, manage your workspace',
    authType: 'api_key',
    fields: [
      { key: 'botToken', label: 'Bot Token', type: 'password', required: true,
        placeholder: 'xoxb-...', help: 'api.slack.com/apps → OAuth & Permissions → Bot User OAuth Token',
        helpUrl: 'https://api.slack.com/apps' },
    ],
    triggers: [], actions: ['slack_send_message', 'slack_create_channel', 'slack_invite_user'],
    docsUrl: 'https://api.slack.com',
  },
  {
    id: 'whatsapp', name: 'WhatsApp Business', category: 'messaging', icon: 'WA',
    color: '#25D366', popular: true,
    description: 'Send and receive WhatsApp messages via Meta Business API',
    authType: 'api_key',
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true,
        help: 'Meta Business Suite → WhatsApp → API Setup → Permanent Token',
        helpUrl: 'https://developers.facebook.com/apps' },
      { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text', required: true,
        help: 'Meta Developer Portal → Your App → WhatsApp → API Setup → Phone Number ID' },
    ],
    triggers: ['whatsapp_message'], actions: ['whatsapp_send_message'],
  },
  {
    id: 'telegram', name: 'Telegram', category: 'messaging', icon: 'TG',
    color: '#2CA5E0', popular: false,
    description: 'Send messages and handle commands via Telegram bots',
    authType: 'api_key',
    fields: [
      { key: 'botToken', label: 'Bot Token', type: 'password', required: true,
        placeholder: '123456:ABC-DEF...', help: 'Open Telegram → @BotFather → /newbot → copy token',
        helpUrl: 'https://t.me/BotFather' },
      { key: 'defaultChatId', label: 'Default Chat ID', type: 'text', required: false,
        help: 'Forward a message to @userinfobot to get the chat ID' },
    ],
    triggers: ['telegram_message'], actions: ['telegram_send_message'],
  },
  // ── EMAIL ────────────────────────────────────────────────────────
  {
    id: 'gmail', name: 'Gmail', category: 'email', icon: 'GM',
    color: '#EA4335', popular: true,
    description: 'Send and read emails, manage labels, reply to threads via Gmail',
    authType: 'service_account',
    fields: [
      { key: 'serviceAccountJson', label: 'Service Account JSON', type: 'textarea', required: true,
        placeholder: '{"type":"service_account",...}',
        help: 'Google Cloud Console → IAM → Service Accounts → Create Key (JSON) → Enable Domain-Wide Delegation',
        helpUrl: 'https://console.cloud.google.com/iam-admin/serviceaccounts' },
      { key: 'delegatedEmail', label: 'Gmail Address (Send As)', type: 'text', required: true,
        placeholder: 'you@yourdomain.com', help: 'The Gmail address emails will be sent from' },
    ],
    triggers: ['gmail_new_email', 'gmail_label_added'],
    actions: ['gmail_send_email', 'gmail_reply', 'gmail_label_email'],
  },
  {
    id: 'sendgrid', name: 'SendGrid', category: 'email', icon: 'SG',
    color: '#1A82E2', popular: false,
    description: 'Send transactional and marketing emails at scale via SendGrid',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true,
        placeholder: 'SG.xxx', help: 'SendGrid → Settings → API Keys → Create API Key',
        helpUrl: 'https://app.sendgrid.com/settings/api_keys' },
      { key: 'fromEmail', label: 'From Email', type: 'text', required: true, placeholder: 'you@domain.com' },
      { key: 'fromName', label: 'From Name', type: 'text', required: false, placeholder: 'Your Company' },
    ],
    triggers: [], actions: ['sendgrid_send_email'],
  },
  // ── CRM ──────────────────────────────────────────────────────────
  {
    id: 'hubspot', name: 'HubSpot', category: 'crm', icon: 'HS',
    color: '#FF7A59', popular: true,
    description: 'Create and update contacts, deals, companies. Log activities and tasks.',
    authType: 'api_key',
    fields: [
      { key: 'accessToken', label: 'Private App Token', type: 'password', required: true,
        placeholder: 'pat-na1-...', help: 'HubSpot → Settings → Integrations → Private Apps → Create app → copy token',
        helpUrl: 'https://app.hubspot.com/private-apps' },
    ],
    triggers: ['hubspot_new_contact', 'hubspot_deal_created'],
    actions: ['hubspot_create_contact', 'hubspot_update_contact', 'hubspot_create_deal', 'hubspot_create_task'],
  },
  {
    id: 'salesforce', name: 'Salesforce', category: 'crm', icon: 'SF',
    color: '#00A1E0', popular: false,
    description: 'Create and update Salesforce leads, contacts, opportunities and records',
    authType: 'oauth2',
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
      { key: 'instanceUrl', label: 'Instance URL', type: 'url', required: true, placeholder: 'https://yourorg.salesforce.com' },
    ],
    triggers: [], actions: ['salesforce_create_lead', 'salesforce_update_record'],
  },
  {
    id: 'pipedrive', name: 'Pipedrive', category: 'crm', icon: 'PD',
    color: '#1A1F36', popular: false,
    description: 'Manage your sales pipeline — create persons, deals, activities',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'API Token', type: 'password', required: true,
        help: 'Pipedrive → Settings → Personal Preferences → API → copy token',
        helpUrl: 'https://app.pipedrive.com/settings/api' },
    ],
    triggers: [], actions: ['pipedrive_create_person'],
  },
  // ── DATA ─────────────────────────────────────────────────────────
  {
    id: 'google_sheets', name: 'Google Sheets', category: 'data', icon: 'GS',
    color: '#0F9D58', popular: true,
    description: 'Append, update, and read rows from Google Sheets spreadsheets',
    authType: 'service_account',
    fields: [
      { key: 'serviceAccountJson', label: 'Service Account JSON', type: 'textarea', required: true,
        help: 'Same service account as Gmail. Share your spreadsheet with the service account email.',
        helpUrl: 'https://console.cloud.google.com/iam-admin/serviceaccounts' },
    ],
    triggers: [], actions: ['google_sheets_append_row', 'google_sheets_update_row', 'google_sheets_find_row'],
  },
  {
    id: 'airtable', name: 'Airtable', category: 'data', icon: 'AT',
    color: '#FCB400', popular: true,
    description: 'Create, update, and search records in Airtable databases',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'Personal Access Token', type: 'password', required: true,
        placeholder: 'patXXXX...', help: 'airtable.com/create/tokens → Create token with data.records scopes',
        helpUrl: 'https://airtable.com/create/tokens' },
    ],
    triggers: ['airtable_new_record'], actions: ['airtable_create_record', 'airtable_update_record', 'airtable_find_record'],
  },
  {
    id: 'notion', name: 'Notion', category: 'data', icon: 'NT',
    color: '#000000', popular: true,
    description: 'Create and update pages in Notion databases',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'Integration Token', type: 'password', required: true,
        placeholder: 'secret_...', help: 'notion.so/my-integrations → New Integration → copy token. Share your database with the integration.',
        helpUrl: 'https://www.notion.so/my-integrations' },
    ],
    triggers: [], actions: ['notion_create_page', 'notion_update_page', 'notion_find_page'],
  },
  // ── PAYMENTS ─────────────────────────────────────────────────────
  {
    id: 'stripe', name: 'Stripe', category: 'payments', icon: 'ST',
    color: '#635BFF', popular: true,
    description: 'Trigger on payments, create invoices, send payment links, process refunds',
    authType: 'api_key',
    fields: [
      { key: 'secretKey', label: 'Secret Key', type: 'password', required: true,
        placeholder: 'sk_live_...', help: 'Stripe Dashboard → Developers → API Keys → Secret key',
        helpUrl: 'https://dashboard.stripe.com/apikeys' },
      { key: 'webhookSecret', label: 'Webhook Secret', type: 'password', required: false,
        placeholder: 'whsec_...', help: 'Stripe → Developers → Webhooks → Add endpoint → copy signing secret' },
    ],
    triggers: ['stripe_payment_success', 'stripe_subscription_created', 'stripe_subscription_cancelled'],
    actions: ['stripe_create_invoice', 'stripe_send_payment_link', 'stripe_refund'],
  },
  {
    id: 'paypal', name: 'PayPal', category: 'payments', icon: 'PP',
    color: '#003087', popular: false,
    description: 'Send invoices and payment requests via PayPal',
    authType: 'oauth2',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true, helpUrl: 'https://developer.paypal.com/dashboard/' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'mode', label: 'Mode', type: 'select', required: true, options: [{ label: 'Live', value: 'live' }, { label: 'Sandbox', value: 'sandbox' }] },
    ],
    triggers: [], actions: ['paypal_send_invoice'],
  },
  // ── PROJECT MANAGEMENT ───────────────────────────────────────────
  {
    id: 'jira', name: 'Jira', category: 'project_management', icon: 'JR',
    color: '#0052CC', popular: false,
    description: 'Create and update issues, track sprints and projects in Jira',
    authType: 'api_key',
    fields: [
      { key: 'email', label: 'Jira Email', type: 'text', required: true, placeholder: 'you@company.com' },
      { key: 'apiToken', label: 'API Token', type: 'password', required: true,
        help: 'id.atlassian.com/manage-profile/security/api-tokens → Create token',
        helpUrl: 'https://id.atlassian.com/manage-profile/security/api-tokens' },
      { key: 'domain', label: 'Jira Domain', type: 'text', required: true, placeholder: 'yourcompany.atlassian.net' },
    ],
    triggers: ['jira_issue_created'], actions: ['jira_create_issue', 'jira_update_issue'],
  },
  {
    id: 'linear', name: 'Linear', category: 'project_management', icon: 'LN',
    color: '#5E6AD2', popular: false,
    description: 'Create and update issues in Linear',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true,
        help: 'Linear → Settings → API → Personal API Keys → Create key',
        helpUrl: 'https://linear.app/settings/api' },
    ],
    triggers: [], actions: ['linear_create_issue'],
  },
  {
    id: 'asana', name: 'Asana', category: 'project_management', icon: 'AS',
    color: '#FC636B', popular: false,
    description: 'Create tasks and projects in Asana',
    authType: 'api_key',
    fields: [
      { key: 'accessToken', label: 'Personal Access Token', type: 'password', required: true,
        help: 'app.asana.com → My Profile → Apps → Manage Developer Apps → Create token',
        helpUrl: 'https://app.asana.com/0/my-apps' },
    ],
    triggers: [], actions: ['asana_create_task'],
  },
  {
    id: 'trello', name: 'Trello', category: 'project_management', icon: 'TR',
    color: '#0079BF', popular: false,
    description: 'Create cards and manage boards in Trello',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'text', required: true, helpUrl: 'https://trello.com/app-key' },
      { key: 'apiToken', label: 'API Token', type: 'password', required: true },
    ],
    triggers: [], actions: ['trello_create_card'],
  },
  // ── MARKETING ────────────────────────────────────────────────────
  {
    id: 'mailchimp', name: 'Mailchimp', category: 'marketing', icon: 'MC',
    color: '#FFE01B', popular: false,
    description: 'Add subscribers and send campaigns via Mailchimp',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true,
        help: 'Mailchimp → Account → Extras → API Keys → Create A Key',
        helpUrl: 'https://us1.admin.mailchimp.com/account/api/' },
      { key: 'serverPrefix', label: 'Server Prefix', type: 'text', required: true,
        placeholder: 'us1', help: 'Last part of your Mailchimp API endpoint URL (e.g. us1, us6)' },
    ],
    triggers: [], actions: ['mailchimp_add_subscriber'],
  },
  {
    id: 'convertkit', name: 'ConvertKit', category: 'marketing', icon: 'CK',
    color: '#FB6970', popular: false,
    description: 'Add subscribers and manage sequences in ConvertKit',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true,
        helpUrl: 'https://app.convertkit.com/account_settings/advanced_settings' },
    ],
    triggers: [], actions: ['convertkit_add_subscriber'],
  },
  // ── STORAGE ──────────────────────────────────────────────────────
  {
    id: 'google_drive', name: 'Google Drive', category: 'storage', icon: 'GD',
    color: '#4285F4', popular: false,
    description: 'Upload and manage files in Google Drive',
    authType: 'service_account',
    fields: [
      { key: 'serviceAccountJson', label: 'Service Account JSON', type: 'textarea', required: true,
        helpUrl: 'https://console.cloud.google.com/iam-admin/serviceaccounts' },
    ],
    triggers: [], actions: ['google_drive_upload'],
  },
  // ── COMMUNICATION ────────────────────────────────────────────────
  {
    id: 'zoom', name: 'Zoom', category: 'communication', icon: 'ZM',
    color: '#2D8CFF', popular: false,
    description: 'Create and manage Zoom meetings',
    authType: 'oauth2',
    fields: [
      { key: 'accountId', label: 'Account ID', type: 'text', required: true, helpUrl: 'https://marketplace.zoom.us/' },
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
    ],
    triggers: [], actions: ['zoom_create_meeting'],
  },
  {
    id: 'intercom', name: 'Intercom', category: 'communication', icon: 'IC',
    color: '#1F8DED', popular: false,
    description: 'Create contacts and conversations in Intercom',
    authType: 'api_key',
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true,
        helpUrl: 'https://app.intercom.com/a/apps/_/developer-hub' },
    ],
    triggers: [], actions: ['intercom_create_contact'],
  },
  {
    id: 'zendesk', name: 'Zendesk', category: 'communication', icon: 'ZD',
    color: '#03363D', popular: false,
    description: 'Create and update support tickets in Zendesk',
    authType: 'api_key',
    fields: [
      { key: 'email', label: 'Email', type: 'text', required: true },
      { key: 'apiToken', label: 'API Token', type: 'password', required: true,
        helpUrl: 'https://support.zendesk.com/hc/en-us/articles/4408889192858' },
      { key: 'subdomain', label: 'Subdomain', type: 'text', required: true, placeholder: 'yourcompany' },
    ],
    triggers: [], actions: ['zendesk_create_ticket'],
  },
  // ── E-COMMERCE ───────────────────────────────────────────────────
  {
    id: 'shopify', name: 'Shopify', category: 'ecommerce', icon: 'SH',
    color: '#96BF48', popular: false,
    description: 'Trigger on new orders, manage products and customers',
    authType: 'api_key',
    fields: [
      { key: 'shopDomain', label: 'Shop Domain', type: 'text', required: true, placeholder: 'yourstore.myshopify.com' },
      { key: 'accessToken', label: 'Admin API Token', type: 'password', required: true,
        help: 'Shopify Admin → Apps → Develop apps → Create app → Admin API access token',
        helpUrl: 'https://help.shopify.com/en/manual/apps/private-apps' },
    ],
    triggers: ['shopify_new_order'], actions: ['shopify_create_order', 'shopify_update_product'],
  },
  // ── FORMS ────────────────────────────────────────────────────────
  {
    id: 'typeform', name: 'Typeform', category: 'developer', icon: 'TF',
    color: '#262627', popular: true,
    description: 'Trigger workflows when Typeform forms are submitted',
    authType: 'api_key',
    fields: [
      { key: 'accessToken', label: 'Personal Access Token', type: 'password', required: true,
        helpUrl: 'https://admin.typeform.com/account#/section/tokens' },
    ],
    triggers: ['typeform_submission'], actions: [],
  },
  // ── DEVELOPER / CUSTOM ───────────────────────────────────────────
  {
    id: 'webhook', name: 'Webhook', category: 'developer', icon: 'WH',
    color: '#1a1a2e', popular: true,
    description: 'Receive data from any source and trigger workflows with webhooks',
    authType: 'webhook_secret',
    fields: [
      { key: 'secret', label: 'Webhook Secret (optional)', type: 'password', required: false,
        help: 'If set, incoming requests must include X-Webhook-Secret header' },
    ],
    triggers: ['webhook_inbound'], actions: ['webhook_outbound'],
  },
  {
    id: 'http', name: 'HTTP Request', category: 'developer', icon: 'HT',
    color: '#0d1833', popular: true,
    description: 'Make GET, POST, PUT, DELETE requests to any REST API or endpoint',
    authType: 'api_key',
    fields: [
      { key: 'baseUrl', label: 'Base URL (optional)', type: 'url', required: false, placeholder: 'https://api.example.com' },
      { key: 'apiKey', label: 'API Key (optional)', type: 'password', required: false },
      { key: 'authHeader', label: 'Auth Header Name', type: 'text', required: false, placeholder: 'Authorization' },
    ],
    triggers: [], actions: ['http_request', 'graphql_request'],
  },
  {
    id: 'github', name: 'GitHub', category: 'developer', icon: 'GH',
    color: '#24292e', popular: false,
    description: 'Trigger on push events, pull requests, and issues in GitHub repositories',
    authType: 'api_key',
    fields: [
      { key: 'accessToken', label: 'Personal Access Token', type: 'password', required: true,
        help: 'GitHub → Settings → Developer settings → Personal access tokens → Generate new token',
        helpUrl: 'https://github.com/settings/tokens' },
    ],
    triggers: ['github_push', 'github_pr_opened'], actions: [],
  },
  // ── AI ───────────────────────────────────────────────────────────
  {
    id: 'ai', name: 'AI by Ziz', category: 'ai', icon: 'AI',
    color: '#1a0d2a', popular: true,
    description: 'Autonomous AI agent, text transformation, classification, extraction, translation, and summarization powered by Claude',
    authType: 'none',
    fields: [],
    triggers: [], actions: ['ai_agent', 'ai_transform', 'ai_classify', 'ai_extract', 'ai_summarize', 'ai_translate'],
  },
]

export const CONNECTOR_BY_ID = Object.fromEntries(CONNECTORS.map(c => [c.id, c]))
export const POPULAR_CONNECTORS = CONNECTORS.filter(c => c.popular)

export function getConnectorForStepType(stepType: string): ConnectorDefinition | undefined {
  return CONNECTORS.find(c => c.actions.includes(stepType as any) || c.triggers.includes(stepType as any))
}

export function getConnectorIcon(serviceId: string): { icon: string; color: string } {
  const c = CONNECTOR_BY_ID[serviceId]
  return c ? { icon: c.icon, color: c.color } : { icon: 'ZZ', color: '#1a1a2e' }
}
