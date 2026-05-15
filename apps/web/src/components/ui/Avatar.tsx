'use client';
import { cn } from './utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isOnline?: boolean;
}

const sizes = {
  xs: "h-6 w-6 text-[10px]", // 24px
  sm: "h-8 w-8 text-xs",     // 32px
  md: "h-10 w-10 text-sm",   // 40px
  lg: "h-14 w-14 text-base", // 56px
};

const dotSizes = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

export const Avatar = ({ className, src, initials, size = 'md', isOnline, ...props }: AvatarProps) => {
  return (
    <div className={cn("relative inline-block", sizes[size], className)} {...props}>
      <div className="w-full h-full rounded-full overflow-hidden bg-background-elevated border border-background-border flex items-center justify-center font-bold text-text-secondary uppercase">
        {src ? (
          <img src={src} alt={initials || "Avatar"} className="w-full h-full object-cover" />
        ) : (
          initials?.substring(0, 2)
        )}
      </div>
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background-base",
            isOnline ? "bg-success" : "bg-text-muted",
            dotSizes[size]
          )}
        />
      )}
    </div>
  );
};

export const AvatarGroup = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={cn("flex items-center -space-x-3", className)}>
      {children}
    </div>
  );
};
