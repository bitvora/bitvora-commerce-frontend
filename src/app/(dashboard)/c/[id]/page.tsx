'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { app_routes } from '@/lib/constants';
import { SemiboldSmallerText, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '@/lib/helpers';
import { Skeleton } from '@/app/(dashboard)/checkouts/[id]/components';
import React from 'react';
import { Link } from '@/components/Links';
import { Checkout } from '@/types/checkout';
import { getCheckout, pollCheckout } from './actions';
import { QRCodeSVG } from 'qrcode.react';
import Confetti from 'react-confetti';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const router = useRouter();

  const [checkout, setCheckout] = useState<Checkout>({} as Checkout);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<string>('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('unified');

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
        <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
          {paymentConfirmed && <Confetti />}

          <div className="flex w-full justify-between items-center">
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

          <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full overflow-auto flex flex-col gap-6">
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
                {/* Amount and description */}
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {formatCurrency(checkout?.amount, checkout?.currency)}
                  </h3>
                </div>

                {/* Payment method tabs */}
                <div className="border-t border-b border-gray-700">
                  <div className="grid grid-cols-3 text-center">
                    <button
                      className={`py-3 font-medium ${
                        activeTab === 'unified'
                          ? 'text-purple-400 border-b-2 border-purple-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setActiveTab('unified')}>
                      Unified
                    </button>
                    <button
                      className={`py-3 font-medium ${
                        activeTab === 'lightning'
                          ? 'text-purple-400 border-b-2 border-purple-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setActiveTab('lightning')}>
                      Lightning
                    </button>
                    <button
                      className={`py-3 font-medium ${
                        activeTab === 'bitcoin'
                          ? 'text-purple-400 border-b-2 border-purple-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setActiveTab('bitcoin')}>
                      Bitcoin
                    </button>
                  </div>
                </div>

                {/* QR codes and payment instructions */}
                <div className="p-6">
                  {activeTab === 'unified' && (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg flex justify-center">
                        <QRCodeSVG value={getUnifiedQRCodeValue()} size={128} />
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">
                          Scan with a wallet that supports both Bitcoin and Lightning payments.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'lightning' && (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg flex justify-center">
                        <QRCodeSVG value={checkout?.lightning_invoice || ''} size={128} />
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">
                          Scan with a Lightning wallet or copy the invoice
                        </p>
                        <div className="relative">
                          <input
                            type="text"
                            value={checkout?.lightning_invoice || 'Sample lightning invoice...'}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-xs overflow-ellipsis"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'bitcoin' && (
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg flex justify-center">
                        <QRCodeSVG value={checkout?.bitcoin_address || ''} size={128} />
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">
                          Scan with a Bitcoin wallet or copy the address
                        </p>
                        <div className="relative">
                          <input
                            type="text"
                            value={checkout?.bitcoin_address || 'Sample bitcoin address...'}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-xs overflow-ellipsis"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment amount reminder */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                      Please send exactly {formatCurrency(checkout?.amount, checkout?.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment will be detected automatically
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
