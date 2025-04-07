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
