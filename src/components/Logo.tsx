'use client';

import Image from 'next/image';
import { Link } from './Links';
import { app_routes } from '@/lib/constants';

export const Logo = ({ url = app_routes.home }: { url?: string }) => {
  return (
    <>
      <div className="sm:hidden">
        <Link href={url}>
          <Image alt="logo" src="/img/bitvora.svg" width={100} height={30} />
        </Link>
      </div>

      <div className="hidden sm:flex md:hidden">
        <Link href={url}>
          <Image alt="logo" src="/img/bitvora.svg" width={120} height={35} />
        </Link>
      </div>

      <div className="hidden md:flex lg:hidden">
        <Link href={url}>
          <Image alt="logo" src="/img/bitvora.svg" width={130} height={40} />
        </Link>
      </div>

      <div className="hidden lg:block">
        <Link href={url}>
          <Image alt="logo" src="/img/bitvora.svg" width={130} height={40} />
        </Link>
      </div>
    </>
  );
};
