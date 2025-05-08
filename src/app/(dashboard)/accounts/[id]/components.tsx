'use client';

import { MediumBody, SemiboldBody } from '@/components/Text';
import { copyToClipboard, formatUUID } from '@/lib/helpers';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Skeleton = () => {
  return (
    <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10 animate-pulse">
      <div className="flex w-full justify-between items-center animate-pulse">
        <div className="h-6 w-36 bg-light-300 rounded-md"></div>
        <div className="h-6 w-6 bg-light-300 rounded-full"></div>
      </div>

      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-[180px] h-[180px] bg-light-300 rounded-md"></div>

        <div className="flex flex-col gap-3 w-full">
          <div className="h-5 w-48 bg-light-300 rounded-md"></div>

          <div className="h-4 w-full bg-light-300 rounded-md"></div>

          <div className="h-4 w-3/4 bg-light-300 rounded-md"></div>

          <div className="h-5 w-24 bg-light-300 rounded-md"></div>

          <div className="h-4 w-32 bg-light-300 rounded-md"></div>

          <div className="h-4 w-36 bg-light-300 rounded-md"></div>
        </div>
      </div>

      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-full h-[300px] bg-light-300 rounded-md"></div>
      </div>
    </div>
  );
};

export const AccountDetailsItem = ({
  label,
  value,
  id
}: {
  label: string;
  value: string;
  id?: boolean;
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full sm:max-w-1/3">
        <MediumBody className="text-light-500">{label}</MediumBody>
      </div>

      <div className="w-full sm:max-w-2/3 text-start sm:text-end justify-start sm:justify-end flex items-center gap-2">
        <SemiboldBody>{id ? formatUUID(value) : value}</SemiboldBody>
        {id && (
          <button
            className="border-none outline-none text-secondary-700 hover:text-secondary-500 cursor-pointer"
            onClick={() => copyToClipboard({ text: value })}>
            <FontAwesomeIcon icon={faCopy} />
          </button>
        )}
      </div>
    </div>
  );
};
