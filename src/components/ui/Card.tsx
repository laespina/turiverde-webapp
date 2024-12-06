import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("pb-4 border-b border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Content = function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("pt-4", className)} {...props}>
      {children}
    </div>
  );
};