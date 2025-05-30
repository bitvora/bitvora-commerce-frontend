'use client';

import { ReactNode, type HTMLAttributes } from 'react';

interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  children: string | ReactNode;
  className?: string;
}

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  children: string | ReactNode;
  className?: string;
}

export const RegularHeader1 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h1
      className={`${
        className ?? ''
      } font-normal text-[56px] md:text-[64px] 2xl:text-[72px] tracking-[0%]`}
      {...props}>
      {children}
    </h1>
  );
};

export const SemiboldHeader2 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h2
      className={`${className ?? ''} font-semibold text-[40px] md:text-[56px] 2xl:text-[60px] tracking-[0%]`}
      {...props}>
      {children}
    </h2>
  );
};

export const RegularHeader2 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h2
      className={`${className ?? ''} font-normal text-[40px] md:text-[56px] 2xl:text-[60px] tracking-[0%]`}
      {...props}>
      {children}
    </h2>
  );
};

export const SemiboldHeader3 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h3
      className={`${className ?? ''} font-semibold text-[30px] md:text-[40px] 2xl:text-[50px] tracking-[0%]`}
      {...props}>
      {children}
    </h3>
  );
};

export const RegularHeader3 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h3
      className={`${className ?? ''} font-normal text-[30px] md:text-[40px] 2xl:text-[50px] tracking-[0%]`}
      {...props}>
      {children}
    </h3>
  );
};

export const SemiboldHeader4 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h4
      className={`${className ?? ''} font-semibold text-[25px] md:text-[31px] 2xl:text-[36px] tracking-[0%]`}
      {...props}>
      {children}
    </h4>
  );
};

export const MediumHeader4 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h4
      className={`${className ?? ''} font-medium text-[25px] md:text-[31px] 2xl:text-[36px] tracking-[0%]`}
      {...props}>
      {children}
    </h4>
  );
};

export const RegularHeader4 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h4
      className={`${className ?? ''} font-normal text-[25px] md:text-[31px] 2xl:text-[36px] tracking-[0%]`}
      {...props}>
      {children}
    </h4>
  );
};

export const MediumHeader5 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h5
      className={`${className ?? ''} font-medium text-[20px] md:text-[25px] 2xl:text-[30px] tracking-[0%]`}
      {...props}>
      {children}
    </h5>
  );
};

export const RegularHeader6 = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h5
      className={`${className ?? ''} font-normal text-[18px] md:text-[24px] 2xl:text-[28px] tracking-[0%]`}
      {...props}>
      {children}
    </h5>
  );
};

export const SemiboldTitle = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h6 className={`${className ?? ''} font-semibold text-[20px] 2xl:text-[24px] tracking-[0%]`} {...props}>
      {children}
    </h6>
  );
};

export const MediumTitle = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h6 className={`${className ?? ''} font-medium text-[20px] 2xl:text-[24px] tracking-[0%]`} {...props}>
      {children}
    </h6>
  );
};

export const RegularTitle = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h6 className={`${className ?? ''} font-normal text-[20px] 2xl:text-[24px] tracking-[0%]`} {...props}>
      {children}
    </h6>
  );
};

export const SemiboldBody = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-semibold text-[16px] 2xl:text-[18px]`} {...props}>
      {children}
    </p>
  );
};

export const MediumBody = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-medium text-[16px] 2xl:text-[18px]`} {...props}>
      {children}
    </p>
  );
};

export const RegularBody = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-normal text-[16px] 2xl:text-[18px]`} {...props}>
      {children}
    </p>
  );
};

export const LightBody = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-light text-[16px] 2xl:text-[18px]`} {...props}>
      {children}
    </p>
  );
};

export const BoldSmallText = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`font-bold text-[14px] 2xl:text-[16px] tracking-[2%] ${className ?? ''}`} {...props}>
      {children}
    </p>
  );
};

export const SemiboldSmallText = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`font-semibold text-[14px] 2xl:text-[16px] tracking-[2%] ${className ?? ''}`} {...props}>
      {children}
    </p>
  );
};

export const MediumSmallText = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`font-medium text-[14px] 2xl:text-[16px] tracking-[2%] ${className ?? ''}`} {...props}>
      {children}
    </p>
  );
};

export const RegularSmallText = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`font-normal text-[14px] 2xl:text-[16px] tracking-[2%] ${className ?? ''}`} {...props}>
      {children}
    </p>
  );
};

export const BoldSmallerText = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-bold text-[12px] 2xl:text-[14px] tracking-[0%]`} {...props}>
      {children}
    </p>
  );
};

export const SemiboldSmallerText = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-semibold text-[12px] 2xl:text-[14px] tracking-[0%]`} {...props}>
      {children}
    </p>
  );
};

export const MediumSmallerText = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-medium text-[12px] 2xl:text-[14px] tracking-[0%]`} {...props}>
      {children}
    </p>
  );
};

export const RegularSmallerText = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-normal text-[12px] 2xl:text-[14px] tracking-[0%]`} {...props}>
      {children}
    </p>
  );
};

export const BoldCaption = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-bold text-[10px] 2xl:text-[12px] tracking-[0%]`} {...props}>
      {children}
    </p>
  );
};

export const SemiboldCaption = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-semibold text-[10px] 2xl:text-[12px] tracking-[0%]`} {...props}>
      {children}
    </p>
  );
};

export const RegularCaption = ({ children, className, ...props }: TextProps) => {
  return (
    <p className={`${className ?? ''} font-normal text-[10px] 2xl:text-[12px] tracking-[0%]`} {...props}>
      {children}
    </p>
  );
};
