import React, { useState } from 'react';
import { BridgePipeline } from '../types';

interface EndpointRegistryProps {
  bridges: BridgePipeline[];
  onSelectBridgeAndConfigure: (bridgeId: string) => void;
}

export const EndpointRegistryView: React.FC<EndpointRegistryProps> = ({
  bridges,
  onSelectBridgeAndConfigure
}) => {
  const [filter, setFilter] = useState('');

  const filtered = bridges.filter(b =>
    b.name.toLowerCase().includes(filter.toLowerCase()) ||
    b.endpoint.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4 p-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181c24] border border-[#262a33] p-3.5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#262a33] border border-[#31353e] text-[#c0c1ff]">
            <span className="material-symbols-outlined text-[20px]">dns</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Endpoint Ingestion Registry & Gateways
            </h1>
            <p className="text-xs text-[#908fa0]">
              Catalog of registered upstream endpoints, network paths, security headers, and circuit breaker status.
            </p>
          </div>
        </div>

        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#908fa0] text-[15px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search endpoints or domains..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#908fa0] focus:outline-none font-sans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(b => (
          <div key={b.id} className="bg-[#181c24] border border-[#262a33] rounded-xl p-4 space-y-3 hover:border-[#31353e] transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8083ff]/20 text-[#c0c1ff]">
                  {b.method}
                </span>
                <span className="font-bold text-white text-sm">{b.name}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                b.status === 'healthy' ? 'bg-[#4edea3]/20 text-[#4edea3]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
              }`}>
                {b.status.toUpperCase()}
              </span>
            </div>

            <div className="p-2 bg-[#0a0e16] border border-[#262a33] rounded-lg font-mono text-[11px] text-[#7bd0ff] break-all">
              {b.endpoint}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#908fa0]">
              <div>
                <span>Auth: </span>
                <strong className="text-white">{b.authType}</strong>
              </div>
              <div>
                <span>Cadence: </span>
                <strong className="text-white">{b.syncInterval}</strong>
              </div>
              <div>
                <span>Throttling: </span>
                <strong className="text-white">{b.throttlingRate}</strong>
              </div>
              <div>
                <span>Cluster: </span>
                <strong className="text-[#c0c1ff]">us-east-1a</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262a33] flex items-center justify-between">
              <span className="text-[11px] text-[#908fa0] font-mono">UUID: {b.uuid}</span>
              <button
                onClick={() => onSelectBridgeAndConfigure(b.id)}
                className="text-xs text-[#7bd0ff] hover:underline font-mono flex items-center space-x-1"
              >
                <span>Edit Configuration</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
