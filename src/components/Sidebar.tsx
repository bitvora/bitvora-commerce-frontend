/* eslint-disable @next/next/no-img-element */
'use client';

import { useAppContext } from '@/app/contexts';
import { Link } from '@/components/Links';
import { Logo } from '@/components/Logo';
import {
  MediumSmallerText,
  MediumSmallText,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { logout } from '@/lib/auth';
import { app_routes } from '@/lib/constants';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import secureLocalStorage from 'react-secure-storage';

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
  const { currentAccount, isAccountLoading } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-[300px] max-w-[300px] xl:w-[300px] xl:max-w-[300px] 2xl:w-[350px] 2xl:max-w-[350px] max-h-screen h-screen overflow-y-auto overflow-x-hidden hidden lg:flex flex-col relative pr-[30px]">
      <header className="sticky top-0 left-0 bg-primary-100">
        <Link href={app_routes.dashboard}>
          <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
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

      {!isAccountLoading && (
        <div className="flex flex-col gap-2 sticky bottom-[40px] left-0 right-[30px] bg-primary-100 cursor-pointer px-2">
          <hr className="bg-light-400 w-full h-[1px] border-0" />

          <div className="flex gap-2 items-center w-full justify-between mt-2">
            <div className="flex gap-4 items-center flex-1 min-w-0">
              {currentAccount?.logo ? (
                <img
                  src={currentAccount?.logo}
                  className="w-8 h-8 rounded-md"
                  alt={currentAccount?.name}
                />
              ) : (
                <Image src="/img/user.svg" alt={currentAccount?.name} height={36} width={36} />
              )}

              <SemiboldSmallText className="text-light-900 truncate overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                {currentAccount?.name}
              </SemiboldSmallText>
            </div>

            <button
              className="text-light-700 hover:text-light-500 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}>
              <FontAwesomeIcon icon={menuOpen ? faAngleUp : faAngleDown} />
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col px-2">
                <NavItem
                  active_icon="/icons/profile.svg"
                  icon="/icons/profile.svg"
                  route={app_routes.profile}
                  text="Manage Profile"
                  padding={false}
                />

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    secureLocalStorage.clear();
                    await logout();
                  }}
                  className="-mt-2">
                  <button
                    className={`w-full h-[45px] rounded-md flex gap-3 justify-start items-center py-2 cursor-pointer`}
                    type="submit">
                    <Image width={16} height={16} src="/icons/logout.svg" alt="Logout" />
                    <MediumSmallText className="mt-[0.5px] text-red-700">Logout</MediumSmallText>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
