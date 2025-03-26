'use client';

export const LoadingIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={`${className} h-4 w-4 border-[1px] border-light-900 border-t-primary-500 rounded-full animate-spin`}
    />
  );
};
