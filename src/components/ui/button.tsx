import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors outline-none select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          size === 'default' && 'h-9 px-4 py-2 text-sm',
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'lg' && 'h-11 px-6 text-base',
          size === 'icon' && 'h-9 w-9 p-0',
          variant === 'default' && 'bg-[var(--teal)] text-white hover:bg-[var(--navy)]',
          variant === 'outline' && 'border border-[var(--line)] bg-white hover:bg-slate-50 text-[var(--ink)]',
          variant === 'secondary' && 'bg-slate-100 text-slate-900 hover:bg-slate-200',
          variant === 'ghost' && 'hover:bg-slate-100 text-[var(--ink)]',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
