import type { Metadata } from 'next';
import { getWebhook, getWebhookDeliveries } from '../../actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import WebhookContextProvider from '../../../context';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Webhook Attempt`
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
    queryKey: ['webhook', params.id],
    queryFn: () => getWebhook(params.id)
  });

  await queryClient.prefetchQuery({
    queryKey: ['webhook-deliveries', params.id],
    queryFn: () => getWebhookDeliveries(params.id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WebhookContextProvider>{children}</WebhookContextProvider>
    </HydrationBoundary>
  );
}
