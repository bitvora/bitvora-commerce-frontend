export interface Customer {
  id: string;
  user_id: string;
  account_id: string;
  name: string;
  email: string;
  description: string;
  billing_address_line1: string;
  billing_address_line2?: string;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_country: string;
  shipping_address_line1: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  phone_number: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerType {
  account_id: string;
  name: string;
  email: string;
  description: string;
  billing_address_line1: string;
  billing_address_line2: string;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_country: string;
  shipping_address_line1: string;
  shipping_address_line2?: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  phone_number: string;
  currency: string;
}
