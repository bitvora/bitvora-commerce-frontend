import { WalletTransactionsProvider } from '@/contexts/wallet';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Wallet Transactions'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <WalletTransactionsProvider>{children}</WalletTransactionsProvider>
    </Suspense>
  );
}
