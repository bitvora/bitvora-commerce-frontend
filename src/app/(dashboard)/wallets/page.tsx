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
import { SwitchWallet, WithdrawBitcoin, WalletTransactionsFilter, WalletHeaderSkeleton } from './components';
import Table from '@/components/tables';
import { useMemo, useState } from 'react';
import { app_routes } from '@/lib/constants';
import { formatDate } from '@/lib/helpers';
import { Link } from '@/components/Links';
import { useAppContext } from '@/contexts';
import clsx from 'clsx';
import Image from 'next/image';
import numeral from 'numeral';
import { useWalletTransactions } from '@/contexts/wallet';

export default function Page() {
  const { wallets, balance, isWalletLoading } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const { loading, transactions } = useWalletTransactions();

  const columns = [
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <Link href={`${app_routes.wallet}/transactions/${row.payment_hash}`}>
          <SemiboldSmallText className="truncate text-light-700 hover:text-light-900">
            {numeral(row.amount / 1000).format('0,0')} SATS
          </SemiboldSmallText>
        </Link>
      )
    },
    {
      header: 'Time',
      accessor: 'created_at',
      render: (row) => (
        <Link href={`${app_routes.wallet}/transactions/${row.payment_hash}`}>
          <SemiboldSmallText className="text-light-700 hover:text-light-900 hidden md:flex">
            {formatDate(new Date(row.created_at * 1000).toISOString())}
          </SemiboldSmallText>
          <SemiboldSmallerText className="truncate md:hidden text-light-700 hover:text-light-900">
            {formatDate(new Date(row.created_at * 1000).toISOString())}
          </SemiboldSmallerText>
        </Link>
      )
    },
    {
      header: 'Network',
      accessor: 'invoice',
      render: (row) => (
        <Link href={`${app_routes.wallet}/transactions/${row.payment_hash}`}>
          <Image
            width={25}
            height={25}
            src={row.invoice ? '/currencies/sats.svg' : '/currencies/btc.svg'}
            alt="network"
          />
        </Link>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => (
        <Link href={`${app_routes.wallet}/transactions/${row.payment_hash}`}>
          <SemiboldSmallText className="truncate text-light-700 hover:text-light-900">
            {row.type === 'incoming' ? 'Deposit' : 'Withdrawal'}
          </SemiboldSmallText>
        </Link>
      )
    }
  ];

  const is_wallet_connected = useMemo(() => {
    return wallets.length > 0 && wallets.some((wallet) => wallet.active);
  }, [wallets]);

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="flex flex-col-reverse md:flex-col gap-6 md:gap-8 w-full">
        <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
          <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
            <MediumHeader5 className="text-light-900">Wallet Transactions</MediumHeader5>

            <div className="hidden md:flex">
              <Currency />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-[auto] justify-between">
            <div className="flex items-center gap-2">
              <SwitchWallet />
            </div>
          </div>
        </div>

        {isWalletLoading ? (
          <WalletHeaderSkeleton />
        ) : (
          <div
            id="wallet-header"
            className={clsx(
              'flex w-full items-center justify-between px-6 sm:px-8 py-6 gap-2 md:gap-8 rounded-lg h-[220px] sm:h-[200px] lg:h-[250px] xl:h-[250px]'
            )}>
            <div className="flex flex-col justify-between h-full gap-2">
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

                <SemiboldSmallText className="text-light-700">
                  Balance:
                  <span className="text-secondary-700 ml-1 font-bold">
                    {numeral(balance).format('0,0')} SATS
                  </span>
                </SemiboldSmallText>

                <div>
                  {!is_wallet_connected && (
                    <SemiboldSmallerText className="text-light-700">
                      Set up a wallet connection by clicking the connect wallet
                    </SemiboldSmallerText>
                  )}
                </div>
              </div>

              <WithdrawBitcoin />
            </div>

            <div className="max-w-1/3 md:min-w-1/3 justify-end float-right hidden sm:flex">
              <Image
                src="/img/wallet-connect.svg"
                alt="wallet-connect"
                width={200}
                height={200}
                className="w-[200px] h-[200px] object-contain"
              />
            </div>
          </div>
        )}
      </div>

      <div className="w-full">
        <Table
          tableContainerClassName="products-table"
          columns={columns}
          data={transactions}
          rowsPerPage={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          tableHeader={
            <div className="w-full flex items-center justify-between">
              <SemiboldBody className="text-light-900">Wallet Transactions</SemiboldBody>

              {!loading && <WalletTransactionsFilter />}
            </div>
          }
          isLoading={loading}
          emptyMessage="No Transactions"
        />
      </div>
    </div>
  );
}
