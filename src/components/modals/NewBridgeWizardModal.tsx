import React, { useState } from 'react';
import { ConnectorTemplate, BridgePipeline, TemplateScope } from '../../types';
import { CONNECTOR_TEMPLATES } from '../../data/mockData';

interface NewBridgeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBridge: (newBridge: BridgePipeline) => void;
  onLaunchDryRunAndDeploy: (bridge: BridgePipeline) => void;
}

export const NewBridgeWizardModal: React.FC<NewBridgeWizardModalProps> = ({
  isOpen,
  onClose,
  onAddBridge,
  onLaunchDryRunAndDeploy
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ConnectorTemplate>(CONNECTOR_TEMPLATES[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Step 2 state
  const [authStrategy, setAuthStrategy] = useState<'Bearer Token' | 'OAuth 2.0 (PKCE)' | 'API Key (Vault)' | 'Basic (API Token)'>('Bearer Token');
  const [domainPrefix, setDomainPrefix] = useState('acme-global');
  const [apiVersion, setApiVersion] = useState('2024-01');
  const [secretToken, setSecretToken] = useState('shpat_99ab283fec01a89c4d912440192e44');
  const [showSecret, setShowSecret] = useState(false);
  const [scopes, setScopes] = useState<TemplateScope[]>(selectedTemplate.scopes);
  const [handshakeTested, setHandshakeTested] = useState(false);
  const [isTestingProbe, setIsTestingProbe] = useState(false);

  // Step 3 state
  const [triggerMode, setTriggerMode] = useState<'cron' | 'webhook' | 'manual'>('cron');
  const [cadenceCron, setCadenceCron] = useState('*/15 * * * *');
  const [cadenceLabel, setCadenceLabel] = useState('Every 15 min');
  const [backfillChecked, setBackfillChecked] = useState(true);
  const [leakyBucketChecked, setLeakyBucketChecked] = useState(true);
  const [cacheSnapshots, setCacheSnapshots] = useState(true);

  if (!isOpen) return null;

  const filteredTemplates = CONNECTOR_TEMPLATES.filter(t =>
    categoryFilter === 'all' ? true : t.category === categoryFilter
  );

  const handleSelectTemplate = (tpl: ConnectorTemplate) => {
    setSelectedTemplate(tpl);
    setScopes(tpl.scopes);
  };

  const handleToggleScope = (scopeId: string) => {
    setScopes(prev => prev.map(s => s.id === scopeId ? { ...s, checked: !s.checked } : s));
  };

  const handleTestProbe = () => {
    setIsTestingProbe(true);
    setTimeout(() => {
      setIsTestingProbe(false);
      setHandshakeTested(true);
    }, 1000);
  };

  const handleFinalDeploy = () => {
    const constructedBridge: BridgePipeline = {
      id: `brg-${selectedTemplate.id}-${Date.now()}`,
      uuid: `brg_${selectedTemplate.id.slice(4)}_${Math.random().toString(36).substring(2, 8)}`,
      name: `${selectedTemplate.title} Ingestion`,
      service: selectedTemplate.category === 'ecommerce' ? 'shopify' : 'custom_rest',
      category: selectedTemplate.category === 'ecommerce' ? 'ecommerce' : 'custom',
      tag: selectedTemplate.title.slice(0, 4).toUpperCase(),
      method: 'GET',
      endpoint: selectedTemplate.defaultEndpoint.replace('{store_name}', domainPrefix).replace('{domain}', domainPrefix).replace('{instance}', domainPrefix).replace('{subdomain}', domainPrefix),
      authType: authStrategy,
      secretToken,
      syncInterval: cadenceLabel,
      cronExpression: cadenceCron,
      lastSync: 'Just now',
      recordsSynced: 250,
      status: 'healthy',
      statusText: 'Healthy',
      cluster: 'aws-us-east-1a-edge (Primary)',
      queryParams: [
        { id: '1', key: 'limit', value: '250' },
        { id: '2', key: 'status', value: 'any' }
      ],
      headers: [
        { id: '1', key: 'Content-Type', value: 'application/json' },
        { id: '2', key: 'Authorization', value: `Bearer ${secretToken}`, isSecret: true }
      ],
      paginationStrategy: 'Link Header (RFC-5988)',
      paginationNote: 'Cursor based link traversal',
      throttlingRate: '4 requests / sec',
      throttlingNote: 'Token bucket 40/40 limit',
      cacheSnapshots,
      maxRetries: 4,
      backoffCeiling: '30 seconds',
      timeoutMs: 8000,
      autoRetry429: true
    };

    onLaunchDryRunAndDeploy(constructedBridge);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#181c24] border border-[#31353e] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-[#262a33] bg-[#141820] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#262a33] border border-[#31353e] text-[#8083ff]">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                Add New Bridge Connector
              </h2>
              <p className="text-[11px] text-[#908fa0] font-mono">
                Step {step} of 3: {step === 1 ? 'Connector Template' : step === 2 ? 'Authentication & Scope' : 'Ingestion Schedule & Schema'}
              </p>
            </div>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  step === s
                    ? 'bg-[#8083ff] text-[#0d0096] ring-2 ring-[#8083ff]/40'
                    : step > s
                    ? 'bg-[#4edea3] text-[#003824]'
                    : 'bg-[#262a33] text-[#908fa0]'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
            <button
              onClick={onClose}
              className="p-1 text-[#908fa0] hover:text-white rounded ml-3"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Dynamic Step Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4">
          {/* ================= STEP 1: CONNECTOR TEMPLATE ================= */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 border-b border-[#262a33] pb-2 text-xs font-medium">
                {[
                  { id: 'all', label: 'All Templates (6)' },
                  { id: 'ecommerce', label: 'E-Commerce' },
                  { id: 'crm', label: 'CRM & Sales' },
                  { id: 'devops', label: 'DevOps & Issues' },
                  { id: 'support', label: 'Customer Support' },
                  { id: 'custom', label: 'Custom Protocol' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      categoryFilter === tab.id
                        ? 'bg-[#262a33] text-[#c0c1ff] font-semibold'
                        : 'text-[#908fa0] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTemplates.map(tpl => {
                  const isSelected = selectedTemplate.id === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#262a33]/60 border-[#8083ff] shadow-md shadow-[#8083ff]/10 ring-1 ring-[#8083ff]'
                          : 'bg-[#0f131c] border-[#262a33] hover:border-[#31353e] hover:bg-[#181c24]'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="material-symbols-outlined text-[20px] text-[#7bd0ff]">
                              {tpl.icon}
                            </span>
                            <span className="font-bold text-white text-xs">{tpl.title}</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#181c24] text-[#908fa0] border border-[#262a33]">
                            {tpl.version}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#908fa0] mt-2 line-clamp-2 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#262a33] mt-3 flex items-center justify-between text-[10px] font-mono text-[#908fa0]">
                        <span>Poll: {tpl.avgPoll}</span>
                        <span className="text-[#4edea3]">{tpl.rateLimit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Template Quick Inspection Panel */}
              <div className="p-3.5 bg-[#0a0e16] border border-[#262a33] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[#908fa0] block text-[11px]">Selected Template:</span>
                  <span className="font-bold text-white text-sm">{selectedTemplate.title}</span>
                  <span className="text-[#7bd0ff] font-mono text-[11px] block mt-0.5">
                    Default Endpoint: {selectedTemplate.defaultEndpoint}
                  </span>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] font-bold rounded-lg text-xs shadow-md transition-all self-end sm:self-auto"
                >
                  Configure Auth & Continue →
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: AUTHENTICATION & SCOPE ================= */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Auth Strategy cards */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white">Authentication Strategy</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Bearer Token', 'OAuth 2.0 (PKCE)', 'API Key (Vault)', 'Basic (API Token)'] as const).map(strat => (
                    <button
                      key={strat}
                      onClick={() => setAuthStrategy(strat)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        authStrategy === strat
                          ? 'bg-[#262a33] border-[#8083ff] text-[#c0c1ff] font-semibold'
                          : 'bg-[#0a0e16] border-[#262a33] text-[#908fa0] hover:text-white'
                      }`}
                    >
                      <div className="font-mono text-[11px]">{strat}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain & Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#908fa0]">Store Domain Prefix</label>
                  <div className="flex rounded-lg overflow-hidden border border-[#262a33]">
                    <input
                      type="text"
                      value={domainPrefix}
                      onChange={(e) => setDomainPrefix(e.target.value)}
                      className="flex-1 bg-[#0a0e16] px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    />
                    <span className="bg-[#262a33] text-[#908fa0] px-2.5 py-2 text-xs font-mono border-l border-[#31353e]">
                      .myshopify.com
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#908fa0]">API Version Tag</label>
                  <select
                    value={apiVersion}
                    onChange={(e) => setApiVersion(e.target.value)}
                    className="w-full bg-[#0a0e16] border border-[#262a33] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
                  >
                    <option value="2024-01">2024-01 (Stable Release)</option>
                    <option value="2023-10">2023-10 (LTS)</option>
                    <option value="unstable">unstable (Candidate)</option>
                  </select>
                </div>
              </div>

              {/* Secret Token with Eye Mask */}
              <div className="space-y-1">
                <label className="text-xs text-[#908fa0]">Admin Access Token (Private App)</label>
                <div className="relative flex items-center">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={secretToken}
                    onChange={(e) => setSecretToken(e.target.value)}
                    className="w-full bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded-lg pl-3 pr-10 py-2 text-xs text-white font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 text-[#908fa0] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showSecret ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Granular Ingestion Scopes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white">Granular Ingestion Scopes</label>
                  <span className="text-[11px] font-mono text-[#4edea3]">Least Privilege Principle</span>
                </div>

                <div className="space-y-2">
                  {scopes.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleToggleScope(s.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start space-x-3 ${
                        s.checked
                          ? 'bg-[#1c2028] border-[#8083ff]/40'
                          : 'bg-[#0a0e16] border-[#262a33] opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={s.checked}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-[#8083ff] focus:ring-0 bg-[#181c24] border-[#31353e]"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{s.name}</span>
                          <span className="text-[10px] font-mono text-[#7bd0ff]">({s.rawScopes})</span>
                          {s.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#ffdad6]/20 text-[#ffb4ab] border border-[#ffb4ab]/30">
                              {s.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#908fa0] mt-0.5">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Handshake Probe Banner */}
              <div className="p-3 bg-[#0a0e16] border border-[#262a33] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Connection Probe Verification</span>
                  <span className="text-[11px] text-[#908fa0]">
                    {handshakeTested
                      ? 'Handshake probe succeeded: HTTP 200 OK (TLS 1.3 in 138ms)'
                      : 'Verify credentials and DNS before proceeding to scheduling.'}
                  </span>
                </div>

                <button
                  onClick={handleTestProbe}
                  disabled={isTestingProbe}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center space-x-1.5 ${
                    handshakeTested
                      ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40'
                      : 'bg-[#262a33] hover:bg-[#31353e] text-[#c0c1ff] border border-[#8083ff]/40'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[15px] ${isTestingProbe ? 'animate-spin' : ''}`}>
                    {handshakeTested ? 'check_circle' : 'network_check'}
                  </span>
                  <span>{isTestingProbe ? 'Probing...' : handshakeTested ? 'Passed (200 OK)' : 'Test Handshake'}</span>
                </button>
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#262a33]">
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] rounded-lg text-xs font-medium border border-[#262a33]"
                >
                  ← Back to Templates
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] font-bold rounded-lg text-xs shadow-md transition-all"
                >
                  Save & Continue to Schedule →
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: INGESTION SCHEDULE & SCHEMA ================= */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Trigger Mode Cards */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white">Trigger Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'cron', title: 'Cron / Scheduled Poll', desc: 'Periodic background worker pull', icon: 'schedule' },
                    { id: 'webhook', title: 'Webhook Receiver', desc: 'Real-time HTTP push events', icon: 'cable' },
                    { id: 'manual', title: 'Manual On-Demand', desc: 'Triggered via API or dashboard only', icon: 'touch_app' }
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setTriggerMode(m.id as any)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        triggerMode === m.id
                          ? 'bg-[#262a33] border-[#8083ff] text-[#c0c1ff]'
                          : 'bg-[#0a0e16] border-[#262a33] text-[#908fa0] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="material-symbols-outlined text-[16px]">{m.icon}</span>
                        <span className="font-bold text-xs text-white">{m.title}</span>
                      </div>
                      <p className="text-[11px] text-[#908fa0] mt-1">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cadence Selector */}
              {triggerMode === 'cron' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#0a0e16] border border-[#262a33] rounded-xl">
                  <div className="space-y-1">
                    <label className="text-xs text-[#908fa0]">Ingestion Frequency</label>
                    <select
                      value={cadenceLabel}
                      onChange={(e) => {
                        setCadenceLabel(e.target.value);
                        if (e.target.value === 'Every 5 min') setCadenceCron('*/5 * * * *');
                        if (e.target.value === 'Every 15 min') setCadenceCron('*/15 * * * *');
                        if (e.target.value === 'Hourly') setCadenceCron('0 * * * *');
                        if (e.target.value === 'Daily') setCadenceCron('0 0 * * *');
                      }}
                      className="w-full bg-[#181c24] border border-[#262a33] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
                    >
                      <option value="Every 5 min">Every 5 min</option>
                      <option value="Every 15 min">Every 15 min (Recommended)</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily at 00:00 UTC</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#908fa0]">Cron Expression Pattern</label>
                    <input
                      type="text"
                      value={cadenceCron}
                      onChange={(e) => setCadenceCron(e.target.value)}
                      className="w-full bg-[#181c24] border border-[#262a33] rounded-lg px-3 py-2 text-xs text-[#7bd0ff] font-mono focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Safeguards & Storage options */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2.5 p-2.5 bg-[#0a0e16] border border-[#262a33] rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={leakyBucketChecked}
                    onChange={(e) => setLeakyBucketChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8083ff] bg-[#181c24] border-[#31353e]"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">Leaky Bucket Token Refill Rate Limit</span>
                    <p className="text-[11px] text-[#908fa0]">
                      Prevents 429 errors by capping egress to 4 requests/sec with exponential backoff on jitter.
                    </p>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2.5 bg-[#0a0e16] border border-[#262a33] rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cacheSnapshots}
                    onChange={(e) => setCacheSnapshots(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8083ff] bg-[#181c24] border-[#31353e]"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white">Cache Persistent JSON Snapshots</span>
                    <p className="text-[11px] text-[#908fa0]">
                      Stores encrypted raw responses in local SQLite disk cache for instant re-play and audit proofs.
                    </p>
                  </div>
                </label>
              </div>

              {/* Auto-Inferred Schema Preview */}
              <div className="border border-[#262a33] rounded-xl overflow-hidden bg-[#0a0e16]">
                <div className="p-2.5 bg-[#141820] border-b border-[#262a33] flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">
                    Auto-Inferred Schema Map (18 Attributes Detected)
                  </span>
                  <span className="text-[#4edea3] font-mono text-[11px]">0 Type Conflicts</span>
                </div>
                <div className="max-h-36 overflow-y-auto divide-y divide-[#1c2028] font-mono text-[11px] px-3 py-1">
                  <div className="py-1 flex justify-between text-[#7bd0ff]">
                    <span>$.orders[*].id</span>
                    <span className="text-white">order_id (Integer / BIGINT)</span>
                  </div>
                  <div className="py-1 flex justify-between text-[#7bd0ff]">
                    <span>$.orders[*].created_at</span>
                    <span className="text-white">created_at_utc (ISO-8601)</span>
                  </div>
                  <div className="py-1 flex justify-between text-[#7bd0ff]">
                    <span>$.orders[*].current_total_price</span>
                    <span className="text-white">total_amount_usd (Decimal / Currency)</span>
                  </div>
                  <div className="py-1 flex justify-between text-[#7bd0ff]">
                    <span>$.orders[*].email</span>
                    <span className="text-white">customer_email (String / PII Masked)</span>
                  </div>
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#262a33]">
                <button
                  onClick={() => setStep(2)}
                  className="px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] rounded-lg text-xs font-medium border border-[#262a33]"
                >
                  ← Back to Auth
                </button>
                <button
                  onClick={handleFinalDeploy}
                  className="px-5 py-2 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] font-bold rounded-lg text-xs shadow-lg shadow-[#8083ff]/30 transition-all flex items-center space-x-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">rocket_launch</span>
                  <span>Test Sync & Deploy Bridge Pipeline</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
