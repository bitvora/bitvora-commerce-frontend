import api from '@/lib/api';
import { getPastDate, getPastMonth } from '@/lib/helpers';
import { getSessionFromServer } from '@/lib/session';

async function getSalesData(period, date) {
  try {
    const session = await getSessionFromServer();
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

async function getNewCustomersData(period, date) {
  try {
    const session = await getSessionFromServer();
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

export const getDailyNewCustomers = () => getNewCustomersData('new-customers-daily', getPastDate(0));
export const getLastSevenDaysNewCustomers = () => getNewCustomersData('new-customers-7-days', getPastDate(0));
export const getLastThirtyDaysNewCustomers = () => getNewCustomersData('new-customers-30-days', getPastDate(0));
export const getLastSixMonthsNewCustomers = () => getNewCustomersData('new-customers-6-months', getPastDate(0));
export const getLastTwelveMonthsNewCustomers = () => getNewCustomersData('new-customers-12-months', getPastDate(0));

export const getYesterdayNewCustomers = () => getNewCustomersData('new-customers-daily', getPastDate(1));
export const getPreviousWeekNewCustomers = () => getNewCustomersData('new-customers-7-days', getPastDate(7));
export const getPreviousMonthNewCustomers = () => getNewCustomersData('new-customers-30-days', getPastDate(30));
export const getPreviousSixMonthsNewCustomers = () => getNewCustomersData('new-customers-6-months', getPastMonth(6));
export const getPreviousYearNewCustomers = () => getNewCustomersData('new-customers-12-months', getPastMonth(12));