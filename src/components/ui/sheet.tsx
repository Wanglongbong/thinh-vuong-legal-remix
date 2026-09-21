import React, { createContext, useContext } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | null>(null);

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(SheetContext);
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        onClick?.(e);
        ctx?.setOpen(!ctx.open);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SheetContent({
  className,
  children,
  modal = true,
}: {
  className?: string;
  children: React.ReactNode;
  modal?: boolean;
}) {
  const ctx = useContext(SheetContext);

  if (!ctx?.open) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-end',
        !modal && 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 pointer-events-auto"
          onClick={() => ctx.setOpen(false)}
          aria-hidden="true"
        />
      )}
      {/* Drawer Panel */}
      <div
        className={cn(
          'relative z-50 flex flex-col shadow-2xl h-full transition-transform duration-300 ease-out pointer-events-auto',
          className
        )}
        role="dialog"
        aria-modal={modal ? 'true' : 'false'}
      >
        <button
          type="button"
          data-slot="sheet-close"
          className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          onClick={() => ctx.setOpen(false)}
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-4 flex flex-col', className)} {...props}>
      {children}
    </div>
  );
}

export function SheetTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn('text-lg font-medium', className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SheetDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="sheet-description"
      className={cn('text-sm text-slate-400', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function SheetClose({
  className,
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(SheetContext);
  return (
    <button
      type="button"
      className={className}
      data-slot="sheet-close"
      onClick={(e) => {
        onClick?.(e);
        ctx?.setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
