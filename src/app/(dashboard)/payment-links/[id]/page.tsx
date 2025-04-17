'use client';

import { useRouter } from 'next/navigation';
import { getPaymentLink } from './actions';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { app_routes } from '@/lib/constants';
import { MediumBody, SemiboldBody, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { copyToClipboard, formatDate, generatePaymentLink, renderPrice } from '@/lib/helpers';
import { Skeleton, PaymentDetailsItem } from './components';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import React from 'react';
import { Link } from '@/components/Links';
import { PaymentLink } from '@/types/payment-links';
import { useProductContext } from '@/app/(dashboard)/products/context';
import numeral from 'numeral';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const router = useRouter();

  const [paymentLink, setPaymentLink] = useState<PaymentLink>({} as PaymentLink);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['payment-link', id],
    queryFn: () => getPaymentLink(id),
    enabled: !!id,
    refetchOnWindowFocus: true,
    refetchInterval: 3000
  });

  useEffect(() => {
    if (data?.data) {
      setPaymentLink(data?.data);
      setLoading(false);
    }
  }, [data]);

  const handleClose = () => {
    router.push(app_routes.payment_links);
  };

  const { getProductById } = useProductContext();

  const product = useMemo(
    () => getProductById(paymentLink.product_id),
    [getProductById, paymentLink.product_id]
  );

  return (
    <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">Payment Link Details</SemiboldTitle>

            <Link href={app_routes.payment_links}>
              <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>

          <div className="rounded-lg px-5 lg:px-5 py-5 lg:py-6 bg-primary-150 w-full overflow-auto flex flex-col gap-6">
            <SemiboldBody className="text-light-900">Basic Information</SemiboldBody>

            <PaymentDetailsItem
              label="ID"
              value={paymentLink?.id}
              url={generatePaymentLink(paymentLink?.id)}
              id={true}
            />

            <PaymentDetailsItem label="Product" value={product?.name} url={product?.product_link} />

            <PaymentDetailsItem
              label="Amount"
              value={renderPrice({ amount: paymentLink?.amount, currency: 'sats' })}
            />

            <PaymentDetailsItem
              label="Expiry Time"
              value={`${numeral(paymentLink?.expiry_minutes).format('0,0')} mins`}
            />

            <PaymentDetailsItem label="Created" value={formatDate(paymentLink?.created_at)} />

            <hr className="border-[0.5px] border-light-300 h-[0.5px]" />

            <div className="flex flex-col gap-2">
              <MediumBody className="text-light-500">Payment Link</MediumBody>

              <div className="rounded-md px-4 py-3 flex border-[0.5px] border-light-600">
                <Link href={generatePaymentLink(paymentLink?.id)} className="w-full">
                  <MediumBody className="text-light-900">
                    {generatePaymentLink(paymentLink?.id)}
                  </MediumBody>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center border-none outline-none fixed bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10">
            <Link href={generatePaymentLink(paymentLink?.id)} className="w-full">
              <SecondaryButton className="h-11 w-full">Go to Payment Page</SecondaryButton>
            </Link>

            <PrimaryButton
              className="h-11 w-full border-none outline-none"
              onClick={(event) => {
                event.preventDefault();
                copyToClipboard({ text: generatePaymentLink(paymentLink?.id) });
              }}>
              Copy Link
            </PrimaryButton>
          </div>
        </div>
      )}
    </Drawer>
  );
}
