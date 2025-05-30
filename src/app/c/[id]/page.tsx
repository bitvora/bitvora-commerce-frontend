'use client';

import { useQuery } from '@tanstack/react-query';
import { use, useEffect, useMemo, useState } from 'react';
import { app_routes } from '@/lib/constants';
import {
  MediumBody,
  MediumHeader4,
  MediumSmallerText,
  RegularBody,
  SemiboldBody,
  SemiboldCaption,
  SemiboldHeader3,
  SemiboldSmallerText,
  SemiboldSmallText
} from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import numeral from 'numeral';
import { Skeleton, RenderQRCode } from './components';
import React from 'react';
import { Link } from '@/components/Links';
import { Checkout } from '@/types/checkout';
import { getCheckout, pollCheckout } from './actions';
import Confetti from 'react-confetti';
import Tabs from '@/components/Tab';
import { Logo } from '@/components/Logo';
import Image from 'next/image';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCountdown } from '@/hooks/useCountDown';
import { convertSatsToFiat } from '@/lib/helpers';

type Params = Promise<{ id: string }>;

export default function Page(props: { params: Params }) {
  const params = use(props.params);
  const id = params.id;

  const router = useRouter();

  const [checkout, setCheckout] = useState<Checkout>({} as Checkout);
  const [loading, setLoading] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [usdAmount, setUsdAmount] = useState(0);

  const { data } = useQuery({
    queryKey: ['checkout', id],
    queryFn: () => getCheckout(id),
    enabled: !!id,
    refetchOnWindowFocus: true
  });

  const { data: checkoutPollingData } = useQuery({
    queryKey: ['poll-checkout', id],
    queryFn: () => pollCheckout(id),
    enabled: !!id,
    refetchOnWindowFocus: true,
    refetchInterval: 3000
  });

  useEffect(() => {
    if (data?.data) {
      const checkout: Checkout = data?.data;

      if (checkout.expires_at && new Date() > new Date(checkout.expires_at)) {
        toast.error('Checkout link expired');
        router.push(app_routes.checkouts);
      }
      setCheckout(checkout);
      setLoading(false);
    }
  }, [data, router]);

  useEffect(() => {
    if (checkoutPollingData?.data) {
      const { state, received_amount, amount, redirect_url } = checkoutPollingData.data;
      if (state === 'paid' && received_amount >= amount) {
        setPaymentConfirmed(true);

        if (redirect_url) {
          setTimeout(() => {
            router.push(redirect_url);
          }, 5000);
        }
      }
    }
  }, [checkoutPollingData, router]);

  const getUnifiedQRCodeValue = () => {
    const { bitcoin_address, lightning_invoice, amount } = checkout || {};
    if (bitcoin_address && lightning_invoice) {
      return `bitcoin:${bitcoin_address}?amount=${amount}&lightning=${lightning_invoice}`;
    }

    return bitcoin_address || lightning_invoice || '';
  };

  const isCompleted = useMemo(() => {
    return (
      checkout.state &&
      (checkout.state.toLowerCase() === 'completed' || checkout.state.toLowerCase() === 'paid')
    );
  }, [checkout]);

  const isPaymentConfirmed = useMemo(() => {
    return isCompleted || paymentConfirmed;
  }, [isCompleted, paymentConfirmed]);

  const countdown = useCountdown(checkout.expires_at);

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
    <div className="w-screen h-screen bg-primary-150 relative overflow-hidden">
      <div className="fixed top-5 left-7">
        <Link href={app_routes.dashboard}>
          <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
            <Logo url={app_routes.dashboard} />
            <MediumSmallerText className="text-inherit mt-2">Commerce</MediumSmallerText>
          </div>
        </Link>
      </div>

      <div className="fixed top-5 right-7">
        <Link href={app_routes.checkouts}>
          <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
            <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
          </button>
        </Link>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <div className="lg:grid lg:grid-cols-2 lg:min-h-screen lg:max-h-screen h-full overflow-y-auto lg:overflow-hidden payment-page">
          {paymentConfirmed && <Confetti />}

          <div className="flex lg:pt-[20%] justify-center lg:h-full border-b-[0.5px] px-6 pb-4 lg:pb-1 lg:px-1 lg:border-r-[0.5px] border-light-500">
            <div className="flex flex-col gap-10 w-full lg:w-[unset]">
              <div className="hidden lg:flex">
                <Image src="/img/shopping-cart.svg" alt="checkout" width={64} height={64} />
              </div>

              <div className="flex lg:flex-col gap-1 w-full lg:w-[unset] justify-between md:items-center lg:items-start">
                <MediumBody className="text-secondary-700 hidden lg:flex">Checkout</MediumBody>
                <SemiboldSmallText className="lg:hidden text-secondary-700">
                  Checkout
                </SemiboldSmallText>

                <div className="flex flex-col gap-1 lg:gap-2 lg:w-[unset]">
                  <SemiboldHeader3 className="text-light-900 hidden lg:flex">
                    $ {numeral(usdAmount).format('0,0.00')}
                  </SemiboldHeader3>

                  <SemiboldBody className="text-light-900 lg:hidden">
                    $ {numeral(usdAmount).format('0,0.00')}
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
              <div className="flex items-center justify-between px-6 py-4 bg-green-50 rounded-lg mt-4 lg:mt-0">
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
                        <RenderQRCode
                          value={getUnifiedQRCodeValue()}
                          disabled={isPaymentConfirmed}
                        />
                      )
                    },
                    {
                      label: 'OnChain',
                      content: (
                        <RenderQRCode
                          value={checkout?.bitcoin_address}
                          disabled={isPaymentConfirmed}
                        />
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
      )}
    </div>
  );
}
