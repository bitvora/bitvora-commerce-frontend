import { Logo } from '@/components/Logo';
import { MediumSmallerText, RegularHeader3, SemiboldBody } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import Link from 'next/link';
import { Buttons } from './server-components';
import { NavLinks, Menu } from './client-components';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';

export default function Home() {
  return (
    <div className="w-screen h-screen bg-bg flex flex-col overflow-y-auto overflow-x-hidden">
      <header className="w-full fixed top-6 md:top-4 left-0 right-0 px-5 md:px-0">
        <div
          className="rounded-4xl xl:rounded-[4000px] h-16 md:h-[64px] lg:h-[80px] w-full md:max-w-[600px] z-[1000] bg-bg lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1256px] mx-auto border-[0.5px] border-primary-500 px-[20px] xl:px-[32px] py-[px] flex items-center justify-between"
          id="navbar">
          <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
            <Logo url={app_routes.home} />
            <Link href={app_routes.home}>
              <MediumSmallerText className="text-inherit mt-2 hidden md:flex">
                Commerce
              </MediumSmallerText>
            </Link>
          </div>

          <NavLinks />

          <div className="flex items-center gap-3">
            <Buttons />

            <Menu />
          </div>
        </div>
      </header>

      <div
        id="hero"
        className="flex items-center gap-8 w-full py-[200px] sm:py-[250px] lg:py-[300px] pl-10 sm:pl-8 md:pl-[50px] lg:pl-[75px] xl:pl-[100px] 2xl:pl-[160px] pr-10 lg:pr-0">
        <div className="w-full flex flex-col gap-4 lg:max-w-[500px] text-center md:text-start mx-auto md:mx-[unset]">
          <RegularHeader3>
            Open Source <span className="text-secondary-700">Bitcoin Payments</span> For Everyone
          </RegularHeader3>

          <SemiboldBody className="text-light-700 justify-center">
            The 100% open source Bitcoin payment platform for merchants, online stores, and
            businesses. Accept Lightning and on-chain payments without giving up control.
          </SemiboldBody>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full">
            <Link href={app_routes.signup} className="w-full">
              <PrimaryButton className="h-14 min-w-[240px] w-full">
                Get Started for Free
              </PrimaryButton>
            </Link>

            <SecondaryButton className="h-14 min-w-[172px] w-full">Self-Host It</SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
