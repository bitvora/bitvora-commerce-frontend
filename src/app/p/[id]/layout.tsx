import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getPaymentLinkDetails } from './actions';
import ContextProvider from '@/contexts';

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: 'Payment'
};

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['payment-link-details', id],
    queryFn: () => getPaymentLinkDetails(id)
  });

  return (
    <ContextProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </ContextProvider>
  );
}
