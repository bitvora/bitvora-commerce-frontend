'use client';

import { Link } from '@/components/Links';
import { MediumBody, SemiboldBody } from '@/components/Text';
import { copyToClipboard, formatUUID } from '@/lib/helpers';
import { CheckoutState } from '@/types/checkout';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

export const Skeleton = () => {
  return (
    <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10 animate-pulse">
      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-full h-[300px] bg-light-300 rounded-md"></div>
      </div>
    </div>
  );
};

export const CheckoutDetailsItem = ({
  label,
  value,
  url,
  id
}: {
  label: string;
  value: string;
  url?: string;
  id?: boolean;
}) => {
  const formattedValue = id ? formatUUID(value) : value;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full sm:max-w-1/3">
        <MediumBody className="text-light-500">{label}</MediumBody>
      </div>

      {id ? (
        <div className="w-full sm:max-w-2/3 text-start sm:text-end justify-start sm:justify-end flex items-center gap-2">
          {url ? (
            <Link href={url} target="_blank" referrerPolicy="no-referrer">
              <SemiboldBody className="underline">{formattedValue}</SemiboldBody>
            </Link>
          ) : (
            <SemiboldBody>{formattedValue}</SemiboldBody>
          )}

          {id && (
            <button
              className="border-none outline-none text-secondary-700 hover:text-secondary-500 cursor-pointer"
              onClick={() => copyToClipboard({ text: url ? url : value })}>
              <FontAwesomeIcon icon={faCopy} />
            </button>
          )}
        </div>
      ) : (
        <div className="w-full sm:max-w-2/3 text-start sm:text-end flex flex-wrap items-center gap-2 break-words overflow-visible">
          <SemiboldBody className="break-words overflow-visible w-full">
            {formattedValue}
          </SemiboldBody>
        </div>
      )}
    </div>
  );
};

export const CheckoutStatus = ({ state }: { state: CheckoutState }) => {
  let className = '';

  switch (state) {
    case 'expired':
      className = 'text-red-700';
      break;

    case 'paid':
      className = 'text-green-700';
      break;

    case 'pending_confirmation':
      className = 'text-yellow-700';
      break;

    case 'overpaid':
    case 'underpaid':
    case 'open':
    default:
      className = 'text-light-900';
      break;
  }

  return (
    <div className="flex justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full">
        <MediumBody className="text-light-500">State</MediumBody>
      </div>

      <SemiboldBody className={clsx('capitalize', className)}>{state}</SemiboldBody>
    </div>
  );
};
