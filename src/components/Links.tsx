'use client';

import NextLink from 'next/link';
import {
  type HTMLAttributeAnchorTarget,
  type HTMLAttributeReferrerPolicy,
  type ReactNode
} from 'react';

interface LinkProps {
  children: string | ReactNode;
  href: string;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  target?: HTMLAttributeAnchorTarget | undefined;
  className?: string;
  replace?: boolean;
}

export const Link = ({ href, children, referrerPolicy, target, className, replace }: LinkProps) => {
  return (
    <NextLink
      href={href}
      replace={replace}
      referrerPolicy={referrerPolicy}
      target={target}
      className={`text-white hover:text-light truncate ${className}`}>
      {children}
    </NextLink>
  );
};
