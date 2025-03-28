import { ReactNode } from 'react';
import { getAccounts } from '@/lib/actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export const ServerLayout = async ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};
