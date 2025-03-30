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
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={clsx(
        'font-semibold bg-transparent border-[0.5px] border-light-400 text-light-900',
        'hover:border-light-300 hover:text-light-800',
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

export const RedButton = ({
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
        'font-semibold bg-red-500 border-red-500 text-light-900',
        'hover:bg-red-300 hover:border-red-300 hover:text-light-800',
        'text-sm lg:text-[16px] tracking-[4%] leading-4 rounded-md px-4 py-2',
        'disabled:bg-red-200 disabled:border-red-200 disabled:text-light-700',
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
