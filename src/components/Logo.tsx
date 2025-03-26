'use client';

import Image from 'next/image';
import { Link } from './Links';
import { app_routes } from '@/lib/constants';

export const Logo = () => {
  return (
    <>
      <div className="lg:hidden">
        <Link href={app_routes.home}>
          <Image alt="logo" src="/logo.png" width={100} height={30} />
        </Link>
      </div>

      <div className="hidden lg:block">
        <Link href={app_routes.home}>
          <Image alt="logo" src="/logo.png" width={130} height={40} />
        </Link>
      </div>
    </>
  );
};
