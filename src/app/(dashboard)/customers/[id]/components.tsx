'use client';

import { MediumBody, SemiboldBody } from '@/components/Text';

export const Skeleton = () => {
  return (
    <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-150 gap-10 animate-pulse">
      <div className="flex w-full justify-between items-center animate-pulse">
        <div className="h-6 w-36 bg-light-300 rounded-md"></div>
        <div className="h-6 w-6 bg-light-300 rounded-full"></div>
      </div>

      <div className="h-[500px] w-full bg-light-300 rounded-md"></div>
    </div>
  );
};

export const CustomerDetailsItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full sm:max-w-1/3">
        <MediumBody className="text-light-500">{label}</MediumBody>
      </div>

      <div className="w-full sm:max-w-2/3 text-start sm:text-end justify-start sm:justify-end flex">
        <SemiboldBody>{value}</SemiboldBody>
      </div>
    </div>
  );
};
