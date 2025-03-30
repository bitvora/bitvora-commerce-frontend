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
  { label: 'SATS', value: 'sats', image: '/currencies/sats.svg' },
  { label: 'BTC', image: '/currencies/btc.svg', value: 'btc' },
  { label: 'USD', image: '/currencies/usd.svg', value: 'usd' },
  {
    label: 'EUR',
    image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/EU.svg',
    value: 'eur'
  },
  {
    label: 'GBP',
    image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg',
    value: 'gbp'
  },
  {
    label: 'JPY',
    image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/JP.svg',
    value: 'jpy'
  },
  {
    label: 'CAD',
    image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/CA.svg',
    value: 'cad'
  },
  {
    label: 'AUD',
    image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/AU.svg',
    value: 'aud'
  },
  {
    label: 'CNY',
    image: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/CN.svg',
    value: 'cny'
  },
  { label: 'ETH', image: '/currencies/eth.jpg', value: 'etc' }
];

export const graph_periods = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  {
    label: '6M',
    value: '6M'
  },
  { label: '1Y', value: '1Y' }
];

export const billing_period_hours = [
  {
    label: 'Weekly',
    value: 168
  },
  {
    label: 'Monthly',
    value: 720
  },
  {
    label: 'Yearly',
    value: 8760
  }
];
