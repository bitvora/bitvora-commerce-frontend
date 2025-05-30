import type { Metadata } from 'next';
import ProductContextProvider from './context';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getProducts } from './actions';
import { getSessionFromServer } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Products'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const session = await getSessionFromServer();

  await queryClient.prefetchQuery({
    queryKey: ['products', session?.activeAccount],
    queryFn: () => getProducts()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductContextProvider>{children}</ProductContextProvider>
    </HydrationBoundary>
  );
}
