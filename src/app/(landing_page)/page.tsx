import { MediumBody, RegularHeader3, RegularHeader4, SemiboldBody } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import Link from 'next/link';
import { ContactSales, Pricing, Features } from './client-components';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import {
  bitvora_developer_portal_link,
  bitvora_github_link,
  bitvora_self_host_link,
  self_hosting_features
} from './constants';
import Image from 'next/image';

export default function Page() {
  return (
    <>
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

            <Link
              href={bitvora_self_host_link}
              className="w-full"
              target="_blank"
              referrerPolicy="origin">
              <SecondaryButton className="h-14 min-w-[172px] w-full">Self-Host It</SecondaryButton>
            </Link>
          </div>
        </div>
      </div>

      <Features />

      <Pricing />

      <div className="w-full px-0 xl:px-[100px] md:py-[20px] lg:py-0 xl:py-[50px] mt-[100px] lg:mt-[50px] pt-[20px] lg:pt-[50px] md:mb-6 lg:mb-0 xl:mb-12 md:pb-6 lg:pb-0 xl:pb-12 mx-auto ">
        <div
          id="self-hosting"
          className="flex flex-col md:flex-row justify-between gap-10 md:gap-4 lg:gap-10 bg-primary-100 py-4 pb-8 md:py-16 md:px-10 rounded-lg items-center">
          <div className="w-full md:w-1/2 flex sm:justify-center sm:text-center sm:mx-auto">
            <div className="hidden md:block">
              <Image
                src="/img/landing/self-hosting.svg"
                alt="self hosting"
                height={500}
                width={500}
                className="mx-auto"
              />
            </div>

            <div className="md:hidden">
              <Image
                src="/img/landing/mobile-self-hosting.svg"
                alt="self hosting"
                height={400}
                width={400}
                className="mx-auto"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-6 px-6 sm:px-14 md:px-0">
            <RegularHeader4 className="text-light-900">
              Self-Host Your Bitcoin Payment Infrastructure
            </RegularHeader4>

            <SemiboldBody className="text-light-700">
              Bitvora Commerce is 100% open source. Take control of your payment infrastructure by
              hosting it yourself.
            </SemiboldBody>

            <ul className="space-y-2">
              {self_hosting_features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-[4px]" />
                  <MediumBody className="text-light-700">{feature}</MediumBody>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-4 mt-4 w-full">
              <Link
                href={bitvora_github_link}
                target="_blank"
                referrerPolicy="origin"
                className="w-full">
                <PrimaryButton className="h-14 xl:max-w-[256px] w-full flex items-center justify-center gap-2">
                  <Image
                    src="/img/landing/social-media/github.svg"
                    width={25}
                    height={25}
                    alt="github"
                  />
                  GitHub Repository
                </PrimaryButton>
              </Link>

              <Link
                href={bitvora_developer_portal_link}
                target="_blank"
                referrerPolicy="origin"
                className="w-full">
                <SecondaryButton className="h-14 xl:max-w-[256px] w-full">
                  View Documentation
                </SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ContactSales />
    </>
  );
}
