import type { Metadata } from 'next';
import { getCustomer } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import CustomerContextProvider from '../context';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;

  const customer = await getCustomer(id);

  return {
    title: `Customer: ${customer?.data?.name}`,
    description: customer?.data?.description,
    openGraph: {
      title: `Customer: ${customer?.data?.name}`,
      description: customer?.data?.description,
      images: [
        {
          url: customer?.data?.image,
          width: 1200,
          height: 630,
          alt: customer?.data?.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Customer: ${customer?.data?.name}`,
      description: customer?.data?.description,
      images: [customer?.data?.image]
    }
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
    queryKey: ['customer', id],
    queryFn: () => getCustomer(id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomerContextProvider>{children}</CustomerContextProvider>
    </HydrationBoundary>
  );
}
