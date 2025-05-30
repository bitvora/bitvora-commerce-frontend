import type { Metadata } from 'next';
import { getProduct } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ProductContextProvider from '@/app/(dashboard)/products/context';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;

  const product = await getProduct(id);

  return {
    title: `Product: ${product?.data?.name}`,
    description: product?.data?.description,
    openGraph: {
      title: `Product: ${product?.data?.name}`,
      description: product?.data?.description,
      images: [
        {
          url: product?.data?.image,
          width: 1200,
          height: 630,
          alt: product?.data?.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Product: ${product?.data?.name}`,
      description: product?.data?.description,
      images: [product?.data?.image]
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
    queryKey: ['product', id],
    queryFn: () => getProduct(id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductContextProvider>{children}</ProductContextProvider>
    </HydrationBoundary>
  );
}
