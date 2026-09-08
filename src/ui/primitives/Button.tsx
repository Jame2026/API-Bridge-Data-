import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-xs font-semibold gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#8083ff] text-[#0d0096] hover:bg-[#9194ff] shadow-md shadow-[#8083ff]/20 active:scale-[0.98]',
    secondary:
      'bg-[#181c24] text-[#dfe2ee] hover:bg-[#262a33] border border-[#262a33]',
    outline:
      'bg-transparent text-[#dfe2ee] hover:bg-[#181c24] border border-[#262a33]',
    ghost:
      'bg-transparent text-[#908fa0] hover:text-[#dfe2ee] hover:bg-[#181c24]',
    danger:
      'bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#ffb4ab]/25',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
