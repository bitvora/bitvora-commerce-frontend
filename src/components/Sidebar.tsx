'use client';

import { Link } from '@/components/Links';
import { Logo } from '@/components/Logo';
import { MediumSmallerText, MediumSmallText, SemiboldSmallerText } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  active_icon,
  padding = true
}: {
  text: string;
  route: string;
  icon: string;
  active_icon: string;
  padding?: boolean;
}) {
  const path = usePathname();

  const isActive = path === route || path.startsWith(`${route}/`);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={route}>
      <div
        className={`w-full h-[45px] rounded-md flex gap-3 justify-start items-center py-2 ${
          isActive
            ? 'border-[1px] border-light-400 text-secondary-700'
            : 'text-light-900 hover:text-secondary-700'
        } ${padding ? 'px-3' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <Image width={16} height={16} src={isActive || isHovered ? active_icon : icon} alt={text} />
        <MediumSmallText className="text-inherit mt-[0.5px]">{text}</MediumSmallText>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-[300px] max-w-[300px] lg:w-[250px] lg:max-w-[250px] xl:w-[300px] xl:max-w-[300px] 2xl:w-[350px] 2xl:max-w-[350px] max-h-screen h-screen overflow-y-auto overflow-x-hidden hidden lg:flex flex-col relative pr-[30px] lg:pr-3 xl:pr-[30px]">
      <div className="sticky top-0 left-0 bg-primary-100">
        <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
          <Logo url={app_routes.dashboard} />
          <Link href={app_routes.dashboard} className="text-inherit!">
            <MediumSmallerText className="text-inherit mt-2">Commerce</MediumSmallerText>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full mt-4 pt-4 mb-[50px]">
        <Account />

        <div className="flex flex-col gap-2 w-full mt-3 pt-3">
          <SemiboldSmallerText className="text-light-500 uppercase mx-2 pb-2">
            main
          </SemiboldSmallerText>

          <div className="flex flex-col gap-1">
            {main_routes.map(({ active_icon, icon, route, text }) => (
              <NavItem key={text} active_icon={active_icon} icon={icon} route={route} text={text} />
            ))}
          </div>
        </div>

        <hr className="bg-light-300 w-full h-[1px] border-0" />

        <div className="flex flex-col gap-2 w-full">
          <SemiboldSmallerText className="text-light-500 uppercase mx-2 pb-2">
            developer
          </SemiboldSmallerText>

          <div className="flex flex-col gap-1">
            {developer_routes.map(({ active_icon, icon, route, text }) => (
              <NavItem key={text} active_icon={active_icon} icon={icon} route={route} text={text} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
