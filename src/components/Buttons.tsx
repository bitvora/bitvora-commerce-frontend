'use client';

import { LoadingIcon } from '@/components/Icons';
import { type ReactNode, type HTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: string | ReactNode;
  className?: string;
  loading?: boolean;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  iconPosition?: 'start' | 'end';
  icon?: ReactNode;
}

export const PrimaryButton = ({
  children,
  className = '',
  loading = false,
  type = 'button',
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={clsx(
        'font-semibold bg-primary-500 border-primary-500 text-light-900',
        'hover:bg-primary-300 hover:border-primary-300 hover:text-light-800',
        'text-sm lg:text-[16px] tracking-[4%] leading-4 rounded-md px-4 py-2',
        'disabled:bg-primary-200 disabled:border-primary-200 disabled:text-light-700',
        loading || disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      {...props}>
      {loading ? (
        <div className="w-full h-full flex justify-center text-center items-center">
          <LoadingIcon />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export const SecondaryButton = ({
  children,
  className = '',
  loading = false,
  type = 'button',
  disabled,
  iconPosition,
  icon,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={clsx(
        'font-semibold flex gap-2 bg-light-900 border-light-900 text-secondary-50 hover:text-secondary-100 outline-none hover:border-light hover:border-opacity-15 focus:border-opacity-15',
        'text-sm lg:text-[16px] tracking-[4%] leading-4 rounded-md px-4 py-2 text-light h-12',
        className
      )}
      {...props}>
      {iconPosition === 'start' && icon}
      {loading ? <LoadingIcon /> : children}
      {iconPosition === 'end' && icon}
    </button>
  );
};
