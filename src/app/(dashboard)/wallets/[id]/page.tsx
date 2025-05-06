'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { app_routes } from '@/lib/constants';
import { SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { formatDate, formatSnakeCaseToTitle } from '@/lib/helpers';
import Tabs from '@/components/Tab';
import { WalletConnectionDetails, Skeleton } from './components';

import React from 'react';
import { Link } from '@/components/Links';
import { Wallet } from '@/types/wallets';
import { useAppContext } from '@/contexts';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const { wallets, isWalletLoading } = useAppContext();

  const router = useRouter();

  const [wallet, setWallet] = useState<Wallet>({} as Wallet);

  const handleClose = () => {
    router.push(app_routes.wallet);
  };

  useEffect(() => {
    const wallet = wallets.find((wallet) => wallet.id === id);
    if (wallet) {
      setWallet(wallet);
    } else {
      if (!isWalletLoading && wallets.length > 0 && !wallet) {
        router.push(app_routes.wallet);
      }
    }
  }, [wallets, isWalletLoading, id, router]);

  return (
    <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
      {isWalletLoading ? (
        <Skeleton />
      ) : (
        <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">Connection Details</SemiboldTitle>

            <Link href={app_routes.wallet}>
              <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>

          <div className="w-full flex flex-col gap-3 sm:gap-6 items-start bg-primary-40">
            <WalletConnectionDetails label="ID" value={wallet?.id} id />
            <WalletConnectionDetails label="Nostr Pubkey" value={wallet?.nostr_pubkey} />
            <WalletConnectionDetails label="Nostr Relay" value={wallet?.nostr_relay} />
            <WalletConnectionDetails label="Linked On" value={formatDate(wallet?.created_at)} />
          </div>

          <div className="w-full mt-5 md:mt-10 bg-primary-150 rounded-lg px-3 md:px-4 py-3 md:py-4">
            <Tabs
              tabs={[
                {
                  label: 'Permissions',
                  content: (
                    <div className="flex flex-col w-full gap-2 mt-2 pt-2">
                      {wallet?.methods?.map((method) => (
                        <SemiboldSmallText className="text-light-700" key={method}>
                          {formatSnakeCaseToTitle(method)}
                        </SemiboldSmallText>
                      ))}
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}
    </Drawer>
  );
}
