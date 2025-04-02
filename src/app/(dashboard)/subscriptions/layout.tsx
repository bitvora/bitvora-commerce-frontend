import type { Metadata } from 'next';
import SubscriptionContextProvider from './context';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getSubscriptions } from './actions';
import { getSessionFromServer } from '@/lib/session';
import { getCustomers } from '@/app/(dashboard)/customers/actions';
import CustomersContextProvider from '@/app/(dashboard)/customers/context';
import ProductsContextProvider from '@/app/(dashboard)/products/context';
import { getProducts } from '@/app/(dashboard)/products/actions';

export const metadata: Metadata = {
  title: 'Subscriptions'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const session = await getSessionFromServer();

  await queryClient.prefetchQuery({
    queryKey: ['subscriptions', session?.activeAccount],
    queryFn: () => getSubscriptions()
  });

  await queryClient.prefetchQuery({
    queryKey: ['customers', session?.activeAccount],
    queryFn: () => getCustomers()
  });

  await queryClient.prefetchQuery({
    queryKey: ['products', session?.activeAccount],
    queryFn: () => getProducts()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscriptionContextProvider>
        <ProductsContextProvider>
          <CustomersContextProvider>{children}</CustomersContextProvider>
        </ProductsContextProvider>
      </SubscriptionContextProvider>
    </HydrationBoundary>
  );
}
