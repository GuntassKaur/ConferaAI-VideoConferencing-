'use client';
import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from './utils';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
    
    const variants = {
      primary: "bg-accent hover:bg-accent-light text-white shadow-sm shadow-accent-glow",
      ghost: "bg-transparent hover:bg-background-elevated text-text-primary",
      danger: "bg-danger hover:bg-red-400 text-white shadow-sm shadow-danger/20",
      icon: "bg-background-elevated hover:bg-background-border text-text-primary border border-background-border",
    };
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    };
    
    const iconSizes = {
      sm: "h-8 w-8",
      md: "h-11 w-11",
      lg: "h-14 w-14",
    };

    const combinedSize = variant === 'icon' ? iconSizes[size] : sizes[size];

    return (
      <motion.button
        ref={ref}
        whileHover={disabled || isLoading ? {} : { scale: 0.98 }}
        whileTap={disabled || isLoading ? {} : { scale: 0.96 }}
        className={cn(baseStyles, variants[variant], combinedSize, className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
