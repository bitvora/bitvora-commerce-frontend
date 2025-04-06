'use client';

import Drawer from 'react-modern-drawer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { MediumTitle, SemiboldBody, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { PrimaryButton, RedButton, SecondaryButton } from '@/components/Buttons';
import { DarkInput, DarkTextarea, PhoneNumberInput } from '@/components/Inputs';
import { createCustomer, deleteCustomer, updateCustomer } from './actions';
import { useCustomerContext } from './context';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { app_routes, currencies } from '@/lib/constants';
import { CloseIcon, DeleteIcon } from '@/components/Icons';
import Select, { CountrySelect } from '@/components/Selects';
import { useAppContext } from '@/app/contexts';
import Modal from '@/components/Modal';
import Accordion from '@/components/Accordion';
import { countNonEmptyFields } from '@/lib/helpers';
import { Customer } from '@/types/customers';
import { QueryClient } from '@tanstack/react-query';

export const AddCustomer = () => {
  const { currentAccount } = useAppContext();
  const { refetchCustomers } = useCustomerContext();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname === app_routes.customers && searchParams.get('action') === 'new-customer') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.customers);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.customers}?action=new-customer`);
  };

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>New Customer</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">New Customer</SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-auto h-full w-full">
            <Formik
              initialValues={{
                account_id: currentAccount?.id || '',
                name: '',
                email: '',
                description: '',
                phone_number: '',
                currency: '',
                billing_address_line1: '',
                billing_address_line2: '',
                billing_city: '',
                billing_state: '',
                billing_postal_code: '',
                billing_country: '',
                shipping_address_line1: '',
                shipping_address_line2: '',
                shipping_city: '',
                shipping_state: '',
                shipping_postal_code: '',
                shipping_country: ''
              }}
              enableReinitialize
              validationSchema={Yup.object({
                name: Yup.string().required('Name is required'),
                email: Yup.string()
                  .email('Must be a valid email address')
                  .max(255)
                  .required('Email address is required'),
                phone_number: Yup.string().required('Phone Number is required'),
                currency: Yup.string().required('Currency is required'),
                description: Yup.string().required('Description is required'),
                billing_address_line1: Yup.string().required('Billing Address is required'),
                billing_city: Yup.string().required('City is required'),
                billing_state: Yup.string().required('State is required'),
                billing_postal_code: Yup.string().required('Postal Code is required'),
                billing_country: Yup.string().required('Country is required'),
                shipping_address_line1: Yup.string().required('Shipping Address is required'),
                shipping_city: Yup.string().required('City is required'),
                shipping_state: Yup.string().required('State is required'),
                shipping_postal_code: Yup.string().required('Postal Code is required'),
                shipping_country: Yup.string().required('COuntry is required')
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const result = await createCustomer(values);

                  if (!result.success) {
                    toast.error(result.error || 'Error creating customer');
                    return;
                  }

                  refetchCustomers();
                  toast.success('Customer created successfully');
                  handleClose();
                  resetForm();
                } catch (err) {
                  console.error(err);
                  toast.error('Error creating customer');
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
                const customerStats = countNonEmptyFields(values, [
                  'name',
                  'email',
                  'description',
                  'phone_number',
                  'currency'
                ]);

                const billingAddressStats = countNonEmptyFields(values, [
                  'billing_address_line1',
                  'billing_address_line2',
                  'billing_city',
                  'billing_state',
                  'billing_postal_code',
                  'billing_country'
                ]);

                const shippingAddressStats = countNonEmptyFields(values, [
                  'shipping_address_line1',
                  'shipping_address_line2',
                  'shipping_city',
                  'shipping_state',
                  'shipping_postal_code',
                  'shipping_country'
                ]);

                return (
                  <Form noValidate onSubmit={handleSubmit}>
                    <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full h-full overflow-auto">
                      <Accordion
                        items={[
                          {
                            label: (
                              <div className="w-full justify-start text-start">
                                <SemiboldBody className="text-light-900">
                                  Customer Details{' '}
                                  <span className="text-light-700">
                                    {customerStats?.nonEmptyFields}/{customerStats?.totalFields}
                                  </span>
                                </SemiboldBody>
                              </div>
                            ),
                            content: (
                              <div className="flex flex-col gap-5 px-2 mb-2 relative">
                                <div>
                                  <DarkInput
                                    label="Name"
                                    handleChange={handleChange}
                                    name="name"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter customer name"
                                    value={values.name}
                                    showLabel
                                    required
                                  />
                                </div>

                                <div>
                                  <DarkInput
                                    label="Email"
                                    handleChange={handleChange}
                                    name="email"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter customer email"
                                    value={values.email}
                                    showLabel
                                    required
                                  />
                                </div>

                                <div>
                                  <DarkTextarea
                                    label="Customer Description"
                                    handleChange={handleChange}
                                    name="description"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter customer description"
                                    value={values.description}
                                    showLabel
                                    rows={3}
                                    required
                                  />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                  <div className="w-full">
                                    <PhoneNumberInput
                                      handleChange={async (value) =>
                                        await setFieldValue('phone_number', value)
                                      }
                                      name="phone_number"
                                      errors={errors}
                                      touched={touched}
                                      value={values.phone_number}
                                      showLabel
                                      required
                                      label="Phone Number"
                                    />
                                  </div>

                                  <div className="mb-2 pb-2 w-full md:w-1/3">
                                    <div className="pb-1 flex items-start gap-1">
                                      <SemiboldBody className="text-light-700 transition-opacity duration-300">
                                        Currency
                                      </SemiboldBody>

                                      <SemiboldBody className="text-light-700 transition-opacity duration-300">
                                        *
                                      </SemiboldBody>
                                    </div>

                                    <div className="mt-1">
                                      <Select
                                        placeholder="Currency"
                                        position="top"
                                        value={values.currency}
                                        onChange={(value) => setFieldValue('currency', value)}
                                        options={currencies.map(({ label, value }) => {
                                          return {
                                            label,
                                            value
                                          };
                                        })}
                                        dropdownClass="bg-primary-40 product-currency"
                                        className="hover:border-primary-500"
                                        listClassName="text-light-700 hover:text-light-900 product-currency-item"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          },

                          {
                            label: (
                              <div className="w-full justify-start text-start">
                                <SemiboldBody className="text-light-900">
                                  Billing Address{' '}
                                  <span className="text-light-700">
                                    {billingAddressStats?.nonEmptyFields}/
                                    {billingAddressStats?.totalFields}
                                  </span>
                                </SemiboldBody>
                              </div>
                            ),
                            content: (
                              <div className="flex flex-col gap-5 px-2 mb-2 relative">
                                <div>
                                  <DarkInput
                                    label="Billing Address Line 1"
                                    handleChange={handleChange}
                                    name="billing_address_line1"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter Address"
                                    value={values.billing_address_line1}
                                    showLabel
                                    required
                                  />
                                </div>
                                <div>
                                  <DarkInput
                                    label="Billing Address Line 2"
                                    handleChange={handleChange}
                                    name="billing_address_line2"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter Address"
                                    value={values.billing_address_line2}
                                    showLabel
                                  />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                  <div className="w-full">
                                    <DarkInput
                                      label="City"
                                      handleChange={handleChange}
                                      name="billing_city"
                                      errors={errors}
                                      touched={touched}
                                      placeholder="Enter City"
                                      value={values.billing_city}
                                      showLabel
                                      required
                                    />
                                  </div>

                                  <div className="w-full">
                                    <DarkInput
                                      label="State"
                                      handleChange={handleChange}
                                      name="billing_state"
                                      errors={errors}
                                      touched={touched}
                                      placeholder="Enter State"
                                      value={values.billing_state}
                                      showLabel
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                  <div className="w-full">
                                    <DarkInput
                                      label="Postal Code"
                                      handleChange={handleChange}
                                      name="billing_postal_code"
                                      errors={errors}
                                      touched={touched}
                                      placeholder="Enter Postal Code"
                                      value={values.billing_postal_code}
                                      showLabel
                                      required
                                    />
                                  </div>

                                  <div className="w-full">
                                    <CountrySelect
                                      handleChange={async (value) =>
                                        await setFieldValue('billing_country', value)
                                      }
                                      errors={errors}
                                      touched={touched}
                                      value={values.billing_country}
                                      name="billing_country"
                                      label="Country"
                                      placeholder="Select your Country"
                                      position="top"
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          },

                          {
                            label: (
                              <div className="w-full justify-start text-start">
                                <SemiboldBody className="text-light-900">
                                  Shipping Address{' '}
                                  <span className="text-light-700">
                                    {shippingAddressStats?.nonEmptyFields}/
                                    {shippingAddressStats?.totalFields}
                                  </span>
                                </SemiboldBody>
                              </div>
                            ),
                            content: (
                              <div className="flex flex-col gap-5 px-2 mb-2 relative">
                                <div>
                                  <DarkInput
                                    label="Shipping Address Line 1"
                                    handleChange={handleChange}
                                    name="shipping_address_line1"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter Address"
                                    value={values.shipping_address_line1}
                                    showLabel
                                    required
                                  />
                                </div>
                                <div>
                                  <DarkInput
                                    label="Shipping Address Line 2"
                                    handleChange={handleChange}
                                    name="shipping_address_line2"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter Address"
                                    value={values.shipping_address_line2}
                                    showLabel
                                  />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                  <div className="w-full">
                                    <DarkInput
                                      label="City"
                                      handleChange={handleChange}
                                      name="shipping_city"
                                      errors={errors}
                                      touched={touched}
                                      placeholder="Enter City"
                                      value={values.shipping_city}
                                      showLabel
                                      required
                                    />
                                  </div>

                                  <div className="w-full">
                                    <DarkInput
                                      label="State"
                                      handleChange={handleChange}
                                      name="shipping_state"
                                      errors={errors}
                                      touched={touched}
                                      placeholder="Enter State"
                                      value={values.shipping_state}
                                      showLabel
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                  <div className="w-full">
                                    <DarkInput
                                      label="Postal Code"
                                      handleChange={handleChange}
                                      name="shipping_postal_code"
                                      errors={errors}
                                      touched={touched}
                                      placeholder="Enter Postal Code"
                                      value={values.shipping_postal_code}
                                      showLabel
                                      required
                                    />
                                  </div>

                                  <div className="w-full">
                                    <CountrySelect
                                      handleChange={async (value) =>
                                        await setFieldValue('shipping_country', value)
                                      }
                                      errors={errors}
                                      touched={touched}
                                      value={values.shipping_country}
                                      name="shipping_country"
                                      label="Country"
                                      placeholder="Select your Country"
                                      position="top"
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        ]}
                        contentClassName="w-full mt-2 pt-2"
                        triggerClassName=""
                        containerClassName="mb-5 pb-2 border-b-[0.5px] border-light-300"
                      />
                    </div>

                    <div className="flex flex-col gap-2 w-full mt-6">
                      <div className="mt-4 pt-4 w-full">
                        <PrimaryButton
                          className="w-full h-12"
                          loading={isSubmitting}
                          type="submit"
                          disabled={!isValid || !dirty}>
                          Create Customer
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

export const EditCustomer = ({
  customer,
  isEditOpen,
  toggleEditModal
}: {
  customer: Customer;
  isEditOpen: boolean;
  toggleEditModal: (value: boolean) => void;
}) => {
  const { refetchCustomers } = useCustomerContext();

  const handleClose = () => {
    toggleEditModal(false);
  };

  const queryClient = new QueryClient();

  return (
    <Drawer
      open={isEditOpen}
      onClose={handleClose}
      direction="right"
      className="drawer"
      overlayOpacity={0.9}>
      <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
        <div className="flex w-full justify-between items-center">
          <SemiboldTitle className="text-light-900">Edit Customer</SemiboldTitle>

          <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-auto h-full w-full">
          <Formik
            initialValues={{
              account_id: customer?.account_id || '',
              name: customer?.name || '',
              email: customer?.email || '',
              description: customer?.description || '',
              phone_number: customer?.phone_number || '',
              currency: customer?.currency || '',
              billing_address_line1: customer?.billing_address_line1 || '',
              billing_address_line2: customer?.billing_address_line2 || '',
              billing_city: customer?.billing_city || '',
              billing_state: customer?.billing_state || '',
              billing_postal_code: customer?.billing_postal_code || '',
              billing_country: customer?.billing_country || '',
              shipping_address_line1: customer?.shipping_address_line1 || '',
              shipping_address_line2: customer?.shipping_address_line2 || '',
              shipping_city: customer?.shipping_city || '',
              shipping_state: customer?.shipping_state || '',
              shipping_postal_code: customer?.shipping_postal_code || '',
              shipping_country: customer?.shipping_country || ''
            }}
            enableReinitialize
            validationSchema={Yup.object({
              name: Yup.string().required('Name is required'),
              email: Yup.string()
                .email('Must be a valid email address')
                .max(255)
                .required('Email address is required'),
              phone_number: Yup.string().required('Phone Number is required'),
              currency: Yup.string().required('Currency is required'),
              description: Yup.string().required('Description is required'),
              billing_address_line1: Yup.string().required('Billing Address is required'),
              billing_city: Yup.string().required('City is required'),
              billing_state: Yup.string().required('State is required'),
              billing_postal_code: Yup.string().required('Postal Code is required'),
              billing_country: Yup.string().required('Country is required'),
              shipping_address_line1: Yup.string().required('Shipping Address is required'),
              shipping_city: Yup.string().required('City is required'),
              shipping_state: Yup.string().required('State is required'),
              shipping_postal_code: Yup.string().required('Postal Code is required'),
              shipping_country: Yup.string().required('COuntry is required')
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                const result = await updateCustomer(customer.id, values);

                if (!result.success) {
                  toast.error(result.error || 'Error creating customer');
                  return;
                }

                refetchCustomers();
                await queryClient.refetchQueries({
                  queryKey: ['customer', customer.id]
                });

                toast.success('Customer updated successfully');
                handleClose();
                resetForm();
              } catch (err) {
                console.error(err);
                toast.error('Error updating customer');
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
              const customerStats = countNonEmptyFields(values, [
                'name',
                'email',
                'description',
                'phone_number',
                'currency'
              ]);

              const billingAddressStats = countNonEmptyFields(values, [
                'billing_address_line1',
                'billing_address_line2',
                'billing_city',
                'billing_state',
                'billing_postal_code',
                'billing_country'
              ]);

              const shippingAddressStats = countNonEmptyFields(values, [
                'shipping_address_line1',
                'shipping_address_line2',
                'shipping_city',
                'shipping_state',
                'shipping_postal_code',
                'shipping_country'
              ]);

              return (
                <Form noValidate onSubmit={handleSubmit}>
                  <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full h-full overflow-auto">
                    <Accordion
                      items={[
                        {
                          label: (
                            <div className="w-full justify-start text-start">
                              <SemiboldBody className="text-light-900">
                                Customer Details{' '}
                                <span className="text-light-700">
                                  {customerStats?.nonEmptyFields}/{customerStats?.totalFields}
                                </span>
                              </SemiboldBody>
                            </div>
                          ),
                          content: (
                            <div className="flex flex-col gap-5 px-2 mb-2 relative">
                              <div>
                                <DarkInput
                                  label="Name"
                                  handleChange={handleChange}
                                  name="name"
                                  errors={errors}
                                  touched={touched}
                                  placeholder="Enter customer name"
                                  value={values.name}
                                  showLabel
                                  required
                                />
                              </div>

                              <div>
                                <DarkInput
                                  label="Email"
                                  handleChange={handleChange}
                                  name="email"
                                  errors={errors}
                                  touched={touched}
                                  placeholder="Enter customer email"
                                  value={values.email}
                                  showLabel
                                  required
                                />
                              </div>

                              <div>
                                <DarkTextarea
                                  label="Customer Description"
                                  handleChange={handleChange}
                                  name="description"
                                  errors={errors}
                                  touched={touched}
                                  placeholder="Enter customer description"
                                  value={values.description}
                                  showLabel
                                  rows={3}
                                  required
                                />
                              </div>

                              <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                <div className="w-full">
                                  <PhoneNumberInput
                                    handleChange={async (value) =>
                                      await setFieldValue('phone_number', value)
                                    }
                                    name="phone_number"
                                    errors={errors}
                                    touched={touched}
                                    value={values.phone_number}
                                    showLabel
                                    required
                                    label="Phone Number"
                                  />
                                </div>

                                <div className="mb-2 pb-2 w-full md:w-1/3">
                                  <div className="pb-1 flex items-start gap-1">
                                    <SemiboldBody className="text-light-700 transition-opacity duration-300">
                                      Currency
                                    </SemiboldBody>

                                    <SemiboldBody className="text-light-700 transition-opacity duration-300">
                                      *
                                    </SemiboldBody>
                                  </div>

                                  <div className="mt-1">
                                    <Select
                                      placeholder="Currency"
                                      position="top"
                                      value={values.currency}
                                      onChange={(value) => setFieldValue('currency', value)}
                                      options={currencies.map(({ label, value }) => {
                                        return {
                                          label,
                                          value
                                        };
                                      })}
                                      dropdownClass="bg-primary-40 product-currency"
                                      className="hover:border-primary-500"
                                      listClassName="text-light-700 hover:text-light-900 product-currency-item"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        },

                        {
                          label: (
                            <div className="w-full justify-start text-start">
                              <SemiboldBody className="text-light-900">
                                Billing Address{' '}
                                <span className="text-light-700">
                                  {billingAddressStats?.nonEmptyFields}/
                                  {billingAddressStats?.totalFields}
                                </span>
                              </SemiboldBody>
                            </div>
                          ),
                          content: (
                            <div className="flex flex-col gap-5 px-2 mb-2 relative">
                              <div>
                                <DarkInput
                                  label="Billing Address Line 1"
                                  handleChange={handleChange}
                                  name="billing_address_line1"
                                  errors={errors}
                                  touched={touched}
                                  placeholder="Enter Address"
                                  value={values.billing_address_line1}
                                  showLabel
                                  required
                                />
                              </div>
                              <div>
                                <DarkInput
                                  label="Billing Address Line 2"
                                  handleChange={handleChange}
                                  name="billing_address_line2"
                                  errors={errors}
                                  touched={touched}
                                  placeholder="Enter Address"
                                  value={values.billing_address_line2}
                                  showLabel
                                />
                              </div>

                              <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                <div className="w-full">
                                  <DarkInput
                                    label="City"
                                    handleChange={handleChange}
                                    name="billing_city"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter City"
                                    value={values.billing_city}
                                    showLabel
                                    required
                                  />
                                </div>

                                <div className="w-full">
                                  <DarkInput
                                    label="State"
                                    handleChange={handleChange}
                                    name="billing_state"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter State"
                                    value={values.billing_state}
                                    showLabel
                                    required
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                <div className="w-full">
                                  <DarkInput
                                    label="Postal Code"
                                    handleChange={handleChange}
                                    name="billing_postal_code"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter Postal Code"
                                    value={values.billing_postal_code}
                                    showLabel
                                    required
                                  />
                                </div>

                                <div className="w-full">
                                  <CountrySelect
                                    handleChange={async (value) =>
                                      await setFieldValue('billing_country', value)
                                    }
                                    errors={errors}
                                    touched={touched}
                                    value={values.billing_country}
                                    name="billing_country"
                                    label="Country"
                                    placeholder="Select your Country"
                                    position="top"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        },

                        {
                          label: (
                            <div className="w-full justify-start text-start">
                              <SemiboldBody className="text-light-900">
                                Shipping Address{' '}
                                <span className="text-light-700">
                                  {shippingAddressStats?.nonEmptyFields}/
                                  {shippingAddressStats?.totalFields}
                                </span>
                              </SemiboldBody>
                            </div>
                          ),
                          content: (
                            <div className="flex flex-col gap-5 px-2 mb-2 relative">
                              <div>
                                <DarkInput
                                  label="Shipping Address Line 1"
                                  handleChange={handleChange}
                                  name="shipping_address_line1"
                                  errors={errors}
                                  touched={touched}
                                  placeholder="Enter Address"
                                  value={values.shipping_address_line1}
                                  showLabel
                                  required
                                />
                              </div>
                              <div>
                                <DarkInput
                                  label="Shipping Address Line 2"
                                  handleChange={handleChange}
                                  name="shipping_address_line2"
                                  errors={errors}
                                  touched={touched}
                                  placeholder="Enter Address"
                                  value={values.shipping_address_line2}
                                  showLabel
                                />
                              </div>

                              <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                <div className="w-full">
                                  <DarkInput
                                    label="City"
                                    handleChange={handleChange}
                                    name="shipping_city"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter City"
                                    value={values.shipping_city}
                                    showLabel
                                    required
                                  />
                                </div>

                                <div className="w-full">
                                  <DarkInput
                                    label="State"
                                    handleChange={handleChange}
                                    name="shipping_state"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter State"
                                    value={values.shipping_state}
                                    showLabel
                                    required
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-5 sm:gap-3 md:gap-2 items-start w-full">
                                <div className="w-full">
                                  <DarkInput
                                    label="Postal Code"
                                    handleChange={handleChange}
                                    name="shipping_postal_code"
                                    errors={errors}
                                    touched={touched}
                                    placeholder="Enter Postal Code"
                                    value={values.shipping_postal_code}
                                    showLabel
                                    required
                                  />
                                </div>

                                <div className="w-full">
                                  <CountrySelect
                                    handleChange={async (value) =>
                                      await setFieldValue('shipping_country', value)
                                    }
                                    errors={errors}
                                    touched={touched}
                                    value={values.shipping_country}
                                    name="shipping_country"
                                    label="Country"
                                    placeholder="Select your Country"
                                    position="top"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        }
                      ]}
                      contentClassName="w-full mt-2 pt-2"
                      triggerClassName=""
                      containerClassName="mb-5 pb-2 border-b-[0.5px] border-light-300"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-6">
                    <div className="mt-4 pt-4 w-full">
                      <PrimaryButton
                        className="w-full h-12"
                        loading={isSubmitting}
                        type="submit"
                        disabled={isSubmitting}>
                        Update Customer
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

export const DeleteCustomerModal = ({
  customer,
  isDeleteOpen,
  closeDeleteModal
}: {
  customer: Customer;
  isDeleteOpen: boolean;
  closeDeleteModal: () => void;
}) => {
  const { refetchCustomers } = useCustomerContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteCustomer = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const result = await deleteCustomer(customer.id);

      if (!result.success) {
        toast.error(result.error || 'Error deleting customer');
        return;
      }

      toast.success('Customer deleted successfully');
      refetchCustomers();
      closeDeleteModal();
      router.push(app_routes.customers);
    } catch (err) {
      console.error(err);
      toast.error('Error deleting customer');
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
          Are you sure you want to delete this customer?
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
          onClick={handleDeleteCustomer}>
          Delete
        </RedButton>
      </div>
    </Modal>
  );
};
