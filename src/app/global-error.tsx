'use client';

import { Inter } from 'next/font/google';
import { MediumHeader5, MediumSmallerText } from '@/components/Text';
import { Logo } from '@/components/Logo';
import { PrimaryButton } from '@/components/Buttons';
import { app_routes } from '@/lib/constants';
import { Link } from '@/components/Links';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-custom-bg bg-cover bg-center bg-no-repeat h-screen w-screen overflow-y-hidden overflow-x-hidden">
          <div className="z-50 w-full flex flex-wrap items-center justify-between px-10 py-5 navbar-expand-lg shadow h-20">
            <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
              <Logo url={app_routes.dashboard} />
              <Link href={app_routes.dashboard}>
                <MediumSmallerText className="text-inherit mt-2">Commerce</MediumSmallerText>
              </Link>
            </div>
          </div>

          <div className="w-full mt-6 pt-6 justify-center items-center text-center px-6">
            <MediumHeader5 className="text-white">Something went wrong!</MediumHeader5>
            <div className="mt-6">
              <PrimaryButton
                onClick={() => {
                  reset();
                }}>
                Try again
              </PrimaryButton>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
