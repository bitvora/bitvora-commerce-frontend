/* eslint-disable @next/next/no-img-element */
'use client';

import { Account } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { app_routes } from '@/lib/constants';
import Drawer from 'react-modern-drawer';
import { Skeleton, AccountDetailsItem } from './components';
import { SemiboldBody, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { Link } from '@/components/Links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '@/lib/helpers';
import { RedButton, SecondaryButton } from '@/components/Buttons';
import { useAppContext } from '@/contexts';
import {
  AccountImageModal,
  DeleteAccount,
  EditAccount
} from '@/app/(dashboard)/accounts/components';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [account, setAccount] = useState<Account>({} as Account);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const { currentAccount } = useAppContext();

  const { data } = useQuery({
    queryKey: ['accounts', id],
    queryFn: () => getAccount(id),
    enabled: !!id,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (data?.data) {
      setAccount(data?.data);
      setLoading(false);
    }
  }, [data]);

  const handleClose = () => {
    router.push(app_routes.accounts);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
  };

  const toggleEditModal = useCallback((value: boolean) => {
    setIsEditOpen(value);
  }, []);

  const closeImageModal = () => {
    setIsImageOpen(false);
  };

  return (
    <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">Account Details</SemiboldTitle>

            <Link href={app_routes.accounts}>
              <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>

          <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full overflow-auto flex flex-col gap-10">
            <div className="w-full flex gap-3 sm:gap-6 items-start">
              <div
                className="w-[100px] h-[100px] max-w-[100px] max-h-[100px] cursor-pointer"
                onClick={() => setIsImageOpen(true)}>
                <img
                  src={account?.logo}
                  alt={account?.name}
                  className="w-full h-full rounded-md object-cover"
                />
              </div>

              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex flex-col gap-1">
                  <div>
                    <SemiboldBody className="text-light-900">{account?.name}</SemiboldBody>
                  </div>

                  {account?.city && (
                    <div>
                      <SemiboldSmallText className="text-light-700">
                        {account?.city}
                      </SemiboldSmallText>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-primary-150 w-full overflow-auto flex flex-col gap-6 pr-4">
              <AccountDetailsItem label="Account ID" value={account?.id} id />

              <AccountDetailsItem label="Account Name" value={account?.name} />

              {account?.address_line1 && (
                <AccountDetailsItem label="Address 1" value={account?.address_line1} />
              )}

              {account?.address_line2 && (
                <AccountDetailsItem label="Address 2" value={account?.address_line2} />
              )}

              {account?.city && <AccountDetailsItem label="City" value={account?.city} />}

              {account?.state && <AccountDetailsItem label="State" value={account?.state} />}

              {account?.postal_code && (
                <AccountDetailsItem label="Postal Code" value={account?.postal_code} />
              )}

              {account?.country && <AccountDetailsItem label="Country" value={account?.country} />}

              <AccountDetailsItem label="Created" value={formatDate(account?.created_at)} />
            </div>
          </div>

          <div className="flex gap-4 items-center border-none outline-none">
            <SecondaryButton className="h-11 w-full" onClick={() => toggleEditModal(true)}>
              Edit Account
            </SecondaryButton>

            {currentAccount?.id !== id && (
              <RedButton
                className="h-11 w-full border-none outline-none"
                onClick={() => setIsDeleteOpen(true)}>
                Delete Account
              </RedButton>
            )}
          </div>

          <EditAccount
            isEditOpen={isEditOpen}
            account={account}
            toggleEditModal={toggleEditModal}
          />

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
        </div>
      )}
    </Drawer>
  );
}
