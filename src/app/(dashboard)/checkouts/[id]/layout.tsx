import type { Metadata } from 'next';
import { getCheckout } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const metadata: Metadata = {
  title: 'Checkout'
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
    queryKey: ['checkout', params.id],
    queryFn: () => getCheckout(params.id)
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
