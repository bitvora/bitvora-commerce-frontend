import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import {
  getDailySales,
  getLastSevenDaysSales,
  getLastSixMonthsSales,
  getLastThirtyDaysSales,
  getLastTwelveMonthsSales
} from './actions';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['daily-sales'],
    queryFn: getDailySales
  });

  await queryClient.prefetchQuery({
    queryKey: ['seven-days-sales'],
    queryFn: getLastSevenDaysSales
  });

  await queryClient.prefetchQuery({
    queryKey: ['thirty-days-sales'],
    queryFn: getLastThirtyDaysSales
  });

  await queryClient.prefetchQuery({
    queryKey: ['six-months-sales'],
    queryFn: getLastSixMonthsSales
  });

  await queryClient.prefetchQuery({
    queryKey: ['twelve-months-sales'],
    queryFn: getLastTwelveMonthsSales
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
