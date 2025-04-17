'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { app_routes } from '@/lib/constants';
import {
  SemiboldBody,
  SemiboldHeader3,
  SemiboldSmallerText,
  SemiboldTitle
} from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '@/lib/helpers';
import { Skeleton } from '@/app/(dashboard)/checkouts/[id]/components';
import React from 'react';
import { Link } from '@/components/Links';
import { Checkout } from '@/types/checkout';
import { getCheckout, pollCheckout } from './actions';
import { QRCodeSVG } from 'qrcode.react';
import Confetti from 'react-confetti';
import Tabs from '@/components/Tab';
import { ReadonlyInput } from '@/components/Inputs';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const router = useRouter();

  const [checkout, setCheckout] = useState<Checkout>({} as Checkout);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<string>('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

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
      setCheckout(data?.data);

      setLoading(false);
    }
  }, [data]);

  const handleClose = () => {
    router.push(app_routes.checkouts);
  };

  useEffect(() => {
    if (!checkout?.expires_at) return;

    const timer = setInterval(() => {
      const now = new Date();
      const expiryDate = new Date(checkout.expires_at!);
      const diffMs = expiryDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCountdown('Expired');
        clearInterval(timer);
        return;
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      let timeString = '';
      if (diffDays > 0) {
        timeString += `${diffDays} day${diffDays > 1 ? 's' : ''} `;
      }
      if (diffHours > 0) {
        timeString += `${diffHours} hour${diffHours > 1 ? 's' : ''} `;
      }
      timeString += `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;

      setCountdown(timeString.trim());
    }, 1000);

    return () => clearInterval(timer);
  }, [checkout?.expires_at]);

  useEffect(() => {
    if (checkoutPollingData?.data) {
      console.log(JSON.stringify(checkoutPollingData?.data));
      const { state, received_amount, amount } = checkoutPollingData.data;
      if (state === 'paid' && received_amount >= amount) {
        setPaymentConfirmed(true);
      }
    }
  }, [checkoutPollingData]);

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

  return (
    <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto h-full">
          {paymentConfirmed && <Confetti />}

          <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full h-auto flex flex-col gap-6">
            <div className="flex w-full justify-between items-center border-b-[0.5px] border-light-300 pb-4">
              <div className="flex items-center gap-4">
                <SemiboldTitle className="text-light-900">Payment</SemiboldTitle>

                {checkout?.expires_at && !isCompleted && (
                  <div className="bg-red-500 px-3 py-0.5 rounded-full">
                    <SemiboldSmallerText className="text-light-900">
                      {countdown === 'Expired' ? 'Expired' : `Expires in: ${countdown}`}
                    </SemiboldSmallerText>
                  </div>
                )}
              </div>

              <Link href={app_routes.checkouts}>
                <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                  <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center py-6 px-2 w-full">
              <div className="py-4 px-6 w-full border-[0.5px] border-light-400 flex items-center justify-center rounded-md bg-primary-50">
                <SemiboldHeader3 className="text-light-900">
                  {formatCurrency(checkout?.amount, checkout?.currency)}
                </SemiboldHeader3>
              </div>
            </div>
          </div>

          <div className="rounded-lg w-full flex flex-col gap-6">
            {isCompleted || paymentConfirmed ? (
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Payment Complete!</h3>
                <p className="text-gray-400 mb-6">Thank you for your payment.</p>
              </div>
            ) : (
              <>
                <div className="w-full">
                  <Tabs
                    type="secondary"
                    defaultActiveIndex={0}
                    tabs={[
                      {
                        label: 'Unified',
                        content: (
                          <div className="w-full flex justify-center text-center flex-col gap-3">
                            <SemiboldBody className="text-light-500">Invoice</SemiboldBody>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg flex justify-center">
                                <QRCodeSVG value={getUnifiedQRCodeValue() || ''} size={240} />
                              </div>

                              <div>
                                <ReadonlyInput value={getUnifiedQRCodeValue()} show />
                              </div>
                            </div>
                          </div>
                        )
                      },
                      {
                        label: 'OnChain',
                        content: (
                          <div className="w-full flex justify-center text-center flex-col gap-3">
                            <SemiboldBody className="text-light-500">Invoice</SemiboldBody>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg flex justify-center">
                                <QRCodeSVG value={checkout?.bitcoin_address || ''} size={240} />
                              </div>

                              <div>
                                <ReadonlyInput value={checkout?.bitcoin_address} show />
                              </div>
                            </div>
                          </div>
                        )
                      },
                      {
                        label: 'Lightning',
                        content: (
                          <div className="w-full flex justify-center text-center flex-col gap-3">
                            <SemiboldBody className="text-light-500">Invoice</SemiboldBody>

                            <div className="space-y-4">
                              <div className="p-4 rounded-lg flex justify-center">
                                <QRCodeSVG value={checkout?.lightning_invoice || ''} size={240} />
                              </div>

                              <div>
                                <ReadonlyInput value={checkout?.lightning_invoice} show />
                              </div>
                            </div>
                          </div>
                        )
                      }
                    ]}
                  />
                </div>

                <div className="p-6 bg-yellow-50 mt-6 rounded-lg flex items-start gap-4">
                  <div>
                    <div className="rounded-full mt-1 text-yellow-700 max-h-5 max-w-5 border-2 py-2.5 px-2.5 border-yellow-700 flex items-center justify-center text-center">
                      <FontAwesomeIcon icon={faExclamation} className="text-inherit" />
                    </div>
                  </div>

                  <ul className="text-start list-disc pl-4 text-yellow-700 space-y-2">
                    <li>
                      <SemiboldBody className="text-inherit">
                        Scan with a wallet that supports both Bitcoin and Lightning Payments.
                      </SemiboldBody>
                    </li>

                    <li>
                      <SemiboldBody className="text-inherit">
                        Please send exactly the amount given.
                      </SemiboldBody>
                    </li>

                    <li>
                      <SemiboldBody className="text-inherit">
                        Payments will be detected automatically.
                      </SemiboldBody>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
