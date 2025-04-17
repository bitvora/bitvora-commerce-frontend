/* eslint-disable @next/next/no-img-element */
'use client';

import Drawer from 'react-modern-drawer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { MediumTitle, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { PrimaryButton, RedButton, SecondaryButton } from '@/components/Buttons';
import { DarkAutocomplete, DarkAutocompleteHandle, DarkInput } from '@/components/Inputs';
import { createPaymentLink, deletePaymentLink, updatePaymentLink } from './actions';
import { usePaymentLinkContext } from './context';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { app_routes, currencies } from '@/lib/constants';
import { CloseIcon, DeleteIcon } from '@/components/Icons';
import { SelectField } from '@/components/Selects';
import { useAppContext } from '@/app/contexts';
import { CreatePaymentLinkType, PaymentLink } from '@/types/payment-links';
import Modal from '@/components/Modal';
import { useQueryClient } from '@tanstack/react-query';
import { useProductContext } from '@/app/(dashboard)/products/context';
import { Link } from '@/components/Links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const AddPaymentLink = () => {
  const { currentAccount } = useAppContext();
  const { refetchPaymentLinks } = usePaymentLinkContext();
  const { products } = useProductContext();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      pathname === app_routes.payment_links &&
      searchParams.get('action') === 'new-payment-link'
    ) {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.payment_links);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.payment_links}?action=new-payment-link`);
  };

  const productAutocompleteRef = useRef<DarkAutocompleteHandle>(null);

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>New Payment Link</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">New Payment Link</SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-auto h-full w-full">
            <Formik
              initialValues={{
                product_id: '',
                amount: 0,
                currency: '',
                expiry_minutes: ''
              }}
              enableReinitialize
              validationSchema={Yup.object({
                product_id: Yup.string().required('Product is required'),
                amount: Yup.number()
                  .required('Amount is required')
                  .positive('Amount must be greater than zero'),
                currency: Yup.string().required('Currency is required')
              })}
              onSubmit={async (values, { resetForm }) => {
                const payload: CreatePaymentLinkType = {
                  account_id: currentAccount?.id
                };

                if (values.product_id) {
                  payload.product_id = values.product_id;
                }

                if (values.amount) {
                  payload.amount = Number(values.amount);
                  payload.currency = values.currency;
                }

                if (values.expiry_minutes) {
                  payload.expiry_minutes = Number(values.expiry_minutes);
                }

                try {
                  const result = await createPaymentLink(payload);

                  if (!result.success) {
                    toast.error(result.error || 'Error creating payment link');
                    return;
                  }

                  refetchPaymentLinks();
                  toast.success('Payment link created successfully');
                  handleClose();
                  resetForm();
                  productAutocompleteRef.current?.clear();
                  router.push(`${app_routes.payment_links}/${result?.data?.data?.id}`);
                } catch (err) {
                  console.error(err);
                  toast.error('Error creating payment link');
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
                  <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full gap-6 flex-col flex">
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
                        href={`${app_routes.payment_links}?action=new-product`}
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

                    <div className="w-full flex justify-between items-center gap-3">
                      <div className="mb-2 pb-2 w-2/3">
                        <DarkInput
                          label="Price"
                          handleChange={handleChange}
                          name="amount"
                          errors={errors}
                          touched={touched}
                          placeholder="0.00"
                          value={values.amount}
                          showLabel
                          required
                          type="number"
                        />
                      </div>

                      <div className="mb-2 pb-2 w-1/3">
                        <SelectField
                          label="Currency"
                          name="currency"
                          value={values.currency}
                          onChange={(value) => setFieldValue('currency', value)}
                          options={currencies.map(({ label, value }) => {
                            return {
                              label,
                              value
                            };
                          })}
                          placeholder="Currency"
                          errors={errors}
                          touched={touched}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <DarkInput
                        label="Expires (in minutes)"
                        handleChange={handleChange}
                        name="expiry_minutes"
                        errors={errors}
                        touched={touched}
                        placeholder="0 minutes"
                        value={values.expiry_minutes}
                        showLabel
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 fixed bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10 mt-6">
                    <div className="mt-4 pt-4 w-full">
                      <PrimaryButton
                        className="w-full h-12"
                        loading={isSubmitting}
                        type="submit"
                        disabled={!isValid || !dirty}>
                        Create Payment Link
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

export const EditPaymentLink = ({
  paymentLink,
  isEditOpen,
  toggleEditModal
}: {
  paymentLink: PaymentLink;
  isEditOpen: boolean;
  toggleEditModal: (value: boolean) => void;
}) => {
  const { refetchPaymentLinks } = usePaymentLinkContext();
  const { currentAccount } = useAppContext();
  const { products } = useProductContext();

  const handleClose = () => {
    toggleEditModal(false);
  };

  const queryClient = useQueryClient();
  const productAutocompleteRef = useRef<DarkAutocompleteHandle>(null);

  return (
    <Drawer
      open={isEditOpen}
      onClose={handleClose}
      direction="right"
      className="drawer"
      overlayOpacity={0.9}>
      <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10">
        <div className="flex w-full justify-between items-center">
          <SemiboldTitle className="text-light-900">Edit Payment Link</SemiboldTitle>

          <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-auto h-full w-full">
          <Formik
            initialValues={{
              product_id: paymentLink?.product_id || '',
              amount: paymentLink?.amount || 0,
              currency: paymentLink?.currency || '',
              expiry_minutes: paymentLink?.expiry_minutes || ''
            }}
            enableReinitialize
            validationSchema={Yup.object({
              product_id: Yup.string().required('Product is required'),
              amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be greater than zero'),
              currency: Yup.string().required('Currency is required')
            })}
            onSubmit={async (values, { resetForm }) => {
              const payload: CreatePaymentLinkType = {
                account_id: currentAccount?.id
              };

              if (values.product_id) {
                payload.product_id = values.product_id;
              }

              if (values.amount) {
                payload.amount = Number(values.amount);
                payload.currency = values.currency;
              }

              if (values.expiry_minutes) {
                payload.expiry_minutes = Number(values.expiry_minutes);
              }

              try {
                const result = await updatePaymentLink(paymentLink.id, payload);

                if (!result.success) {
                  toast.error(result.error || 'Error updating payment link');
                  return;
                }

                refetchPaymentLinks();
                toast.success('Payment link updated successfully');
                productAutocompleteRef.current?.clear();

                await queryClient.refetchQueries({
                  queryKey: ['payment-link', paymentLink.id]
                });
                handleClose();
                resetForm();
              } catch (err) {
                console.error(err);
                toast.error('Error updating payment link');
              }
            }}>
            {({
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
              setFieldValue
            }) => {
              return (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className="rounded-lg px-5 lg:px-6 py-5 lg:py-6 bg-primary-150 w-full h-full gap-6 flex-col flex">
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
                        href={`${app_routes.payment_links}?action=new-product`}
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

                    <div className="w-full flex justify-between items-center gap-3">
                      <div className="mb-2 pb-2 w-2/3">
                        <DarkInput
                          label="Price"
                          handleChange={handleChange}
                          name="amount"
                          errors={errors}
                          touched={touched}
                          placeholder="0.00"
                          value={values.amount}
                          showLabel
                          required
                          type="number"
                        />
                      </div>

                      <div className="mb-2 pb-2 w-1/3">
                        <SelectField
                          label="Currency"
                          name="currency"
                          value={values.currency}
                          onChange={(value) => setFieldValue('currency', value)}
                          options={currencies.map(({ label, value }) => {
                            return {
                              label,
                              value
                            };
                          })}
                          placeholder="Currency"
                          errors={errors}
                          touched={touched}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <DarkInput
                        label="Expires (in minutes)"
                        handleChange={handleChange}
                        name="expiry_minutes"
                        errors={errors}
                        touched={touched}
                        placeholder="0 minutes"
                        value={values.expiry_minutes}
                        showLabel
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 fixed bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10 mt-6">
                    <div className="mt-4 pt-4 w-full">
                      <PrimaryButton className="w-full h-12" loading={isSubmitting} type="submit">
                        Update Payment Link
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

export const DeletePaymentLink = ({
  paymentLink,
  isDeleteOpen,
  closeDeleteModal
}: {
  paymentLink: PaymentLink;
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
}) => {
  const { refetchPaymentLinks } = usePaymentLinkContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeletePaymentLink = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const result = await deletePaymentLink(paymentLink.id);

      if (!result.success) {
        toast.error(result.error || 'Error deleting payment link');
        return;
      }

      toast.success('payment link deleted successfully');
      refetchPaymentLinks();
      closeDeleteModal();
      router.push(app_routes.payment_links);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting payment link');
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
          Are you sure you want to delete this payment link?
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
          onClick={handleDeletePaymentLink}>
          Delete
        </RedButton>
      </div>
    </Modal>
  );
};
