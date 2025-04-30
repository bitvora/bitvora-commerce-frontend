'use client';

import { useAPIKeysContext } from './context';
import { useAppContext } from '@/app/contexts';
import { PrimaryButton, RedButton, SecondaryButton } from '@/components/Buttons';
import { app_routes } from '@/lib/constants';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Drawer from 'react-modern-drawer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { MediumTitle, SemiboldBody, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { CloseIcon, DeleteIcon, WarningIcon } from '@/components/Icons';
import { APIKey, CreateAPIKeyType } from '@/types/api-keys';
import Modal from '@/components/Modal';
import { deleteAPIKey, createAPIKey, updateAPIKey } from './actions';
import { useQueryClient } from '@tanstack/react-query';
import { DarkInput, DarkReadonlyInput } from '@/components/Inputs';
import Tabs from '@/components/Tab';
import Accordion from '@/components/Accordion';
import { Checkbox } from '@/components/Checkbox';
import { formatKeyName } from '@/lib/helpers';

const initialPermissions = {
  read: false,
  create: false,
  update: false,
  delete: false
};

const initialValues = {
  name: '',
  permissions: {
    customers: { ...initialPermissions },
    products: { ...initialPermissions },
    subscriptions: { ...initialPermissions },
    payment_links: { ...initialPermissions },
    checkouts: { ...initialPermissions },
    wallets: { ...initialPermissions },
    invoices: { ...initialPermissions },
    webhooks: { ...initialPermissions }
  }
};

const Permissions = ({
  items,
  readOnly = false
}: {
  items: {
    label: string;
    values: {
      read: boolean;
      create: boolean;
      update: boolean;
      delete: boolean;
    };
    onChange?: (perm: string, checked: boolean) => void;
  }[];
  readOnly?: boolean;
}) => {
  return (
    <Accordion
      contentClassName="w-full mt-2 pt-2"
      triggerClassName=""
      containerClassName="mb-5 pb-2 border-b-[0.5px] border-light-300"
      items={items.map(({ label, values, onChange }) => {
        const total = Object.keys(values).length;
        const checked = Object.values(values).filter(Boolean).length;

        const allChecked = checked === total;
        const partiallyChecked = checked > 0 && checked < total;

        const handleSelectAll = () => {
          if (!readOnly && onChange) {
            Object.keys(values).forEach((perm) => {
              onChange(perm, !allChecked);
            });
          }
        };

        return {
          label: (
            <div className="w-full justify-start text-start">
              <SemiboldBody className="text-light-700 capitalize">
                {formatKeyName(label)} ({checked}/{total})
              </SemiboldBody>
            </div>
          ),
          content: (
            <div className="flex flex-col">
              {Object.entries(values).map(([key, value]) => {
                return (
                  <Checkbox
                    key={key}
                    label={key}
                    name={key}
                    checked={value}
                    onChange={() => !readOnly && onChange?.(key, !value)}
                    disabled={readOnly}
                  />
                );
              })}

              {!readOnly && (
                <div className="mt-1 pt-1">
                  <Checkbox
                    label={
                      <SemiboldSmallText className="text-light-600">Select All</SemiboldSmallText>
                    }
                    name={`${label}-select-all`}
                    checked={allChecked}
                    indeterminate={partiallyChecked}
                    onChange={handleSelectAll}
                    disabled={readOnly}
                  />
                </div>
              )}
            </div>
          )
        };
      })}
    />
  );
};

