import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

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
