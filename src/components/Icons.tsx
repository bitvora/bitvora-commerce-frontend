'use client';

export const LoadingIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={`${className} h-10 w-10 border-4 border-light-900 border-t-primary-500 rounded-full animate-spin`}
    />
  );
};
