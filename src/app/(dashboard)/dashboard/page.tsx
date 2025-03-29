'use client';

import NewCustomers from './components/NewCustomers';
import SalesGraph from './components/SalesGraph';
import ActiveSubscribers from './components/ActiveSubscribers';
import { PrimaryButton } from '@/components/Buttons';
import Currency from '@/components/Currency';
import { MediumHeader5, SemiboldSmallText } from '@/components/Text';
import MRR from './components/MRR';
import { Link } from '@/components/Links';
import { app_routes } from '@/lib/constants';

export default function Page() {
  return (
    <div className="flex flex-col gap-8 bg-primary-150 px-3 pt-6 lg:pt-0 pb-8">
      <div className="bg-transparent xl:bg-primary-50 rounded-lg px-2 lg:px-8 py-2 lg:h-[80px] w-full flex items-center justify-between">
        <div className="gap-10 items-center hidden xl:flex">
          <MediumHeader5>Dashboard</MediumHeader5>

          <div className="hidden lg:flex">
            <Currency />
          </div>
        </div>

        <div className="flex gap-4 items-center w-full xl:w-[auto]">
          <PrimaryButton className="h-10 sm:h-12 md:h-12 w-full xl:w-[auto]">
            <SemiboldSmallText>Payment Link</SemiboldSmallText>
          </PrimaryButton>

          <Link href={`${app_routes.products}?action=new-product`}>
            <PrimaryButton className="h-10 sm:h-12 md:h-12 w-full xl:w-[auto]">
              <SemiboldSmallText>Add Product</SemiboldSmallText>
            </PrimaryButton>
          </Link>
        </div>
      </div>

      <SalesGraph />

      <div className="flex gap-3 items-stretch overflow-hidden">
        <NewCustomers />
        <ActiveSubscribers />
        <MRR />
      </div>
    </div>
  );
}
