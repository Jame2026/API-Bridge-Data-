import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../routes/paths';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { RequireRole } from '../auth/RequireRole';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Reports = lazy(() => import('../pages/Reports'));
const ActivityExplorer = lazy(() => import('../pages/ActivityExplorer'));
const Projects = lazy(() => import('../pages/Projects'));
const IngestGuide = lazy(() => import('../pages/IngestGuide'));
const Login = lazy(() => import('../pages/Login'));

const PageLoader = () => (
  <div className="h-full w-full py-24 flex flex-col items-center justify-center space-y-3">
    <div className="w-8 h-8 border-2 border-[#8083ff] border-t-transparent rounded-full animate-spin" />
    <span className="text-xs text-[#908fa0] font-mono">Loading module...</span>
  </div>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: (
      <RequireRole>
        <DashboardLayout />
      </RequireRole>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.dashboard} replace />,
      },
      {
        path: ROUTES.dashboard,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: ROUTES.reports,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Reports />
          </Suspense>
        ),
      },
      {
        path: ROUTES.activityExplorer,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ActivityExplorer />
          </Suspense>
        ),
      },
      {
        path: ROUTES.projects,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Projects />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ingestGuide,
        element: (
          <Suspense fallback={<PageLoader />}>
            <IngestGuide />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.login,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.dashboard} replace />,
  },
]);
