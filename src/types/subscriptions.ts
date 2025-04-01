export interface Subscription {
  id: string;
  user_id: string;
  account_id: string;
  customer_id: string;
  product_id: string;
  billing_start_date: string;
  active_on_date: string;
  status: SubscriptionStatus;
  next_billing_date: string;
  failed_payment_attempts: number;
  billing_interval_hours: number;
  metadata: {
    notes: string;
    additional_info: string;
  };
  nostr_relay: string;
  nostr_pubkey: string;
  nostr_secret: string;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled';
