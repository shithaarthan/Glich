import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          'w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow text-text placeholder:text-text-muted',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
export default Input;
