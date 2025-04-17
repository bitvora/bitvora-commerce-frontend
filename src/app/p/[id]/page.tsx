'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { app_routes } from '@/lib/constants';
import { MediumSmallerText, SemiboldSmallText, SemiboldTitle } from '@/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Skeleton } from './components';
import React from 'react';
import { Link } from '@/components/Links';
import { getPaymentLinkDetails } from './actions';
import { Logo } from '@/components/Logo';
import { useRouter } from 'next/navigation';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const router = useRouter();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['payment-link-details', id],
    queryFn: () => getPaymentLinkDetails(id),
    enabled: !!id,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (data.data && data.data.id) {
      router.push(`/c/${data?.data?.id}`);
    }
  }, [data, router]);

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
        <Link href={app_routes.payment_links}>
          <button className="border-none outline-none cursor-pointer text-light-900 hover:text-light-700">
            <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
          </button>
        </Link>
      </div>

      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="min-h-screen max-h-screen h-full overflow-hidden payment-page">
          {isError ? (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <div className="rounded-lg p-2 md:p-8 max-w-md w-full text-center justify-center flex flex-col gap-10">
                <SemiboldTitle className="text-red-600">Payment Link Error</SemiboldTitle>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:max-w-[500px] justify-between md:justify-center">
                  <Link href={app_routes.dashboard} className="w-full">
                    <SecondaryButton className="h-11 w-full">Return to Home</SecondaryButton>
                  </Link>

                  <Link
                    href={`${app_routes.payment_links}?action=new-payment-link`}
                    className="w-full">
                    <PrimaryButton className="h-11 w-full border-none outline-none">
                      Generate New Link
                    </PrimaryButton>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <div className="rounded-lg p-2 md:p-8 max-w-md w-full text-center justify-center flex flex-col gap-10">
                <SemiboldTitle className="text-light-900">Processing Payment Link</SemiboldTitle>

                <SemiboldSmallText className="text-light-700">
                  Please wait while we redirect you to the checkout page...
                </SemiboldSmallText>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
