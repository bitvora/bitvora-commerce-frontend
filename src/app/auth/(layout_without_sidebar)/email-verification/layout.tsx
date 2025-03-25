import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Verification'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
