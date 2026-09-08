import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export function NativeSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div
      className={cn('relative w-full', className)}
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        className="h-10 w-full appearance-none rounded border border-[var(--line)] bg-white px-3 py-2 pr-8 text-sm text-[var(--ink)] outline-none focus:border-[var(--teal)] disabled:opacity-50"
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />
    </div>
  );
}

export function NativeSelectOption({
  className,
  ...props
}: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option data-slot="native-select-option" className={className} {...props} />;
}

export function NativeSelectOptGroup({
  className,
  ...props
}: React.OptgroupHTMLAttributes<HTMLOptGroupElement>) {
  return <optgroup data-slot="native-select-optgroup" className={className} {...props} />;
}
