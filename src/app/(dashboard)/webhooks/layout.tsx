import type { Metadata } from 'next';
import WebhookContextProvider from './context';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getWebhooks } from './actions';
import { getSessionFromServer } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Webhooks'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const session = await getSessionFromServer();

  await queryClient.prefetchQuery({
    queryKey: ['webhooks', session?.activeAccount],
    queryFn: () => getWebhooks()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WebhookContextProvider>{children}</WebhookContextProvider>
    </HydrationBoundary>
  );
}
