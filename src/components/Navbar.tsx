'use client';

import { MenuIcon, CloseIcon } from '@/components/Icons';
import { Logo } from '@/components/Logo';
import { SemiboldSmallText } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Drawer from 'react-modern-drawer';
import Image from 'next/image';
import { useState } from 'react';
import Currency from '@/components/Currency';
import Account from '@/components/Account';

const main_routes = [
  {
    text: 'Dashboard',
    route: app_routes.dashboard,
    icon: '/icons/dashboard.svg',
    active_icon: '/icons/active-dashboard.svg'
  },
  {
    text: 'Products',
    route: app_routes.products,
    icon: '/icons/products.svg',
    active_icon: '/icons/active-products.svg'
  },
  {
    text: 'Customers',
    route: app_routes.customers,
    icon: '/icons/customers.svg',
    active_icon: '/icons/active-customers.svg'
  },
  {
    text: 'Subscriptions',
    route: app_routes.subscriptions,
    icon: '/icons/subscriptions.svg',
    active_icon: '/icons/active-subscriptions.svg'
  },
  {
    text: 'Checkouts',
    route: app_routes.checkouts,
    icon: '/icons/checkouts.svg',
    active_icon: '/icons/active-checkouts.svg'
  },
  {
    text: 'Payment Links',
    route: app_routes.payment_links,
    icon: '/icons/payment-links.svg',
    active_icon: '/icons/active-payment-links.svg'
  },
  {
    text: 'Wallet',
    route: app_routes.wallet,
    icon: '/icons/wallet.svg',
    active_icon: '/icons/active-wallet.svg'
  },
  {
    text: 'Account Management',
    route: app_routes.accounts,
    icon: '/icons/account-management.svg',
    active_icon: '/icons/active-account-management.svg'
  }
];

const developer_routes = [
  {
    text: 'API Keys',
    route: app_routes.api_keys,
    icon: '/icons/api-keys.svg',
    active_icon: '/icons/active-api-keys.svg'
  },
  {
    text: 'Webhooks',
    route: app_routes.webhooks,
    icon: '/icons/webhooks.svg',
    active_icon: '/icons/active-webhooks.svg'
  }
];

function NavItem({
  text,
  icon,
  route,
  active_icon
}: {
  text: string;
  route: string;
  icon: string;
  active_icon: string;
}) {
  const path = usePathname();

  const isActive = path === route || path.startsWith(`${route}/`);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={route}>
      <div
        className={`w-full h-[45px] rounded-md flex gap-4 justify-start items-center px-1 py-2 ${
          isActive ? 'text-secondary-700' : 'text-light-900 hover:text-secondary-700'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <Image width={16} height={16} src={isActive || isHovered ? active_icon : icon} alt={text} />
        <SemiboldSmallText className="text-inherit mt-[0.5px]">{text}</SemiboldSmallText>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <header className="flex lg:hidden w-full sticky top-0 left-0 bg-primary-50 justify-between mb-4 pb-4 items-center px-4">
        <div className="flex items-center gap-4 text-light-700 hover:text-light-800">
          <Logo url={app_routes.dashboard} />
          <Currency />
        </div>

        <button
          className="cursor-pointer bg-transparent border-none outline-none"
          onClick={toggleDrawer}>
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      <Drawer open={isOpen} onClose={toggleDrawer} direction="left" className="mobile-drawer">
        <div className="w-full h-full overflow-x-hidden overflow-y-auto flex flex-col gap-2">
          <Account />

          <div className="flex flex-col gap-1" onClick={toggleDrawer}>
            {main_routes.map(({ active_icon, icon, route, text }) => (
              <NavItem key={text} active_icon={active_icon} icon={icon} route={route} text={text} />
            ))}
          </div>

          <hr className="bg-light-300 w-full h-[1px] border-[0.5px] border-light-400 my-2" />

          <div className="flex flex-col gap-1" onClick={toggleDrawer}>
            {developer_routes.map(({ active_icon, icon, route, text }) => (
              <NavItem key={text} active_icon={active_icon} icon={icon} route={route} text={text} />
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
