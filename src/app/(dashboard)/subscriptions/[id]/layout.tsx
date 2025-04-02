import type { Metadata } from 'next';
import { getSubscription } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import SubscriptionContextProvider from '../context';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['subscription', params.id],
    queryFn: () => getSubscription(params.id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscriptionContextProvider>{children}</SubscriptionContextProvider>
    </HydrationBoundary>
  );
}
