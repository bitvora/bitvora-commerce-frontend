import { CurrencyType } from '@/lib/types';

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
  webhooks: '/webhooks',
  profile: '/profile'
};

export const api_url = process.env.NEXT_PUBLIC_API_URL || 'https://api.commerce.bitvora.com';

export const currencies: CurrencyType[] = [
  { label: 'SATS', image: '/currencies/sats.svg' },
  { label: 'BTC', image: '/currencies/btc.svg' },
  { label: 'USD', image: '/currencies/usd.svg' },
  { label: 'EUR', image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/EU.svg' },
  { label: 'GBP', image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg' },
  { label: 'JPY', image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg' },
  { label: 'CAD', image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/CA.svg' },
  { label: 'AUD', image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/AU.svg' },
  { label: 'CNY', image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg' },
  { label: 'ETH', image: '/currencies/eth.jpg' }
];
