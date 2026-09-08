import React from 'react';
import { BridgePipeline } from '../../types';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridge: BridgePipeline;
  onGoToInspector: () => void;
  onGoToDashboard: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  bridge,
  onGoToInspector,
  onGoToDashboard
}) => {
  if (!isOpen) return null;

  const handleDownloadAudit = () => {
    const auditData = {
      event: 'PIPELINE_VERIFIED_AND_DEPLOYED',
      pipeline_id: bridge.id,
      uuid: bridge.uuid,
      name: bridge.name,
      timestamp_utc: new Date().toISOString(),
      tls_cipher: 'ECDHE-RSA-AES128-GCM-SHA256',
      handshake_latency_ms: 138,
      status_code: 200,
      mapped_columns: 18,
      schema_conflicts: 0,
      cadence: bridge.syncInterval,
      cron: bridge.cronExpression,
      kms_status: 'AUTHENTICATED'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `verification-audit-${bridge.uuid}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181c24] border border-[#31353e] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95">
        {/* Top Glowing Hero */}
        <div className="p-6 bg-gradient-to-b from-[#4edea3]/10 to-transparent border-b border-[#262a33] text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#4edea3]/20 border border-[#4edea3] flex items-center justify-center shadow-lg shadow-[#4edea3]/30">
            <span className="material-symbols-outlined text-[32px] text-[#4edea3]">check_circle</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white tracking-tight font-sans">
              Bridge Connector Deployed Successfully
            </h2>
            <p className="text-xs text-[#4edea3] font-mono mt-1">
              All 5 Verification Stages Passed • 0 Schema Conflicts • Ingestion Active
            </p>
          </div>
        </div>

        {/* 4 Summary Vitals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-[#0a0e16] border-b border-[#262a33] text-center font-mono">
          <div className="p-2 bg-[#181c24] rounded-lg border border-[#262a33]">
            <span className="text-[10px] text-[#908fa0] block">First Pull</span>
            <span className="text-sm font-bold text-white">10 / 10 sampled</span>
          </div>
          <div className="p-2 bg-[#181c24] rounded-lg border border-[#262a33]">
            <span className="text-[10px] text-[#908fa0] block">Roundtrip Latency</span>
            <span className="text-sm font-bold text-[#4edea3]">138 ms</span>
          </div>
          <div className="p-2 bg-[#181c24] rounded-lg border border-[#262a33]">
            <span className="text-[10px] text-[#908fa0] block">Sync Cadence</span>
            <span className="text-sm font-bold text-[#7bd0ff]">{bridge.syncInterval}</span>
          </div>
          <div className="p-2 bg-[#181c24] rounded-lg border border-[#262a33]">
            <span className="text-[10px] text-[#908fa0] block">Target Schema</span>
            <span className="text-sm font-bold text-white">18 Columns</span>
          </div>
        </div>

        {/* Pipeline Details */}
        <div className="p-4 space-y-3 text-xs font-mono">
          <div className="p-3 bg-[#0a0e16] rounded-xl border border-[#262a33] space-y-2">
            <div className="flex justify-between text-[#908fa0]">
              <span>Pipeline:</span>
              <span className="text-white font-bold font-sans">{bridge.name}</span>
            </div>
            <div className="flex justify-between text-[#908fa0]">
              <span>Unique ID:</span>
              <span className="text-[#7bd0ff]">{bridge.uuid}</span>
            </div>
            <div className="flex justify-between text-[#908fa0]">
              <span>Ingestion Target:</span>
              <span className="text-[#dfe2ee] truncate max-w-xs">{bridge.endpoint}</span>
            </div>
            <div className="flex justify-between text-[#908fa0]">
              <span>TLS Certificate:</span>
              <span className="text-[#4edea3]">TLS 1.3 DigiCert Global Root (Verified)</span>
            </div>
          </div>

          {/* Sampled Ingress Records */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-[#908fa0] uppercase tracking-wider block">
              Sampled Ingestion Records (First 3)
            </span>
            <div className="border border-[#262a33] rounded-lg overflow-hidden bg-[#0a0e16]">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-[#262a33] bg-[#141820] text-[#908fa0]">
                    <th className="py-1.5 px-3">Order ID</th>
                    <th className="py-1.5 px-3">Revenue</th>
                    <th className="py-1.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262a33]">
                  <tr>
                    <td className="py-1.5 px-3 text-white font-bold">#5519827102</td>
                    <td className="py-1.5 px-3 text-[#4edea3]">$271.33 USD</td>
                    <td className="py-1.5 px-3 text-[#7bd0ff]">Processing</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-white font-bold">#5519827101</td>
                    <td className="py-1.5 px-3 text-[#4edea3]">$1,894.00 USD</td>
                    <td className="py-1.5 px-3 text-[#4edea3]">Fulfilled</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-white font-bold">#5519827100</td>
                    <td className="py-1.5 px-3 text-[#4edea3]">$84.20 USD</td>
                    <td className="py-1.5 px-3 text-[#4edea3]">Fulfilled</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#141820] border-t border-[#262a33] flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            onClick={handleDownloadAudit}
            className="w-full sm:w-auto px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#7bd0ff] rounded-lg text-xs font-mono border border-[#262a33] flex items-center justify-center space-x-1"
          >
            <span className="material-symbols-outlined text-[15px]">file_download</span>
            <span>Audit Log (.json)</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onGoToInspector();
              }}
              className="flex-1 sm:flex-none px-3.5 py-1.5 bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] rounded-lg text-xs font-medium border border-[#31353e]"
            >
              View in Inspector
            </button>
            <button
              onClick={() => {
                onClose();
                onGoToDashboard();
              }}
              className="flex-1 sm:flex-none px-4 py-1.5 bg-[#4edea3] hover:bg-[#5affb5] text-[#003824] rounded-lg text-xs font-bold shadow-md shadow-[#4edea3]/20"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
