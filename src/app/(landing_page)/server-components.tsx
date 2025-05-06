import { PrimaryButton } from '@/components/Buttons';
import { app_routes } from '@/lib/constants';
import { getSessionFromServer } from '@/lib/session';
import Link from 'next/link';

export const Buttons = async () => {
  const session = await getSessionFromServer();

  return (
    <div className="flex gap-4 items-center">
      <Link href={session ? app_routes.dashboard : app_routes.login}>
        <PrimaryButton
          className="h-12 w-32 2xl:w-36 rounded-full"
          style={{ borderRadius: '3.40282e38px' }}>
          {session ? 'Dashboard' : 'Login'}
        </PrimaryButton>
      </Link>
    </div>
  );
};
