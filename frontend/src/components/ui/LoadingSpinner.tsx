import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'gray';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'white',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    white: 'border-white',
    primary: 'border-primary',
    gray: 'border-gray-400'
  };

  const spinnerClasses = `${sizeClasses[size]} border-2 border-t-transparent ${colorClasses[color]} rounded-full animate-spin ${className}`.trim();

  return (
    <div className={spinnerClasses} role="status" aria-label="Carregando">
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
