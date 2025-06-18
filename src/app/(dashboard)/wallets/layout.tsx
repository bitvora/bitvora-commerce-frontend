import { WalletTransactionsProvider } from '@/contexts/wallet';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ConfigProvider, App } from 'antd';

export const metadata: Metadata = {
  title: 'Wallets'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <WalletTransactionsProvider>
        <ConfigProvider>
          <App message={{ maxCount: 1 }} notification={{ maxCount: 1 }}>
            {children}
          </App>
        </ConfigProvider>
      </WalletTransactionsProvider>
    </Suspense>
  );
}
