'use client';

import { MobileMenuIcon } from '@/components/Icons';
import { Logo } from '@/components/Logo';
import { MediumSmallerText, SemiboldSmallText } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import {links} from './constants';

export const NavLinks = () => {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);

    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-4">
      {links.map((link, index) => {
        const url = `${pathname}${currentHash}`;
        const isActive = link.href === url;

        return (
          <>
            <Link
              href={link.href}
              key={index}
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

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);

    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="lg:hidden flex items-center justify-center">
      <button onClick={toggleDrawer} className="cursor-pointer">
        {isOpen ? (
          <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
        ) : (
          <MobileMenuIcon />
        )}
      </button>

      <Drawer open={isOpen} onClose={toggleDrawer} direction="top" className="mt-28 drawer ">
        <div className="w-full h-full flex flex-col bg-primary-50">
          {links.map((link, index) => {
            const url = `${pathname}${currentHash}`;
            const isActive = link.href === url;

            return (
              <div
                key={index}
                onClick={toggleDrawer}
                className={clsx('w-full flex items-center justify-center py-4', {
                  'border-b border-light-300': index < links.length - 1
                })}>
                <Link href={link.href}>
                  <SemiboldSmallText
                    className={clsx('text-light-900 hover:text-secondary-700 capitalize', {
                      'text-secondary-700': isActive
                    })}>
                    {link.label}
                  </SemiboldSmallText>
                </Link>
              </div>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};

export const AppLogo = () => (
  <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
    <Logo url={app_routes.home} />
    <Link href={app_routes.home}>
      <MediumSmallerText className="text-inherit mt-2 hidden md:flex">Commerce</MediumSmallerText>
    </Link>
  </div>
);
