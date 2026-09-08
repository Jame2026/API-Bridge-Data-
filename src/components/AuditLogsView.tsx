import React, { useState } from 'react';
import { SyncActivityLog } from '../types';

interface AuditLogsProps {
  logs: SyncActivityLog[];
}

export const AuditLogsView: React.FC<AuditLogsProps> = ({ logs }) => {
  const [filter, setFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<SyncActivityLog | null>(logs[0] || null);

  const filteredLogs = logs.filter(l =>
    l.bridgeName.toLowerCase().includes(filter.toLowerCase()) ||
    l.statusText.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4 p-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181c24] border border-[#262a33] p-3.5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#262a33] border border-[#31353e] text-[#4edea3]">
            <span className="material-symbols-outlined text-[20px]">reorder</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Real-Time Payload Stream & Audit Logs
            </h1>
            <p className="text-xs text-[#908fa0]">
              Complete chronological ledger of incoming upstream responses, schema validations, and HTTP handshake status.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#908fa0] text-[15px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search stream by pipeline or code..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#908fa0] focus:outline-none font-sans"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Stream List (7 cols) */}
        <div className="lg:col-span-7 bg-[#181c24] border border-[#262a33] rounded-xl overflow-hidden">
          <div className="p-3 border-b border-[#262a33] bg-[#141820] flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Live Ingestion Events ({filteredLogs.length})
            </span>
            <span className="text-[11px] font-mono text-[#4edea3] flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span>Streaming Enabled</span>
            </span>
          </div>

          <div className="divide-y divide-[#262a33] font-mono text-xs max-h-[600px] overflow-y-auto">
            {filteredLogs.map(log => {
              const isSelected = selectedLog?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-[#262a33] border-l-2 border-[#8083ff]' : 'hover:bg-[#1c2028]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-[#908fa0] text-[11px]">{log.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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

                  <div className="flex items-center space-x-3 text-[#908fa0] text-[11px]">
                    <span>{log.recordsCount} rec</span>
                    <span className="text-white">{log.payloadSize}</span>
                    <span className="text-[#4edea3]">{log.latencyMs}ms</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Log Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-[#181c24] border border-[#262a33] rounded-xl p-4 flex flex-col justify-between">
          {selectedLog ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
                <h3 className="font-bold text-white uppercase">Event Inspection</h3>
                <span className="text-[#7bd0ff]">{selectedLog.timestamp}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[#908fa0]">
                  <span>Pipeline:</span>
                  <span className="text-white font-sans font-semibold">{selectedLog.bridgeName}</span>
                </div>
                <div className="flex justify-between text-[#908fa0]">
                  <span>Status Code:</span>
                  <span className={selectedLog.statusCode === 200 ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}>
                    {selectedLog.statusText}
                  </span>
                </div>
                <div className="flex justify-between text-[#908fa0]">
                  <span>Roundtrip Duration:</span>
                  <span className="text-[#4edea3]">{selectedLog.latencyMs} ms</span>
                </div>
                <div className="flex justify-between text-[#908fa0]">
                  <span>Payload Volume:</span>
                  <span className="text-white">{selectedLog.payloadSize} ({selectedLog.recordsCount} records)</span>
                </div>
                <div className="flex justify-between text-[#908fa0]">
                  <span>KMS Signature:</span>
                  <span className="text-[#c0c1ff]">sha256-verified-ok</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#262a33]">
                <span className="text-[11px] text-[#908fa0] block mb-1">Payload Envelope Hash</span>
                <div className="p-2 bg-[#0a0e16] border border-[#262a33] rounded text-[10px] text-[#dfe2ee] break-all">
                  SHA256: 9f83a218042910fae12089420481c9a1029841fce20
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-[#908fa0] block mb-1">Worker Telemetry Trace</span>
                <div className="p-2 bg-[#0a0e16] border border-[#262a33] rounded text-[10px] text-[#4edea3] leading-relaxed">
                  [ingress-worker-04] Handshake OK (138ms)<br />
                  [schema-engine] 18 mapped fields passed validation<br />
                  [cache-disk] Buffered to SQLite store in 4ms<br />
                  [egress-event] Dispatched to buffer ring
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#908fa0] text-xs">
              Select an event from the stream to inspect details.
            </div>
          )}

          <div className="pt-3 border-t border-[#262a33] text-[10px] text-[#908fa0] font-mono flex items-center justify-between">
            <span>Audit retention: 90 days</span>
            <span className="text-[#7bd0ff]">Export JSON</span>
          </div>
        </div>
      </div>
    </div>
  );
};
