import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'outline';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  variant = 'glass',
  padding = 'lg',
  shadow = 'md'
}: CardProps) {
  const baseClasses = 'rounded-lg transition-all duration-300';

  const variantClasses = {
    glass: 'glass-card',
    solid: 'bg-white/10 border border-white/20',
    outline: 'bg-transparent border-2 border-white/20'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}
