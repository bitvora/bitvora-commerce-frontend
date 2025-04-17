import type { Metadata } from 'next';
import PaymentLinksContextProvider from './context';
import CustomersContextProvider from '@/app/(dashboard)/customers/context';
import ProductsContextProvider from '@/app/(dashboard)/products/context';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getPaymentLinks } from './actions';
import { getSessionFromServer } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Payment Links'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const session = await getSessionFromServer();

  await queryClient.prefetchQuery({
    queryKey: ['payment-links', session?.activeAccount],
    queryFn: () => getPaymentLinks()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomersContextProvider>
        <ProductsContextProvider>
          <PaymentLinksContextProvider>{children}</PaymentLinksContextProvider>
        </ProductsContextProvider>
      </CustomersContextProvider>
    </HydrationBoundary>
  );
}
