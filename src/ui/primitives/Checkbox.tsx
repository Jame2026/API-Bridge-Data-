import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={checkboxId} className={`inline-flex items-center gap-2 cursor-pointer select-none text-xs text-[#dfe2ee] ${className}`}>
      <input
        id={checkboxId}
        type="checkbox"
        className="w-4 h-4 rounded bg-[#181c24] border border-[#262a33] text-[#8083ff] focus:ring-0 focus:ring-offset-0 transition-colors"
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
};
