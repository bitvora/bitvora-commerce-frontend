import api from '@/lib/api';
import {  getPastDate, getPastMonth } from '@/lib/helpers';
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
export const getPreviousWeek = () => getSalesData('7-days', getPastDate(7));
export const getPreviousMonth = () => getSalesData('30-days', getPastDate(30));
export const getPreviousSixMonths = () => getSalesData('6-months', getPastMonth(6));
export const getPreviousYear = () => getSalesData('12-months', getPastMonth(12));
