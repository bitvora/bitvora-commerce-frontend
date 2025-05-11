import Image from 'next/image';
import {
  MediumBody,
  RegularHeader3,
  RegularHeader6,
  RegularTitle,
  SemiboldBody,
  SemiboldSmallText
} from '@/components/Text';
import { app_routes } from '@/lib/constants';
import Link from 'next/link';
import { Buttons } from './server-components';
import { NavLinks, Menu, AppLogo } from './client-components';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import { footer_links, social_links } from './constants';

export default function Home() {
  return (
    <div className="w-screen h-screen bg-bg flex flex-col overflow-y-auto overflow-x-hidden">
      <header className="w-screen z-[1000] fixed top-0 left-0 right-0 px-5 md:px-0 backdrop-blur-3xl">
        <div
          className="rounded-4xl xl:rounded-[4000px] mt-4 h-16 md:h-[64px] lg:h-[80px] w-full md:max-w-[600px] z-[1000] bg-bg lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1256px] mx-auto border-[0.5px] border-primary-500 px-[20px] xl:px-[32px] py-[px] flex items-center justify-between"
          id="navbar">
          <AppLogo />

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
          <RegularHeader3 className="text-light-900">
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

      <div id="features" className="flex px-10 mt-4 md:mt-[100px] w-full gap-10">
        <div className="mx-auto w-full flex flex-col gap-3 mb-4 pb-4">
          <RegularHeader3 className="text-light-900 text-center">
            <span className="block md:inline md:pr-2">Powerful</span>
            <span className="block md:inline">
              Bitcoin <span className="md:text-secondary-700">Payment</span>
            </span>
            <span className="block text-secondary-700 md:text-light-900">Features</span>
          </RegularHeader3>

          <SemiboldBody className="text-light-700 justify-center text-center">
            Discover the unique advantages of building on Bitcoin
          </SemiboldBody>
        </div>

        <div className="flex flex-col md:flex-row"></div>
      </div>

      <footer
        id="footer"
        className="flex flex-col w-full px-6 sm:px-8 md:px-6 lg:px-[100px] py-[20px] sm:py-[20px] lg:py-[50px] mt-[100px] lg:mt-[50px] pt-[20px] lg:pt-[50px] mb-6 lg:mb-12 pb-6 lg:pb-12  mx-auto">
        <div className="w-full pb-10 mb-10 border-b-[0.5px] border-light-border">
          <RegularHeader6 className="justify-center">
            <span className="sm:inline justify-center flex tracking-widest font-normal capitalize leading-[130%]">
              Bitvora: Your
            </span>
            <span className="sm:inline justify-center ml-2 flex tracking-widest font-normal capitalize leading-[130%]">
              Partner in Bitcoin
            </span>
            <span className="sm:inline ml-2 justify-center flex tracking-widest font-normal capitalize leading-[130%]">
              Infrastructure.
            </span>
          </RegularHeader6>
        </div>

        <div className="block sm:hidden w-full mt-2 pt-2 border-b-[0.5px] border-light-border pb-[20px]">
          <div className="w-full justify-center text-center flex mb-4 pb-4">
            <AppLogo />
          </div>

          <div className="mt-2 pt-2 flex gap-8 justify-between">
            <div className="w-full">
              <RegularTitle className="text-light-500 text-sm 2xl:text-lg font-bold uppercase mb-3 pb-3 sm:pb-2 tracking-normal leading-tight">
                SITEMAP
              </RegularTitle>

              {footer_links.map((link, index) => (
                <div key={index} className="mb-3 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-2 2xl:mb-2">
                  <Link
                    href={link.href}
                    target={link.isExternal ? '_blank' : '_self'}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}>
                    <MediumBody className="text-light-900 text-left capitalize mb-2 hover:text-light-700">
                      {link.label}
                    </MediumBody>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full mt-2 pt-[20px] pb-[20px] px-6 justify-center gap-8 sm:hidden border-b-[0.5px] border-light-border">
          <div>
            <Link href="/">
              <SemiboldSmallText className="text-left capitalize text-light-900 hover:text-light-700">
                Terms of Service
              </SemiboldSmallText>
            </Link>
          </div>

          <div>
            <Link href="/">
              <SemiboldSmallText className="text-left capitalize text-light-900 hover:text-light-700">
                Privacy Policy
              </SemiboldSmallText>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full mt-2 pt-[20px] pb-[20px] sm:hidden">
          <div className="flex justify-center gap-6 px-6 items-center">
            {social_links.map(({ href, image, label }, index) => (
              <div key={index}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-left mb-2">
                  <Image width={25} height={25} alt={label} src={image} />
                </Link>
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center text-center">
            <SemiboldSmallText className="font-bold text-light-900 text-sm 2xl:text-base text-left capitalize mb-2 hover:text-light-700">
              © <span className="year"></span> Bitvora Commerce. All rights reserved.
            </SemiboldSmallText>
          </div>
        </div>

        <div className="hidden sm:grid grid-cols-4 gap-4 w-full mt-6 sm:mt-4 lg:mt-6 pt-6 sm:pt-4 lg:pt-6 border-b-[0.5px] border-light-border pb-[40px]">
          <div className="col-span-2">
            <AppLogo />
          </div>

          <div className="col-span-1">
            <RegularTitle className="text-white text-[15px] sm:text-sm md:text-[15px] lg:text-lg 2xl:text-xl font-semibold uppercase mb-2 pb-2 tracking-normal leading-tight">
              SITEMAP
            </RegularTitle>

            {footer_links.map((link, index) => (
              <div key={index} className="mb-3 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-2 2xl:mb-2">
                <Link
                  href={link.href}
                  target={link.isExternal ? '_blank' : '_self'}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}>
                  <MediumBody className="text-light-900 text-left capitalize mb-2 hover:text-light-700">
                    {link.label}
                  </MediumBody>
                </Link>
              </div>
            ))}
          </div>

          <div className="col-span-1">
            <RegularTitle className="text-white text-[15px] sm:text-sm md:text-[15px] lg:text-lg 2xl:text-xl font-semibold uppercase mb-2 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-2 2xl:mb-2 pb-2 sm:pb-2 md:pb-2 lg:pb-2 xl:pb-2 2xl:pb-2 tracking-normal leading-tight">
              legal
            </RegularTitle>

            <div className="mb-2">
              <Link href="/">
                <SemiboldSmallText className="text-left capitalize text-light-900 hover:text-light-700">
                  Terms of Service
                </SemiboldSmallText>
              </Link>
            </div>

            <div className="mb-2">
              <Link href="/">
                <SemiboldSmallText className="text-left capitalize text-light-900 hover:text-light-700">
                  Privacy Policy
                </SemiboldSmallText>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex justify-between gap-4 w-full mt-6 sm:mt-4 lg:mt-6 pt-6 sm:pt-4 lg:pt-6 pb-5 items-center">
          <SemiboldSmallText className="font-bold text-light-900 text-xs md:text-sm 2xl:text-base text-left capitalize mb-2 hover:text-light-700">
            © <span className="year"></span> Bitvora Commerce. All rights reserved.
          </SemiboldSmallText>

          <div className="flex justify-center gap-6 px-6 items-center">
            {social_links.map(({ href, image, label }, index) => (
              <div key={index}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-left mb-2">
                  <Image width={25} height={25} alt={label} src={image} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
