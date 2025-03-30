import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import numeral from 'numeral';

dayjs.extend(relativeTime);

export const formatDate = (date: string, format = 'MMM DD, YYYY hh:mm a'): string =>
  dayjs(date).format(format);

export const formatUUID = (uuid: string, length = 8): string => uuid.slice(0, length);

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

export const renderPrice = ({ amount, currency }: { amount: number; currency: string }) => {
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
