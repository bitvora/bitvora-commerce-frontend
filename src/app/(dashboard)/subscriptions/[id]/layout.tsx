import type { Metadata } from 'next';
import { getSubscription } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import SubscriptionContextProvider from '../context';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;

  const subscription = await getSubscription(id);

  return {
    title: `Subscription: ${subscription?.data?.id}`
  };
}

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
    queryKey: ['subscription', id],
    queryFn: () => getSubscription(id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscriptionContextProvider>{children}</SubscriptionContextProvider>
    </HydrationBoundary>
  );
}
