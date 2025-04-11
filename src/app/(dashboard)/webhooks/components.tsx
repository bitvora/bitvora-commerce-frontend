'use client';

import Drawer from 'react-modern-drawer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { MediumTitle, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { PrimaryButton, RedButton, SecondaryButton } from '@/components/Buttons';
import { DarkInput, DarkTextarea, ReadonlyInput } from '@/components/Inputs';
import { deleteWebhook, createWebhook, updateWebhook } from './actions';
import { useWebhookContext } from './context';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { app_routes, webhook_events } from '@/lib/constants';
import { CloseIcon, DeleteIcon } from '@/components/Icons';
import { Checkbox } from '@/components/Checkbox';
import { useAppContext } from '@/app/contexts';
import Modal from '@/components/Modal';
import { useQueryClient } from '@tanstack/react-query';
import { Webhook, CreateWebhookType, NewWebhook } from '@/types/webhooks';
import { formatWebhookEvent } from '@/lib/helpers';
import Tabs from '@/components/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

export const DeleteWebhook = ({
  webhook,
  isDeleteOpen,
  closeDeleteModal
}: {
  webhook: Webhook;
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
}) => {
  const { refetchWebhooks } = useWebhookContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteWebhook = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const result = await deleteWebhook(webhook.id);

      if (!result.success) {
        toast.error(result.error || 'Error deleting webhook');
        return;
      }

      toast.success('Webhook deleted successfully');
      refetchWebhooks();
      closeDeleteModal();
      router.push(app_routes.webhooks);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting webhook');
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
          Are you sure you want to delete this webhook?
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
          onClick={handleDeleteWebhook}>
          Delete
        </RedButton>
      </div>
    </Modal>
  );
};