export const CreateAPIKey = () => {
  const { currentAccount } = useAppContext();
  const { refetchAPIKeys } = useAPIKeysContext();
  const [tab, setTab] = useState(1);
  const [generatedKey, setGeneratedKey] = useState('');

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pathname === app_routes.api_keys && searchParams.get('action') === 'new-key') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.api_keys);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.api_keys}?action=new-key`);
  };

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>Generate Key</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required')
          })}
          onSubmit={async (values) => {
            const payload: CreateAPIKeyType = {
              ...values,
              account_id: currentAccount?.id
            };
            try {
              const result = await createAPIKey(payload);

              if (!result.success) {
                toast.error(result.error || 'Error creating api key');
                return;
              }

              setGeneratedKey(result?.data?.data?.token);

              refetchAPIKeys();
              toast.success('Api key created successfully');
              scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              setTab(2);
            } catch (err) {
              console.error(err);
              toast.error('Error creating api key');
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
            setFieldValue,
            resetForm
          }) => (
            <div
              ref={scrollRef}
              className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
              <div className="flex w-full justify-between items-center">
                <SemiboldTitle className="text-light-900">New Key</SemiboldTitle>

                <button
                  className="border-none outline-none cursor-pointer"
                  onClick={() => {
                    resetForm();
                    handleClose();
                  }}>
                  <CloseIcon />
                </button>
              </div>

              <div className="overflow-auto h-full w-full">
                <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full flex flex-col gap-2">
                    {tab === 2 && (
                      <div className="w-full rounded-md px-4 flex items-center bg-yellow-50 py-5 mb-4 gap-3">
                        <WarningIcon />
                        <SemiboldBody className="text-yellow-700">
                          API keys cannot be recovered
                        </SemiboldBody>
                      </div>
                    )}

                    <div className="mb-2 pb-2">
                      <DarkInput
                        label="Name"
                        handleChange={handleChange}
                        name="name"
                        //@ts-expect-error too lazy to fix
                        errors={errors}
                        touched={touched}
                        placeholder="Enter name"
                        value={values.name}
                        showLabel
                        required
                        disabled={tab !== 1}
                      />
                    </div>

                    {tab === 2 && <DarkReadonlyInput value={generatedKey} hidden label='Generated Key' />}
                  </div>

                  <div className="w-full rounded-lg px-3 md:px-4 py-3 md:py-4">
                    <Tabs
                      tabs={[
                        {
                          label: 'Permissions',
                          content: (
                            <div className="w-full mt-3 pt-3">
                              <Permissions
                                items={Object.entries(values.permissions).map(
                                  ([key, permissionValues]) => ({
                                    label: key,
                                    values: permissionValues,
                                    onChange: (permKey: string, checked: boolean) => {
                                      setFieldValue(`permissions.${key}.${permKey}`, checked);
                                    }
                                  })
                                )}
                                readOnly={tab !== 1}
                              />
                            </div>
                          )
                        }
                      ]}
                    />
                  </div>

                  {tab === 1 && (
                    <div className="flex flex-col gap-2 w-full mt-6">
                      <div className="w-full">
                        <PrimaryButton
                          className="w-full h-12"
                          loading={isSubmitting}
                          type="submit"
                          disabled={!isValid || !dirty}>
                          Create Key
                        </PrimaryButton>
                      </div>
                    </div>
                  )}
                </Form>
              </div>
            </div>
          )}
        </Formik>
      </Drawer>
    </>
  );
};

export const DeleteAPIKey = ({
  apiKey,
  isDeleteOpen,
  closeDeleteModal
}: {
  apiKey: APIKey;
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
}) => {
  const { refetchAPIKeys } = useAPIKeysContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAPIKey = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const result = await deleteAPIKey(apiKey.id);

      if (!result.success) {
        toast.error(result.error || 'Error deleting api key');
        return;
      }

      toast.success('Api key deleted successfully');
      refetchAPIKeys();
      closeDeleteModal();
      router.push(app_routes.api_keys);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting api key');
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
          Are you sure you want to delete this key?
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
          onClick={handleDeleteAPIKey}>
          Delete
        </RedButton>
      </div>
    </Modal>
  );
};

export const EditAPIKey = ({
  apiKey,
  isEditOpen,
  toggleEditModal
}: {
  apiKey: APIKey;
  isEditOpen: boolean;
  toggleEditModal: (value: boolean) => void;
}) => {
  const handleClose = () => {
    toggleEditModal(false);
  };

  const { currentAccount } = useAppContext();

  const { refetchAPIKeys } = useAPIKeysContext();
  const queryClient = useQueryClient();

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Drawer
      open={isEditOpen}
      onClose={handleClose}
      direction="right"
      className="drawer"
      overlayOpacity={0.9}>
      <Formik
        initialValues={{
          ...initialValues,
          ...apiKey
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required')
        })}
        enableReinitialize
        onSubmit={async (values) => {
          const payload: CreateAPIKeyType = {
            ...values,
            account_id: currentAccount?.id
          };
          try {
            const result = await updateAPIKey(apiKey.id, payload);

            if (!result.success) {
              toast.error(result.error || 'Error updating api key');
              return;
            }

            refetchAPIKeys();
            toast.success('Api key updated successfully');

            await queryClient.refetchQueries({
              queryKey: ['api-key', apiKey.id]
            });

            scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (err) {
            console.error(err);
            toast.error('Error updating api key');
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
          setFieldValue,
          resetForm
        }) => (
          <div
            className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10"
            ref={scrollRef}>
            <div className="flex w-full justify-between items-center">
              <SemiboldTitle className="text-light-900">Update Key</SemiboldTitle>

              <button
                className="border-none outline-none cursor-pointer"
                onClick={() => {
                  resetForm();
                  handleClose();
                }}>
                <CloseIcon />
              </button>
            </div>

            <div className="overflow-auto h-full w-full">
              <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full flex flex-col gap-2">
                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="Name"
                      handleChange={handleChange}
                      name="name"
                      //@ts-expect-error too lazy to fix
                      errors={errors}
                      touched={touched}
                      placeholder="Enter name"
                      value={values.name}
                      showLabel
                      required
                    />
                  </div>
                </div>

                <div className="w-full rounded-lg px-3 md:px-4 py-3 md:py-4">
                  <Tabs
                    tabs={[
                      {
                        label: 'Permissions',
                        content: (
                          <div className="w-full mt-3 pt-3">
                            <Permissions
                              items={Object.entries(values.permissions).map(
                                ([key, permissionValues]) => ({
                                  label: key,
                                  values: permissionValues,
                                  onChange: (permKey: string, checked: boolean) => {
                                    setFieldValue(`permissions.${key}.${permKey}`, checked);
                                  }
                                })
                              )}
                            />
                          </div>
                        )
                      }
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2 w-full mt-6">
                  <div className="w-full">
                    <PrimaryButton
                      className="w-full h-12"
                      loading={isSubmitting}
                      type="submit"
                      disabled={!isValid || !dirty}>
                      Update Key
                    </PrimaryButton>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </Drawer>
  );
};
