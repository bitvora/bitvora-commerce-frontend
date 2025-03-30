import type { Metadata } from 'next';
import ProductContextProvider from './context';

export const metadata: Metadata = {
  title: 'Products'
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <ProductContextProvider>{children}</ProductContextProvider>;
}
