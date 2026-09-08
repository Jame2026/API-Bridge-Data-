import React from 'react';
import { DATE_RANGE_OPTIONS } from '../../config/constants';
import { Calendar } from 'lucide-react';

export interface DateRangePickerProps {
  value: 'today' | '7d' | '30d' | '90d' | 'all';
  onChange: (value: 'today' | '7d' | '30d' | '90d' | 'all') => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center p-1 bg-[#141822] border border-[#262a33] rounded-xl text-xs font-mono ${className}`}>
      <div className="px-2 text-[#908fa0] flex items-center">
        <Calendar className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center space-x-1">
        {DATE_RANGE_OPTIONS.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dfe2ee] hover:bg-[#181c24]'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
