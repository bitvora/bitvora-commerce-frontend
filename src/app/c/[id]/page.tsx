'use client';

import { useQuery } from '@tanstack/react-query';
import { use, useEffect, useMemo, useState } from 'react';
import { app_routes } from '@/lib/constants';
import { MediumSmallerText } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Skeleton, RegularCheckout, SubscriptionCheckout } from './components';
import React from 'react';
import { Link } from '@/components/Links';
import { Checkout } from '@/types/checkout';
import { getCheckout, pollCheckout } from './actions';
import { Logo } from '@/components/Logo';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCountdown } from '@/hooks/useCountDown';
import Confetti from 'react-confetti';

type Params = Promise<{ id: string }>;

export default function Page(props: { params: Params }) {
  const params = use(props.params);
  const id = params.id;

  const router = useRouter();

  const [checkout, setCheckout] = useState<Checkout>({} as Checkout);
  const [loading, setLoading] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const { data } = useQuery({
    queryKey: ['checkout', id],
    queryFn: () => getCheckout(id),
    enabled: !!id,
    refetchOnWindowFocus: true
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

  const countdown = useCountdown(checkout.expires_at);

  useEffect(() => {
    if (countdown === 'Expired') {
      toast.error('Checkout link expired');
      router.push(app_routes.checkouts);
    }
  }, [countdown, router]);

  const { data: checkoutPollingData } = useQuery({
    queryKey: ['poll-checkout', id],
    queryFn: () => pollCheckout(id),
    enabled: !!id,
    refetchOnWindowFocus: true,
    refetchInterval: 3000
  });

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

  const isCompleted = useMemo(() => {
    return (
      checkout.state &&
      (checkout.state.toLowerCase() === 'completed' || checkout.state.toLowerCase() === 'paid')
    );
  }, [checkout]);

  const isPaymentConfirmed = useMemo(() => {
    return isCompleted || paymentConfirmed;
  }, [isCompleted, paymentConfirmed]);

  return (
    <div className="w-screen h-screen bg-primary-150 relative overflow-hidden">
      {paymentConfirmed && <Confetti />}

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
        <>
          {checkout?.type === 'subscription' ? (
            <SubscriptionCheckout
              checkout={checkout}
              countdown={countdown}
              isCompleted={isCompleted}
              isPaymentConfirmed={isPaymentConfirmed}
            />
          ) : (
            <RegularCheckout
              checkout={checkout}
              countdown={countdown}
              isCompleted={isCompleted}
              isPaymentConfirmed={isPaymentConfirmed}
            />
          )}
        </>
      )}
    </div>
  );
}
