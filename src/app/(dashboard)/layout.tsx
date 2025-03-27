import { getAccounts } from '@/app/(dashboard)/actions';
import Navbar from '@/components/Navbar';
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
      <div className="w-screen h-screen overflow-hidden bg-primary-50 lg:bg-primary-100 px-6 pt-8 flex flex-col lg:flex-row gap-1 lg:gap-6">
        <Sidebar />
        <Navbar />

        <div className="flex-1 h-full overflow-auto w-full">{children}</div>
      </div>
    </HydrationBoundary>
  );
}
