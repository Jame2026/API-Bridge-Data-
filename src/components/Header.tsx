import React, { useState } from 'react';
import { NavView } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import { SupabaseConnectionModal } from './modals/SupabaseConnectionModal';

interface HeaderProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  activeRegion: string;
  onRegionChange: (region: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onTriggerSync,
  isSyncing,
  activeRegion,
  onRegionChange
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Jira Cloud: 429 Rate Limit encountered', time: '2m ago', unread: true, type: 'warning' },
    { id: '2', title: 'Shopify Store Orders: 250 records synced', time: '4m ago', unread: true, type: 'success' },
    { id: '3', title: 'Schema auto-inferred for Stripe webhook', time: '18m ago', unread: false, type: 'info' }
  ]);

  const isConfigured = isSupabaseConfigured();
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-14 border-b border-[#262a33] bg-[#0a0e16] px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & Left navigation */}
      <div className="flex items-center space-x-6">
        <button
          onClick={() => onNavigate('overview-bridges')}
          className="flex items-center space-x-2.5 focus:outline-none group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8083ff] to-[#7bd0ff] flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
            <span className="material-symbols-outlined text-[#0d0096] text-[20px] font-bold">hub</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-sm tracking-tight group-hover:text-[#c0c1ff] transition-colors">
                API DATA BRIDGE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#262a33] text-[#7bd0ff] border border-[#31353e]">
                v2.4 PROD
              </span>
            </div>
            <span className="text-[10px] text-[#908fa0] font-mono leading-none">Enterprise Ingestion Mesh</span>
          </div>
        </button>

        {/* Primary View Links */}
        <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-[#262a33]">
          <button
            onClick={() => onNavigate('overview-bridges')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'overview-bridges'
                ? 'bg-[#262a33] text-[#c0c1ff] shadow-sm'
                : 'text-[#c7c4d7] hover:text-white hover:bg-[#181c24]'
            }`}
          >
            Overview & Bridges
          </button>
          <button
            onClick={() => onNavigate('connect-auth')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'connect-auth'
                ? 'bg-[#262a33] text-[#c0c1ff] shadow-sm'
                : 'text-[#c7c4d7] hover:text-white hover:bg-[#181c24]'
            }`}
          >
            Connect & Auth
          </button>
          <button
            onClick={() => onNavigate('fetch-inspector')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'fetch-inspector'
                ? 'bg-[#262a33] text-[#c0c1ff] shadow-sm'
                : 'text-[#c7c4d7] hover:text-white hover:bg-[#181c24]'
            }`}
          >
            Fetch & Inspector
          </button>
          <button
            onClick={() => onNavigate('reports-analytics')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentView === 'reports-analytics'
                ? 'bg-[#262a33] text-[#c0c1ff] shadow-sm'
                : 'text-[#c7c4d7] hover:text-white hover:bg-[#181c24]'
            }`}
          >
            Reports & Analytics
          </button>
        </nav>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center space-x-3">
        {/* Worker Engine Health */}
        <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1 bg-[#181c24] border border-[#262a33] rounded-full text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
          </span>
          <span className="text-[#908fa0] text-[11px]">Worker Engine:</span>
          <span className="text-[#4edea3] font-mono font-medium text-[11px]">99.98% Healthy</span>
        </div>

        {/* Region Selector */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2 py-1 bg-[#181c24] border border-[#262a33] rounded-md text-xs">
          <span className="material-symbols-outlined text-[#908fa0] text-[15px]">public</span>
          <select
            value={activeRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="bg-transparent text-xs text-[#dfe2ee] font-mono focus:outline-none cursor-pointer pr-1"
          >
            <option value="us-east-1" className="bg-[#181c24]">us-east-1 (Primary)</option>
            <option value="eu-central-1" className="bg-[#181c24]">eu-central-1 (Frankfurt)</option>
            <option value="ap-southeast-1" className="bg-[#181c24]">ap-southeast-1 (Singapore)</option>
          </select>
        </div>

        {/* Supabase Status Pill */}
        <button
          onClick={() => setSupabaseModalOpen(true)}
          className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            isConfigured
              ? 'bg-[#14231d] text-[#4edea3] border-[#3ecf8e]/40 hover:bg-[#1a2f26]'
              : 'bg-[#181c24] text-[#908fa0] border-[#262a33] hover:text-white hover:border-[#3c4250]'
          }`}
          title="Supabase Database Connection & Telemetry Settings"
        >
          <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-[#3ecf8e] animate-pulse' : 'bg-[#eab308]'}`} />
          <span className="font-mono text-[11px] font-semibold tracking-wide">
            {isConfigured ? 'Supabase' : 'Connect Supabase'}
          </span>
        </button>

        {/* Trigger Manual Sync */}
        <button
          onClick={onTriggerSync}
          disabled={isSyncing}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shadow-sm ${
            isSyncing
              ? 'bg-[#31353e] text-[#908fa0] cursor-not-allowed'
              : 'bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] active:scale-[0.98]'
          }`}
          title="Trigger full ingestion sync across active pipelines"
        >
          <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>{isSyncing ? 'Syncing...' : 'Trigger Manual Sync'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 text-[#c7c4d7] hover:text-white hover:bg-[#181c24] rounded-md transition-colors relative"
            title="Ingestion Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ffb4ab] ring-2 ring-[#0a0e16]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#181c24] border border-[#31353e] rounded-lg shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-[#262a33] flex items-center justify-between">
                <span className="font-semibold text-white">Operational Alerts</span>
                <button
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                  }}
                  className="text-[11px] text-[#7bd0ff] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-[#262a33]">
                {notifications.map(item => (
                  <div key={item.id} className={`p-2.5 hover:bg-[#262a33]/50 transition-colors ${item.unread ? 'bg-[#262a33]/20' : ''}`}>
                    <div className="flex items-start space-x-2">
                      <span className={`material-symbols-outlined text-[16px] mt-0.5 ${
                        item.type === 'warning' ? 'text-[#ffb4ab]' : item.type === 'success' ? 'text-[#4edea3]' : 'text-[#7bd0ff]'
                      }`}>
                        {item.type === 'warning' ? 'warning' : item.type === 'success' ? 'check_circle' : 'info'}
                      </span>
                      <div className="flex-1">
                        <p className="text-[#dfe2ee] font-medium leading-tight">{item.title}</p>
                        <span className="text-[10px] text-[#908fa0] font-mono">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#262a33]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00a6e0] to-[#8083ff] flex items-center justify-center text-white text-xs font-semibold overflow-hidden border border-[#464554]">
            <span className="text-[11px] font-mono">AC</span>
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-[11px] font-semibold text-white leading-tight">Alex Chen</span>
            <span className="text-[9px] text-[#908fa0] font-mono">Lead Data Architect</span>
          </div>
        </div>
      </div>

      <SupabaseConnectionModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </header>
  );
};
