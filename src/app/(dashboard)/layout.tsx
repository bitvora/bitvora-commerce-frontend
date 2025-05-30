import { CreateAccount } from './client-components';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ContextProvider from '@/contexts';
import { ServerLayout } from '@/app/(dashboard)/server-components';
import ProductContextProvider from '@/app/(dashboard)/products/context';
import CustomerContextProvider from '@/app/(dashboard)/customers/context';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ContextProvider>
      <ProductContextProvider>
        <CustomerContextProvider>
          <ServerLayout>
            <div className="w-screen h-screen overflow-hidden bg-primary-50 lg:bg-primary-100 lg:px-6 pt-8 lg:pt-6 xl:pt-8 flex flex-col lg:flex-row gap-1 lg:gap-3 2xl:gap-6 relative">
              <Sidebar />
              <Navbar />

              <CreateAccount />

              <div className="flex-1 h-full overflow-auto w-full lg:pb-8 lg:mb-8">{children}</div>
            </div>
          </ServerLayout>
        </CustomerContextProvider>
      </ProductContextProvider>
    </ContextProvider>
  );
}
