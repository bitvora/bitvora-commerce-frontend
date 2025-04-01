import type { Metadata } from 'next';
import CustomersContextProvider from './context';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCustomers } from './actions';
import { getSessionFromServer } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Customers'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const session = await getSessionFromServer();

  await queryClient.prefetchQuery({
    queryKey: ['customers', session?.activeAccount],
    queryFn: () => getCustomers()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomersContextProvider>{children}</CustomersContextProvider>
    </HydrationBoundary>
  );
}
