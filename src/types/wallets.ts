export interface Wallet {
  id: string;
  user_id: string;
  account_id: string;
  nostr_pubkey: string;
  nostr_secret: string;
  nostr_relay: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  methods: string[];
}

export interface WalletTransaction {
  amount: number;
  created_at: number;
  description: string;
  fees_paid: number;
  invoice: string;
  payment_hash: string;
  settled_at: number;
  type: string;
}
