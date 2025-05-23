import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import numeral from 'numeral';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getSessionFromServer } from '@/lib/session';

dayjs.extend(relativeTime);

export const formatDate = (date: string, format = 'MMM DD, YYYY hh:mm a'): string =>
  dayjs(date).format(format);

export const formatUUID = (uuid: string, length = 8): string =>
  uuid ? uuid.slice(0, length) : uuid;

export const getPastDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date.toISOString(), 'YYYY-MM-DD');
};

export const getPastMonth = (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return formatDate(date.toISOString(), 'YYYY-MM-DD');
};

export const formatWithCommas = (num: string) => {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const renderPrice = ({ amount, currency }: { amount: number; currency?: string }) => {
  let price;

  switch (currency) {
    case 'sats':
      price = `${numeral(amount).format('0,0')} sats`;
      break;

    case 'btc':
      price = `${numeral(amount).format('0,0.0000000')} btc`;
      break;

    case 'eur':
      price = `€ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'gbp':
      price = `£ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'jpy':
      price = `¥ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'cad':
      price = `CA$ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'aud':
      price = `AU$ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'cny':
      price = `CN¥ ${numeral(amount).format('0,0.00')}`;
      break;

    case 'eth':
      price = `${numeral(amount).format('0,0.0000000')} eth`;
      break;

    case 'usd':
    default:
      price = `$ ${numeral(amount).format('0,0.00')}`;
  }

  return price;
};

export const countNonEmptyFields = <T extends Record<string, unknown>>(
  values: T,
  fieldsToCheck: (keyof T)[]
) => {
  const totalFields = fieldsToCheck.length;

  const nonEmptyFields = fieldsToCheck.filter(
    (key) => values[key] !== '' && values[key] !== null
  ).length;

  return { totalFields, nonEmptyFields };
};

export const copyToClipboard = ({
  text,
  alertMessage = 'Copied to clip board'
}: {
  text: string;
  alertMessage?: string;
}) => {
  window.navigator.clipboard.writeText(text);
  toast(alertMessage);
};

export const pasteToClipboard = async ({ callback }: { callback: (text: string) => void }) => {
  const text = await navigator.clipboard.readText();
  callback(text);
};

export const formatKeyName = (key: string) => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const countTruePermissions = (obj) => {
  let trueCount = 0;

  for (const key in obj) {
    for (const perm in obj[key]) {
      if (obj[key][perm] === true) {
        trueCount++;
      }
    }
  }

  return trueCount;
};

export function formatSnakeCaseToTitle(str: string): string {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const generateCheckoutLink = (id: string) => `${process.env.NEXT_PUBLIC_APP_URL}/c/${id}`;

export const generatePaymentLink = (id: string) => `${process.env.NEXT_PUBLIC_APP_URL}/p/${id}`;

export const generateProductLink = (id: string) =>
  `${process.env.NEXT_PUBLIC_APP_URL}/products/${id}`;

export const generateCustomerLink = (id: string) =>
  `${process.env.NEXT_PUBLIC_APP_URL}/customers/${id}`;

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(amount);
};

export function formatWebhookEvent(event: string): string {
  if (!event) return '';

  const [first, ...rest] = event.split('.');
  return [capitalize(first), ...rest].join(' ');
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function maskString(input: string): string {
  return '*'.repeat(input.length);
}

export const convertSatsToFiat = async ({ fiat, sats }: { sats: number; fiat: string }) => {
  try {
    const session = await getSessionFromServer();
    const response = await api.fetch(`/fiat/convert/to-fiat/${fiat}?satoshis=${sats}`, {}, session);
    if (!response) return [];

    if (!response.ok) {
      throw new Error('Failed to convert sats to fiat');
    }

    const res = await response.json();
    return res?.data;
  } catch (error) {
    console.error('Failed to convert sats to fiat:', error);
    return {};
  }
};
