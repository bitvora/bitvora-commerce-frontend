import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getPaymentLinkDetails } from './actions';
import ContextProvider from '@/contexts';

export const metadata: Metadata = {
  title: 'Payment'
};

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['payment-link-details', params.id],
    queryFn: () => getPaymentLinkDetails(params.id)
  });

  return (
    <ContextProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </ContextProvider>
  );
}
