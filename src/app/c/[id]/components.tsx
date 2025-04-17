'use client';

import { SemiboldBody, SemiboldSmallText } from '@/components/Text';
import { copyToClipboard } from '@/lib/helpers';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { QRCodeSVG } from 'qrcode.react';

export const Skeleton = () => {
  return (
    <div className="h-screen w-screen relative px-6 py-6 rounded-lg flex flex-col md:flex-row bg-transparent gap-1 animate-pulse">
      <div className="w-full flex gap-8 h-full items-start animate-pulse pt-[60px]">
        <div className="w-full h-full bg-light-300 rounded-md"></div>
      </div>
    </div>
  );
};

export const RenderQRCode = ({
  value,
  disabled = false
}: {
  value: string;
  disabled?: boolean;
}) => {
  return (
    <div className="w-full flex justify-center text-center flex-col gap-3">
      <SemiboldBody className="text-light-500">Invoice</SemiboldBody>

      <div className="space-y-4">
        <div className="p-4 rounded-lg flex justify-center">
          <QRCodeSVG value={value || ''} size={240} bgColor={disabled ? '#645c70' : '#FFFFFF'} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="rounded-md px-4 py-3 flex items-center border-[0.5px] border-light-600 w-full justify-between gap-4 relative">
            <div className="flex items-center w-full overflow-x-scroll pr-10 mr-10">
              <SemiboldSmallText
                className={clsx('whitespace-nowrap min-w-max', {
                  'text-light-900': !disabled,
                  'text-light-500': disabled
                })}>
                {value}
              </SemiboldSmallText>
            </div>

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button
                onClick={() => copyToClipboard({ text: value })}
                className={clsx(
                  'cursor-pointer h-8 w-8 rounded-md text-light-700 focus:text-light-900 hover:text-light-900 bg-primary-200'
                )}
                type="button">
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
