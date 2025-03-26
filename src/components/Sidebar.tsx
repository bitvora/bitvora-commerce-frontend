'use client';

import { getAccounts } from '@/app/(dashboard)/actions';
import { Link } from '@/components/Links';
import { Logo } from '@/components/Logo';
import {
  MediumSmallerText,
  MediumSmallText,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
        className={`w-full h-[45px] rounded-md flex gap-3 justify-start items-center px-3 py-2 ${
          isActive
            ? 'border-[1px] border-light-400 text-secondary-700'
            : 'text-light-900 hover:border-[1px] hover:border-light-400 hover:text-secondary-700'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <Image width={16} height={16} src={isActive || isHovered ? active_icon : icon} alt={text} />
        <MediumSmallText className="text-inherit mt-1">{text}</MediumSmallText>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const { data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts()
  });

  return (
    <div className="w-[320px] max-w-[320px] max-h-screen h-screen overflow-y-auto overflow-x-hidden flex flex-col relative pr-[30px]">
      <header className="text-light-700 hover:text-light-800 sticky top-0 left-0 bg-primary-100">
        <Link href={app_routes.dashboard}>
          <div className="flex items-center gap-2">
            <Logo url={app_routes.dashboard} />
            <MediumSmallerText className="text-inherit mt-2">Commerce</MediumSmallerText>
          </div>
        </Link>
      </header>

      <div className="flex flex-col gap-4 w-full mt-4 pt-4 mb-[50px]">
        <div className="flex flex-col gap-2 w-full">
          <SemiboldSmallerText className="text-light-500 uppercase mx-2 pb-2">
            main
          </SemiboldSmallerText>

          <div className="flex flex-col gap-1">
            {main_routes.map(({ active_icon, icon, route, text }) => (
              <NavItem key={text} active_icon={active_icon} icon={icon} route={route} text={text} />
            ))}
          </div>
        </div>

        <hr className="bg-light-400 w-full h-[1px] border-0" />

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

      <div className="flex flex-col gap-4 sticky bottom-[40px] left-0 right-[30px] bg-primary-100">
        <hr className="bg-light-400 w-full h-[1px] border-0" />

        <div className="flex gap-2 items-center w-full justify-between">
          <div className="flex gap-2 items-center flex-1 min-w-0">
            {/* <img src="https://picsum.photos/200" className="w-8 h-8 rounded-md" alt="me" /> */}
            <Image src="/img/user.svg" alt="user" height={36} width={36} />

            <SemiboldSmallText className="text-light-900 truncate overflow-hidden text-ellipsis whitespace-nowrap flex-1">
              utxo the webmasterutxo the webmasterutxo the webmasterutxo the webmasterutxo the
              webmaster
            </SemiboldSmallText>
          </div>

          <button className="text-light-700 hover:text-light-500 cursor-pointer">
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        </div>
      </div>
    </div>
  );
}
