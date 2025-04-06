export interface Permission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface CreateAPIKeyType {
  account_id: string;
  name: string;
  permissions: {
    customers: Permission;
    products: Permission;
    subscriptions: Permission;
    payment_links: Permission;
    checkouts: Permission;
    wallets: Permission;
    invoices: Permission;
    webhooks: Permission;
  };
}

export interface APIKey {
  id: number;
  user_id: string;
  account_id: string;
  name: string;
  permissions: {
    customers: Permission;
    products: Permission;
    subscriptions: Permission;
    payment_links: Permission;
    checkouts: Permission;
    wallets: Permission;
    invoices: Permission;
    webhooks: Permission;
  };
  created_at: string;
  updated_at: string;
}
