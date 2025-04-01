import type { Metadata } from 'next';
import SubscriptionContextProvider from './context';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getSubscriptions } from './actions';
import { getSessionFromServer } from '@/lib/session';

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscriptionContextProvider>{children}</SubscriptionContextProvider>
    </HydrationBoundary>
  );
}
