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
    total_count: number;
    start_date: string;
    end_date: string;
    data_points: {
      date: string;
      count: number;
      day_of_week: number;
      day_of_month: number;
      month: number;
      year: number;
    }[];
  };
};

export type ActiveSubscribersData = {
  data: {
    total_count: number;
    start_date: string;
    end_date: string;
    data_points: {
      date: string;
      count: number;
      day_of_week: number;
      day_of_month: number;
      month: number;
      year: number;
    }[];
  };
};

export type MRRData = {
  data: {
    total_amount: number;
    total_count: number;
    start_time: string;
    end_time: string;
    start_month?: string;
    end_month?: string;
    data_points: {
      timestamp?: string;
      amount: number;
      count: number;
      day_of_week: number;
      day_of_month: number;
      month: number;
      year: number;
      date?: string;
      month_name?: string;
      month_num?: number;
    }[];
  };
};

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface Product {
  id: string;
  user_id: string;
  account_id: string;
  name: string;
  description: string;
  image: string;
  is_recurring: boolean;
  amount: number;
  currency: string;
  billing_period_hours: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductType {
  account_id: string;
  name: string;
  description: string;
  image: string;
  is_recurring: boolean;
  amount: number;
  currency: string;
  billing_period_hours?: number;
}
