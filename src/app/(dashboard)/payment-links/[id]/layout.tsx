import type { Metadata } from 'next';
import { getPaymentLink } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const metadata: Metadata = {
  title: 'Payment Link'
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
    queryKey: ['payment-link', params.id],
    queryFn: () => getPaymentLink(params.id)
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
