import type { Metadata } from 'next';
import { getAPIKey } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import APIKeysContextProvider from '../context';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
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
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['api-key', params.id],
    queryFn: () => getAPIKey(params.id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <APIKeysContextProvider>{children}</APIKeysContextProvider>
    </HydrationBoundary>
  );
}
