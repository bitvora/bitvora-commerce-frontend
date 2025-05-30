import type { Metadata } from 'next';
import { getAPIKey } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import APIKeysContextProvider from '../context';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;

  const apiKey = await getAPIKey(id);

  return {
    title: `API key: ${apiKey?.data?.name}`
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
    queryKey: ['api-key', id],
    queryFn: () => getAPIKey(id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <APIKeysContextProvider>{children}</APIKeysContextProvider>
    </HydrationBoundary>
  );
}
