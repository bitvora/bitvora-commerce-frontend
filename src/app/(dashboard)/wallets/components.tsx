'use client';

import { useAppContext } from '@/app/contexts';
import { PrimaryButton } from '@/components/Buttons';
import { SemiboldSmallerText, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Drawer from 'react-modern-drawer';
import { CloseIcon } from '@/components/Icons';
import { DarkInput } from '@/components/Inputs';
import { connectWallet } from './actions';

export const ConnectWallet = () => {
  const { currentAccount, refetchWallet } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname === app_routes.wallet && searchParams.get('action') === 'connect-wallet') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.wallet);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.wallet}?action=connect-wallet`);
  };

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>Connect Wallet</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">New Wallet Connect</SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-auto h-full w-full">
            <Formik
              initialValues={{
                wallet_connect: ''
              }}
              enableReinitialize
              validationSchema={Yup.object({
                wallet_connect: Yup.string().required('Name is required')
              })}
              onSubmit={async (values, { resetForm }) => {
                const payload = {
                  account_id: currentAccount?.id,
                  wallet_connect: values.wallet_connect
                };

                try {
                  const result = await connectWallet(payload);

                  if (!result.success) {
                    toast.error(result.error || 'Error connecting wallet');
                    return;
                  }

                  refetchWallet();
                  toast.success('Wallet connected successfully');
                  handleClose();
                  resetForm();
                } catch (err) {
                  console.error(err);
                  toast.error('Error connecting wallet');
                }
              }}>
              {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                isValid,
                dirty
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full">
                    <div className="mb-2 pb-2">
                      <DarkInput
                        label="Wallet Connect URL"
                        handleChange={handleChange}
                        name="wallet_connect"
                        errors={errors}
                        touched={touched}
                        placeholder="Wallet Connect URL"
                        value={values.wallet_connect}
                        showLabel
                        required
                      />

                      <SemiboldSmallerText className="text-light-700 mt-2 pt-2">
                        Enter the wallet connect URL from your compatible wallet application
                      </SemiboldSmallerText>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-6 fixed bottom-4 md:bottom-6 left-2 md:left-6 right-2 md:right-6">
                    <div className="mt-4 pt-4 w-full rounded-lg px-2 lg:px-6">
                      <PrimaryButton
                        className="w-full h-12"
                        loading={isSubmitting}
                        type="submit"
                        disabled={!isValid || !dirty}>
                        Connect Wallet
                      </PrimaryButton>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Drawer>
    </>
  );
};
