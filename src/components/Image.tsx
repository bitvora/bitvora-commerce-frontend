/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

type ImageComponentProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export default function ImageComponent({
  src,
  alt,
  fallbackSrc = '/img/user.svg',
  ...props
}: ImageComponentProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
      className="w-10 h-10 rounded-md object-cover"
      {...props}
    />
  );
}
