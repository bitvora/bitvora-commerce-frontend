'use client';

import { useRouter } from 'next/navigation';
import { getCheckout } from './actions';
import { useQuery } from '@tanstack/react-query';
import { use, useEffect, useMemo, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { app_routes } from '@/lib/constants';
import { MediumBody, SemiboldBody, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { copyToClipboard, formatDate, generateCheckoutLink, renderPrice } from '@/lib/helpers';
import { Skeleton, CheckoutDetailsItem, CheckoutStatus } from './components';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import React from 'react';
import { Link } from '@/components/Links';
import { Checkout } from '@/types/checkout';
import { useProductContext } from '@/app/(dashboard)/products/context';
import { useCustomerContext } from '@/app/(dashboard)/customers/context';

type Params = Promise<{ id: string }>;

export default function Page(props: { params: Params }) {
  const params = use(props.params);
  const id = params.id;

  const router = useRouter();

  const [checkout, setCheckout] = useState<Checkout>({} as Checkout);
  const [loading, setLoading] = useState(true);

  const { data } = useQuery({
    queryKey: ['checkout', id],
    queryFn: () => getCheckout(id),
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

  const { getProductById } = useProductContext();
  const { getCustomerById } = useCustomerContext();

  const product = useMemo(
    () => getProductById(checkout.product_id),
    [getProductById, checkout.product_id]
  );

  const customer = useMemo(
    () => getCustomerById(checkout.customer_id),
    [getCustomerById, checkout.customer_id]
  );

  const isExpired = useMemo(() => {
    if (!checkout?.expires_at) return true;

    const expiresAt = new Date(checkout.expires_at);
    const now = new Date();

    return checkout.state === 'expired' || now > expiresAt;
  }, [checkout.expires_at, checkout.state]);

  return (
    <Drawer open onClose={handleClose} direction="right" className="drawer" overlayOpacity={0.9}>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 overflow-auto">
          <div className="flex w-full justify-between items-center">
            <SemiboldTitle className="text-light-900">Checkout Details</SemiboldTitle>

            <Link href={app_routes.checkouts}>
              <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
                <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
              </button>
            </Link>
          </div>

          <div className="rounded-lg px-2 md:px-5 lg:px-5 py-5 lg:py-6 md:bg-primary-150 w-full overflow-auto flex flex-col gap-6">
            <SemiboldBody className="text-light-900 hidden md:flex">Basic Information</SemiboldBody>

            <CheckoutDetailsItem
              label="ID"
              value={checkout?.id}
              url={generateCheckoutLink(checkout?.id)}
              id={true}
            />

            <CheckoutDetailsItem
              label="Product"
              value={product?.name}
              url={product?.product_link}
            />

            <CheckoutDetailsItem
              label="Amount"
              value={renderPrice({ amount: checkout?.amount, currency: 'sats' })}
            />

            {checkout?.customer_id && (
              <CheckoutDetailsItem
                label="Customer ID"
                value={customer?.name}
                url={customer?.customer_link}
              />
            )}

            <CheckoutStatus state={checkout?.state} />

            <CheckoutDetailsItem label="Created" value={formatDate(checkout?.created_at)} />

            <CheckoutDetailsItem label="Expires At" value={formatDate(checkout?.expires_at)} />

            {!isExpired && (
              <>
                <hr className="border-[0.5px] border-light-300 h-[0.5px]" />

                <div className="flex flex-col gap-2">
                  <MediumBody className="text-light-500">Checkout Link</MediumBody>

                  <div className="rounded-md px-4 py-3 flex border-[0.5px] border-light-600">
                    <Link href={generateCheckoutLink(checkout?.id)} className="w-full">
                      <MediumBody className="text-light-900">
                        {generateCheckoutLink(checkout?.id)}
                      </MediumBody>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isExpired && (
            <div className="flex gap-4 items-center border-none outline-none fixed bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10">
              <Link href={generateCheckoutLink(checkout?.id)} className="w-full">
                <SecondaryButton className="h-11 w-full">Go to Checkout Page</SecondaryButton>
              </Link>

              <PrimaryButton
                className="h-11 w-full border-none outline-none"
                onClick={(event) => {
                  event.preventDefault();
                  copyToClipboard({ text: generateCheckoutLink(checkout?.id) });
                }}>
                Copy Link
              </PrimaryButton>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
