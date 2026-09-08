import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/paths';
import { useUiStore } from '../state/uiStore';
import { useAuth } from '../auth/useAuth';
import { useProjectsQuery } from '../features/projects/api/projects.queries';
import { DateRangePicker } from '../ui/composed/DateRangePicker';
import { Button } from '../ui/primitives/Button';
import { 
  LayoutDashboard, 
  FileText, 
  ListOrdered, 
  FolderKanban, 
  Code2, 
  LogOut, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Menu
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: projects = [] } = useProjectsQuery();

  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const activeProjectId = useUiStore((s) => s.activeProjectId);
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);
  const dateRange = useUiStore((s) => s.dateRange);
  const setDateRange = useUiStore((s) => s.setDateRange);
  const toasts = useUiStore((s) => s.toasts);

  const navLinks = [
    { to: ROUTES.dashboard, label: 'Usage Dashboard', icon: LayoutDashboard },
    { to: ROUTES.reports, label: 'Saved Reports', icon: FileText },
    { to: ROUTES.activityExplorer, label: 'Activity Explorer', icon: ListOrdered },
    { to: ROUTES.projects, label: 'Internal Projects', icon: FolderKanban },
    { to: ROUTES.ingestGuide, label: 'Ingest API Guide', icon: Code2 },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0e16] text-[#dfe2ee] font-sans antialiased">
      {/* Toast Notifications */}
      <div className="fixed top-5 right-5 z-[9999] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md text-xs font-medium animate-in slide-in-from-top-3 duration-200 pointer-events-auto ${
              toast.type === 'success'
                ? 'bg-[#182a20]/95 border-[#4edea3]/40 text-[#4edea3]'
                : toast.type === 'error'
                ? 'bg-[#2a1618]/95 border-[#ffb4ab]/40 text-[#ffb4ab]'
                : 'bg-[#181c26]/95 border-[#8083ff]/40 text-[#8083ff]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } shrink-0 bg-[#10141d] border-r border-[#262a33] flex flex-col justify-between transition-all duration-200 z-30`}
      >
        <div>
          {/* Logo */}
          <div className="h-16 px-4 border-b border-[#262a33] flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#4edea3] flex items-center justify-center text-[#0d0096] shrink-0 font-extrabold text-sm shadow-md shadow-[#8083ff]/20">
                U
              </div>
              {sidebarOpen && (
                <div className="flex flex-col truncate">
                  <span className="font-bold text-white text-xs tracking-wider uppercase font-mono truncate">
                    Internal Usage
                  </span>
                  <span className="text-[10px] text-[#908fa0] font-mono">Reporting Platform</span>
                </div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded text-[#908fa0] hover:text-white hover:bg-[#181c24]"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== ROUTES.dashboard && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#8083ff]/15 text-[#8083ff] border border-[#8083ff]/30 font-semibold'
                      : 'text-[#908fa0] hover:text-white hover:bg-[#181c24]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-[#262a33] bg-[#141822] flex items-center justify-between">
            <div className="flex flex-col truncate pr-2">
              <span className="text-xs font-medium text-white truncate font-mono">{user?.name}</span>
              <span className="text-[10px] text-[#908fa0] truncate">{user?.email}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate(ROUTES.login);
              }}
              title="Logout"
              className="p-1.5 rounded-lg text-[#908fa0] hover:text-[#ffb4ab] hover:bg-[#181c24] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-6 bg-[#10141d] border-b border-[#262a33] flex items-center justify-between shrink-0">
          {/* Project Selector */}
          <div className="flex items-center space-x-3">
            <Layers className="w-4 h-4 text-[#8083ff]" />
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-[#181c24] border border-[#262a33] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#8083ff] cursor-pointer"
            >
              <option value="all">All Internal Projects (Aggregate)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center space-x-3">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </header>

        {/* Dynamic Route Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#262a33]">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
