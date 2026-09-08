import React from 'react';
import { NavView, BridgePipeline } from '../types';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  bridges: BridgePipeline[];
  selectedBridgeId: string;
  onSelectBridge: (id: string) => void;
  onOpenNewBridgeModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  bridges,
  selectedBridgeId,
  onSelectBridge,
  onOpenNewBridgeModal
}) => {
  const navItems = [
    { id: 'overview-bridges' as NavView, label: 'Overview & Bridges', icon: 'hub', badge: `${bridges.length}` },
    { id: 'connect-auth' as NavView, label: 'Connect & Auth', icon: 'cable' },
    { id: 'fetch-inspector' as NavView, label: 'Fetch & Inspector', icon: 'data_object' },
    { id: 'reports-analytics' as NavView, label: 'Reports & Analytics', icon: 'monitoring' },
    { id: 'endpoint-registry' as NavView, label: 'Endpoint Registry', icon: 'dns', badge: '12' },
    { id: 'audit-logs' as NavView, label: 'Payload Stream Logs', icon: 'reorder', badge: 'LIVE' }
  ];

  const selectedBridge = bridges.find(b => b.id === selectedBridgeId) || bridges[0];

  return (
    <aside className="w-64 bg-[#0a0e16] border-r border-[#262a33] flex flex-col justify-between h-[calc(100vh-3.5rem)] shrink-0 select-none">
      {/* Top section: Main navigation links */}
      <div className="p-3 space-y-4">
        {/* New Bridge Quick Action */}
        <button
          onClick={onOpenNewBridgeModal}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#181c24] hover:bg-[#262a33] border border-[#31353e] hover:border-[#8083ff]/50 rounded-lg text-xs font-semibold text-[#dfe2ee] transition-all group shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-[#8083ff] group-hover:scale-110 transition-transform">add_circle</span>
          <span>Add New Bridge</span>
        </button>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#908fa0]">
            INGESTION CORE
          </div>
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1c2028] text-[#c0c1ff] border-l-2 border-[#8083ff] font-semibold'
                    : 'text-[#c7c4d7] hover:text-white hover:bg-[#181c24]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#8083ff]' : 'text-[#908fa0]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    item.badge === 'LIVE'
                      ? 'bg-[#4edea3]/20 text-[#4edea3] font-bold animate-pulse'
                      : isActive
                      ? 'bg-[#8083ff]/20 text-[#c0c1ff]'
                      : 'bg-[#262a33] text-[#908fa0]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Bridge Switcher context */}
        <div className="pt-2 border-t border-[#262a33]">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#908fa0] flex items-center justify-between">
            <span>ACTIVE WORKBENCH</span>
            <span className="text-[9px] text-[#7bd0ff]">SWITCH</span>
          </div>
          <select
            value={selectedBridgeId}
            onChange={(e) => onSelectBridge(e.target.value)}
            className="w-full mt-1 bg-[#181c24] border border-[#262a33] rounded-md px-2 py-1.5 text-xs text-[#dfe2ee] font-sans focus:outline-none focus:border-[#8083ff]"
          >
            {bridges.length === 0 ? (
              <option value="" className="bg-[#181c24]">
                No pipelines created
              </option>
            ) : (
              bridges.map(b => (
                <option key={b.id} value={b.id} className="bg-[#181c24]">
                  {b.name} ({b.tag})
                </option>
              ))
            )}
          </select>

          {selectedBridge ? (
            <div className="mt-2 p-2 bg-[#181c24]/70 border border-[#262a33] rounded-md text-[11px] font-mono space-y-1">
              <div className="flex items-center justify-between text-[#908fa0]">
                <span>METHOD:</span>
                <span className="text-[#7bd0ff] font-bold">{selectedBridge.method}</span>
              </div>
              <div className="flex items-center justify-between text-[#908fa0]">
                <span>CADENCE:</span>
                <span className="text-white">{selectedBridge.syncInterval}</span>
              </div>
              <div className="flex items-center justify-between text-[#908fa0]">
                <span>STATUS:</span>
                <span className={selectedBridge.status === 'healthy' ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}>
                  {selectedBridge.statusText || selectedBridge.status}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenNewBridgeModal}
              className="w-full mt-2 p-2 bg-[#181c24]/50 border border-dashed border-[#262a33] hover:border-[#8083ff]/50 rounded-md text-[11px] text-[#908fa0] hover:text-white flex items-center justify-center space-x-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Connect API Pipeline</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom section: Real-time telemetry gauge */}
      <div className="p-3 bg-[#0f131c] border-t border-[#262a33] space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#908fa0] text-[11px]">Mesh Throughput</span>
          <span className="font-mono text-white text-[11px] font-medium">4.8k req/m</span>
        </div>
        <div className="w-full bg-[#181c24] h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#8083ff] to-[#7bd0ff] h-full rounded-full w-3/4 animate-pulse" />
        </div>

        <div className="flex items-center justify-between pt-1 text-[10px] text-[#908fa0] font-mono">
          <span>Worker Latency: <strong className="text-[#4edea3]">24.2 ms</strong></span>
          <span>Buffer: <strong className="text-white">99.4%</strong></span>
        </div>

        <div className="pt-1 text-[9px] text-[#908fa0] font-mono border-t border-[#1c2028] flex items-center justify-between">
          <span>Cluster: us-east.sync.v2</span>
          <span className="text-[#4edea3]">TLS 1.3</span>
        </div>
      </div>
    </aside>
  );
};
