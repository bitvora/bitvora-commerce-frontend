'use client';

import { getAccounts } from '@/app/(dashboard)/actions';
import { Link } from '@/components/Links';
import { Logo } from '@/components/Logo';
import { MediumSmallText } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';

export default function Sidebar() {
  const { data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts()
  });

  return (
    <div className="w-[350px] h-full overflow-auto flex flex-col relative">
      <Link href={app_routes.dashboard}>
        <header className="flex items-center gap-2 text-light-700 hover:text-light-800">
          <Logo url={app_routes.dashboard} />

          <MediumSmallText className="text-inherit mt-2">Commerce</MediumSmallText>
        </header>
      </Link>
    </div>
  );
}
