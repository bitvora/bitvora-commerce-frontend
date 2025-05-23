'use client';

import Currency from '@/components/Currency';
import {
  BoldSmallText,
  MediumHeader5,
  SemiboldBody,
  SemiboldCaption,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { ConnectWallet } from './components';
import Table from '@/components/Table';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DarkInput } from '@/components/Inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import { formatDate, formatUUID } from '@/lib/helpers';
import { Link } from '@/components/Links';
import { useAppContext } from '@/contexts';
import clsx from 'clsx';
import Image from 'next/image';

export default function Page() {
  const { wallets, isWalletLoading } = useAppContext();

  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (currentPage > 1) params.set('page', String(currentPage));

    router.push(`${app_routes.wallet}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, currentPage, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const filteredWallets = useMemo(() => {
    if (!debouncedQuery) return wallets;

    return wallets.filter((wallet) =>
      Object.values(wallet).some((value) =>
        String(value).toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  }, [wallets, debouncedQuery]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const clearQuery = () => {
    setQuery('');
    setCurrentPage(1);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => (
        <Link href={`${app_routes.wallet}/${row.id}`} className="text-inherit">
          <SemiboldSmallText className="truncate text-light-700 hover:text-light-900">
            {formatUUID(row.id)}
          </SemiboldSmallText>
        </Link>
      )
    },
    {
      header: 'Permissions',
      accessor: 'methods',
      render: (row) => (
        <Link href={`${app_routes.wallet}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {row.methods?.length}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {row.methods?.length}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Nostr Relay',
      accessor: 'nostr_relay',
      render: (row) => (
        <Link href={`${app_routes.wallet}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {row.nostr_relay}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {row.nostr_relay}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (row) => (
        <Link href={`${app_routes.wallet}/${row.id}`}>
          <SemiboldSmallText
            className={clsx('hidden md:flex', {
              'text-light-700 hover:text-light-900': !row.active,
              'text-green-500 hover:text-green-700': row.active
            })}>
            {row.active ? 'Active' : 'Inactive'}
          </SemiboldSmallText>
          <SemiboldSmallerText
            className={clsx('md:hidden', {
              'text-light-700 hover:text-light-900': !row.active,
              'text-green-500 hover:text-green-700': row.active
            })}>
            {row.active ? 'Active' : 'Inactive'}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Linked At',
      accessor: 'created_at',
      render: (row) => (
        <Link href={`${app_routes.wallet}/${row.id}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {formatDate(row.created_at)}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatDate(row.created_at)}
          </SemiboldSmallerText>
        </Link>
      )
    }
  ];

  const is_wallet_connected = useMemo(() => {
    return wallets.length > 0 && wallets.some((wallet) => wallet.active);
  }, [wallets]);

  const connected_wallet = useMemo(() => {
    return !isWalletLoading ? wallets.find((wallet) => wallet.active) : null;
  }, [wallets, isWalletLoading]);

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="flex flex-col-reverse md:flex-col gap-6 md:gap-8 w-full">
        <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
          <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
            <MediumHeader5>Wallets</MediumHeader5>

            <div className="hidden md:flex">
              <Currency />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-[auto] justify-between">
            <div className="sm:hidden">
              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search Wallets"
                startIcon={
                  <div className="text-light-500">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </div>
                }
                endIcon={
                  query && (
                    <button
                      className="cursor-pointer z-10 text-light-700 hover:text-light-900 outline-none border-none"
                      onClick={clearQuery}>
                      <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                    </button>
                  )
                }
                className="h-10"
              />
            </div>

            <div>
              <ConnectWallet />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            'flex w-full items-center justify-between px-6 sm:px-8 py-6 gap-2 md:gap-8 rounded-lg h-[180px] sm:h-[200px] lg:h-[220px] xl:h-[200px]',
            {
              'cursor-pointer': is_wallet_connected
            }
          )}
          onClick={() => {
            if (is_wallet_connected) {
              router.push(`${app_routes.wallet}/${connected_wallet?.id}`);
            }
          }}
          style={{
            background: `
      linear-gradient(
        to right,
        #100c17 0%,
        #100c17 33%,
        rgba(16, 12, 23, 0.95) 40%,
        rgba(16, 12, 23, 0.6) 50%,
        rgba(16, 12, 23, 0.2) 60%,
        transparent 66.01%
      ),
      radial-gradient(83.34% 204.56% at 96.26% 110.11%, #2F2244 0%, #15101E 61.03%)
    `,
            backgroundBlendMode: 'normal'
          }}>
          <div className="flex flex-col justify-between h-full">
            <div
              className={clsx(
                'flex text-center justify-center items-center px-4 py-0.5 rounded-2xl w-fit',
                {
                  'bg-green-50': is_wallet_connected,
                  'bg-red-50': !is_wallet_connected
                }
              )}>
              <SemiboldSmallText
                className={clsx('hidden md:flex lg:hidden xl:flex', {
                  'text-green-700': is_wallet_connected,
                  'text-red-700': !is_wallet_connected
                })}>
                {is_wallet_connected ? 'Wallet Connected' : 'No Wallet Connected'}
              </SemiboldSmallText>

              <SemiboldCaption
                className={clsx('md:hidden lg:flex xl:hidden', {
                  'text-green-700': is_wallet_connected,
                  'text-red-700': !is_wallet_connected
                })}>
                {is_wallet_connected ? 'Wallet Connected' : 'No Wallet Connected'}
              </SemiboldCaption>
            </div>

            <div className="flex flex-col gap-1">
              {is_wallet_connected ? (
                <>
                  <BoldSmallText className="text-light-900 md:hidden lg:flex xl:hidden">
                    Wallet Connected
                  </BoldSmallText>
                  <MediumHeader5 className="text-light-900 hidden md:flex lg:hidden xl:flex">
                    Wallet Connected
                  </MediumHeader5>
                </>
              ) : (
                <>
                  <BoldSmallText className="text-light-900 md:hidden lg:flex xl:hidden">
                    Connect Wallet
                  </BoldSmallText>
                  <MediumHeader5 className="text-light-900 hidden md:flex lg:hidden xl:flex">
                    Connect Wallet
                  </MediumHeader5>
                </>
              )}

              <div>
                {is_wallet_connected ? (
                  <SemiboldSmallerText className="text-light-700">
                    Permissions: <span>{connected_wallet?.methods?.length}</span>
                  </SemiboldSmallerText>
                ) : (
                  <SemiboldSmallerText className="text-light-700">
                    Set up a wallet connection by clicking the connect wallet
                  </SemiboldSmallerText>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-1/3 md:min-w-1/3 flex justify-end float-right">
            <Image
              src="/img/wallet-connect.svg"
              alt="wallet-connect"
              width={200}
              height={200}
              className="w-[200px] h-[200px] object-contain"
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={filteredWallets as unknown as Record<string, unknown>[]}
          rowsPerPage={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          tableHeader={
            <div className="w-full hidden md:flex items-center justify-between">
              <SemiboldBody className="text-light-900">
                Wallets <span className="text-light-700">({filteredWallets.length})</span>
              </SemiboldBody>

              <DarkInput
                value={query}
                handleChange={handleQueryChange}
                name="query"
                placeholder="Search Wallets"
                startIcon={
                  <div className="text-light-500">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </div>
                }
                endIcon={
                  query && (
                    <button
                      className="cursor-pointer z-10 text-light-700 hover:text-light-900 outline-none border-none"
                      onClick={clearQuery}>
                      <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                    </button>
                  )
                }
                className="h-10"
              />
            </div>
          }
          isLoading={isWalletLoading}
          emptyMessage={query ? 'No Wallets found' : 'No Wallets'}
        />
      </div>
    </div>
  );
}
