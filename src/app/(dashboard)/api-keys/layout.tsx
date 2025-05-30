import type { Metadata } from 'next';
import APIKeysContextProvider from './context';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAPIKeys } from './actions';
import { getSessionFromServer } from '@/lib/session';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'API Keys'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const session = await getSessionFromServer();

  await queryClient.prefetchQuery({
    queryKey: ['api-keys', session?.activeAccount],
    queryFn: () => getAPIKeys()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <APIKeysContextProvider>
        <Suspense>{children} </Suspense>
      </APIKeysContextProvider>
    </HydrationBoundary>
  );
}
