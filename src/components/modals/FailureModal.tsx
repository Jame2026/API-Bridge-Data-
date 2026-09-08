import React, { useState } from 'react';

interface FailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditConfig: () => void;
  onRetrySuccess: () => void;
}

export const FailureModal: React.FC<FailureModalProps> = ({
  isOpen,
  onClose,
  onEditConfig,
  onRetrySuccess
}) => {
  const [fixedScopes, setFixedScopes] = useState(false);
  const [fixedCurrency, setFixedCurrency] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);

  if (!isOpen) return null;

  const handleApplyFixScope = () => {
    setFixedScopes(true);
  };

  const handleApplyFixCurrency = () => {
    setFixedCurrency(true);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      onClose();
      onRetrySuccess();
    }, 1200);
  };

  const handleCopyLog = () => {
    const log = `14:22:04.102 [ERROR] Upstream HTTP 403 Forbidden: "Access denied. Target endpoint requires scope: read_orders_fulfillment"
14:22:04.150 [WARN] Upstream token lacks granted permissions for logistics carrier tracking.
14:22:04.220 [ERROR] Schema assertion failed on column "total_amount_usd": Expected NUMERIC(12,2), received String '"CAD $1,420.00"' with non-numeric currency prefix.
14:22:04.240 [HALT] Pipeline halted automatically by safety circuit breaker. 0 records written to permanent database.`;
    navigator.clipboard.writeText(log);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const handleExportIncident = () => {
    const data = {
      incident_id: 'INC-403-SCHEMA-FAIL',
      timestamp_utc: new Date().toISOString(),
      status_code: 403,
      failures: [
        { type: 'AUTH_SCOPE_MISSING', scope: 'read_orders_fulfillment' },
        { type: 'SCHEMA_TYPE_COLLISION', column: 'total_amount_usd', received: 'CAD $1,420.00', expected: 'NUMERIC' }
      ]
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `incident-diagnostics-403.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181c24] border border-[#ffb4ab]/40 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-[#262a33] bg-[#141820] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#ffb4ab]/20 border border-[#ffb4ab]/40 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                Bridge Verification Failed: Handshake & Schema Mismatch
              </h2>
              <p className="text-[11px] text-[#ffb4ab] font-mono">
                Pipeline Halted • 2 Critical Failures Detected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#908fa0] hover:text-white rounded"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Critical Alert Banner */}
        <div className="p-4 bg-[#ffb4ab]/10 border-b border-[#ffb4ab]/30 flex items-start space-x-3">
          <span className="material-symbols-outlined text-[#ffb4ab] text-[20px] mt-0.5">
            gpp_bad
          </span>
          <div className="text-xs">
            <span className="font-bold text-[#ffb4ab] font-mono block">
              HTTP 403 Forbidden & Strict Schema Collision
            </span>
            <p className="text-[#dfe2ee] mt-0.5 leading-relaxed">
              Upstream refused the read request due to a missing OAuth scope (`read_orders_fulfillment`), and the schema parser encountered uncastable currency characters (`"CAD $1,420.00"`).
            </p>
          </div>
        </div>

        {/* Diagnostic Metrics */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-[#0a0e16] border-b border-[#262a33] text-center font-mono text-xs">
          <div className="p-2 bg-[#181c24] rounded border border-[#262a33]">
            <span className="text-[10px] text-[#908fa0] block">Roundtrip Latency</span>
            <span className="text-sm font-bold text-[#ffb4ab]">524 ms</span>
          </div>
          <div className="p-2 bg-[#181c24] rounded border border-[#262a33]">
            <span className="text-[10px] text-[#908fa0] block">HTTP Status</span>
            <span className="text-sm font-bold text-[#ffb4ab]">403 Forbidden</span>
          </div>
          <div className="p-2 bg-[#181c24] rounded border border-[#262a33]">
            <span className="text-[10px] text-[#908fa0] block">Schema Conflicts</span>
            <span className="text-sm font-bold text-[#ffb4ab]">2 Rejects</span>
          </div>
          <div className="p-2 bg-[#181c24] rounded border border-[#262a33]">
            <span className="text-[10px] text-[#908fa0] block">Scope Quota</span>
            <span className="text-sm font-bold text-[#dfe2ee]">0 / 40 Scope</span>
          </div>
        </div>

        {/* 5-Stage Lifecycle Breakdown */}
        <div className="p-4 space-y-2 bg-[#181c24]">
          <div className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
            Verification Lifecycle Failure Points
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="p-2 bg-[#0a0e16] rounded border border-[#4edea3]/30 flex justify-between items-center text-[#dfe2ee]">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check_circle</span>
                <span>Stage 1: Network & TLS 1.3 Handshake</span>
              </div>
              <span className="text-[#4edea3] text-[11px]">PASSED (44ms)</span>
            </div>

            <div className="p-2 bg-[#0a0e16] rounded border border-[#4edea3]/30 flex justify-between items-center text-[#dfe2ee]">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check_circle</span>
                <span>Stage 2: KMS Credential & Token Exchange</span>
              </div>
              <span className="text-[#4edea3] text-[11px]">PASSED (112ms)</span>
            </div>

            <div className="p-2 bg-[#ffb4ab]/15 rounded border border-[#ffb4ab]/40 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">cancel</span>
                <span>Stage 3: Upstream Rate Limit Header Inspection</span>
              </div>
              <span className="text-[#ffb4ab] text-[11px] font-bold">FAILED (HTTP 403 Forbidden)</span>
            </div>

            <div className="p-2 bg-[#0a0e16] rounded border border-[#262a33] flex justify-between items-center text-[#908fa0]">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#908fa0] text-[16px]">remove_circle</span>
                <span>Stage 4: Dry-Run Payload Ingestion</span>
              </div>
              <span className="text-[#908fa0] text-[11px]">HALTED</span>
            </div>

            <div className="p-2 bg-[#ffb4ab]/15 rounded border border-[#ffb4ab]/40 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">cancel</span>
                <span>Stage 5: Schema Mapping & Column Assertion</span>
              </div>
              <span className="text-[#ffb4ab] text-[11px] font-bold">FAILED (Type Mismatch: CAD $1,420.00)</span>
            </div>
          </div>
        </div>

        {/* Automated Diagnostics & 1-Click Fixes */}
        <div className="p-4 bg-[#0a0e16] border-t border-[#262a33] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white font-mono uppercase">Automated Diagnostic Remedies</span>
            <span className="text-[11px] text-[#7bd0ff] font-mono">1-Click Auto-Remediation</span>
          </div>

          <div className="space-y-2">
            {/* Remedy 1 */}
            <div className="p-2.5 bg-[#181c24] border border-[#262a33] rounded-lg flex items-center justify-between">
              <div className="text-xs">
                <span className="font-semibold text-white">Inject missing OAuth scope</span>
                <p className="text-[11px] text-[#908fa0] font-mono">
                  Append <code className="text-[#7bd0ff]">read_orders_fulfillment</code> to the request authorization header.
                </p>
              </div>
              <button
                onClick={handleApplyFixScope}
                disabled={fixedScopes}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  fixedScopes
                    ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30'
                    : 'bg-[#8083ff] text-[#0d0096] hover:bg-[#9194ff]'
                }`}
              >
                {fixedScopes ? '✓ Applied' : 'Apply Scope Fix'}
              </button>
            </div>

            {/* Remedy 2 */}
            <div className="p-2.5 bg-[#181c24] border border-[#262a33] rounded-lg flex items-center justify-between">
              <div className="text-xs">
                <span className="font-semibold text-white">Attach Currency Stripper Transform Rule</span>
                <p className="text-[11px] text-[#908fa0] font-mono">
                  Strip <code className="text-[#7bd0ff]">CAD $</code> prefix using <code className="text-[#c0c1ff]">RegexReplace("^[A-Z]{3}\\s*\\$?", "")</code>.
                </p>
              </div>
              <button
                onClick={handleApplyFixCurrency}
                disabled={fixedCurrency}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  fixedCurrency
                    ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30'
                    : 'bg-[#8083ff] text-[#0d0096] hover:bg-[#9194ff]'
                }`}
              >
                {fixedCurrency ? '✓ Applied' : 'Apply Schema Fix'}
              </button>
            </div>
          </div>
        </div>

        {/* Raw Log Terminal */}
        <div className="p-4 bg-[#05070a] border-t border-[#262a33] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#908fa0]">raw_verification_incident.log</span>
            <button
              onClick={handleCopyLog}
              className="text-[#7bd0ff] hover:underline flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-[13px]">
                {copiedLog ? 'check' : 'content_copy'}
              </span>
              <span>{copiedLog ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-2.5 bg-[#0a0e16] border border-[#262a33] rounded font-mono text-[11px] text-[#ffb4ab] leading-relaxed max-h-24 overflow-y-auto">
{`14:22:04.102 [ERROR] Upstream HTTP 403 Forbidden: "Target endpoint requires scope: read_orders_fulfillment"
14:22:04.220 [ERROR] Schema assertion failed on column "total_amount_usd": Expected NUMERIC(12,2), received "CAD $1,420.00"
14:22:04.240 [HALT] Safety circuit breaker engaged. 0 records corrupted.`}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#141820] border-t border-[#262a33] flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            onClick={handleExportIncident}
            className="w-full sm:w-auto px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#7bd0ff] rounded-lg text-xs font-mono border border-[#262a33]"
          >
            Export Diagnostics (.json)
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onEditConfig();
              }}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] rounded-lg text-xs font-medium border border-[#31353e]"
            >
              Edit Configuration
            </button>
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex-1 sm:flex-none px-4 py-1.5 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] rounded-lg text-xs font-bold shadow-md shadow-[#8083ff]/20 flex items-center justify-center space-x-1"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRetrying ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{isRetrying ? 'Verifying Fixes...' : 'Retry Verification'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
