import type { Metadata } from 'next';
import { getWebhook, getWebhookDeliveries } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import WebhookContextProvider from '../context';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;

  const webhook = await getWebhook(id);

  return {
    title: `Webhook: ${webhook?.data?.id}`
  };
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Params
}) {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['webhook', id],
    queryFn: () => getWebhook(id)
  });

  await queryClient.prefetchQuery({
    queryKey: ['webhook-deliveries', id],
    queryFn: () => getWebhookDeliveries(id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WebhookContextProvider>{children}</WebhookContextProvider>
    </HydrationBoundary>
  );
}
