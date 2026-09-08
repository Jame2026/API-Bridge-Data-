import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'accent' | 'danger' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles = {
    primary: 'bg-[#8083ff]/15 text-[#8083ff] border-[#8083ff]/30',
    success: 'bg-[#4edea3]/15 text-[#4edea3] border-[#4edea3]/30',
    accent: 'bg-[#7bd0ff]/15 text-[#7bd0ff] border-[#7bd0ff]/30',
    danger: 'bg-[#ffb4ab]/15 text-[#ffb4ab] border-[#ffb4ab]/30',
    neutral: 'bg-[#262a33] text-[#dfe2ee] border-[#31353e]',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
