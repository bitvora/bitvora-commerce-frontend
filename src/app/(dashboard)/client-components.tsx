'use client';

import Drawer from 'react-modern-drawer';
import { SemiboldSmallerText, SemiboldTitle } from '@/components/Text';
import { useAppContext } from '@/contexts';
import { CreateAccountForm } from '@/components/CreateAccount';
import { memo } from 'react';

const CreateAccountComponent = () => {
  const { accounts, isAccountLoading } = useAppContext();

  const shouldOpenDrawer = !isAccountLoading && accounts.length < 1;

  return (
    <Drawer open={shouldOpenDrawer} direction="right" className="drawer" overlayOpacity={0.9}>
      <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10">
        <div className="flex w-full flex-col justify-center text-center md:text-start md:justify-start">
          <SemiboldTitle className="text-light-900">Create Account</SemiboldTitle>

          <SemiboldSmallerText className="text-light-700">
            Only account name is required. All other fields are optional.
          </SemiboldSmallerText>
        </div>

        <CreateAccountForm />
      </div>
    </Drawer>
  );
};

export const CreateAccount = memo(CreateAccountComponent);
