import { webhook_events } from '@/lib/constants';

export interface Webhook {
  id: string;
  user_id: string;
  account_id: string;
  url: string;
  description: string;
  enabled: boolean;
  events: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookType {
  account_id: string;
  url: string;
  description: string;
  events: string[];
}

export type WebhookEvent = (typeof webhook_events)[number];

export type WebhookDeliveryStatusType = 'pending' | 'successful' | 'failed';

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: WebhookEvent;
  status: WebhookDeliveryStatusType;
  request_payload: Record<string, unknown>;
  response_body: string;
  response_status_code: number;
  duration_ms: number;
  error_message: string;
  created_at: string;
  updated_at: string;
}

export interface NewWebhook{
  secret: string;
  webhook: {
    id: string;
    user_id: string;
    account_id: string;
    url: string;
    description: string;
    secret: string;
    enabled: boolean;
    events: string[];
    created_at: string;
    updated_at: string;
  };
}
