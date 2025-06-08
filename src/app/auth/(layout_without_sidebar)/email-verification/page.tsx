'use client';

import { SemiboldHeader4, SemiboldSmallText } from '@/components/Text';
import { api_url, app_routes } from '@/lib/constants';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import secureLocalStorage from 'react-secure-storage';

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const user_id = searchParams.get('id');
  const confirmation_token = searchParams.get('token');

  useEffect(() => {
    let isMounted = true;

    if (!user_id || !confirmation_token) {
      router.push(app_routes.signup);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${api_url}/confirm_email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id, confirmation_token })
        });

        if (!res.ok) {
          if (isMounted) toast.error('Invalid or expired confirmation token');
          router.push(app_routes.signup);
          return;
        }

        const data = await res.json();
        const sessionId = data?.data?.id;
        let accounts = [];
        let activeAccount = '';

        try {
          const accountsResponse = await fetch(`${api_url}/account`, {
            headers: { 'Session-ID': sessionId }
          });

          if (accountsResponse.ok) {
            const accountsData = await accountsResponse.json();
            accounts = accountsData.data ?? [];
            activeAccount = accounts.length > 0 ? accounts[0]?.id : '';
          }
        } catch (accountErr) {
          console.error('Error fetching accounts:', accountErr);
        }

        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: sessionId,
            user_id: data?.data?.user_id,
            session_token: data?.data?.session_token,
            logged_in_at: data?.data?.logged_in_at,
            status: data?.data?.status,
            accounts,
            activeAccount
          })
        });

        secureLocalStorage.setItem('accounts', JSON.stringify(accounts));
        const currentAccount = accounts.find((acc) => acc.id === activeAccount);
        if (currentAccount) {
          secureLocalStorage.setItem('currentAccount', JSON.stringify(currentAccount));
        }

        if (isMounted) toast.success(data?.message || 'Email confirmed successfully');
        router.push(app_routes.dashboard);
      } catch (err) {
        console.error(err);
        if (isMounted) toast.error('Invalid or expired confirmation token');
        router.push(app_routes.signup);
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [user_id, confirmation_token, router]);

  return (
    <div className="flex flex-col gap-2 w-full text-center justify-center h-full md:w-[600px] min-h-[450px] md:h-auto md:border-[0.5px] md:border-light-400 md:rounded-lg lg:py-10 px-4 lg:px-10">
      <div className="mx-auto">
        <Image src="/img/login.png" alt="login" width={50} height={50} />
      </div>

      <SemiboldHeader4 className="text-light-900">Confirming your email address</SemiboldHeader4>

      <SemiboldSmallText className="text-light-700">
        Verifying your email. Please wait...
      </SemiboldSmallText>

      <div className="flex flex-col gap-2 absolute lg:relative bottom-10 lg:bottom-[unset] max-w-[500px] mx-auto w-full lg:w-[unset] left-0 lg:left-[unset] right-0 lg:right-[unset] mt-6 pt-6">
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-light-700 border-t-transparent" />
        </div>
      </div>
    </div>
  );
}
