'use client';

import { Link } from '@/components/Links';
import { MediumBody, SemiboldBody } from '@/components/Text';
import { copyToClipboard, formatUUID } from '@/lib/helpers';
import { WebhookDeliveryStatusType } from '@/types/webhooks';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

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

export const WebhookAttemptDetails = ({
  label,
  value,
  url,
  id,
  error
}: {
  label: string;
  value: string;
  url?: string;
  id?: boolean;
  error?: boolean;
}) => {
  const formattedValue = id ? formatUUID(value) : value;

  const color = error ? 'text-red-700' : 'text-light-900';

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full sm:max-w-1/3">
        <MediumBody className="text-light-500">{label}</MediumBody>
      </div>

      {id ? (
        <div
          className={clsx(
            'w-full sm:max-w-2/3 text-start sm:text-end justify-start sm:justify-end flex items-center gap-2',
            color
          )}>
          {url ? (
            <Link href={url} target="_blank" referrerPolicy="same-origin">
              <SemiboldBody className={clsx('underline', color)}>{formattedValue}</SemiboldBody>
            </Link>
          ) : (
            <SemiboldBody className={color}>{formattedValue}</SemiboldBody>
          )}

          {id && (
            <button
              className="border-none outline-none text-secondary-700 hover:text-secondary-500 cursor-pointer"
              onClick={() => copyToClipboard({ text: value })}>
              <FontAwesomeIcon icon={faCopy} />
            </button>
          )}
        </div>
      ) : (
        <div className="w-full sm:max-w-2/3 text-start sm:text-end flex flex-wrap items-center gap-2 break-words overflow-visible md:justify-end">
          {url ? (
            <Link href={url} target="_blank" referrerPolicy="same-origin">
              <SemiboldBody className={clsx('underline', color)}>{formattedValue}</SemiboldBody>
            </Link>
          ) : (
            <SemiboldBody className={clsx('break-words overflow-visible w-full', color)}>
              {formattedValue}
            </SemiboldBody>
          )}
        </div>
      )}
    </div>
  );
};

export const WebhookDeliveryStatus = ({ state }: { state: WebhookDeliveryStatusType }) => {
  let className = '';

  switch (state) {
    case 'successful':
      className = 'text-green-700';
      break;

    case 'pending':
      className = 'text-yellow-700';
      break;

    case 'failed':
      className = 'text-red-700';
      break;

    default:
      className = 'text-light-900';
      break;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-6 w-full">
      <div className="w-full sm:max-w-1/3">
        <MediumBody className="text-light-500">Status</MediumBody>
      </div>

      <div className="w-full sm:max-w-2/3 text-start sm:text-end flex flex-wrap items-center gap-2 break-words overflow-visible md:justify-end">
        <SemiboldBody className={clsx('truncate capitalize', className)}>{state}</SemiboldBody>
      </div>
    </div>
  );
};
