export interface PaymentLink {
  id: string;
  user_id: string;
  account_id: string;
  product_id: string;
  amount: number;
  currency: string;
  expiry_minutes: number;
  redirect_link: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentLinkType {
  account_id: string;
  product_id?: string;
  amount?: number;
  currency?: string;
  expiry_minutes?: number;
  redirect_link?: string;
}
