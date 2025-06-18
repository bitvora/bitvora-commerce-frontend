'use client';

import {
  MediumBody,
  MediumHeader4,
  RegularBody,
  SemiboldBody,
  SemiboldCaption,
  SemiboldHeader3,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { convertSatsToFiat, copyToClipboard, pasteToClipboard } from '@/lib/helpers';
import { Checkout } from '@/types/checkout';
import { faCopy, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import numeral from 'numeral';
import Tabs from '@/components/Tab';
import { Link } from '@/components/Links';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { subscribeCheckout } from '@/app/c/[id]/actions';
import { Input } from '@/components/Inputs';
import { PasteIcon } from '@/components/Icons';
import { PrimaryButton } from '@/components/Buttons';

export const Skeleton = () => {
  return (
    <div className="h-screen w-screen relative px-6 py-6 rounded-lg flex flex-col md:flex-row bg-transparent gap-1 animate-pulse">
      <div className="w-full flex gap-8 h-full items-start animate-pulse pt-[60px]">
        <div className="w-full h-full bg-light-300 rounded-md"></div>
      </div>
    </div>
  );
};

export const RenderQRCode = ({
  value,
  disabled = false
}: {
  value: string;
  disabled?: boolean;
}) => {
  return (
    <div className="w-full flex justify-center text-center flex-col gap-3">
      <SemiboldBody className="text-light-500">Invoice</SemiboldBody>

      <div className="space-y-4">
        <div className="p-4 rounded-lg flex justify-center">
          <div
            className={clsx('rounded-md', {
              'border-10 border-white': !disabled
            })}>
            <QRCodeSVG value={value || ''} size={240} bgColor={disabled ? '#645c70' : '#FFFFFF'} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="rounded-md px-4 py-3 flex items-center border-[0.5px] border-light-600 w-full justify-between gap-4 relative">
            <div className="flex items-center w-full overflow-x-scroll pr-10 mr-10">
              <SemiboldSmallText
                className={clsx('whitespace-nowrap min-w-max', {
                  'text-light-900': !disabled,
                  'text-light-500': disabled
                })}>
                {value}
              </SemiboldSmallText>
            </div>

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button
                onClick={() => copyToClipboard({ text: value })}
                className={clsx(
                  'cursor-pointer h-8 w-8 rounded-md text-light-700 focus:text-light-900 hover:text-light-900 bg-primary-200'
                )}
                type="button">
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type CheckoutProps = {
  checkout: Checkout;
  countdown: string;
  isPaymentConfirmed: boolean;
  isCompleted: boolean;
};

export const RegularCheckout = ({
  checkout,
  countdown,
  isPaymentConfirmed,
  isCompleted
}: CheckoutProps) => {
  const [usdAmount, setUsdAmount] = useState(0);

  const getUnifiedQRCodeValue = () => {
    const { bitcoin_address, lightning_invoice, amount } = checkout || {};
    if (bitcoin_address && lightning_invoice) {
      return `bitcoin:${bitcoin_address}?amount=${amount}&lightning=${lightning_invoice}`;
    }

    return bitcoin_address || lightning_invoice || '';
  };

  useEffect(() => {
    const fetchFiatAmount = async () => {
      if (!checkout?.amount) return;

      const response = await convertSatsToFiat({
        sats: checkout.amount,
        fiat: 'usd'
      });

      setUsdAmount(response?.fiat_amount || 0);
    };

    fetchFiatAmount();
  }, [checkout?.amount]);

  return (
    <div className="lg:grid lg:grid-cols-2 lg:min-h-screen lg:max-h-screen h-full overflow-y-auto lg:overflow-hidden payment-page">
      <div className="flex lg:pt-[20%] justify-center lg:h-full border-b-[0.5px] px-6 pb-4 lg:pb-1 lg:px-1 lg:border-r-[0.5px] border-light-500">
        <div className="flex flex-col gap-10 w-full lg:w-[unset]">
          <div className="hidden lg:flex">
            <Image src="/img/shopping-cart.svg" alt="checkout" width={64} height={64} />
          </div>

          <div className="flex lg:flex-col gap-1 w-full lg:w-[unset] justify-between md:items-center lg:items-start">
            <MediumBody className="text-secondary-700 hidden lg:flex">Checkout</MediumBody>
            <SemiboldSmallText className="lg:hidden text-secondary-700">Checkout</SemiboldSmallText>

            <div className="flex flex-col gap-1 lg:gap-2 lg:w-[unset]">
              <SemiboldHeader3 className="text-light-900 hidden lg:flex">
                $ {numeral(usdAmount).format(usdAmount < 0.01 ? '0,0.000' : '0,0.00')}
              </SemiboldHeader3>

              <SemiboldBody className="text-light-900 lg:hidden">
                $ {numeral(usdAmount).format(usdAmount < 0.01 ? '0,0.000' : '0,0.00')}
              </SemiboldBody>

              <div className="flex gap-2 md:px-4 py-2 md:bg-light-overlay-100 rounded-3xl">
                <Image
                  src="/img/btc.svg"
                  width={20}
                  height={20}
                  alt="sats"
                  className="rounded-full hidden md:flex"
                />

                <MediumBody className="text-light-900">
                  {numeral(checkout?.amount).format('0,0')}
                </MediumBody>

                <RegularBody className="text-light-700">SATS</RegularBody>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:pt-[20%] justify-center overflow-y-auto px-6 lg:px-[60px] pb-10">
        {!isPaymentConfirmed && (
          <div className="flex items-center gap-4 mt-4 lg:mt-10">
            <MediumHeader4 className="text-light-900 hidden lg:flex">Payment</MediumHeader4>
            <SemiboldBody className="text-light-900 lg:hidden">Payment</SemiboldBody>

            {checkout?.expires_at && !isCompleted && (
              <div className="bg-red-500 px-3 py-0.5 rounded-full">
                <SemiboldSmallerText className="text-light-900 hidden lg:flex">
                  Expires in: {countdown}
                </SemiboldSmallerText>

                <SemiboldCaption className="text-light-900 lg:hidden">
                  Expires in: {countdown}
                </SemiboldCaption>
              </div>
            )}
          </div>
        )}

        {isPaymentConfirmed && (
          <div className="flex items-center justify-between px-6 py-4 bg-green-50 rounded-lg mt-4 lg:mt-0 max-w-[500px]">
            <SemiboldBody className="text-green-700">Payment Completed</SemiboldBody>

            <Image
              src="/img/green-circle-check.svg"
              alt="payment completed"
              width={32}
              height={32}
            />
          </div>
        )}

        <div className="rounded-lg w-full flex flex-col gap-6 pb-10">
          <div className="w-full">
            <Tabs
              type="secondary"
              disabled={isPaymentConfirmed}
              defaultActiveIndex={2}
              tabs={[
                {
                  label: 'Unified',
                  content: (
                    <RenderQRCode value={getUnifiedQRCodeValue()} disabled={isPaymentConfirmed} />
                  )
                },
                {
                  label: 'OnChain',
                  content: (
                    <RenderQRCode value={checkout?.bitcoin_address} disabled={isPaymentConfirmed} />
                  )
                },
                {
                  label: 'Lightning',
                  content: (
                    <RenderQRCode
                      value={checkout?.lightning_invoice}
                      disabled={isPaymentConfirmed}
                    />
                  )
                }
              ]}
            />
          </div>

          <div
            className={clsx('p-4 lg:p-6 mt-6 rounded-lg flex items-start gap-4', {
              'text-light-300 bg-primary-50': isPaymentConfirmed,
              'text-yellow-700 bg-yellow-50': !isPaymentConfirmed
            })}>
            <div className="hidden lg:flex">
              <div
                className={clsx(
                  'rounded-full mt-1 text-inherit max-h-5 max-w-5 border-2 py-2.5 px-2.5 flex items-center justify-center text-center',
                  {
                    'border-light-300': isPaymentConfirmed,
                    'border-yellow-700': !isPaymentConfirmed
                  }
                )}>
                <FontAwesomeIcon icon={faExclamation} className="text-inherit" />
              </div>
            </div>

            <ul className="text-start list-disc pl-4 space-y-2">
              <li>
                <SemiboldBody className="text-inherit hidden lg:flex">
                  Scan with a wallet that supports both Bitcoin and Lightning Payments.
                </SemiboldBody>

                <SemiboldSmallText className="text-inherit lg:hidden">
                  Scan with a wallet that supports both Bitcoin and Lightning Payments.
                </SemiboldSmallText>
              </li>

              <li>
                <SemiboldBody className="text-inherit hidden lg:flex">
                  Please send exactly the amount given.
                </SemiboldBody>

                <SemiboldSmallText className="text-inherit lg:hidden">
                  Please send exactly the amount given.
                </SemiboldSmallText>
              </li>

              <li>
                <SemiboldBody className="text-inherit hidden lg:flex">
                  Payments will be detected automatically.
                </SemiboldBody>

                <SemiboldSmallText className="text-inherit lg:hidden">
                  Payments will be detected automatically.
                </SemiboldSmallText>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SubscriptionCheckout = ({
  checkout,
  countdown,
  isPaymentConfirmed,
  isCompleted
}: CheckoutProps) => {
  const [usdAmount, setUsdAmount] = useState(0);

  useEffect(() => {
    const fetchFiatAmount = async () => {
      if (!checkout?.amount) return;

      const response = await convertSatsToFiat({
        sats: checkout.amount,
        fiat: 'usd'
      });

      setUsdAmount(response?.fiat_amount || 0);
    };

    fetchFiatAmount();
  }, [checkout?.amount]);

  const formik = useFormik({
    initialValues: {
      wallet_connect: ''
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await subscribeCheckout(checkout.id, values);

        if (!result.success) {
          toast.error(result.error || 'Error making withdrawal');
          return;
        }

        toast.success(result?.data?.message || 'Payment sent successfully');
        resetForm();
      } catch (err) {
        console.error(err);
        toast.error('Error making withdrawal');
      }
    },
    validationSchema: Yup.object({
      wallet_connect: Yup.string().required('Your NWC url is required')
    }),
    enableReinitialize: true
  });

  return (
    <div className="lg:grid lg:grid-cols-2 lg:min-h-screen lg:max-h-screen h-full overflow-y-auto lg:overflow-hidden payment-page">
      <div className="flex lg:pt-[20%] justify-center lg:h-full border-b-[0.5px] px-6 pb-4 lg:pb-16 lg:px-1 lg:border-r-[0.5px] border-light-500">
        <div className="flex flex-col gap-10 w-full lg:w-[unset] justify-between">
          <div className="flex flex-col w-full gap-10">
            <div className="hidden lg:flex">
              <Image
                src="/img/subscription-shopping-cart.svg"
                alt="subscription-checkout"
                width={64}
                height={64}
              />
            </div>

            <div className="flex lg:flex-col gap-1 w-full lg:w-[unset] justify-between md:items-center lg:items-start">
              <MediumBody className="text-secondary-700 hidden lg:flex">Subscription</MediumBody>
              <SemiboldSmallText className="lg:hidden text-secondary-700">
                Subscription
              </SemiboldSmallText>

              <div className="flex flex-col gap-1 lg:gap-2 lg:w-[unset]">
                <div className="flex items-center gap-1">
                  <div>
                    <SemiboldHeader3 className="text-light-900 hidden lg:flex">
                      $ {numeral(usdAmount).format(usdAmount < 0.01 ? '0,0.000' : '0,0.00')}
                    </SemiboldHeader3>

                    <SemiboldBody className="text-light-900 lg:hidden">
                      $ {numeral(usdAmount).format(usdAmount < 0.01 ? '0,0.000' : '0,0.00')}
                    </SemiboldBody>
                  </div>

                  <span className="text-base text-light-500 mt-1 lg:mt-3">/month</span>
                </div>

                <div className="flex gap-2 md:px-4 py-2 md:bg-light-overlay-100 rounded-3xl">
                  <Image
                    src="/img/btc.svg"
                    width={20}
                    height={20}
                    alt="sats"
                    className="rounded-full hidden md:flex"
                  />

                  <MediumBody className="text-light-900">
                    {numeral(checkout?.amount).format('0,0')}
                  </MediumBody>

                  <RegularBody className="text-light-700">SATS</RegularBody>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-2.5 border-[0.5px] border-light-400 rounded-md hidden lg:flex flex-col gap-1 w-full lg:min-w-[300px] max-w-[500px] ">
            <div>
              <SemiboldBody className="text-light-700">Monthly</SemiboldBody>
            </div>

            <SemiboldSmallText className="text-light-700">
              $ {numeral(usdAmount).format('0,0.00')}
              <span className="text-base text-light-500 pl-1">/month</span>
            </SemiboldSmallText>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:pt-[10%] overflow-y-auto px-6 lg:px-[60px] pb-10">
        {!isPaymentConfirmed && (
          <div className="flex items-center gap-4 mt-4 lg:mt-10">
            <MediumHeader4 className="text-light-900 hidden lg:flex">Payment</MediumHeader4>
            <SemiboldBody className="text-light-900 lg:hidden">Payment</SemiboldBody>

            {checkout?.expires_at && !isCompleted && (
              <div className="bg-red-500 px-3 py-0.5 rounded-full">
                <SemiboldSmallerText className="text-light-900 hidden lg:flex">
                  Expires in: {countdown}
                </SemiboldSmallerText>

                <SemiboldCaption className="text-light-900 lg:hidden">
                  Expires in: {countdown}
                </SemiboldCaption>
              </div>
            )}
          </div>
        )}

        {isPaymentConfirmed && (
          <div className="flex items-center justify-between px-6 py-4 bg-green-50 rounded-lg mt-4 lg:mt-0 max-w-[500px]">
            <SemiboldBody className="text-green-700">Payment Completed</SemiboldBody>

            <Image
              src="/img/green-circle-check.svg"
              alt="payment completed"
              width={32}
              height={32}
            />
          </div>
        )}

        <form
          className="rounded-lg w-full flex flex-col gap-10 pb-10 max-w-[500px]"
          noValidate
          onSubmit={formik.handleSubmit}>
          <div
            className={clsx('rounded-md px-6 py-4 w-full', {
              'bg-light-overlay-100': isPaymentConfirmed,
              'bg-light-overlay-50': !isPaymentConfirmed
            })}>
            <MediumBody
              className={clsx({
                'text-light-900': !isPaymentConfirmed,
                'text-light-700': isPaymentConfirmed
              })}>
              Nostr Wallet Connect is a seamless way to pay with Bitcoin, you can create a free
              wallet via Bitvora{' '}
              <Link href="https://bitvora.com" target="_blank" referrerPolicy="origin">
                <span className="text-secondary-700 hover:underline hover:text-secondary-500">
                  here
                </span>
              </Link>
              .
            </MediumBody>
          </div>

          <div className="mb-2 pb-2 flex flex-col gap-2">
            <Input
              label="Nostr Wallet Connect"
              handleChange={(event) => formik.setFieldValue('wallet_connect', event.target.value)}
              name="wallet_connect"
              errors={formik.errors}
              touched={formik.touched}
              placeholder="Nostr Wallet Connect"
              value={formik.values.wallet_connect}
              showLabel
              disabled={isPaymentConfirmed}
              required
              endIcon={
                <button
                  className="h-10 w-10 rounded-lg cursor-pointer bg-primary-200 hover:bg-primary-100 flex items-center justify-center"
                  onClick={async (event) => {
                    event.preventDefault();
                    await pasteToClipboard({
                      callback: (text: string) => {
                        formik.setFieldValue('wallet_connect', text);
                      }
                    });
                  }}>
                  <PasteIcon />
                </button>
              }
            />
          </div>

          <div className="rounded-lg px-2 lg:px-0">
            <PrimaryButton
              className="w-full max-w-[250px] h-12"
              loading={formik.isSubmitting}
              type="submit"
              disabled={!formik.values.wallet_connect || isPaymentConfirmed}>
              Subscribe
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
