import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#dfe2ee]/80 font-mono uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-[#908fa0] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#181c24] border border-[#262a33] rounded-lg px-3 py-2 text-xs text-[#dfe2ee] placeholder-[#908fa0]/60 focus:outline-none focus:border-[#8083ff] transition-colors ${
            icon ? 'pl-9' : ''
          } ${error ? 'border-[#ffb4ab]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-[#ffb4ab] mt-0.5">{error}</p>}
    </div>
  );
};
