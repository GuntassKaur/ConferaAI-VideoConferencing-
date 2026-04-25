'use client';
import { forwardRef } from 'react';
import { cn } from './utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: "bg-[#0f0f13] border-[#1e1e27]",
      elevated: "bg-[#17171d] border-[#1e1e27] shadow-xl",
      glass: "bg-[#0f0f13]/40 backdrop-blur-xl border-[#1e1e27] shadow-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border transition-colors duration-300 hover:border-[#6366f1]/50 overflow-hidden",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
