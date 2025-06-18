import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'react-modern-drawer/dist/index.css';
import 'react-calendar/dist/Calendar.css';
import 'react-phone-number-input/style.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '@/styles/globals.css';
import '@/styles/landing.css';

import { Toaster } from 'react-hot-toast';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Bitvora Commerce | Bitcoin Payment Platform',
  description: '100% Open Source Bitcoin Payment Platform for merchants and businesses'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
