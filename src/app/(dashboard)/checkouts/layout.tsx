import type { Metadata } from 'next';
import CheckoutContextProvider from './context';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCheckouts } from './actions';
import { getSessionFromServer } from '@/lib/session';
import CustomersContextProvider from '@/app/(dashboard)/customers/context';
import ProductsContextProvider from '@/app/(dashboard)/products/context';
import { getProducts } from '@/app/(dashboard)/products/actions';
import { getCustomers } from '@/app/(dashboard)/customers/actions';

export const metadata: Metadata = {
  title: 'Checkout'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const session = await getSessionFromServer();

  await queryClient.prefetchQuery({
    queryKey: ['checkouts', session?.activeAccount],
    queryFn: () => getCheckouts()
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
      <CustomersContextProvider>
        <ProductsContextProvider>
          <CheckoutContextProvider>{children}</CheckoutContextProvider>
        </ProductsContextProvider>
      </CustomersContextProvider>
    </HydrationBoundary>
  );
}
