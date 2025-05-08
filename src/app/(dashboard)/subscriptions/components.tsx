/* eslint-disable @next/next/no-img-element */
'use client';

import { CreateSubscriptionType, Subscription } from '@/types/subscriptions';
import { useSubscriptionContext } from './context';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createSubscription, deleteSubscription, updateSubscription } from './actions';
import toast from 'react-hot-toast';
import { app_routes } from '@/lib/constants';
import Modal from '@/components/Modal';
import { CloseIcon, DeleteIcon } from '@/components/Icons';
import { MediumTitle, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { PrimaryButton, RedButton, SecondaryButton } from '@/components/Buttons';
import Drawer from 'react-modern-drawer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAppContext } from '@/contexts';
import {
  DarkAutocomplete,
  DarkAutocompleteHandle,
  DarkInput,
  DarkTextarea
} from '@/components/Inputs';
import { useCustomerContext } from '@/app/(dashboard)/customers/context';
import { Link } from '@/components/Links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useProductContext } from '@/app/(dashboard)/products/context';
import { CalendarInput } from '@/components/Selects';
import { useQueryClient } from '@tanstack/react-query';

export const DeleteSubscriptionModal = ({
  subscription,
  isDeleteOpen,
  closeDeleteModal
}: {
  subscription: Subscription;
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
}) => {
  const { refetchSubscriptions } = useSubscriptionContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteSubscription = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const result = await deleteSubscription(subscription.id);

      if (!result.success) {
        toast.error(result.error || 'Error deleting subscription');
        return;
      }

      toast.success('Subscription deleted successfully');
      refetchSubscriptions();
      closeDeleteModal();
      router.push(app_routes.subscriptions);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting subscription');
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
          Are you sure you want to delete this subscription?
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
          onClick={handleDeleteSubscription}>
          Delete
        </RedButton>
      </div>
    </Modal>
  );
};

