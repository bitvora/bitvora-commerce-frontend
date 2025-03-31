import api from '@/lib/api';
import { getPastDate, getPastMonth } from '@/lib/helpers';
import { getSessionFromServer } from '@/lib/session';

async function getSalesData(period: string, date: string) {
  try {
    const session = await getSessionFromServer();

    if (!session || session?.activeAccount === '') {
      return null;
    }

    const response = await api.fetch(
      `/dashboard/${session?.activeAccount}/sales/${period}/${date}`,
      {},
      session
    );

    if (!response?.ok) return [];

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${period} sales:`, error);
    return [];
  }
}

export const getDailySales = () => getSalesData('daily', getPastDate(0));
export const getLastSevenDaysSales = () => getSalesData('7-days', getPastDate(0));
export const getLastThirtyDaysSales = () => getSalesData('30-days', getPastDate(0));
export const getLastSixMonthsSales = () => getSalesData('6-months', getPastDate(0));
export const getLastTwelveMonthsSales = () => getSalesData('12-months', getPastDate(0));

export const getYesterdaySales = () => getSalesData('daily', getPastDate(1));
export const getPreviousWeekSales = () => getSalesData('7-days', getPastDate(7));
export const getPreviousMonthSales = () => getSalesData('30-days', getPastDate(30));
export const getPreviousSixMonthsSales = () => getSalesData('6-months', getPastMonth(6));
export const getPreviousYearSales = () => getSalesData('12-months', getPastMonth(12));

async function getNewCustomersData(period: string, date: string) {
  try {
    const session = await getSessionFromServer();

    if (!session || session?.activeAccount === '') {
      return null;
    }

    const response = await api.fetch(
      `/dashboard/${session?.activeAccount}/customers/${period}/${date}`,
      {},
      session
    );

    if (!response?.ok) return [];

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${period} new customers:`, error);
    return [];
  }
}

export const getDailyNewCustomers = () => getNewCustomersData('daily', getPastDate(0));
export const getLastSevenDaysNewCustomers = () => getNewCustomersData('7-days', getPastDate(0));
export const getLastThirtyDaysNewCustomers = () => getNewCustomersData('30-days', getPastDate(0));
export const getLastSixMonthsNewCustomers = () => getNewCustomersData('6-months', getPastDate(0));
export const getLastTwelveMonthsNewCustomers = () =>
  getNewCustomersData('12-months', getPastDate(0));

export const getYesterdayNewCustomers = () => getNewCustomersData('daily', getPastDate(1));
export const getPreviousWeekNewCustomers = () => getNewCustomersData('7-days', getPastDate(7));
export const getPreviousMonthNewCustomers = () => getNewCustomersData('30-days', getPastDate(30));
export const getPreviousSixMonthsNewCustomers = () =>
  getNewCustomersData('6-months', getPastMonth(6));
export const getPreviousYearNewCustomers = () => getNewCustomersData('12-months', getPastMonth(12));

async function getActiveSubscribersData(period: string, date: string) {
  try {
    const session = await getSessionFromServer();

    if (!session || session?.activeAccount === '') {
      return null;
    }

    const response = await api.fetch(
      `/dashboard/${session?.activeAccount}/subscribers/${period}/${date}`,
      {},
      session
    );

    if (!response?.ok) return [];

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${period} active subscribers:`, error);
    return null;
  }
}

export const getDailyActiveSubscribers = () => getActiveSubscribersData('daily', getPastDate(0));
export const getLastSevenDaysActiveSubscribers = () =>
  getActiveSubscribersData('7-days', getPastDate(0));
export const getLastThirtyDaysActiveSubscribers = () =>
  getActiveSubscribersData('30-days', getPastDate(0));
export const getLastSixMonthsActiveSubscribers = () =>
  getActiveSubscribersData('6-months', getPastDate(0));
export const getLastTwelveMonthsActiveSubscribers = () =>
  getActiveSubscribersData('12-months', getPastDate(0));

export const getYesterdayActiveSubscribers = () =>
  getActiveSubscribersData('daily', getPastDate(1));
export const getPreviousWeekActiveSubscribers = () =>
  getActiveSubscribersData('7-days', getPastDate(7));
export const getPreviousMonthActiveSubscribers = () =>
  getActiveSubscribersData('30-days', getPastDate(30));
export const getPreviousSixMonthsActiveSubscribers = () =>
  getActiveSubscribersData('6-months', getPastMonth(6));
export const getPreviousYearActiveSubscribers = () =>
  getActiveSubscribersData('12-months', getPastMonth(12));

async function getMRRData(period: string, date: string) {
  try {
    const session = await getSessionFromServer();

    if (!session || session?.activeAccount === '') {
      return null;
    }

    const response = await api.fetch(
      `/dashboard/${session?.activeAccount}/mrr/${period}/${date}`,
      {},
      session
    );

    if (!response?.ok) return [];

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${period} MRR:`, error);
    return [];
  }
}

export const getDailyMRR = () => getMRRData('daily', getPastDate(0));
export const getLastSevenDaysMRR = () => getMRRData('7-days', getPastDate(0));
export const getLastThirtyDaysMRR = () => getMRRData('30-days', getPastDate(0));
export const getLastSixMonthsMRR = () => getMRRData('6-months', getPastDate(0));
export const getLastTwelveMonthsMRR = () => getMRRData('12-months', getPastDate(0));

export const getYesterdayMRR = () => getMRRData('daily', getPastDate(1));
export const getPreviousWeekMRR = () => getMRRData('7-days', getPastDate(7));
export const getPreviousMonthMRR = () => getMRRData('30-days', getPastDate(30));
export const getPreviousSixMonthsMRR = () => getMRRData('6-months', getPastMonth(6));
export const getPreviousYearMRR = () => getMRRData('12-months', getPastMonth(12));
