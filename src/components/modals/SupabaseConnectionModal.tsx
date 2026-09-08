import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured, testSupabaseConnection } from '../../lib/supabase';

interface SupabaseConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConnectionModal: React.FC<SupabaseConnectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [testing, setTesting] = useState(false);
  const [statusResult, setStatusResult] = useState<{
    success?: boolean;
    message?: string;
    latencyMs?: number;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const configured = isSupabaseConfigured();
  const currentUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const currentKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const handleTest = async () => {
    setTesting(true);
    setStatusResult(null);
    try {
      const res = await testSupabaseConnection();
      setStatusResult(res);
    } catch (err: any) {
      setStatusResult({
        success: false,
        message: err?.message || 'Failed to ping Supabase',
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen && configured && !statusResult) {
      handleTest();
    }
  }, [isOpen, configured]);

  if (!isOpen) return null;

  const envSample = `# .env.local\nVITE_SUPABASE_URL="https://your-project-id.supabase.co"\nVITE_SUPABASE_ANON_KEY="your-anon-public-key"`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleCopySqlPath = () => {
    navigator.clipboard.writeText('supabase/schema.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#10141d] border border-[#262a33] rounded-xl shadow-2xl max-w-xl w-full overflow-hidden text-xs text-[#dfe2ee] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#262a33] flex items-center justify-between bg-[#141822]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#3ecf8e]/15 border border-[#3ecf8e]/30 flex items-center justify-center text-[#3ecf8e]">
              <span className="material-symbols-outlined text-[20px]">database</span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Supabase Integration Gateway</h3>
              <p className="text-[11px] text-[#908fa0]">Connect persistent telemetry & bridge pipelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#908fa0] hover:text-white hover:bg-[#1f2430] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status Banner */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between ${
            configured
              ? statusResult?.success
                ? 'bg-[#1b3327]/60 border-[#3ecf8e]/40 text-[#a3e635]'
                : 'bg-[#292218]/60 border-[#eab308]/40 text-[#facc15]'
              : 'bg-[#231b26]/60 border-[#f43f5e]/40 text-[#fda4af]'
          }`}>
            <div className="flex items-center space-x-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                configured
                  ? statusResult?.success ? 'bg-[#3ecf8e] animate-pulse' : 'bg-[#eab308]'
                  : 'bg-[#f43f5e]'
              }`} />
              <div>
                <span className="font-semibold text-white">
                  {!configured ? 'Not Configured' : statusResult?.success ? 'Connected to Supabase' : 'Connection Pending'}
                </span>
                <p className="text-[11px] text-[#908fa0] mt-0.5">
                  {!configured
                    ? 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local'
                    : statusResult?.message || 'Testing project endpoint ping...'}
                </p>
              </div>
            </div>
            <button
              onClick={handleTest}
              disabled={testing || !configured}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                testing || !configured
                  ? 'bg-[#1a1f2c] text-[#555d70] cursor-not-allowed border border-[#262a33]'
                  : 'bg-[#262a33] text-[#7bd0ff] hover:bg-[#31353e] hover:text-white border border-[#3c4250]'
              }`}
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {/* Config Parameters */}
          <div className="space-y-2 bg-[#141822] p-3.5 rounded-lg border border-[#262a33]">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#262a33]">
              <span className="font-semibold text-white text-[11px] uppercase tracking-wider">Configuration Status</span>
              <span className="text-[10px] text-[#908fa0] font-mono">Vite Client Environment</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#908fa0]">Project URL:</span>
                <span className="font-mono text-[#c0c1ff] truncate max-w-[280px]">
                  {currentUrl || '<Not Set in .env.local>'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#908fa0]">Anon Public Key:</span>
                <span className="font-mono text-[#7bd0ff] truncate max-w-[280px]">
                  {currentKey ? `${currentKey.slice(0, 16)}...${currentKey.slice(-8)}` : '<Not Set in .env.local>'}
                </span>
              </div>
            </div>
          </div>

          {/* Setup Guide */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-xs flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#8083ff]">settings_ethernet</span>
              <span>Quick Setup Checklist</span>
            </h4>

            <div className="space-y-2 text-[#c7c4d7]">
              {/* Step 1 */}
              <div className="flex items-start space-x-2.5 p-2.5 rounded-md bg-[#141822] border border-[#262a33]">
                <span className="w-5 h-5 rounded-full bg-[#8083ff]/20 text-[#8083ff] font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-white">Add credentials to <code className="text-[#7bd0ff] bg-[#1a1f2c] px-1 py-0.5 rounded">.env.local</code></p>
                  <p className="text-[11px] text-[#908fa0]">
                    Navigate to your <strong className="text-white">Supabase Dashboard &gt; Project Settings &gt; API</strong> and copy your Project URL and Anon key.
                  </p>
                  <div className="flex items-center justify-between bg-[#0a0e16] p-2 rounded border border-[#262a33] font-mono text-[10px] text-[#7bd0ff]">
                    <span>{envSample}</span>
                    <button
                      onClick={handleCopyEnv}
                      className="ml-2 text-xs text-[#908fa0] hover:text-white"
                    >
                      {copiedEnv ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-2.5 p-2.5 rounded-md bg-[#141822] border border-[#262a33]">
                <span className="w-5 h-5 rounded-full bg-[#8083ff]/20 text-[#8083ff] font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-white">Run database schema migration</p>
                  <p className="text-[11px] text-[#908fa0]">
                    Open your Supabase <strong className="text-white">SQL Editor</strong> and run the provided migration script in:
                  </p>
                  <div className="flex items-center justify-between bg-[#0a0e16] px-2.5 py-1.5 rounded border border-[#262a33] font-mono text-[11px] text-[#3ecf8e]">
                    <span>supabase/schema.sql</span>
                    <button
                      onClick={handleCopySqlPath}
                      className="text-xs text-[#908fa0] hover:text-white"
                    >
                      {copiedSql ? 'Copied!' : 'Copy Path'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#262a33] bg-[#141822] flex items-center justify-between">
          <span className="text-[11px] text-[#908fa0] flex items-center space-x-1">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>Client-side anon keys protected with RLS</span>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-[#262a33] hover:bg-[#31353e] text-white rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
