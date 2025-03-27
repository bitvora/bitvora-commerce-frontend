export interface Account {
  id: string;
  user_id: string;
  name: string;
  logo: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountType {
  name: string;
  logo?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface SessionPayload {
  id: string;
  user_id: string;
  session_token: string;
  logged_in_at: string;
  status: string;
  accounts: Account[];
  activeAccount: string;
}

export interface CurrencyType {
  label: string;
  image: string;
}

export type SalesData = {
  data: {
    total_amount: number;
    total_count: number;
    start_time: string;
    end_time: string;
    data_points: { amount: number; date?: string; month?: string; timestamp?: string }[];
  };
};

export type NewCustomerData = {
  data: {
    total_amount: number;
    total_count: number;
    start_time: string;
    end_time: string;
    data_points: { amount: number; date?: string; month?: string; timestamp?: string }[];
  };
};
