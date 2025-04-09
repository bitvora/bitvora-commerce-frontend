export interface RateObject {
  aud: number;
  cad: number;
  chf: number;
  cny: number;
  eur: number;
  gbp: number;
  hkd: number;
  jpy: number;
  nzd: number;
  usd: number;
}

export interface Rates {
  rates: RateObject;
  updated_at: string;
}

export type CheckoutType = 'single' | 'subscription';

export type CheckoutState =
  | 'open'
  | 'paid'
  | 'pending_confirmation'
  | 'underpaid'
  | 'overpaid'
  | 'expired';

export interface Checkout {
  id: string;
  user_id: string;
  account_id: string;
  type: CheckoutType;
  state: CheckoutState;
  amount: number;
  received_amount: number;
  redirect_url: string;
  rates: Rates;
  expires_at: string;
  created_at: string;
  updated_at: string;
  customer_id?: string;
  product_id?: string;
  metadata?: Record<string, unknown>;
  items?: Record<string, unknown>;
  currency: string;
  bitcoin_address?: string;
  lightning_invoice?: string;
}

export interface CreateCheckoutType {
  account_id: string;
  customer_id?: string;
  subscription_id?: string;
  product_id?: string;
  type: CheckoutType;
  amount: number;
  currency: string;
  redirect_url?: string;
  metadata?: Record<string, unknown>;
  items?: Record<string, unknown>;
  expiry_minutes: number;
}
