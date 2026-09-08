import * as React from 'react';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-slot="label"
        className={cn('text-sm font-semibold text-[var(--navy)] select-none', className)}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';
