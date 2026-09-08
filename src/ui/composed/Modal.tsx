import React from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  icon?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  icon,
}) => {
  if (!isOpen) return null;

  const maxWStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`bg-[#10141d] border border-[#262a33] rounded-2xl shadow-2xl w-full ${maxWStyles[maxWidth]} overflow-hidden text-xs text-[#dfe2ee] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#262a33] flex items-center justify-between bg-[#141822]">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#8083ff]/15 border border-[#8083ff]/30 text-[#8083ff]">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-bold text-white text-sm">{title}</h3>
              {subtitle && <p className="text-[11px] text-[#908fa0]">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#908fa0] hover:text-white hover:bg-[#181c24] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
