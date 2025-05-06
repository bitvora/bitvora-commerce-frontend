import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCheckout } from '@/app/(dashboard)/checkouts/[id]/actions';
import ContextProvider from '@/contexts';

export const metadata: Metadata = {
  title: 'Checkout'
};

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['checkout', params.id],
    queryFn: () => getCheckout(params.id)
  });

  return (
    <ContextProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </ContextProvider>
  );
}
