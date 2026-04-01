// Ziz — Complete Type System

export type Plan = 'FREE' | 'PRO' | 'BUSINESS'

export const PLAN_LIMITS: Record<Plan, { runsPerMonth: number; label: string; price: number }> = {
  FREE:     { runsPerMonth: 100,     label: 'Free',     price: 0  },
  PRO:      { runsPerMonth: 10000,   label: 'Pro',      price: 29 },
  BUSINESS: { runsPerMonth: Infinity, label: 'Business', price: 99 },
}

// ── WORKFLOW ─────────────────────────────────────────────────────────

export interface WorkflowDefinition {
  id:          string
  name:        string
  description: string
  version:     number
  trigger:     TriggerNode
  steps:       StepNode[]
  settings:    WorkflowSettings
}

export interface WorkflowSettings {
  retryOnFailure:  boolean
  maxRetries:      number
  retryDelayMs:    number
  timeoutMs:       number
  continueOnError: boolean
}

// ── TRIGGERS ─────────────────────────────────────────────────────────

export type TriggerType =
  | 'manual'
  | 'schedule'
  | 'webhook_inbound'
  | 'stripe_payment_success'
  | 'stripe_subscription_created'
  | 'stripe_subscription_cancelled'
  | 'gmail_new_email'
  | 'gmail_label_added'
  | 'hubspot_new_contact'
  | 'hubspot_deal_created'
  | 'typeform_submission'
  | 'airtable_new_record'
  | 'whatsapp_message'
  | 'telegram_message'
  | 'shopify_new_order'
  | 'woocommerce_new_order'
  | 'calendly_event_scheduled'
  | 'github_push'
  | 'github_pr_opened'
  | 'jira_issue_created'

export interface TriggerNode {
  id:           string
  type:         TriggerType
  name:         string
  description:  string
  credentialId?: string
  config:       Record<string, unknown>
  outputSchema: OutputField[]
}

// ── STEPS ─────────────────────────────────────────────────────────────

export type StepType =
  // Messaging
  | 'slack_send_message'
  | 'slack_create_channel'
  | 'slack_invite_user'
  | 'gmail_send_email'
  | 'gmail_reply'
  | 'gmail_label_email'
  | 'outlook_send_email'
  | 'whatsapp_send_message'
  | 'telegram_send_message'
  | 'sms_send'
  // Data
  | 'google_sheets_append_row'
  | 'google_sheets_update_row'
  | 'google_sheets_find_row'
  | 'airtable_create_record'
  | 'airtable_update_record'
  | 'airtable_find_record'
  | 'notion_create_page'
  | 'notion_update_page'
  | 'notion_find_page'
  | 'mysql_query'
  | 'postgres_query'
  // CRM
  | 'hubspot_create_contact'
  | 'hubspot_update_contact'
  | 'hubspot_create_deal'
  | 'hubspot_create_task'
  | 'salesforce_create_lead'
  | 'salesforce_update_record'
  | 'pipedrive_create_person'
  // Payments
  | 'stripe_create_invoice'
  | 'stripe_send_payment_link'
  | 'stripe_refund'
  | 'paypal_send_invoice'
  // Project Management
  | 'jira_create_issue'
  | 'jira_update_issue'
  | 'linear_create_issue'
  | 'asana_create_task'
  | 'trello_create_card'
  | 'clickup_create_task'
  // Marketing
  | 'mailchimp_add_subscriber'
  | 'mailchimp_send_campaign'
  | 'sendgrid_send_email'
  | 'convertkit_add_subscriber'
  // Storage
  | 'google_drive_upload'
  | 'dropbox_upload'
  | 's3_upload'
  // Communication
  | 'zoom_create_meeting'
  | 'calendly_create_link'
  | 'intercom_create_contact'
  | 'zendesk_create_ticket'
  // E-commerce
  | 'shopify_create_order'
  | 'shopify_update_product'
  // HTTP & Custom
  | 'http_request'
  | 'webhook_outbound'
  | 'graphql_request'
  // Logic
  | 'filter'
  | 'branch'
  | 'loop'
  | 'delay'
  | 'format_text'
  | 'transform_data'
  | 'merge_data'
  // AI
  | 'ai_agent'
  | 'ai_transform'
  | 'ai_classify'
  | 'ai_extract'
  | 'ai_summarize'
  | 'ai_translate'

export interface StepNode {
  id:              string
  type:            StepType
  name:            string
  description:     string
  credentialId?:   string
  config:          Record<string, unknown>
  inputMapping:    InputMapping[]
  outputSchema:    OutputField[]
  retryOnFailure?: boolean
  continueOnError?:boolean
}

export interface InputMapping {
  targetField: string
  value:       string
}

export interface OutputField {
  key:         string
  type:        'string' | 'number' | 'boolean' | 'object' | 'array'
  description: string
  example?:    unknown
}

// ── CONNECTORS CATALOG ───────────────────────────────────────────────

export interface ConnectorDefinition {
  id:          string
  name:        string
  description: string
  category:    ConnectorCategory
  icon:        string   // emoji
  color:       string   // hex bg color
  authType:    'api_key' | 'oauth2' | 'service_account' | 'webhook_secret' | 'none'
  fields:      CredentialField[]
  triggers:    TriggerType[]
  actions:     StepType[]
  docsUrl?:    string
  popular:     boolean
}

export type ConnectorCategory =
  | 'messaging'
  | 'email'
  | 'crm'
  | 'data'
  | 'payments'
  | 'project_management'
  | 'marketing'
  | 'storage'
  | 'communication'
  | 'ecommerce'
  | 'ai'
  | 'developer'
  | 'hr'

export interface CredentialField {
  key:          string
  label:        string
  type:         'text' | 'password' | 'url' | 'textarea' | 'select'
  required:     boolean
  placeholder?: string
  help?:        string
  helpUrl?:     string
  options?:     { label: string; value: string }[]
}

// ── EXECUTION ────────────────────────────────────────────────────────

export interface StepResult {
  stepId:     string
  stepName:   string
  status:     'success' | 'failed' | 'skipped'
  startedAt:  Date
  finishedAt: Date
  durationMs: number
  output?:    Record<string, unknown>
  error?:     { message: string; technicalMessage: string }
  retryCount: number
}

export interface ExecutionContext {
  trigger: Record<string, unknown>
  steps:   Record<string, Record<string, unknown>>
}

// ── CHAT ─────────────────────────────────────────────────────────────

export interface ChatMessage {
  role:               'user' | 'assistant'
  content:            string
  workflowDraft?:     WorkflowDefinition
  credentialRequest?: { service: string; helpSteps: string[]; helpUrl?: string }
  timestamp:          string
}

export interface ClaudeResponse {
  type:          'question' | 'credential_request' | 'workflow' | 'suggestions' | 'error'
  message:       string
  workflow?:     WorkflowDefinition
  service?:      string
  helpSteps?:    string[]
  helpUrl?:      string
  suggestions?:  Array<{ id: string; name: string; description: string; trigger: string }>
}
