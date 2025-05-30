import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Wallets'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children} </Suspense>;
}
