import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getCheckout } from '@/app/(dashboard)/checkouts/[id]/actions';
import ContextProvider from '@/contexts';

type Params = Promise<{ id: string }>;

export const metadata: Metadata = {
  title: 'Checkout'
};

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
    queryKey: ['checkout', id],
    queryFn: () => getCheckout(id)
  });

  return (
    <ContextProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </ContextProvider>
  );
}
