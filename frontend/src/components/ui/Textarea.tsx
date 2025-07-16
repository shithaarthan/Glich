import React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-shadow text-text placeholder:text-text-muted min-h-[120px]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
export default Textarea;
