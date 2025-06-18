'use client';

import { MediumBody, SemiboldBody } from '@/components/Text';
import { copyToClipboard, formatUUID } from '@/lib/helpers';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const TransactionDetails = ({
  label,
  value,
  id
}: {
  label: string;
  value: string;
  id?: boolean;
}) => {
  const formattedValue = id ? formatUUID(value) : value;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full sm:max-w-1/3">
        <MediumBody className="text-light-500">{label}</MediumBody>
      </div>

      {id ? (
        <div className="w-full sm:max-w-2/3 text-start sm:text-end justify-start sm:justify-end flex flex-wrap items-center break-words overflow-visible gap-2">
          <SemiboldBody className="text-light-900">{formattedValue}</SemiboldBody>

          {id && (
            <button
              className="border-none outline-none text-secondary-700 hover:text-secondary-500 cursor-pointer"
              onClick={() => copyToClipboard({ text: value })}>
              <FontAwesomeIcon icon={faCopy} />
            </button>
          )}
        </div>
      ) : (
        <div className="w-full sm:max-w-2/3 text-start sm:text-end flex flex-wrap items-center gap-2 break-words overflow-visible">
          <SemiboldBody className="break-words overflow-visible w-full text-light-900">
            {value}
          </SemiboldBody>
        </div>
      )}
    </div>
  );
};

export const Skeleton = () => {
  return (
    <div className="h-full w-full relative px-4 md:px-6 py-4 md:py-6 rounded-lg flex flex-col bg-primary-40 gap-8 md:gap-10 animate-pulse overflow-auto">
      {/* Header */}
      <div className="flex w-full justify-between items-center">
        <div className="h-6 w-36 bg-light-300 rounded-md" />
        <div className="h-6 w-6 bg-light-300 rounded-full" />
      </div>

      <div className="rounded-lg px-5 py-5 lg:px-5 lg:py-6 bg-primary-150 w-full flex flex-col gap-6">
        <div className="w-full flex px-4 py-3 bg-primary-40">
          <div className="h-5 w-24 bg-light-300 rounded-md" />
        </div>

        <div className="flex flex-col gap-3 w-full items-center justify-center text-center">
          <div className="h-6 w-32 bg-light-300 rounded-md" />
          <div className="h-5 w-20 bg-light-300 rounded-md" />
        </div>
      </div>

      <div className="w-full mt-5 md:mt-10 bg-primary-150 rounded-lg px-3 md:px-4 py-3 md:py-4">
        <div className="flex flex-col w-full gap-4 mt-2 pt-2 sm:gap-6 items-start">
          <div className="h-4 w-48 bg-light-300 rounded-md" />
          <div className="h-4 w-72 bg-light-300 rounded-md" />
          <div className="h-4 w-20 bg-light-300 rounded-md" />
          <div className="h-4 w-60 bg-light-300 rounded-md" />
          <div className="h-4 w-40 bg-light-300 rounded-md" />
        </div>
      </div>
    </div>
  );
};
