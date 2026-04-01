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
          'glass-morphism rounded-2xl p-6 shadow-xl',
          hover && 'hover:scale-[1.02] hover:shadow-2xl transition-all duration-300',
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = 'GlassCard';
