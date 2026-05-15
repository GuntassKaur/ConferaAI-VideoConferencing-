import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fluent-glass rounded-3xl p-6 fluent-shadow',
          hover && 'hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500',
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = 'GlassCard';
