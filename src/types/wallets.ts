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
  description_hash: string;
  expires_at: number;
  fees_paid: number;
  invoice: string;
  metadata: {
    creation_date: string;
    creation_time_ns: string;
    failure_reason: string;
    fee: string;
    fee_msat: string;
    fee_sat: string;
    htlcs: {
      attempt_id: string;
      attempt_time_ns: string;
      failure: {
        channel_update: {
          base_fee: number;
          chain_hash: string;
          chan_id: string;
          channel_flags: number;
          extra_opaque_data: string;
          fee_rate: number;
          htlc_maximum_msat: string;
          htlc_minimum_msat: string;
          message_flags: number;
          signature: string;
          time_lock_delta: number;
          timestamp: number;
        };
        cltv_expiry: number;
        code: string;
        failure_source_index: number;
        flags: number;
        height: number;
        htlc_msat: string;
        onion_sha_256: string;
      };
      preimage: string;
      resolve_time_ns: string;
      route: {
        hops: {
          amt_to: string;
          amt_to_forward: string;
          chan_capacity: string;
          chan_id: string;
          expiry: number;
        }[];
        total_amt: string;
        total_fees: string;
        total_fees_msat: string;
        total_time_lock: number;
      };
      status: string;
    }[];
    payment_hash: string;
    payment_index: string;
    payment_preimage: string;
    payment_request: string;
    status: string;
    value: string;
    value_msat: string;
    value_sat: string;
  };
  payment_hash: string;
  preimage: string;
  settled_at: number;
  type: string;
}
