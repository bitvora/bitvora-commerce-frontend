import type { Metadata } from 'next';
import { getCheckout } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: 'Checkout'
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
    queryKey: ['checkout', id],
    queryFn: () => getCheckout(id)
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
