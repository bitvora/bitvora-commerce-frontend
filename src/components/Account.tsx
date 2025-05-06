/* eslint-disable @next/next/no-img-element */
'use client';

import { useAppContext } from '@/contexts';
import { MediumSmallText, SemiboldSmallText } from '@/components/Text';
import { logout,  } from '@/lib/auth';
import { faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import secureLocalStorage from 'react-secure-storage';
import Dropdown from '@/components/Dropdown';
import { app_routes } from '@/lib/constants';
import { Link } from '@/components/Links';
import { Account } from '@/lib/types';

const AccountMenu = () => {
  const { currentAccount, accounts, updateCurrentAccount } = useAppContext();

  const switchAccounts = async (account: Account) => {
    updateCurrentAccount(account);
  };

  return (
    <Dropdown
      onSelectClose={true}
      trigger={
        <div className="flex gap-2 items-center w-full justify-between">
          <div className="flex items-center flex-1 min-w-0 gap-6 lg:gap-4">
            {currentAccount?.logo ? (
              <img
                src={currentAccount?.logo}
                className="w-8 h-8 rounded-md"
                alt={currentAccount?.name || 'user'}
              />
            ) : (
              <Image
                src="/img/user.svg"
                alt={currentAccount?.name || 'user'}
                height={32}
                width={32}
              />
            )}

            <div>
              <SemiboldSmallText className="text-light-900 truncate overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                {currentAccount?.name}
              </SemiboldSmallText>
            </div>
          </div>

          <div className="text-light-700 hover:text-light-500">
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>
      }
      content={
        <div className="flex flex-col py-2 gap-2 bg-[#211c2b] rounded-md shadow-lg">
          <div className="flex flex-col gap-5 px-4 py-2">
            {accounts.map((account) => {
              return (
                <button
                  key={account.id}
                  onClick={() => switchAccounts(account)}
                  className="flex items-center flex-1 min-w-0 gap-6 lg:gap-4 cursor-pointer text-light-900 hover:text-light-700">
                  {account?.logo ? (
                    <img
                      src={account?.logo}
                      className="w-8 h-8 rounded-md"
                      alt={account?.name || 'user'}
                    />
                  ) : (
                    <Image
                      src="/img/user.svg"
                      alt={account?.name || 'user'}
                      height={32}
                      width={32}
                    />
                  )}

                  <div>
                    <SemiboldSmallText className="text-inherit truncate overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                      {account?.name}
                    </SemiboldSmallText>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t-[0.5px] border-light-500 pt-2 px-4">
            <Link href={`${app_routes.accounts}?action=new-store`}>
              <div
                className={`w-full rounded-md flex gap-3 justify-start items-center py-2 text-secondary-700 hover:text-secondary-500`}>
                <FontAwesomeIcon icon={faPlus} className="text-inherit" />
                <MediumSmallText className="mt-[0.5px]">Create New Account</MediumSmallText>
              </div>
            </Link>
          </div>

          <form
            className="px-6 border-t-[0.5px] py-1 border-light-500"
            onSubmit={async (e) => {
              e.preventDefault();
              secureLocalStorage.clear();
              await logout();
            }}>
            <button
              className={`w-full h-[45px] rounded-md flex gap-3 justify-start items-center py-2 cursor-pointer`}
              type="submit">
              <Image width={16} height={16} src="/icons/logout.svg" alt="Logout" />
              <MediumSmallText className="mt-[0.5px] text-red-700 hover:text-red-500">
                Logout
              </MediumSmallText>
            </button>
          </form>
        </div>
      }
      className="w-full"
      contentClass="w-full bg-light-overlay-50"
      buttonClass="w-full flex gap-2 bg-light-overlay-50 cursor-pointer px-5 mt-3 h-16 items-center rounded-md"
    />
  );
};

export default AccountMenu;
