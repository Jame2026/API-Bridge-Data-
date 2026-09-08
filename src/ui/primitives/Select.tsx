import React from 'react';

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly Option[] | Option[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-[#dfe2ee]/80 font-mono uppercase">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-[#181c24] border border-[#262a33] rounded-lg px-3 py-2 text-xs text-[#dfe2ee] focus:outline-none focus:border-[#8083ff] transition-colors cursor-pointer ${
          error ? 'border-[#ffb4ab]' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#141822] text-[#dfe2ee]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-[#ffb4ab] mt-0.5">{error}</p>}
    </div>
  );
};
