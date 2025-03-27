'use client';

import { PrimaryButton } from '@/components/Buttons';
import Currency from '@/components/Currency';
import { MediumHeader5, SemiboldSmallText } from '@/components/Text';

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-primary-50 rounded-lg px-8 py-2 h-[80px] w-full flex items-center justify-between">
        <div className="flex gap-6 items-center">
          <MediumHeader5>Dashboard</MediumHeader5>

          <Currency />
        </div>

        <div className="flex gap-4 items-center">
          <PrimaryButton className="h-10">
            <SemiboldSmallText>New Payment Link</SemiboldSmallText>
          </PrimaryButton>

          <PrimaryButton className="h-10">
            <SemiboldSmallText>Add Product</SemiboldSmallText>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
