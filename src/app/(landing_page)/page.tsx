import { Logo } from '@/components/Logo';
import { MediumSmallerText } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import Link from 'next/link';
import { Buttons } from './server-components';

export default function Home() {
  return (
    <div className="w-screen h-screen bg-bg py-6 px-8">
      <div className="rounded-4xl xl:rounded-[4000px] h-20 md:h-[64px] lg:h-[80px] w-full md:max-w-[600px] z-[1000] bg-bg lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1256px] mx-auto border-[0.5px] border-primary-500 px-[20px] xl:px-[32px] py-[px] flex items-center justify-between">
        <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
          <Logo url={app_routes.home} />
          <Link href={app_routes.home}>
            <MediumSmallerText className="text-inherit mt-2">Commerce</MediumSmallerText>
          </Link>
        </div>

        <div className="flex gap-4 items-center"></div>

        <Buttons />
      </div>
    </div>
  );
}
