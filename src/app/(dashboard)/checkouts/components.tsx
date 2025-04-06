/* eslint-disable @next/next/no-img-element */
'use client';

import Drawer from 'react-modern-drawer';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  SemiboldBody,
  SemiboldSmallerText,
  SemiboldSmallText,
  SemiboldTitle
} from '@/components/Text';
import { PrimaryButton } from '@/components/Buttons';
import { createCheckout } from './actions';
import { useCheckoutContext } from './context';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { app_routes, currencies } from '@/lib/constants';
import { CloseIcon } from '@/components/Icons';
import { useAppContext } from '@/app/contexts';
import { CheckoutState, CreateCheckoutType } from '@/types/checkout';
import { Link } from '@/components/Links';
import clsx from 'clsx';
import { DarkAutocomplete, DarkInput } from '@/components/Inputs';
import Select from '@/components/Selects';
import { useCustomerContext } from '@/app/(dashboard)/customers/context';
import { useProductContext } from '@/app/(dashboard)/products/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const NewCheckout = () => {
  const { currentAccount } = useAppContext();
  const { refetchCheckouts } = useCheckoutContext();
  const { customers } = useCustomerContext();
  const { products } = useProductContext();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (pathname === app_routes.checkouts && searchParams.get('action') === 'new-checkout') {
      setOpen(true);
    }
  }, [pathname, searchParams]);

  const handleClose = () => {
    setOpen(false);
    router.replace(app_routes.checkouts);
  };

  const handleOpen = () => {
    setOpen(true);
    router.replace(`${app_routes.checkouts}?action=new-checkout`);
  };

  return (
    <>
      <PrimaryButton
        className="h-10 md:h-12 w-[140px] min-w-[140px] lg:w-[auto]"
        onClick={handleOpen}>
        <SemiboldSmallText>New Checkout</SemiboldSmallText>
      </PrimaryButton>

      <Drawer
        open={open}
        onClose={handleClose}
        direction="right"
        className="drawer"
        overlayOpacity={0.9}>
        <div className="h-full w-full relative px-4 lg:px-6 py-4 lg:py-6 rounded-lg flex flex-col bg-primary-40 gap-6 lg:gap-10">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">New Checkout</SemiboldTitle>

            <button className="border-none outline-none cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-auto h-full w-full">
            <Formik
              initialValues={{
                account_id: currentAccount?.id || '',
                customer_id: '',
                subscription_id: '',
                product_id: '',
                type: '',
                amount: '',
                currency: '',
                redirect_url: '',
                metadata: {},
                items: {},
                expiry_minutes: ''
              }}
              enableReinitialize
              validationSchema={Yup.object({
                amount: Yup.number()
                  .required('Amount is required')
                  .positive('Amount must be greater than zero'),
                currency: Yup.string().required('Currency is required'),
                customer_id: Yup.string().required('Customer is required'),
                product_id: Yup.string().required('Product is required')
              })}
              onSubmit={async (values, { resetForm }) => {
                const payload: CreateCheckoutType = {
                  account_id: currentAccount?.id || '',
                  //@ts-expect-error None
                  type: values.type,
                  amount: Number(values.amount),
                  currency: values.currency,
                  redirect_url: values?.redirect_url,
                  metadata: values?.metadata,
                  items: values?.items,
                  expiry_minutes: Number(values.expiry_minutes),
                  customer_id: values?.customer_id,
                  product_id: values?.product_id,
                  subscription_id: values?.subscription_id
                };

                try {
                  const result = await createCheckout(payload);

                  if (!result.success) {
                    toast.error(result.error || 'Error creating customer');
                    return;
                  }

                  refetchCheckouts();
                  toast.success('Customer created successfully');
                  handleClose();
                  resetForm();
                } catch (err) {
                  console.error(err);
                  toast.error('Error creating checkout');
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
                    <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full h-full overflow-auto flex flex-col gap-6">
                      <div className="w-full flex justify-between items-center gap-3">
                        <div className="w-2/3">
                          <DarkInput
                            label="Amount"
                            handleChange={handleChange}
                            name="amount"
                            //@ts-expect-error None
                            errors={errors}
                            touched={touched}
                            placeholder="0.00"
                            value={values.amount}
                            showLabel
                            required
                            type="number"
                          />
                        </div>

                        <div className="w-1/3">
                          <div className="mb-1 flex items-start gap-1">
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
                        />

                        <Link
                          href={`${app_routes.customers}?action=new-customer`}
                          target="_blank"
                          referrerPolicy="no-referrer">
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
                        />

                        <Link
                          href={`${app_routes.products}?action=new-product`}
                          target="_blank"
                          referrerPolicy="no-referrer">
                          <div className="text-secondary-700 hover:text-secondary-400 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus} />
                            <SemiboldSmallText className="text-inherit">
                              New Product
                            </SemiboldSmallText>
                          </div>
                        </Link>
                      </div>

                      <div>
                        <DarkInput
                          label="Expires (in minutes)"
                          handleChange={handleChange}
                          name="expiry_minutes"
                          //@ts-expect-error None
                          errors={errors}
                          touched={touched}
                          placeholder="0 minutes"
                          value={values.expiry_minutes}
                          showLabel
                          required
                          type="number"
                        />
                      </div>

                      <div>
                        <DarkInput
                          label="Redirect URL"
                          handleChange={handleChange}
                          name="redirect_url"
                          type="url"
                          //@ts-expect-error None
                          errors={errors}
                          touched={touched}
                          placeholder="https://"
                          value={values.redirect_url}
                          showLabel
                          required
                        />
                      </div>
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

export const CheckoutStatus = ({ state, id }: { state: CheckoutState; id: string }) => {
  let className = '';

  switch (state) {
    case 'expired':
      className = 'text-red-700';
      break;

    case 'paid':
      className = 'text-green-700';
      break;

    case 'pending_confirmation':
      className = 'text-yellow-700';
      break;

    case 'overpaid':
    case 'underpaid':
    case 'open':
    default:
      className = 'text-light-900';
      break;
  }

  return (
    <Link href={`${app_routes.checkouts}/${id}`} className="text-inherit">
      <SemiboldSmallText className={clsx('truncate hidden md:flex capitalize', className)}>
        {state}
      </SemiboldSmallText>
      <SemiboldSmallerText className={clsx('truncate md:hidden capitalize', className)}>
        {state}
      </SemiboldSmallerText>
    </Link>
  );
};
