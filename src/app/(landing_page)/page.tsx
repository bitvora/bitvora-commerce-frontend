import { Logo } from '@/components/Logo';
import { MediumSmallerText, SemiboldHeader2 } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import Link from 'next/link';
import { Buttons } from './server-components';
import { NavLinks } from './client-components';

export default function Home() {
  return (
    <div className="w-screen h-screen bg-bg py-6 px-8 flex flex-col gap-10">
      <div className="w-full sticky top-0 left-0 right-0">
        <div className="rounded-4xl xl:rounded-[4000px] h-20 md:h-[64px] lg:h-[80px] w-full md:max-w-[600px] z-[1000] bg-bg lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1256px] mx-auto border-[0.5px] border-primary-500 px-[20px] xl:px-[32px] py-[px] flex items-center justify-between">
          <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
            <Logo url={app_routes.home} />
            <Link href={app_routes.home}>
              <MediumSmallerText className="text-inherit mt-2">Commerce</MediumSmallerText>
            </Link>
          </div>

          <NavLinks />

          <Buttons />
        </div>
      </div>

      <div className="flex items-center gap-8 w-full px-6 sm:px-8 md:px-[50px] lg:px-[75px] xl:px-[100px] 2xl:px-[160px] py-[20px] sm:py-[20px] lg:py-[50px] mt-8 lg:mt-[50px] pt-[20px] lg:pt-[50px] container mx-auto">
        <div className="w-full flex flex-col gap-4">
          <SemiboldHeader2>Open Source Bitcoin Payments For Everyone</SemiboldHeader2>
        </div>
        <div className="w-full">2</div>
      </div>
    </div>
  );
}
