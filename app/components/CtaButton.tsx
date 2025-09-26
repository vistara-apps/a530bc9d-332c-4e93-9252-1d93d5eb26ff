'use client';

import { Loader2 } from 'lucide-react';

interface CtaButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CtaButton({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = ''
}: CtaButtonProps) {
  const baseClasses = 'font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl',
    secondary: 'bg-surface text-fg hover:bg-opacity-80 border border-white border-opacity-20',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{children}</span>
    </button>
  );
}
