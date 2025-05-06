'use client';

import { SemiboldSmallText } from '@/components/Text';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const NavLinks = () => {
  const links = [
    {
      label: 'features',
      href: '/#features'
    },
    {
      label: 'pricing',
      href: '/#pricing'
    },
    {
      label: 'self-hosting',
      href: '/#self-hosting'
    },
    {
      label: 'faq',
      href: '/#faq'
    }
  ];

  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    updateHash(); // set on mount
    window.addEventListener('hashchange', updateHash);

    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  return (
    <div className="flex items-center gap-4">
      {links.map((link, index) => {
        const url = `${pathname}${currentHash}`;
        const isActive = link.href === url;

        console.log({ isActive, link: link.href, url });

        return (
          <>
            <Link
              href={link.href}
              key={link.label}
              className={`text-light-900 hover:text-secondary-700 uppercase ${
                isActive ? 'text-secondary-700' : ''
              }`}>
              <SemiboldSmallText>{link.label}</SemiboldSmallText>
            </Link>

            {index < links.length - 1 && (
              <div className="h-[14px] w-[1px] bg-light-400 hidden lg:block"></div>
            )}
          </>
        );
      })}
    </div>
  );
};
