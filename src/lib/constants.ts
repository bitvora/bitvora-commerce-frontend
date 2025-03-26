export const app_routes = {
  home: '/',
  login: '/auth/login',
  signup: '/auth/signup',
  forgot_password: '/auth/forgot-password',
  dashboard: '/dashboard',
  products: '/products',
  customers: '/customers',
  subscriptions: '/subscriptions',
  checkouts: '/checkouts',
  payment_links: '/payment-links',
  wallet: '/wallet',
  api_keys: '/api-keys',
  webhooks: '/webhooks'
};

export const api_url = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';
