import React, { useState } from 'react';
import { BridgePipeline, SyncActivityLog, NavView } from '../types';

interface OverviewViewProps {
  bridges: BridgePipeline[];
  logs: SyncActivityLog[];
  onNavigate: (view: NavView) => void;
  onSelectBridge: (id: string) => void;
  onTriggerSingleSync: (bridgeId: string) => void;
  onOpenNewBridgeModal: () => void;
  onOpenFailureModal: () => void;
  onRefreshMetrics: () => void;
  isRefreshing: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  bridges,
  logs,
  onNavigate,
  onSelectBridge,
  onTriggerSingleSync,
  onOpenNewBridgeModal,
  onOpenFailureModal,
  onRefreshMetrics,
  isRefreshing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'degraded' | 'paused'>('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [syncingBridgeId, setSyncingBridgeId] = useState<string | null>(null);

  const filteredBridges = bridges.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const healthyCount = bridges.filter(b => b.status === 'healthy').length;
  const degradedCount = bridges.filter(b => b.status === 'degraded').length;
  const pausedCount = bridges.filter(b => b.status === 'paused').length;

  const handleRunNow = (bridgeId: string) => {
    setSyncingBridgeId(bridgeId);
    onTriggerSingleSync(bridgeId);
    setTimeout(() => {
      setSyncingBridgeId(null);
    }, 1200);
  };

  const handleExportSchemas = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bridges, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "api-bridges-schema-export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 p-5 max-w-[1600px] mx-auto">
      {/* Top Banner / Cluster Status & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#181c24] border border-[#262a33] p-3.5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#262a33] border border-[#31353e] text-[#c0c1ff]">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Active Telemetry Mesh
              </h1>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#262a33] text-[#7bd0ff] border border-[#31353e]">
                cluster-us-east.sync.v2
              </span>
            </div>
            <p className="text-xs text-[#908fa0]">
              Operational dashboard for real-time pipeline status, API quotas, latency telemetry, and schema health.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Time range selector */}
          <div className="flex items-center bg-[#0f131c] border border-[#262a33] rounded-lg p-0.5 text-xs">
            {['1h', '24h', '7d', '30d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                  timeRange === range
                    ? 'bg-[#262a33] text-[#c0c1ff]'
                    : 'text-[#908fa0] hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh metrics */}
          <button
            onClick={onRefreshMetrics}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] rounded-lg text-xs font-medium border border-[#31353e] transition-all"
            title="Refresh metrics & sync health"
          >
            <span className={`material-symbols-outlined text-[15px] ${isRefreshing ? 'animate-spin text-[#8083ff]' : ''}`}>
              refresh
            </span>
            <span>{isRefreshing ? 'Refreshing' : 'Refresh Metrics'}</span>
          </button>

          {/* Add New Bridge */}
          <button
            onClick={onOpenNewBridgeModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] rounded-lg text-xs font-semibold shadow-md shadow-[#8083ff]/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[17px] font-bold">add</span>
            <span>Add New Bridge</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Active Pipelines */}
        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4 flex flex-col justify-between hover:border-[#31353e] transition-all">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-xs font-mono tracking-wider uppercase">ACTIVE PIPELINES</span>
            <span className="material-symbols-outlined text-[18px] text-[#4edea3]">check_circle</span>
          </div>
          <div className="my-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">{healthyCount}/{bridges.length}</span>
            <span className="text-xs text-[#4edea3] font-mono">99.98% Uptime</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#908fa0] pt-2 border-t border-[#262a33]">
            <span>Active: <strong className="text-white">{healthyCount}</strong></span>
            <span>Degraded: <strong className="text-[#ffb4ab]">{degradedCount}</strong></span>
            <span>Paused: <strong className="text-[#908fa0]">{pausedCount}</strong></span>
          </div>
        </div>

        {/* Card 2: Total Records Pulled */}
        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4 flex flex-col justify-between hover:border-[#31353e] transition-all">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-xs font-mono tracking-wider uppercase">TOTAL RECORDS (24H)</span>
            <span className="material-symbols-outlined text-[18px] text-[#7bd0ff]">database</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-white">1.43M</span>
              <span className="text-xs text-[#4edea3] font-mono font-medium">+18.4%</span>
            </div>
            {/* Sparkline */}
            <svg className="w-20 h-6 text-[#7bd0ff]" fill="none" viewBox="0 0 100 30" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M 0,25 Q 20,20 40,15 T 70,8 T 100,2"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#908fa0] pt-2 border-t border-[#262a33]">
            <span>Peak Ingress: <strong className="text-white">12.4k/min</strong></span>
            <span>Buffered: <strong className="text-white">100%</strong></span>
          </div>
        </div>

        {/* Card 3: Avg Handshake Latency */}
        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4 flex flex-col justify-between hover:border-[#31353e] transition-all">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-xs font-mono tracking-wider uppercase">AVG HANDSHAKE LATENCY</span>
            <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">speed</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-white">142</span>
              <span className="text-sm font-mono text-[#c0c1ff]">ms</span>
              <span className="text-xs text-[#4edea3] font-mono">Fast</span>
            </div>
            {/* Distribution bars */}
            <div className="flex items-end space-x-1 h-6">
              <div className="w-1.5 bg-[#4edea3] h-2 rounded-t" />
              <div className="w-1.5 bg-[#4edea3] h-4 rounded-t" />
              <div className="w-1.5 bg-[#7bd0ff] h-6 rounded-t" />
              <div className="w-1.5 bg-[#8083ff] h-3 rounded-t" />
              <div className="w-1.5 bg-[#ffb4ab] h-2 rounded-t" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#908fa0] pt-2 border-t border-[#262a33]">
            <span>Min: <strong className="text-white">42ms</strong></span>
            <span>P99: <strong className="text-white">380ms</strong></span>
            <span>Jitter: <strong className="text-white">±6ms</strong></span>
          </div>
        </div>

        {/* Card 4: Rate-Limit Quota */}
        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4 flex flex-col justify-between hover:border-[#31353e] transition-all">
          <div className="flex items-center justify-between text-[#908fa0]">
            <span className="text-xs font-mono tracking-wider uppercase">API RATE-LIMIT QUOTA</span>
            <span className="material-symbols-outlined text-[18px] text-[#ffdad6]">hourglass_bottom</span>
          </div>
          <div className="my-2 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-white">42.8%</span>
              <span className="text-xs text-[#908fa0] font-mono">Throttled: <strong className="text-[#ffb4ab]">1</strong></span>
            </div>
            <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden border border-[#262a33]">
              <div className="bg-gradient-to-r from-[#4edea3] via-[#7bd0ff] to-[#ffb4ab] h-full rounded-full w-[42.8%]" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#908fa0] pt-2 border-t border-[#262a33]">
            <span>Jira: <strong className="text-[#ffb4ab]">Backoff (Retry-After)</strong></span>
            <span>Shopify: <strong className="text-white">20/40</strong></span>
          </div>
        </div>
      </div>

      {/* Active Bridges Data Table Section */}
      <div className="bg-[#181c24] border border-[#262a33] rounded-xl overflow-hidden shadow-xl">
        {/* Table Filter Toolbar */}
        <div className="p-3.5 border-b border-[#262a33] flex flex-col md:flex-row items-center justify-between gap-3 bg-[#141820]">
          {/* Left search & filter pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-80">
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#908fa0] text-[16px]">
                search
              </span>
              <input
                type="text"
                placeholder="Filter by name, URL, tag, or auth type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#908fa0] focus:outline-none transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-[#908fa0] hover:text-white"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center bg-[#0a0e16] border border-[#262a33] rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  statusFilter === 'all' ? 'bg-[#262a33] text-white' : 'text-[#908fa0] hover:text-white'
                }`}
              >
                All ({bridges.length})
              </button>
              <button
                onClick={() => setStatusFilter('healthy')}
                className={`px-2.5 py-1 rounded text-xs transition-all flex items-center space-x-1 ${
                  statusFilter === 'healthy' ? 'bg-[#262a33] text-[#4edea3]' : 'text-[#908fa0] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                <span>Active ({healthyCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('degraded')}
                className={`px-2.5 py-1 rounded text-xs transition-all flex items-center space-x-1 ${
                  statusFilter === 'degraded' ? 'bg-[#262a33] text-[#ffb4ab]' : 'text-[#908fa0] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                <span>Degraded ({degradedCount})</span>
              </button>
              <button
                onClick={() => setStatusFilter('paused')}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  statusFilter === 'paused' ? 'bg-[#262a33] text-[#dfe2ee]' : 'text-[#908fa0] hover:text-white'
                }`}
              >
                Paused ({pausedCount})
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportSchemas}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] border border-[#262a33] rounded-lg text-xs font-medium transition-all"
              title="Export all bridge definitions and schema maps"
            >
              <span className="material-symbols-outlined text-[15px] text-[#7bd0ff]">download</span>
              <span>Export Schemas</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#262a33] bg-[#0f131c] text-[#908fa0] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Bridge Identifier & Target</th>
                <th className="py-3 px-4 font-semibold">Auth & Protocol</th>
                <th className="py-3 px-4 font-semibold">Sync Cadence</th>
                <th className="py-3 px-4 font-semibold">Records (24h)</th>
                <th className="py-3 px-4 font-semibold">Health Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a33]">
              {filteredBridges.map((bridge) => {
                const isCurrentSyncing = syncingBridgeId === bridge.id;
                return (
                  <tr
                    key={bridge.id}
                    className="hover:bg-[#1c2028]/80 transition-colors group"
                  >
                    {/* Identifier */}
                    <td className="py-3 px-4">
                      <div className="flex items-start space-x-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold mt-0.5 uppercase ${
                          bridge.category === 'ecommerce'
                            ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30'
                            : bridge.category === 'desk'
                            ? 'bg-[#ffdad6]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                            : bridge.category === 'pipeline'
                            ? 'bg-[#c0c1ff]/20 text-[#c0c1ff] border border-[#8083ff]/30'
                            : bridge.category === 'stream'
                            ? 'bg-[#7bd0ff]/20 text-[#7bd0ff] border border-[#00a6e0]/30'
                            : 'bg-[#31353e] text-[#dfe2ee]'
                        }`}>
                          {bridge.tag}
                        </span>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#c0c1ff] transition-colors flex items-center space-x-2">
                            <span>{bridge.name}</span>
                            <span className="text-[10px] text-[#908fa0] font-mono">({bridge.uuid})</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-[#908fa0] font-mono text-[11px] mt-0.5">
                            <span className="font-bold text-[#7bd0ff]">{bridge.method}</span>
                            <span className="truncate max-w-xs">{bridge.endpoint}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Auth & Protocol */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-[#dfe2ee]">
                        {bridge.authType}
                      </div>
                      <div className="text-[10px] text-[#908fa0] font-mono mt-0.5">
                        {bridge.headers.length} headers • {bridge.queryParams.length} query params
                      </div>
                    </td>

                    {/* Sync Cadence */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-white flex items-center space-x-1.5">
                        <span className="material-symbols-outlined text-[14px] text-[#908fa0]">schedule</span>
                        <span>{bridge.syncInterval}</span>
                      </div>
                      <div className="text-[10px] text-[#908fa0] font-mono mt-0.5">
                        Last sync: <span className="text-[#dfe2ee]">{bridge.lastSync}</span>
                      </div>
                    </td>

                    {/* Records */}
                    <td className="py-3 px-4 font-mono">
                      <div className="text-white font-medium">
                        {bridge.recordsSynced.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#908fa0]">
                        {bridge.cacheSnapshots ? 'Snapshots ON' : 'Direct Pipe'}
                      </div>
                    </td>

                    {/* Health Status */}
                    <td className="py-3 px-4">
                      {bridge.status === 'healthy' && (
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                          <span>Healthy</span>
                        </div>
                      )}
                      {bridge.status === 'degraded' && (
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                          <span>Degraded / 429</span>
                        </div>
                      )}
                      {bridge.status === 'paused' && (
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#31353e] text-[#908fa0] border border-[#464554]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#908fa0]"></span>
                          <span>Paused</span>
                        </div>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Run Now */}
                        <button
                          onClick={() => handleRunNow(bridge.id)}
                          disabled={isCurrentSyncing}
                          className="p-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] hover:text-[#4edea3] rounded border border-[#262a33] transition-all"
                          title="Run Ingestion Now"
                        >
                          <span className={`material-symbols-outlined text-[15px] ${isCurrentSyncing ? 'animate-spin text-[#4edea3]' : ''}`}>
                            play_arrow
                          </span>
                        </button>

                        {/* View in Inspector */}
                        <button
                          onClick={() => {
                            onSelectBridge(bridge.id);
                            onNavigate('fetch-inspector');
                          }}
                          className="p-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] hover:text-[#7bd0ff] rounded border border-[#262a33] transition-all"
                          title="View Payloads & Schema in Inspector"
                        >
                          <span className="material-symbols-outlined text-[15px]">terminal</span>
                        </button>

                        {/* Bridge Config */}
                        <button
                          onClick={() => {
                            onSelectBridge(bridge.id);
                            onNavigate('connect-auth');
                          }}
                          className="p-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] hover:text-[#c0c1ff] rounded border border-[#262a33] transition-all"
                          title="Edit Bridge Configuration"
                        >
                          <span className="material-symbols-outlined text-[15px]">tune</span>
                        </button>

                        {/* Diagnose if degraded/failed */}
                        {bridge.status === 'degraded' && (
                          <button
                            onClick={onOpenFailureModal}
                            className="px-2 py-1 bg-[#ffb4ab]/20 hover:bg-[#ffb4ab]/30 text-[#ffb4ab] border border-[#ffb4ab]/40 rounded font-mono text-[10px] font-bold transition-all flex items-center space-x-1"
                            title="Inspect 429 Rate Limit Incident & Recommended Fixes"
                          >
                            <span className="material-symbols-outlined text-[12px]">bug_report</span>
                            <span>Diagnose</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Dual Panels: Recent Activity Log + Mesh Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Recent Activity Log */}
        <div className="lg:col-span-7 bg-[#181c24] border border-[#262a33] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#262a33]">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[18px] text-[#7bd0ff]">receipt_long</span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Recent Pipeline Sync Activity Log
                </h3>
              </div>
              <button
                onClick={() => onNavigate('fetch-inspector')}
                className="text-[11px] text-[#7bd0ff] hover:underline font-mono"
              >
                View full raw stream in Inspector →
              </button>
            </div>

            <div className="mt-3 divide-y divide-[#262a33] font-mono text-xs">
              {logs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between hover:bg-[#1c2028]/50 px-1 rounded transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-[#908fa0] text-[11px]">{log.timestamp}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.statusCode === 200
                        ? 'bg-[#4edea3]/20 text-[#4edea3]'
                        : log.statusCode === 201
                        ? 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
                        : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                    }`}>
                      {log.statusText}
                    </span>
                    <span className="text-white font-medium font-sans">{log.bridgeName}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-[#908fa0] text-[11px]">
                    <span>{log.recordsCount} records</span>
                    <span className="text-[#c7c4d7]">{log.payloadSize}</span>
                    <span className="text-[#4edea3]">{log.latencyMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#262a33] text-[11px] text-[#908fa0] flex items-center justify-between">
            <span>Buffer Mode: RingBuffer (Last 100,000 entries)</span>
            <span className="text-[#4edea3]">● WebSocket Daemon Active</span>
          </div>
        </div>

        {/* Right: Throughput & Storage Allocation */}
        <div className="lg:col-span-5 bg-[#181c24] border border-[#262a33] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#262a33]">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[18px] text-[#8083ff]">donut_large</span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Throughput & Storage Allocation
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#4edea3]">TLS 1.3 Verified</span>
            </div>

            {/* Ingestion volume shares */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#dfe2ee]">Ingestion Volume by Connector</span>
                <span className="font-mono text-white">1.43M Total</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#0a0e16] border border-[#262a33]">
                <div style={{ width: '42%' }} className="bg-[#4edea3] h-full" title="Shopify (42%)" />
                <div style={{ width: '31%' }} className="bg-[#7bd0ff] h-full" title="Stripe (31%)" />
                <div style={{ width: '14%' }} className="bg-[#8083ff] h-full" title="Salesforce (14%)" />
                <div style={{ width: '13%' }} className="bg-[#ffb4ab] h-full" title="Others (13%)" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#908fa0]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded bg-[#4edea3]" />
                  <span>Shopify: <strong>42% (600k)</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded bg-[#7bd0ff]" />
                  <span>Stripe: <strong>31% (443k)</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded bg-[#8083ff]" />
                  <span>Salesforce: <strong>14% (200k)</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded bg-[#ffb4ab]" />
                  <span>Others: <strong>13% (187k)</strong></span>
                </div>
              </div>

              {/* SQLite Cache Gauge */}
              <div className="pt-3 border-t border-[#262a33] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#dfe2ee]">SQLite Ingestion Cache Store</span>
                  <span className="font-mono text-white">4.8 GB / 20.0 GB (24%)</span>
                </div>
                <div className="w-full bg-[#0a0e16] h-2 rounded-full overflow-hidden border border-[#262a33]">
                  <div className="bg-[#8083ff] h-full rounded-full w-[24%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#908fa0] font-mono">
                  <span>TTL Retention: 14 Days</span>
                  <span className="text-[#4edea3]">Clean / No fragmentation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#262a33] text-[11px] text-[#908fa0] flex items-center justify-between font-mono">
            <span>Webhook Daemon: 0.0.0.0:8443</span>
            <span className="text-[#7bd0ff]">Auto-Reconnect: ON</span>
          </div>
        </div>
      </div>
    </div>
  );
};
