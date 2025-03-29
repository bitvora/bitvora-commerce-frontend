import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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
