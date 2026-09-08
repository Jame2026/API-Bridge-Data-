import React, { useState, useEffect } from 'react';
import { BridgePipeline } from '../../types';

interface DryRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridge: BridgePipeline;
  onCompleteSuccess: () => void;
  onTriggerFailureDiagnostic?: () => void;
}

export const DryRunModal: React.FC<DryRunModalProps> = ({
  isOpen,
  onClose,
  bridge,
  onCompleteSuccess,
  onTriggerFailureDiagnostic
}) => {
  const [progress, setProgress] = useState(25);
  const [stage, setStage] = useState(1);
  const [autoDeploy, setAutoDeploy] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(25);
      setStage(1);
      return;
    }

    const timer1 = setTimeout(() => {
      setStage(2);
      setProgress(50);
    }, 600);

    const timer2 = setTimeout(() => {
      setStage(3);
      setProgress(75);
    }, 1300);

    const timer3 = setTimeout(() => {
      setStage(4);
      setProgress(90);
    }, 2000);

    const timer4 = setTimeout(() => {
      setStage(5);
      setProgress(100);
      if (autoDeploy) {
        setTimeout(() => {
          onCompleteSuccess();
        }, 800);
      }
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen, autoDeploy, onCompleteSuccess]);

  if (!isOpen) return null;

  const handleCopyLogs = () => {
    const logs = `14:22:01.104 [INFO] Initiating TLS 1.3 Handshake with ${bridge.endpoint}
14:22:01.146 [INFO] Cipher: ECDHE-RSA-AES128-GCM-SHA256 established in 42ms
14:22:01.264 [INFO] Token decrypted via KMS key arn:aws:kms:us-east-1:99...
14:22:01.279 [INFO] X-Shopify-Shop-Api-Call-Limit inspected: 20/40 remaining (50% quota headroom)
14:22:01.310 [STREAM] Ingesting 250 records into sandbox memory ring buffer...
14:22:01.420 [SCHEMA] Asserting 18 mapped schema columns against target types: 100% MATCH
14:22:01.450 [SUCCESS] Handshake verified. All 5 pipeline stages passed cleanly.`;
    navigator.clipboard.writeText(logs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181c24] border border-[#31353e] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-[#262a33] bg-[#141820] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#262a33] border border-[#31353e] text-[#8083ff]">
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                Pipeline Verification & Test Handshake
              </h2>
              <p className="text-[11px] text-[#908fa0] font-mono">
                {bridge.name} (UUID: {bridge.uuid})
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

        {/* Telemetry Strip */}
        <div className="p-4 bg-[#0a0e16] border-b border-[#262a33] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#908fa0]">Verification Progress</span>
            <span className="text-[#4edea3] font-bold">{progress}% Completed</span>
          </div>
          <div className="w-full bg-[#181c24] h-2 rounded-full overflow-hidden border border-[#262a33]">
            <div
              style={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-[#8083ff] via-[#7bd0ff] to-[#4edea3] h-full rounded-full transition-all duration-500"
            />
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono pt-1">
            <div className="p-1.5 bg-[#181c24] rounded border border-[#262a33]">
              <span className="text-[10px] text-[#908fa0] block">Roundtrip</span>
              <span className="text-white font-bold">138 ms</span>
            </div>
            <div className="p-1.5 bg-[#181c24] rounded border border-[#262a33]">
              <span className="text-[10px] text-[#908fa0] block">Status</span>
              <span className="text-[#4edea3] font-bold">200 OK</span>
            </div>
            <div className="p-1.5 bg-[#181c24] rounded border border-[#262a33]">
              <span className="text-[10px] text-[#908fa0] block">Payload Buffer</span>
              <span className="text-white font-bold">48.2 KB</span>
            </div>
            <div className="p-1.5 bg-[#181c24] rounded border border-[#262a33]">
              <span className="text-[10px] text-[#908fa0] block">Ingress Rate</span>
              <span className="text-[#7bd0ff] font-bold">4.8 MB/s</span>
            </div>
          </div>
        </div>

        {/* 5-Stage Verification Lifecycle */}
        <div className="p-4 space-y-2.5 bg-[#181c24]">
          <div className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
            Verification Lifecycle Stages
          </div>

          {[
            { id: 1, name: '1. Network & TLS 1.3 Handshake', detail: 'Negotiate cipher suite & verify upstream root CA', duration: '42ms' },
            { id: 2, name: '2. KMS Credential & Token Exchange', detail: 'Hardware decrypt ingestion token in memory enclave', duration: '118ms' },
            { id: 3, name: '3. Upstream Rate Limit Header Inspection', detail: 'Confirm bucket capacity and restore cadence', duration: '15ms' },
            { id: 4, name: '4. Dry-Run Payload Ingestion', detail: 'Stream 250 records into volatile memory ring buffer', duration: '84ms' },
            { id: 5, name: '5. Schema Mapping & Column Assertion', detail: 'Assert 18 columns against strict target data types', duration: '22ms' }
          ].map(s => {
            const isPassed = stage > s.id || progress === 100;
            const isRunning = stage === s.id && progress < 100;
            const isPending = stage < s.id && progress < 100;

            return (
              <div
                key={s.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                  isPassed
                    ? 'bg-[#0a0e16] border-[#4edea3]/30 text-white'
                    : isRunning
                    ? 'bg-[#262a33] border-[#8083ff] text-white shadow'
                    : 'bg-[#0a0e16]/50 border-[#262a33] text-[#908fa0]'
                }`}
              >
                <div className="flex items-center space-x-2.5 text-xs">
                  <span className="material-symbols-outlined text-[18px]">
                    {isPassed ? (
                      <span className="text-[#4edea3]">check_circle</span>
                    ) : isRunning ? (
                      <span className="text-[#8083ff] animate-spin">progress_activity</span>
                    ) : (
                      <span className="text-[#464554]">radio_button_unchecked</span>
                    )}
                  </span>
                  <div>
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-[11px] text-[#908fa0] block font-mono">{s.detail}</span>
                  </div>
                </div>

                <div className="font-mono text-xs">
                  {isPassed && <span className="text-[#4edea3] font-bold">PASSED ({s.duration})</span>}
                  {isRunning && <span className="text-[#8083ff] font-bold animate-pulse">RUNNING...</span>}
                  {isPending && <span className="text-[#464554]">QUEUED</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Sandbox Terminal Logs */}
        <div className="p-4 bg-[#0a0e16] border-t border-[#262a33] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#908fa0]">Live Execution Logs</span>
            <button
              onClick={handleCopyLogs}
              className="text-[#7bd0ff] hover:underline flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-[13px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied Trace' : 'Copy Trace'}</span>
            </button>
          </div>

          <div className="p-3 bg-[#05070a] border border-[#262a33] rounded-lg font-mono text-[11px] text-[#4edea3] max-h-32 overflow-y-auto leading-relaxed space-y-1">
            <p>14:22:01.104 [INFO] Initiating TLS 1.3 Handshake with {bridge.endpoint}...</p>
            {stage >= 2 && <p>14:22:01.146 [INFO] Cipher: ECDHE-RSA-AES128-GCM-SHA256 established in 42ms</p>}
            {stage >= 3 && <p>14:22:01.264 [INFO] Token decrypted via KMS hardware enclave</p>}
            {stage >= 4 && <p>14:22:01.279 [INFO] X-Shopify-Shop-Api-Call-Limit: 20/40 remaining (50% quota)</p>}
            {stage >= 5 && <p>14:22:01.310 [STREAM] 250 records ingested into volatile buffer. 18 columns asserted.</p>}
            {progress === 100 && <p className="text-white font-bold">14:22:01.450 [SUCCESS] Handshake verified. All 5 pipeline stages passed cleanly.</p>}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#141820] border-t border-[#262a33] flex items-center justify-between">
          <label className="flex items-center space-x-2 text-xs text-[#dfe2ee] cursor-pointer font-mono">
            <input
              type="checkbox"
              checked={autoDeploy}
              onChange={(e) => setAutoDeploy(e.target.checked)}
              className="w-4 h-4 rounded text-[#8083ff] bg-[#0a0e16] border-[#31353e]"
            />
            <span>Auto-deploy pipeline on 100% verification pass</span>
          </label>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] rounded-lg text-xs font-medium border border-[#262a33]"
            >
              Abort Verification
            </button>
            <button
              onClick={onCompleteSuccess}
              className="px-4 py-1.5 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] rounded-lg text-xs font-bold shadow-md flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Confirm & Deploy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
