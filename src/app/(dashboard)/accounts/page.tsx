'use client';

export const dynamic = 'force-dynamic';

import Currency from '@/components/Currency';
import {
  BoldSmallText,
  MediumHeader5,
  SemiboldBody,
  SemiboldCaption,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import clsx from 'clsx';
import Image from 'next/image';
import { Link } from '@/components/Links';
import { app_routes } from '@/lib/constants';
import { useAppContext } from '@/contexts';
import { AddNewStore } from './components';
import { DeleteIcon, EditIcon } from '@/components/Icons';
import { useCallback, useState } from 'react';
import { Account } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { AccountImageModal, DeleteAccount, EditAccount } from './components';
import ImageComponent from '@/components/Image';

export default function Page() {
  const { currentAccount, accounts } = useAppContext();
  const router = useRouter();
  const [account, setAccount] = useState<Account>({} as Account);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const toggleEditModal = useCallback(
    (value: boolean) => {
      setIsEditOpen(value);

      if (!value) {
        setAccount({} as Account);
        router.replace(app_routes.accounts);
      }
    },
    [router]
  );

  const handleEdit = (account) => {
    setAccount(account);

    toggleEditModal(true);
  };

  console.log({ account });

  const handleDelete = (account) => {
    setAccount(account);
    setIsDeleteOpen(true);
  };

  const closeImageModal = () => {
    setAccount({} as Account);
    setIsImageOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 md:gap-8 bg-primary-50 md:bg-primary-150 px-0 sm:px-3 pt-6 lg:pt-0 pb-8 w-full">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-4 sm:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="sm:gap-4 md:gap-10 items-center hidden sm:flex">
          <MediumHeader5>Account Management</MediumHeader5>

          <div className="hidden md:flex">
            <Currency />
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-[auto] justify-between">
          <div>{<AddNewStore />}</div>
        </div>
      </div>

      <div
        className={clsx(
          'flex w-full items-center justify-between px-6 sm:px-8 py-6 gap-2 md:gap-8 rounded-lg h-[180px] sm:h-[200px] lg:h-[220px] xl:h-[200px]'
        )}
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
              'flex text-center justify-center items-center px-4 py-1.5 rounded-2xl w-fit bg-green-50'
            )}>
            <SemiboldSmallText className={clsx('hidden md:flex lg:hidden xl:flex text-green-700')}>
              Current Account: {currentAccount?.name}
            </SemiboldSmallText>

            <SemiboldCaption className={clsx('md:hidden lg:flex xl:hidden text-green-700')}>
              Current Account: {currentAccount?.name}
            </SemiboldCaption>
          </div>

          <div className="flex flex-col gap-1">
            <BoldSmallText className="text-light-900 md:hidden lg:flex xl:hidden">
              {currentAccount?.name}
            </BoldSmallText>
            <MediumHeader5 className="text-light-900 hidden md:flex lg:hidden xl:flex">
              {currentAccount?.name}
            </MediumHeader5>

            <div>
              <Link href={`${app_routes.accounts}/${currentAccount?.id}`}>
                <SemiboldSmallText className="text-secondary-700 hover:text-secondary-800">
                  Open account details
                </SemiboldSmallText>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-1/3 md:min-w-1/3 flex justify-end float-right">
          <Image
            src="/img/account.svg"
            alt="account"
            width={200}
            height={200}
            className="w-[200px] h-[200px] object-contain"
          />
        </div>
      </div>

      <EditAccount isEditOpen={isEditOpen} account={account} toggleEditModal={toggleEditModal} />

      <DeleteAccount
        account={account}
        isDeleteOpen={isDeleteOpen}
        closeDeleteModal={closeDeleteModal}
      />

      <AccountImageModal
        account={account}
        isImageOpen={isImageOpen}
        closeImageModal={closeImageModal}
      />

      <div className="bg-primary-50 px-6 sm:px-8 py-6 gap-2 md:gap-8 w-full h-full flex">
        <div className="w-1/3 hidden md:flex flex-col gap-4 border-r-[0.5px] border-light-400 pr-4">
          <SemiboldBody className="text-light-900">Accounts</SemiboldBody>

          <SemiboldSmallText className="text-light-500">Manage accounts</SemiboldSmallText>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-8">
          {accounts.map((account) => {
            return (
              <div key={account.id} className="w-full flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <button
                      className="cursor-pointer border-none outline-none hidden md:flex"
                      onClick={() => {
                        setAccount(account);
                        setIsImageOpen(true);
                      }}>
                      <ImageComponent
                        src={account.logo}
                        alt={account.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    </button>

                    <div>
                      <SemiboldSmallText className="text-light-900 truncate hidden md:flex">
                        {account.name}
                      </SemiboldSmallText>
                      <SemiboldSmallerText className="truncate md:hidden text-light-900">
                        {account.name}
                      </SemiboldSmallerText>

                      <Link href={`${app_routes.accounts}/${account.id}`} className="text-inherit">
                        <SemiboldSmallText className="text-light-500 hover:text-light-700">
                          View Details
                        </SemiboldSmallText>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => handleEdit(account)}
                    className="h-8 w-8 cursor-pointer rounded-md hover:bg-light-overlay-50 flex items-center text-center justify-center border-none outline-none">
                    <EditIcon />
                  </button>

                  <button
                    onClick={() => handleDelete(account)}
                    disabled={currentAccount?.id === account?.id}
                    className={clsx(
                      'h-8 w-8 rounded-md flex items-center text-center justify-center border-none outline-none',
                      {
                        'cursor-pointer hover:bg-light-overlay-50':
                          currentAccount?.id !== account?.id,
                        'cursor-not-allowed': currentAccount?.id === account?.id
                      }
                    )}>
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
