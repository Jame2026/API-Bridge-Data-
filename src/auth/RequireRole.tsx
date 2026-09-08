import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { ROUTES } from '../routes/paths';
import { UserRole } from '../types';

interface RequireRoleProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  children,
  requiredRole = 'viewer',
}) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole as 'admin' | 'auditor' | 'viewer')) {
    return (
      <div className="p-8 text-center text-rose-400">
        <h2 className="text-lg font-bold">Access Restricted</h2>
        <p className="text-sm mt-1 text-slate-400">
          Your role does not have permission to view this section.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
