import React, { useState } from 'react';
import { BridgePipeline } from '../types';

interface ReportsViewProps {
  bridges: BridgePipeline[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ bridges }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  return (
    <div className="space-y-4 p-5 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181c24] border border-[#262a33] p-3.5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#262a33] border border-[#31353e] text-[#7bd0ff]">
            <span className="material-symbols-outlined text-[20px]">monitoring</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Ingestion Telemetry & Operational Analytics
            </h1>
            <p className="text-xs text-[#908fa0]">
              Worker throughput rates, P99 handshake latencies, rate-limit headroom, and retry metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#0a0e16] border border-[#262a33] rounded-lg p-0.5 text-xs font-mono">
            {(['24h', '7d', '30d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded transition-all ${
                  timeframe === t ? 'bg-[#262a33] text-[#c0c1ff]' : 'text-[#908fa0] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4">
          <span className="text-xs font-mono text-[#908fa0] uppercase">Throughput Rate</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">4,820</span>
            <span className="text-xs text-[#908fa0] font-mono">req / min</span>
          </div>
          <span className="text-[11px] text-[#4edea3] font-mono mt-1 block">▲ +14% sustained load</span>
        </div>

        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4">
          <span className="text-xs font-mono text-[#908fa0] uppercase">P99 Latency SLA</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">284</span>
            <span className="text-xs text-[#908fa0] font-mono">ms</span>
          </div>
          <span className="text-[11px] text-[#4edea3] font-mono mt-1 block">● 100% within SLA &lt;500ms</span>
        </div>

        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4">
          <span className="text-xs font-mono text-[#908fa0] uppercase">Error Coercion Rate</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">0.012%</span>
          </div>
          <span className="text-[11px] text-[#dfe2ee] font-mono mt-1 block">3 retry backoffs recovered</span>
        </div>

        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4">
          <span className="text-xs font-mono text-[#908fa0] uppercase">Ingress Network Volume</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-white">42.6</span>
            <span className="text-xs text-[#908fa0] font-mono">GB / day</span>
          </div>
          <span className="text-[11px] text-[#7bd0ff] font-mono mt-1 block">GZIP Compressed stream</span>
        </div>
      </div>

      {/* Latency Breakdown by Connector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Handshake & Probe Latency by Connector
            </h3>
            <span className="text-[11px] text-[#908fa0] font-mono">Target: &lt;200ms</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { name: 'Shopify Store Orders', latency: 138, pct: 46, status: 'Fast' },
              { name: 'Stripe Revenue Events', latency: 112, pct: 37, status: 'Fast' },
              { name: 'Zendesk Tickets', latency: 135, pct: 45, status: 'Fast' },
              { name: 'HubSpot CRM Deals', latency: 198, pct: 66, status: 'Normal' },
              { name: 'GitHub Developer Events', latency: 88, pct: 29, status: 'Fast' },
              { name: 'Jira Cloud Issues (Backoff)', latency: 524, pct: 95, status: 'Degraded' }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#dfe2ee] font-sans text-xs">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">{item.latency} ms</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                      item.status === 'Degraded' ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]' : 'bg-[#4edea3]/20 text-[#4edea3]'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#0a0e16] h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.pct}%` }}
                    className={`h-full rounded-full ${item.status === 'Degraded' ? 'bg-[#ffb4ab]' : 'bg-[#7bd0ff]'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upstream Quotas */}
        <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Upstream API Rate-Limit Consumption
            </h3>
            <span className="text-[11px] text-[#4edea3] font-mono">Leaky Bucket Protected</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { name: 'Shopify Admin API', used: '20 / 40 calls', pct: 50, note: 'Refill: +2 req/s' },
              { name: 'Salesforce REST', used: '14,200 / 100,000 calls', pct: 14.2, note: 'Daily 24h window' },
              { name: 'Zendesk Incremental', used: '180 / 700 req/min', pct: 25.7, note: 'High volume add-on' },
              { name: 'Stripe Financial', used: '25 / 100 req/sec', pct: 25, note: 'Sub-second bursts OK' },
              { name: 'Jira Cloud', used: '40 / 40 (100% Saturation)', pct: 100, note: 'Retry-After: 120s' }
            ].map((q, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#dfe2ee] font-sans text-xs">{q.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">{q.used}</span>
                    <span className="text-[10px] text-[#908fa0]">({q.note})</span>
                  </div>
                </div>
                <div className="w-full bg-[#0a0e16] h-1.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${q.pct}%` }}
                    className={`h-full rounded-full ${q.pct >= 90 ? 'bg-[#ffb4ab]' : q.pct > 40 ? 'bg-[#8083ff]' : 'bg-[#4edea3]'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
