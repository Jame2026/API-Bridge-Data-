import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#0a0e16] p-4 text-[#dfe2ee] font-sans">
      <div className="w-full max-w-md bg-[#10141d] border border-[#262a33] rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8083ff] to-[#4edea3] flex items-center justify-center text-[#0d0096] font-extrabold text-xl shadow-lg shadow-[#8083ff]/30">
            U
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
