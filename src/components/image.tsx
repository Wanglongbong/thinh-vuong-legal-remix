import type { ImgHTMLAttributes } from 'react';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}

export function Image({
  src,
  alt,
  fill,
  priority,
  className,
  ...props
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      className={
        fill
          ? `absolute inset-0 w-full h-full object-cover ${className || ''}`
          : className
      }
      {...props}
    />
  );
}

export default Image;
