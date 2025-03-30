'use client';

import Image from 'next/image';

export const LoadingIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={`${className} h-4 w-4 border-[1px] border-light-900 border-t-primary-500 rounded-full animate-spin`}
    />
  );
};

export const MenuIcon = () => {
  return <Image src="/img/menu.svg" alt="menu" width={25} height={25} />;
};

export const CloseIcon = ({ height = 15, width = 15 }: { width?: number; height?: number }) => {
  return <Image src="/icons/close.svg" alt="close" width={width} height={height} />;
};

export const EditIcon = ({ height = 17, width = 17 }: { width?: number; height?: number }) => {
  return <Image src="/icons/edit.svg" alt="edit" width={width} height={height} />;
};

export const DeleteIcon = ({ height = 17, width = 17 }: { width?: number; height?: number }) => {
  return <Image src="/icons/delete.svg" alt="delete" width={width} height={height} />;
};
