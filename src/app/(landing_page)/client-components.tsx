'use client';

import { MobileMenuIcon } from '@/components/Icons';
import { Logo } from '@/components/Logo';
import {
  MediumBody,
  MediumSmallerText,
  MediumSmallText,
  RegularBody,
  RegularHeader3,
  RegularHeader4,
  RegularHeader6,
  RegularTitle,
  SemiboldBody,
  SemiboldSmallText
} from '@/components/Text';
import { app_routes } from '@/lib/constants';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { links, PricingPlan } from './constants';
import { footer_links, social_links, pricing_plans } from './constants';
import Image from 'next/image';
import { PrimaryButton, SecondaryButton } from '@/components/Buttons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, A11y } from 'swiper/modules';

export const NavLinks = () => {
  const pathname = usePathname();
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  const currentUrl = `${pathname}${currentHash}`;

  return (
    <div className="hidden lg:flex items-center gap-4">
      {links.map((link, index) => {
        const isActive = link.href === currentUrl;

        return (
          <div key={index} className="flex items-center gap-4">
            <Link
              href={link.href}
              className={`text-light-900 hover:text-secondary-700 uppercase ${
                isActive ? 'text-secondary-700' : ''
              }`}>
              <SemiboldSmallText>{link.label}</SemiboldSmallText>
            </Link>

            {index < links.length - 1 && (
              <div className="h-[14px] w-[1px] bg-light-400 hidden lg:block"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash);
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);

    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, []);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="lg:hidden flex items-center justify-center">
      <button onClick={toggleDrawer} className="cursor-pointer">
        {isOpen ? (
          <FontAwesomeIcon icon={faXmark} style={{ width: '20px', height: '20px' }} />
        ) : (
          <MobileMenuIcon />
        )}
      </button>

      <Drawer open={isOpen} onClose={toggleDrawer} direction="top" className="mt-28 drawer ">
        <div className="w-full h-full flex flex-col bg-primary-50">
          {links.map((link, index) => {
            const url = `${pathname}${currentHash}`;
            const isActive = link.href === url;

            return (
              <div
                key={index}
                onClick={toggleDrawer}
                className={clsx('w-full flex items-center justify-center py-4', {
                  'border-b border-light-300': index < links.length - 1
                })}>
                <Link href={link.href}>
                  <SemiboldSmallText
                    className={clsx('text-light-900 hover:text-secondary-700 capitalize', {
                      'text-secondary-700': isActive
                    })}>
                    {link.label}
                  </SemiboldSmallText>
                </Link>
              </div>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};

export const AppLogo = () => (
  <div className="flex items-center gap-2 text-light-700 hover:text-light-800">
    <Logo url={app_routes.home} />
    <Link href={app_routes.home}>
      <MediumSmallerText className="text-inherit mt-2 hidden md:flex">Commerce</MediumSmallerText>
    </Link>
  </div>
);

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="flex flex-col w-full px-6 sm:px-8 md:px-6 lg:px-[100px] py-[20px] sm:py-[20px] lg:py-[50px] mt-[100px] lg:mt-[50px] pt-[20px] lg:pt-[50px] mb-6 lg:mb-12 pb-6 lg:pb-12 mx-auto">
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
  );
};

export const ContactSales = () => {
  return (
    <div className="flex flex-col md:flex-row items-end justify-between px-6 sm:px-8 md:px-6 lg:px-[100px] py-[20px] sm:py-[20px] lg:py-[50px] md:mt-[100px] lg:mt-[50px] mb-6 lg:mb-12 pb-6 lg:pb-12 mx-auto bg-light-900 w-full gap-10">
      <div className="flex flex-col justify-center md:justify-start text-center md:text-start gap-4 w-full md:w-1/2">
        <div className="max-w-[400px]">
          <RegularHeader4 className="text-light-50">
            Ready to Accept Bitcoin Payments?
          </RegularHeader4>
        </div>
        <div className="max-w-[600px]">
          <RegularBody className="text-light-50">
            Join thousands of merchants who are already using Bitvora Commerce to accept Bitcoin
            payments.
          </RegularBody>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 md:mt-0 lg:ml-auto text-right w-full lg:w-auto">
        <Link href={app_routes.signup} className="w-full sm:w-auto">
          <PrimaryButton className="h-14 min-w-[240px] w-full sm:w-auto md:w-[200px]">
            Sign Up for Free
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
};

export const Pricing = () => {
  const [isActive, setIsActive] = useState(pricing_plans[1]);

  return (
    <div
      id="pricing"
      className="flex flex-col md:mt-[100px] xl:mt-[200px] w-full gap-10 px-6 sm:px-8 md:px-6 lg:px-[100px] py-[20px] sm:py-[20px] lg:py-[50px] mt-[100px] lg:mt-[50px] pt-[20px] lg:pt-[50px] mb-6 lg:mb-12 pb-6 lg:pb-12  mx-auto">
      <div className="mx-auto w-full flex flex-col gap-3 mb-4 pb-4">
        <RegularHeader3 className="text-light-900 text-center">
          <span className="block md:inline md:pr-2">Simple, </span>
          <span className="block md:inline">
            <span className="text-secondary-700">Transparent</span> Pricing
          </span>
        </RegularHeader3>

        <SemiboldBody className="text-light-700 justify-center text-center">
          Choose the plan that fits your project&apos;s scale and needs
        </SemiboldBody>
      </div>

      <div className="flex lg:hidden">
        <Swiper
          spaceBetween={10}
          loop
          slidesPerView={1.2}
          modules={[Autoplay, Pagination, A11y]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          pagination={{
            clickable: true
          }}
          onSlideChange={(swiper) => {
            console.log({ index: swiper });
            setIsActive(pricing_plans[swiper.activeIndex]);
          }}>
          {pricing_plans.map((plan, index) => (
            <SwiperSlide key={index}>
              <PricingItem
                isActive={isActive}
                index={index}
                setIsActive={setIsActive}
                plan={plan}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden lg:flex items-stretch gap-10 mx-auto overflow-x-auto">
        {pricing_plans.map((plan, index) => (
          <PricingItem
            key={index}
            isActive={isActive}
            index={index}
            setIsActive={setIsActive}
            plan={plan}
          />
        ))}
      </div>
    </div>
  );
};

export const PricingItem = ({
  plan,
  index,
  isActive,
  setIsActive
}: {
  plan: PricingPlan;
  index: number;
  isActive: PricingPlan;
  setIsActive: Dispatch<SetStateAction<PricingPlan>>;
}) => {
  return (
    <div
      className={clsx(
        'w-full max-w-[350px] md:min-w-[350px] h-full rounded-xl border-[0.5px] border-primary-500 flex flex-col gap-4 px-8 py-8 cursor-pointer transition-[background] duration-[400ms] ease-in-out bg-[radial-gradient(89.47%_54.51%_at_2.06%_2.04%,_#5c487f_17.99%,_rgba(20,_18,_25,_0)_69.93%,_rgba(16,_12,_21,_0)_88.3%)] bg-[#0c0911] hover:bg-[#35284a] isolate box-border',
        { 'bg-[#35284a]': isActive?.title === plan?.title }
      )}
      onMouseEnter={() => setIsActive(plan)}>
      <div className="w-full flex justify-between gap-4 items-start">
        <Image src={plan?.image} width={72} height={72} alt={plan?.title} />

        {plan?.isMostPopular && (
          <div className="px-5 py-1.5 bg-primary-100 rounded-full">
            <MediumSmallText className="text-light-900">Most Popular</MediumSmallText>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <RegularHeader4 className="text-light-900">{plan?.title}</RegularHeader4>

        <div className="flex flex-col gap-2">
          <MediumSmallText className="text-light-900">{plan?.text}</MediumSmallText>
        </div>
      </div>

      <div className="flex justify-start items-center gap-1 mt-4">
        <RegularHeader3 className="text-light-900">{plan?.price.value}</RegularHeader3>
        <MediumBody className="text-light-900 pt-3">{plan?.price.label}</MediumBody>
      </div>

      <div className="w-full mt-4">
        <Link
          href={plan?.cta?.href}
          target={plan?.cta?.isExternal ? '_blank' : '_self'}
          rel={plan?.cta?.isExternal ? 'noopener noreferrer' : undefined}
          className="w-full">
          <SecondaryButton
            className={clsx('h-14 w-full', {
              '!bg-light-900 !text-light-50': isActive?.title === plan?.title
            })}>
            {plan?.cta?.label}
          </SecondaryButton>
        </Link>
      </div>

      <ul className="mt-8 w-full">
        {index === 0 && (
          <>
            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                Lightning Network <span className="text-light-600">payment</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                1 Merchant <span className="text-light-600">account</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-600">
                Up to <span className="text-light-900"> $5,000</span> USD/month
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                No On-chain <span className="text-light-600">payment</span>
              </SemiboldSmallText>
            </li>
          </>
        )}

        {index === 1 && (
          <>
            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                Lightning Network <span className="text-light-600">payment</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                On-chain Bitcoin <span className="text-light-600">Payment</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                0.4% <span className="text-light-600">Transaction Fees</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                Unlimited <span className="text-light-600">Monthly Volume</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                Multiple Merchant <span className="text-light-600">Accounts</span>
              </SemiboldSmallText>
            </li>
          </>
        )}

        {index === 2 && (
          <>
            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                Full Feature <span className="text-light-600">Access</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                No <span className="text-light-600">Monthly Limit</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                Complete <span className="text-light-600">Control</span>
              </SemiboldSmallText>
            </li>

            <li className="flex items-center gap-3 mb-2">
              <div className="w-1 h-1 bg-light-900 rounded-full" />
              <SemiboldSmallText className="text-light-900">
                Technical Setup <span className="text-light-600">Required</span>
              </SemiboldSmallText>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export const Features = () => {
  return (
    <div
      id="features"
      className="flex flex-col px-6 sm:px-8 md:px-6 lg:px-[100px] mt-4 md:mt-[100px] w-full gap-10">
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

      <div className="flex flex-col gap-8 w-full">
        <div className="flex w-full gap-8">
          <div>
            <Image src="/img/landing/features/1.png" height={250} width={800} alt="" />
          </div>

          <div>
            <Image src="/img/landing/features/2.png" height={250} width={420} alt="" />
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div>
            <Image src="/img/landing/features/3.png" height={250} width={600} alt="" />
          </div>

          <div>
            <Image src="/img/landing/features/4.png" height={250} width={600} alt="" />
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div>
            <Image src="/img/landing/features/5.png" height={250} width={800} alt="" />
          </div>

          <div>
            <Image src="/img/landing/features/6.png" height={250} width={420} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
