import type { Metadata } from 'next';
import { getAccount } from '@/lib/actions';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Account } from '@/lib/types';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;

  const response = await getAccount(id);

  const account: Account = response?.data;

  return {
    title: account?.name,
    openGraph: {
      title: account?.name,
      images: [
        {
          url: account?.logo,
          width: 1200,
          height: 630,
          alt: account?.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: account?.name,
      images: [account?.logo]
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
    queryKey: ['accounts', params.id],
    queryFn: () => getAccount(params.id)
  });

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
