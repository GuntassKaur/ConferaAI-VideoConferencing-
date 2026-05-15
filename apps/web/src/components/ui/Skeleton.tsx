'use client';
import { cn } from './utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'block' | 'text';
}

export const Skeleton = ({ className, variant = 'block', ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-background-elevated",
        variant === 'text' ? "rounded-full" : "rounded-xl",
        className
      )}
      {...props}
    />
  );
};
