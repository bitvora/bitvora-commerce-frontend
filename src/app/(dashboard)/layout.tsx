import { getAccounts } from '@/app/(dashboard)/actions';
import Sidebar from '@/components/Sidebar';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-screen h-screen overflow-hidden bg-primary-100 px-6 pt-8 flex gap-6">
        <Sidebar />

        <div className="flex-1 h-full overflow-auto bg-primary-50">{children}</div>
      </div>
    </HydrationBoundary>
  );
}