export const AddSubscription = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customers } = useCustomerContext();
  const { products } = useProductContext();
  const { currentAccount } = useAppContext();
  const { refetchSubscriptions } = useSubscriptionContext();

  const customerAutocompleteRef = useRef<DarkAutocompleteHandle>(null);
  const productAutocompleteRef = useRef<DarkAutocompleteHandle>(null);

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.subscriptions);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.subscriptions}?action=new-subscription`);
  };

  useEffect(() => {
    if (
      pathname === app_routes.subscriptions &&
      searchParams.get('action') === 'new-subscription'
    ) {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[170px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>New Subscription</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">New Subscription</SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-auto h-full w-full">
            <Formik
              initialValues={{
                account_id: currentAccount?.id || '',
                customer_id: '',
                product_id: '',
                metadata_notes: '',
                metadata_additional_info: '',
                nostr_relay: '',
                nostr_pubkey: '',
                nostr_secret: '',
                billing_start_date: '',
                active_on_date: ''
              }}
              enableReinitialize
              validationSchema={Yup.object({
                customer_id: Yup.string().required('Customer is required'),
                product_id: Yup.string().required('Product is required'),
                nostr_relay: Yup.string().required('Nostr Relay is required'),
                nostr_pubkey: Yup.string().required('Nostr Public Key is required'),
                nostr_secret: Yup.string().required('Nostr Secret Key is required'),
                billing_start_date: Yup.string().required('Billing Start Date is required'),
                active_on_date: Yup.string().required('Active On Date is required')
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  let payload: CreateSubscriptionType = {
                    account_id: currentAccount.id,
                    customer_id: values.customer_id,
                    product_id: values.product_id,
                    nostr_relay: values.nostr_relay,
                    nostr_pubkey: values.nostr_pubkey,
                    nostr_secret: values.nostr_secret,
                    billing_start_date: values.billing_start_date,
                    active_on_date: values.active_on_date
                  };

                  if (values.metadata_additional_info) {
                    payload = {
                      ...payload,
                      metadata: {
                        ...payload.metadata,
                        additional_info: values.metadata_additional_info
                      }
                    };
                  }

                  if (values.metadata_notes) {
                    payload = {
                      ...payload,
                      metadata: {
                        ...payload.metadata,
                        notes: values.metadata_notes
                      }
                    };
                  }

                  const result = await createSubscription(payload);
                  if (!result.success) {
                    toast.error(result.error || 'Error creating subscription');
                    return;
                  }
                  refetchSubscriptions();
                  toast.success('Subscription created successfully');
                  customerAutocompleteRef.current?.clear();
                  productAutocompleteRef.current?.clear();
                  handleClose();
                  resetForm();
                  router.push(`${app_routes.subscriptions}/${result?.data?.data?.id}`);
                } catch (err) {
                  console.error(err);
                  toast.error('Error creating subscription');
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
              }) => {
                return (
                  <Form noValidate onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 w-full mt-6">
                      <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full flex flex-col gap-6">
                        <div className="flex flex-col w-full gap-2">
                          <DarkAutocomplete
                            ref={customerAutocompleteRef}
                            label="Customer"
                            name="customer_id"
                            placeholder="Search Customer"
                            options={customers}
                            required
                            onChange={(value) => setFieldValue('customer_id', value.id)}
                            showLabel
                            getOptionLabel={(option) => option.name}
                          />

                          <Link
                            href={`${app_routes.customers}?action=new-customer`}
                            target="_blank"
                            referrerPolicy="same-origin">
                            <div className="text-secondary-700 hover:text-secondary-400 flex items-center gap-2">
                              <FontAwesomeIcon icon={faPlus} />
                              <SemiboldSmallText className="text-inherit">
                                New Customer
                              </SemiboldSmallText>
                            </div>
                          </Link>
                        </div>

                        <div className="flex flex-col w-full gap-2">
                          <DarkAutocomplete
                            ref={productAutocompleteRef}
                            label="Product"
                            name="product_id"
                            placeholder="Search Product"
                            options={products.filter((product) => product.is_recurring)}
                            required
                            onChange={(value) => setFieldValue('product_id', value.id)}
                            showLabel
                            getOptionLabel={(option) => option.name}
                            renderOption={(option) => (
                              <div className="flex items-center gap-4">
                                <img
                                  src={option.image}
                                  className="w-7 h-7 rounded-sm"
                                  alt={option?.name}
                                />
                                <SemiboldSmallText className="text-inherit">
                                  {option.name}
                                </SemiboldSmallText>
                              </div>
                            )}
                          />

                          <Link
                            href={`${app_routes.products}?action=new-product`}
                            target="_blank"
                            referrerPolicy="same-origin">
                            <div className="text-secondary-700 hover:text-secondary-400 flex items-center gap-2">
                              <FontAwesomeIcon icon={faPlus} />
                              <SemiboldSmallText className="text-inherit">
                                New Product
                              </SemiboldSmallText>
                            </div>
                          </Link>
                        </div>

                        <div className="flex w-full gap-2 justify-between">
                          <div className="w-full">
                            <CalendarInput
                              handleChange={async (value) =>
                                await setFieldValue('billing_start_date', value)
                              }
                              name="billing_start_date"
                              placeholder="Billing Start Date"
                              errors={errors}
                              touched={touched}
                              value={values.billing_start_date}
                              minDate={new Date()}
                              showLabel
                              required
                              label="Billing Start Date"
                            />
                          </div>

                          <div className="w-full">
                            <CalendarInput
                              handleChange={async (value) =>
                                await setFieldValue('active_on_date', value)
                              }
                              name="active_on_date"
                              placeholder="Active On Date"
                              errors={errors}
                              touched={touched}
                              value={values.active_on_date}
                              minDate={
                                values.billing_start_date
                                  ? new Date(values.billing_start_date)
                                  : new Date()
                              }
                              showLabel
                              required
                              label="Active On Date"
                            />
                          </div>
                        </div>

                        <div>
                          <DarkInput
                            label="Nostr Public Relay"
                            handleChange={handleChange}
                            name="nostr_relay"
                            errors={errors}
                            touched={touched}
                            placeholder="Nostr Public Relay"
                            value={values.nostr_relay}
                            showLabel
                            required
                          />
                        </div>

                        <div>
                          <DarkInput
                            label="Nostr Public Key"
                            handleChange={handleChange}
                            name="nostr_pubkey"
                            errors={errors}
                            touched={touched}
                            placeholder="Nostr Public Key"
                            value={values.nostr_pubkey}
                            showLabel
                            required
                          />
                        </div>

                        <div>
                          <DarkInput
                            label="Nostr Secret Key"
                            handleChange={handleChange}
                            name="nostr_secret"
                            type="password"
                            errors={errors}
                            touched={touched}
                            placeholder="Nostr Secret Key"
                            value={values.nostr_secret}
                            showLabel
                            required
                          />
                        </div>
                      </div>

                      <div className="py-2 mt-2">
                        <SemiboldSmallText className="text-light-900">Meta data</SemiboldSmallText>
                      </div>

                      <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full flex flex-col gap-6">
                        <div>
                          <DarkTextarea
                            label="Notes"
                            handleChange={handleChange}
                            name="metadata_notes"
                            errors={errors}
                            touched={touched}
                            placeholder="Notes"
                            value={values.metadata_notes}
                            showLabel
                            rows={3}
                          />
                        </div>

                        <div>
                          <DarkTextarea
                            label="Additional Info"
                            handleChange={handleChange}
                            name="metadata_additional_info"
                            errors={errors}
                            touched={touched}
                            placeholder="Additional Info"
                            value={values.metadata_additional_info}
                            showLabel
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 w-full">
                        <PrimaryButton
                          className="w-full h-12"
                          loading={isSubmitting}
                          type="submit"
                          disabled={!isValid || !dirty}>
                          Create Subscription
                        </PrimaryButton>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export const EditSubscription = ({
  subscription,
  isEditOpen,
  toggleEditModal
}: {
  subscription: Subscription;
  isEditOpen: boolean;
  toggleEditModal: (value: boolean) => void;
}) => {
  const { refetchSubscriptions } = useSubscriptionContext();

  const { customers } = useCustomerContext();
  const { products } = useProductContext();
  const router = useRouter();

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
      <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
        <div className="flex w-full justify-between items-center">
          <SemiboldTitle className="text-light-900">Edit Subscription</SemiboldTitle>

          <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-auto h-full w-full">
          <Formik
            initialValues={{
              account_id: subscription?.account_id || '',
              customer_id: subscription?.customer_id || '',
              product_id: subscription?.product_id || '',
              metadata_notes: subscription?.metadata?.notes || '',
              metadata_additional_info: subscription?.metadata?.additional_info || '',
              nostr_relay: subscription?.nostr_relay || '',
              nostr_pubkey: subscription?.nostr_pubkey || '',
              nostr_secret: subscription?.nostr_secret || '',
              billing_start_date: subscription?.billing_start_date || '',
              active_on_date: subscription?.active_on_date || ''
            }}
            enableReinitialize
            validationSchema={Yup.object({
              customer_id: Yup.string().required('Customer is required'),
              product_id: Yup.string().required('Product is required'),
              nostr_relay: Yup.string().required('Nostr Relay is required'),
              nostr_pubkey: Yup.string().required('Nostr Public Key is required'),
              nostr_secret: Yup.string().required('Nostr Secret Key is required'),
              billing_start_date: Yup.string().required('Billing Start Date is required'),
              active_on_date: Yup.string().required('Active On Date is required')
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                let payload: CreateSubscriptionType = {
                  account_id: subscription?.account_id,
                  customer_id: values.customer_id,
                  product_id: values.product_id,
                  nostr_relay: values.nostr_relay,
                  nostr_pubkey: values.nostr_pubkey,
                  nostr_secret: values.nostr_secret,
                  billing_start_date: values.billing_start_date,
                  active_on_date: values.active_on_date
                };

                if (values.metadata_additional_info) {
                  payload = {
                    ...payload,
                    metadata: {
                      ...payload.metadata,
                      additional_info: values.metadata_additional_info
                    }
                  };
                }

                if (values.metadata_notes) {
                  payload = {
                    ...payload,
                    metadata: {
                      ...payload.metadata,
                      notes: values.metadata_notes
                    }
                  };
                }

                const result = await updateSubscription(subscription.id, payload);
                if (!result.success) {
                  toast.error(result.error || 'Error updating subscription');
                  return;
                }
                refetchSubscriptions();
                toast.success('Subscription updated successfully');
                await queryClient.refetchQueries({
                  queryKey: ['subscription', subscription.id]
                });

                handleClose();
                resetForm();
                router.push(`${app_routes.subscriptions}/${result?.data?.data?.id}`);
              } catch (err) {
                console.error(err);
                toast.error('Error updating subscription');
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
            }) => {
              const customer_name = customers?.find(
                (customer) => customer.id === values.customer_id
              )?.name;

              const product_name = products?.find(
                (product) => product.id === values.product_id
              )?.name;

              return (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2 w-full mt-6">
                    <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full flex flex-col gap-6">
                      <div className="flex flex-col w-full gap-2">
                        <DarkAutocomplete
                          label="Customer"
                          name="customer_id"
                          placeholder="Search Customer"
                          options={customers}
                          required
                          onChange={(value) => setFieldValue('customer_id', value.id)}
                          showLabel
                          getOptionLabel={(option) => option.name}
                          isInputComplete
                          defaultValue={customer_name}
                        />

                        <Link
                          href={`${app_routes.customers}?action=new-customer`}
                          target="_blank"
                          referrerPolicy="same-origin">
                          <div className="text-secondary-700 hover:text-secondary-400 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} />
                            <SemiboldSmallText className="text-inherit">
                              New Customer
                            </SemiboldSmallText>
                          </div>
                        </Link>
                      </div>

                      <div className="flex flex-col w-full gap-2">
                        <DarkAutocomplete
                          label="Product"
                          name="product_id"
                          placeholder="Search Product"
                          options={products.filter((product) => product.is_recurring)}
                          required
                          onChange={(value) => setFieldValue('product_id', value.id)}
                          showLabel
                          getOptionLabel={(option) => option.name}
                          renderOption={(option) => (
                            <div className="flex items-center gap-4">
                              <img
                                src={option.image}
                                className="w-7 h-7 rounded-sm"
                                alt={option?.name}
                              />
                              <SemiboldSmallText className="text-inherit">
                                {option.name}
                              </SemiboldSmallText>
                            </div>
                          )}
                          isInputComplete
                          defaultValue={product_name}
                        />

                        <Link
                          href={`${app_routes.products}?action=new-product`}
                          target="_blank"
                          referrerPolicy="same-origin">
                          <div className="text-secondary-700 hover:text-secondary-400 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} />
                            <SemiboldSmallText className="text-inherit">
                              New Product
                            </SemiboldSmallText>
                          </div>
                        </Link>
                      </div>

                      <div className="flex w-full gap-2 justify-between">
                        <div className="w-full">
                          <CalendarInput
                            handleChange={async (value) =>
                              await setFieldValue('billing_start_date', value)
                            }
                            name="billing_start_date"
                            placeholder="Billing Start Date"
                            errors={errors}
                            touched={touched}
                            value={values.billing_start_date}
                            minDate={new Date()}
                            showLabel
                            required
                            label="Billing Start Date"
                          />
                        </div>

                        <div className="w-full">
                          <CalendarInput
                            handleChange={async (value) =>
                              await setFieldValue('active_on_date', value)
                            }
                            name="active_on_date"
                            placeholder="Active On Date"
                            errors={errors}
                            touched={touched}
                            value={values.active_on_date}
                            minDate={
                              values.billing_start_date
                                ? new Date(values.billing_start_date)
                                : new Date()
                            }
                            showLabel
                            required
                            label="Active On Date"
                          />
                        </div>
                      </div>

                      <div>
                        <DarkInput
                          label="Nostr Public Relay"
                          handleChange={handleChange}
                          name="nostr_relay"
                          errors={errors}
                          touched={touched}
                          placeholder="Nostr Public Relay"
                          value={values.nostr_relay}
                          showLabel
                          required
                        />
                      </div>

                      <div>
                        <DarkInput
                          label="Nostr Public Key"
                          handleChange={handleChange}
                          name="nostr_pubkey"
                          errors={errors}
                          touched={touched}
                          placeholder="Nostr Public Key"
                          value={values.nostr_pubkey}
                          showLabel
                          required
                        />
                      </div>

                      <div>
                        <DarkInput
                          label="Nostr Secret Key"
                          handleChange={handleChange}
                          name="nostr_secret"
                          type="password"
                          errors={errors}
                          touched={touched}
                          placeholder="Nostr Secret Key"
                          value={values.nostr_secret}
                          showLabel
                          required
                        />
                      </div>
                    </div>

                    <div className="py-2 mt-2">
                      <SemiboldSmallText className="text-light-900">Meta data</SemiboldSmallText>
                    </div>

                    <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full flex flex-col gap-6">
                      <div>
                        <DarkTextarea
                          label="Notes"
                          handleChange={handleChange}
                          name="metadata_notes"
                          errors={errors}
                          touched={touched}
                          placeholder="Notes"
                          value={values.metadata_notes}
                          showLabel
                          rows={3}
                        />
                      </div>

                      <div>
                        <DarkTextarea
                          label="Additional Info"
                          handleChange={handleChange}
                          name="metadata_additional_info"
                          errors={errors}
                          touched={touched}
                          placeholder="Additional Info"
                          value={values.metadata_additional_info}
                          showLabel
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 w-full">
                      <PrimaryButton
                        className="w-full h-12"
                        loading={isSubmitting}
                        type="submit"
                        disabled={!isValid || !dirty}>
                        Update Subscription
                      </PrimaryButton>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Drawer>
  );
};
