'use client';
import { forwardRef } from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3 text-text-muted">{leftIcon}</div>}
          <input
            ref={ref}
            className={cn(
              "w-full h-11 bg-[#0f0f13] border border-[#1e1e27] rounded-lg text-[#f8fafc] text-sm",
              "focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 transition-all placeholder:text-[#475569]",
              leftIcon ? "pl-10" : "pl-4",
              rightIcon ? "pr-10" : "pr-4",
              error && "border-danger focus:border-danger focus:ring-danger/50",
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 text-text-muted">{rightIcon}</div>}
        </div>
        {error && <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
