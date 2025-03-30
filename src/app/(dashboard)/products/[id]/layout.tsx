import type { Metadata } from 'next';
import { getProduct } from './actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ProductContextProvider from '@/app/(dashboard)/products/context';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);

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
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['product', params.id],
    queryFn: () => getProduct(params.id)
  });

  return (
    <ProductContextProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </ProductContextProvider>
  );
}
