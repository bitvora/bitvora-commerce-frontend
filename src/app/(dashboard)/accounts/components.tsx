'use client';

import { PrimaryButton, RedButton, SecondaryButton } from '@/components/Buttons';
import { CloseIcon, DeleteIcon } from '@/components/Icons';
import { MediumTitle, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { CreateAccountForm } from '@/components/CreateAccount';
import { useAppContext } from '@/contexts';
import Modal from '@/components/Modal';
import { Account } from '@/lib/types';
import toast from 'react-hot-toast';
import { deleteAccount, updateAccount } from '@/lib/actions';
import { useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { DarkInput } from '@/components/Inputs';
import { CountrySelect } from '@/components/Selects';
import ImageComponent from '@/components/Image';

export const AddNewStore = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.accounts);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.accounts}?action=new-store`);
  };

  useEffect(() => {
    if (pathname === app_routes.accounts && searchParams.get('action') === 'new-store') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>Add New Store</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">New Account</SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <CreateAccountForm />
        </div>
      </Drawer>
    </>
  );
};

export const DeleteAccount = ({
  account,
  isDeleteOpen,
  closeDeleteModal
}: {
  account: Account;
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
}) => {
  const { refetchAccount } = useAppContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const result = await deleteAccount(account.id);

      if (!result.success) {
        toast.error(result.error || 'Error deleting account');
        return;
      }

      toast.success('Account deleted successfully');
      refetchAccount();
      closeDeleteModal();
      router.push(app_routes.accounts);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      className="w-full max-w-[600px] p-8 flex flex-col gap-6"
      open={isDeleteOpen}
      onClose={closeDeleteModal}>
      <div className="bg-red-50 w-11 h-11 flex items-center text-center justify-center rounded-md">
        <DeleteIcon height={20} width={20} />
      </div>

      <div className="flex flex-col gap-1">
        <MediumTitle className="text-light-900">
          Are you sure you want to delete this account?
        </MediumTitle>
        <SemiboldSmallText className="text-light-700">
          This action cannot be undone.
        </SemiboldSmallText>
      </div>

      <div className="w-full flex items-center md:ml-auto justify-between md:justify-end gap-4 mt-4">
        <SecondaryButton className="h-11 w-full md:w-28" onClick={closeDeleteModal}>
          Cancel
        </SecondaryButton>

        <RedButton
          className="h-11 w-full md:w-27"
          loading={isDeleting}
          onClick={handleDeleteAccount}>
          Delete
        </RedButton>
      </div>
    </Modal>
  );
};

export const AccountImageModal = ({
  account,
  isImageOpen,
  closeImageModal
}: {
  account: Account;
  isImageOpen: boolean;
  closeImageModal: () => void;
}) => {
  return (
    <Modal
      className="max-w-[300px] max-h-[300px] sm:max-w-[450px] sm:max-h-[450px] md:max-w-[500px] md:max-h-[500px] w-full h-full px-0 py-0 flex flex-col gap-6"
      open={isImageOpen}
      onClose={closeImageModal}>
      <ImageComponent
        src={account?.logo}
        alt={account?.name}
        className="w-full h-full rounded-md object-cover"
      />
    </Modal>
  );
};

export const EditAccount = ({
  account,
  isEditOpen,
  toggleEditModal
}: {
  account: Account;
  isEditOpen: boolean;
  toggleEditModal: (value: boolean) => void;
}) => {
  const { refetchAccount } = useAppContext();

  const handleClose = () => {
    toggleEditModal(false);
  };

  const queryClient = useQueryClient();

  return (
    <Drawer
      open={isEditOpen}
      onClose={handleClose}
      direction="right"
      className="drawer"
      overlayOpacity={0.9}>
      <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10">
        <div className="flex w-full justify-between items-center">
          <SemiboldTitle className="text-light-900">Edit Account</SemiboldTitle>

          <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-auto h-full w-full">
          <Formik
            initialValues={{
              name: account?.name || '',
              logo: account?.logo || '',
              address_line1: account?.address_line1 || '',
              address_line2: account?.address_line2 || '',
              city: account?.city || '',
              state: account?.state || '',
              postal_code: account?.postal_code || '',
              country: account?.country || ''
            }}
            enableReinitialize
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required')
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                const result = await updateAccount(account.id, values);

                if (!result.success) {
                  toast.error(result.error || 'Error updating account');
                  return;
                }

                refetchAccount();
                toast.success('Account updated successfully');
                await queryClient.refetchQueries({
                  queryKey: ['accounts', account.id]
                });
                handleClose();
                resetForm();
              } catch (err) {
                console.error(err);
                toast.error('Error updating account');
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
              dirty,
              setFieldValue
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <div className="rounded-lg px-6 py-6 bg-primary-150 w-full h-full">
                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Name"
                      handleChange={handleChange}
                      name="name"
                      errors={errors}
                      touched={touched}
                      placeholder="Enter Account Name"
                      value={values.name}
                      showLabel
                      required
                    />
                  </div>

                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Logo"
                      handleChange={handleChange}
                      name="logo"
                      errors={errors}
                      touched={touched}
                      type="url"
                      placeholder="Enter Logo URL"
                      value={values.logo}
                      showLabel
                    />
                  </div>

                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Address Line 1"
                      handleChange={handleChange}
                      name="address_line1"
                      errors={errors}
                      touched={touched}
                      placeholder="Enter Address Line 1"
                      value={values.address_line1}
                      showLabel
                    />
                  </div>

                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Address Line 2"
                      handleChange={handleChange}
                      name="address_line2"
                      errors={errors}
                      touched={touched}
                      placeholder="Enter Address Line 2"
                      value={values.address_line2}
                      showLabel
                    />
                  </div>

                  <div className="w-full flex justify-between items-center gap-3">
                    <div className="mb-2 pb-2 w-full">
                      <DarkInput
                        label="City"
                        handleChange={handleChange}
                        name="city"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter City"
                        value={values.city}
                        showLabel
                      />
                    </div>

                    <div className="mb-2 pb-2 w-full">
                      <DarkInput
                        label="State/province"
                        handleChange={handleChange}
                        name="state"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter State"
                        value={values.state}
                        showLabel
                      />
                    </div>
                  </div>

                  <div className="w-full flex justify-between items-center gap-3">
                    <div className="mb-2 pb-2 w-full">
                      <DarkInput
                        label="Postal Code"
                        handleChange={handleChange}
                        name="postal_code"
                        errors={errors}
                        touched={touched}
                        placeholder="Enter Postal Code"
                        value={values.postal_code}
                        showLabel
                      />
                    </div>

                    <div className="mb-2 pb-2 w-full">
                      <CountrySelect
                        handleChange={async (value) => await setFieldValue('country', value)}
                        errors={errors}
                        touched={touched}
                        value={values.country}
                        name="country"
                        label="Country"
                        placeholder="Select your Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full mt-6">
                  <div className="mt-4 pt-4 w-full">
                    <PrimaryButton
                      className="w-full h-12"
                      loading={isSubmitting}
                      type="submit"
                      disabled={!isValid || !dirty}>
                      Update Account
                    </PrimaryButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Drawer>
  );
};