export const CreateWebhook = () => {
  const { currentAccount } = useAppContext();
  const { refetchWebhooks } = useWebhookContext();
  const [newWebhook, setNewWebhook] = useState<NewWebhook>({} as NewWebhook);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(1);

  useEffect(() => {
    if (pathname === app_routes.webhooks && searchParams.get('action') === 'new-webhook') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setOpen(false);
    setTab(1);
    setNewWebhook({} as NewWebhook);
    router.replace(app_routes.webhooks);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.webhooks}?action=new-webhook`);
  };

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>New Webhook</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">
              {tab === 1 ? 'New Webhook' : 'Webhook Details'}
            </SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-auto h-full w-full">
            {tab === 1 ? (
              <Formik
                initialValues={{
                  account_id: currentAccount?.id || '',
                  url: '',
                  description: '',
                  events: [] as string[]
                }}
                enableReinitialize
                validationSchema={Yup.object({
                  url: Yup.string().required('URL is required').url('Enter a valid URL')
                })}
                onSubmit={async (values, { resetForm }) => {
                  const payload: CreateWebhookType = {
                    account_id: currentAccount?.id,
                    description: values.description,
                    events: values.events,
                    url: values.url
                  };

                  try {
                    const result = await createWebhook(payload);

                    if (!result.success) {
                      toast.error(result.error || 'Error creating webhook');
                      return;
                    }

                    refetchWebhooks();
                    setNewWebhook(result?.data?.data);
                    toast.success('Webhook created successfully');
                    setTab(2);
                    resetForm();
                  } catch (err) {
                    console.error(err);
                    toast.error('Error creating webhook');
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
                    <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full">
                      <div className="mb-2 pb-2">
                        <DarkInput
                          label="URL"
                          handleChange={handleChange}
                          name="url"
                          //@ts-expect-error Too lazy to fix
                          errors={errors}
                          touched={touched}
                          placeholder="Enter webhook url"
                          value={values.url}
                          showLabel
                          required
                          type="url"
                        />
                      </div>

                      <div className="mb-2 pb-2">
                        <DarkTextarea
                          label="Description"
                          handleChange={handleChange}
                          name="description"
                          //@ts-expect-error Too lazy to fix
                          errors={errors}
                          touched={touched}
                          placeholder="Enter webhook description"
                          value={values.description}
                          showLabel
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="mt-2 pt-2">
                      <Tabs
                        tabs={[
                          {
                            label: 'Events',
                            content: (
                              <div className="flex flex-col gap-1 w-full mt-3 pt-3">
                                {webhook_events.map((event) => (
                                  <Checkbox
                                    key={event}
                                    label={formatWebhookEvent(event)}
                                    name="events"
                                    checked={values.events.includes(event)}
                                    onChange={(checked) => {
                                      if (checked) {
                                        setFieldValue('events', [...values.events, event]);
                                      } else {
                                        setFieldValue(
                                          'events',
                                          values.events.filter((e) => e !== event)
                                        );
                                      }
                                    }}
                                  />
                                ))}

                                <Checkbox
                                  label="Select All Events"
                                  name="select_all"
                                  checked={values.events.length === webhook_events.length}
                                  indeterminate={
                                    values.events.length > 0 &&
                                    values.events.length < webhook_events.length
                                  }
                                  onChange={(checked) => {
                                    if (checked) {
                                      setFieldValue('events', webhook_events);
                                    } else {
                                      setFieldValue('events', []);
                                    }
                                  }}
                                />
                              </div>
                            )
                          }
                        ]}
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full mt-6">
                      <div className="mt-4 pt-4 w-full">
                        <PrimaryButton
                          className="w-full h-12"
                          loading={isSubmitting}
                          type="submit"
                          disabled={!isValid || !dirty}>
                          Create Webhook
                        </PrimaryButton>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full flex flex-col gap-6">
                  <ReadonlyInput label="URL" value={newWebhook?.webhook?.url} />

                  <ReadonlyInput label="Secret" value={newWebhook?.secret} hidden />
                </div>

                <div className="mt-2 pt-2">
                  <Tabs
                    tabs={[
                      {
                        label: 'Events',
                        content: (
                          <div className="flex flex-col gap-5 px-2 mb-2 relative mt-2 pt-2">
                            {webhook_events.map((event) => {
                              const isPresent = newWebhook?.webhook?.events.includes(event);
                              return (
                                <div
                                  className={clsx('flex items-center gap-2', {
                                    'text-green-700': isPresent,
                                    'text-red-700': !isPresent
                                  })}
                                  key={event}>
                                  <SemiboldSmallText className="text-light-900 capitalize">
                                    {formatWebhookEvent(event)}
                                  </SemiboldSmallText>
                                  <FontAwesomeIcon
                                    icon={isPresent ? faCheck : faXmark}
                                    className="text-inherit w-8 h-8"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )
                      }
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export const EditWebhook = ({
  webhook,
  isEditOpen,
  toggleEditModal
}: {
  webhook: Webhook;
  isEditOpen: boolean;
  toggleEditModal: (value: boolean) => void;
}) => {
  const { refetchWebhooks } = useWebhookContext();

  const queryClient = useQueryClient();

  const handleClose = () => {
    toggleEditModal(false);
  };

  return (
    <Drawer
      open={isEditOpen}
      onClose={handleClose}
      direction="right"
      className="drawer"
      overlayOpacity={0.9}>
      <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
        <div className="flex w-full justify-between items-center">
          <SemiboldTitle className="text-light-900">Edit Webhook</SemiboldTitle>

          <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-auto h-full w-full">
          <Formik
            initialValues={{
              account_id: webhook?.account_id || '',
              url: webhook?.url || '',
              description: webhook?.description || '',
              events: webhook?.events || ([] as string[])
            }}
            enableReinitialize
            validationSchema={Yup.object({
              url: Yup.string().required('URL is required').url('Enter a valid URL')
            })}
            onSubmit={async (values, { resetForm }) => {
              const payload: CreateWebhookType = {
                account_id: webhook?.account_id,
                description: values.description,
                events: values.events,
                url: values.url
              };

              try {
                const result = await updateWebhook(webhook.id, payload);

                if (!result.success) {
                  toast.error(result.error || 'Error updating webhook');
                  return;
                }

                refetchWebhooks();
                toast.success('Webhook updated successfully');

                await queryClient.refetchQueries({
                  queryKey: ['webhook', webhook.id]
                });
                handleClose();
                resetForm();
              } catch (err) {
                console.error(err);
                toast.error('Error updating webhook');
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
                <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full">
                  <div className="mb-2 pb-2">
                    <DarkInput
                      label="URL"
                      handleChange={handleChange}
                      name="url"
                      //@ts-expect-error Too lazy to fix
                      errors={errors}
                      touched={touched}
                      placeholder="Enter webhook url"
                      value={values.url}
                      showLabel
                      required
                      type="url"
                    />
                  </div>

                  <div className="mb-2 pb-2">
                    <DarkTextarea
                      label="Description"
                      handleChange={handleChange}
                      name="description"
                      //@ts-expect-error Too lazy to fix
                      errors={errors}
                      touched={touched}
                      placeholder="Enter webhook description"
                      value={values.description}
                      showLabel
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-2 pt-2">
                  <Tabs
                    tabs={[
                      {
                        label: 'Events',
                        content: (
                          <div className="flex flex-col gap-1 w-full mt-3 pt-3">
                            {webhook_events.map((event) => (
                              <Checkbox
                                key={event}
                                label={formatWebhookEvent(event)}
                                name="events"
                                checked={values.events.includes(event)}
                                onChange={(checked) => {
                                  if (checked) {
                                    setFieldValue('events', [...values.events, event]);
                                  } else {
                                    setFieldValue(
                                      'events',
                                      values.events.filter((e) => e !== event)
                                    );
                                  }
                                }}
                              />
                            ))}

                            <Checkbox
                              label="Select All Events"
                              name="select_all"
                              checked={values.events.length === webhook_events.length}
                              indeterminate={
                                values.events.length > 0 &&
                                values.events.length < webhook_events.length
                              }
                              onChange={(checked) => {
                                if (checked) {
                                  setFieldValue('events', webhook_events);
                                } else {
                                  setFieldValue('events', []);
                                }
                              }}
                            />
                          </div>
                        )
                      }
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-2 w-full mt-6">
                  <div className="mt-4 pt-4 w-full">
                    <PrimaryButton
                      className="w-full h-12"
                      loading={isSubmitting}
                      type="submit"
                      disabled={!isValid || !dirty}>
                      Update Webhook
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
