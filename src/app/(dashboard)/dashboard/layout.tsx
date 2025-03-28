import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
