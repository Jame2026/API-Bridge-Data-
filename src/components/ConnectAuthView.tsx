import React, { useState } from 'react';
import { BridgePipeline, QueryParam, HeaderInjection } from '../types';

interface ConnectAuthViewProps {
  bridge: BridgePipeline;
  onUpdateBridge: (updated: BridgePipeline) => void;
  onRunDryRun: () => void;
  onDeployPipeline: () => void;
  onCancel: () => void;
}

export const ConnectAuthView: React.FC<ConnectAuthViewProps> = ({
  bridge,
  onUpdateBridge,
  onRunDryRun,
  onDeployPipeline,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'validation'>('config');
  const [showSecret, setShowSecret] = useState(false);
  const [testSuccess, setTestSuccess] = useState(true);
  const [testingHandshake, setTestingHandshake] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Editable bridge state
  const [pipelineName, setPipelineName] = useState(bridge.name);
  const [endpoint, setEndpoint] = useState(bridge.endpoint);
  const [method, setMethod] = useState(bridge.method);
  const [authType, setAuthType] = useState(bridge.authType);
  const [secretToken, setSecretToken] = useState(bridge.secretToken);
  const [queryParams, setQueryParams] = useState<QueryParam[]>(bridge.queryParams);
  const [headers, setHeaders] = useState<HeaderInjection[]>(bridge.headers);
  const [throttlingRate, setThrottlingRate] = useState(bridge.throttlingRate);
  const [syncInterval, setSyncInterval] = useState(bridge.syncInterval);
  const [cacheSnapshots, setCacheSnapshots] = useState(bridge.cacheSnapshots);

  const [newParamKey, setNewParamKey] = useState('');
  const [newParamVal, setNewParamVal] = useState('');
  const [showAddParam, setShowAddParam] = useState(false);

  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderVal, setNewHeaderVal] = useState('');
  const [showAddHeader, setShowAddHeader] = useState(false);

  const handleAddParam = () => {
    if (!newParamKey.trim()) return;
    setQueryParams([
      ...queryParams,
      { id: Date.now().toString(), key: newParamKey.trim(), value: newParamVal.trim() }
    ]);
    setNewParamKey('');
    setNewParamVal('');
    setShowAddParam(false);
  };

  const handleRemoveParam = (id: string) => {
    setQueryParams(queryParams.filter(p => p.id !== id));
  };

  const handleAddHeader = () => {
    if (!newHeaderKey.trim()) return;
    setHeaders([
      ...headers,
      { id: Date.now().toString(), key: newHeaderKey.trim(), value: newHeaderVal.trim() }
    ]);
    setNewHeaderKey('');
    setNewHeaderVal('');
    setShowAddHeader(false);
  };

  const handleRemoveHeader = (id: string) => {
    setHeaders(headers.filter(h => h.id !== id));
  };

  const handleRunSimulatorTest = () => {
    setTestingHandshake(true);
    setTimeout(() => {
      setTestingHandshake(false);
      setTestSuccess(true);
    }, 900);
  };

  const handleCopyResponse = () => {
    const jsonSample = `{\n  "orders": [\n    {\n      "id": 5519827102,\n      "admin_graphql_api_id": "gid://shopify/Order/5519827102",\n      "created_at": "2025-02-14T14:19:42-05:00",\n      "current_total_price": "271.33",\n      "currency": "USD",\n      "email": "jane.doe@enterprise-retail.com",\n      "financial_status": "paid",\n      "fulfillment_status": "unfulfilled"\n    }\n  ]\n}`;
    navigator.clipboard.writeText(jsonSample);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleSaveDraft = () => {
    onUpdateBridge({
      ...bridge,
      name: pipelineName,
      endpoint,
      method,
      authType,
      secretToken,
      queryParams,
      headers,
      throttlingRate,
      syncInterval,
      cacheSnapshots
    });
  };

  return (
    <div className="space-y-4 p-5 max-w-[1600px] mx-auto">
      {/* Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181c24] border border-[#262a33] p-3.5 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#908fa0]">Bridges</span>
            <span className="text-[#464554]">/</span>
            <span className="text-white font-bold">Edit Pipeline</span>
            <span className="text-[#7bd0ff] font-semibold">#{bridge.uuid}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
            Sync Active
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] border border-[#262a33] rounded-lg text-xs font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] border border-[#31353e] rounded-lg text-xs font-medium transition-all"
          >
            Save Draft
          </button>
          <button
            onClick={onRunDryRun}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#262a33] hover:bg-[#353942] text-[#c0c1ff] border border-[#8083ff]/40 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-[#8083ff]">play_circle</span>
            <span>Test Handshake & Validate</span>
          </button>
          <button
            onClick={onDeployPipeline}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] rounded-lg text-xs font-bold transition-all shadow-md shadow-[#8083ff]/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px]">rocket_launch</span>
            <span>Deploy Pipeline</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Section 01: Target Service & Base Configuration */}
          <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4.5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8083ff]/20 text-[#c0c1ff] font-bold">
                  01
                </span>
                <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                  Target Service & Base Configuration
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#908fa0]">Protocol Specification</span>
            </div>

            {/* Protocol Presets */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#908fa0] font-medium">Protocol Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'shopify', label: 'Shopify Admin', icon: 'shopping_bag' },
                  { id: 'custom_rest', label: 'REST Custom', icon: 'http' },
                  { id: 'graphql', label: 'GraphQL API', icon: 'schema' },
                  { id: 'webhook', label: 'Webhook Receiver', icon: 'cable' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {}}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      item.id === 'shopify'
                        ? 'bg-[#262a33] border-[#8083ff] text-[#c0c1ff] shadow-sm'
                        : 'bg-[#0f131c] border-[#262a33] text-[#908fa0] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name and Cluster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[#908fa0] font-medium">Pipeline Identifier Name</label>
                <input
                  type="text"
                  value={pipelineName}
                  onChange={(e) => setPipelineName(e.target.value)}
                  className="w-full bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#908fa0] font-medium">Worker Execution Cluster</label>
                <select
                  value={bridge.cluster}
                  onChange={() => {}}
                  className="w-full bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                >
                  <option>aws-us-east-1a-edge (Primary)</option>
                  <option>aws-us-east-1b-replica (Secondary)</option>
                  <option>gcp-europe-west3 (Frankfurt)</option>
                </select>
              </div>
            </div>

            {/* Base Endpoint URL with Method */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#908fa0] font-medium">Base Ingestion Endpoint</label>
              <div className="flex rounded-lg overflow-hidden border border-[#262a33] focus-within:border-[#8083ff]">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="bg-[#262a33] text-xs font-bold font-mono text-[#7bd0ff] px-3 py-2 border-r border-[#31353e] focus:outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="flex-1 bg-[#0a0e16] px-3 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Query Extraction Parameters */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#908fa0] font-medium">Query Extraction Parameters</label>
                <button
                  onClick={() => setShowAddParam(!showAddParam)}
                  className="text-[11px] font-mono text-[#7bd0ff] hover:underline flex items-center space-x-1"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Add Parameter</span>
                </button>
              </div>

              {/* Param tags */}
              <div className="flex flex-wrap gap-1.5">
                {queryParams.map(param => (
                  <div
                    key={param.id}
                    className="flex items-center space-x-1 bg-[#0a0e16] border border-[#262a33] rounded-md px-2 py-1 text-[11px] font-mono"
                  >
                    <span className="text-[#7bd0ff]">{param.key}</span>
                    <span className="text-[#908fa0]">=</span>
                    <span className={param.dynamic ? 'text-[#ffb4ab]' : 'text-[#dfe2ee]'}>
                      {param.value}
                    </span>
                    <button
                      onClick={() => handleRemoveParam(param.id)}
                      className="text-[#908fa0] hover:text-white ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Add param form input */}
              {showAddParam && (
                <div className="flex items-center space-x-2 p-2 bg-[#0a0e16] border border-[#31353e] rounded-lg">
                  <input
                    type="text"
                    placeholder="Key (e.g. limit)"
                    value={newParamKey}
                    onChange={(e) => setNewParamKey(e.target.value)}
                    className="flex-1 bg-[#181c24] border border-[#262a33] rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 250)"
                    value={newParamVal}
                    onChange={(e) => setNewParamVal(e.target.value)}
                    className="flex-1 bg-[#181c24] border border-[#262a33] rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleAddParam}
                    className="px-2.5 py-1 bg-[#8083ff] text-[#0d0096] text-xs font-bold rounded"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddParam(false)}
                    className="text-[#908fa0] hover:text-white text-xs px-1"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 02: Authentication Credentials & Headers */}
          <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4.5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8083ff]/20 text-[#c0c1ff] font-bold">
                  02
                </span>
                <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                  Authentication Credentials & Headers
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#4edea3]">KMS Secret Vault (AES-256)</span>
            </div>

            {/* Auth Strategy Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#908fa0] font-medium">Authentication Strategy</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'API Key / Header',
                  'Bearer Token',
                  'OAuth 2.0 (PKCE)',
                  'Basic (API Token)'
                ].map(type => (
                  <button
                    key={type}
                    onClick={() => setAuthType(type as any)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      authType === type
                        ? 'bg-[#262a33] border-[#8083ff] text-[#c0c1ff]'
                        : 'bg-[#0f131c] border-[#262a33] text-[#908fa0] hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Secret Token Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#908fa0] font-medium">
                Secret Token / Ingestion Key
              </label>
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
              <p className="text-[11px] text-[#908fa0] font-mono">
                Tokens are stored in hardware KMS HSM and never echoed back in cleartext logs.
              </p>
            </div>

            {/* Custom Injection Headers Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[#908fa0] font-medium">Custom Injection Headers</label>
                <button
                  onClick={() => setShowAddHeader(!showAddHeader)}
                  className="text-[11px] font-mono text-[#7bd0ff] hover:underline flex items-center space-x-1"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Add Header</span>
                </button>
              </div>

              <div className="border border-[#262a33] rounded-lg overflow-hidden bg-[#0a0e16]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#262a33] bg-[#141820] text-[#908fa0] font-mono text-[10px] uppercase">
                      <th className="py-2 px-3">Header Key</th>
                      <th className="py-2 px-3">Header Value</th>
                      <th className="py-2 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262a33] font-mono text-[11px]">
                    {headers.map(h => (
                      <tr key={h.id} className="hover:bg-[#181c24]/50">
                        <td className="py-2 px-3 text-[#7bd0ff]">{h.key}</td>
                        <td className="py-2 px-3 text-[#dfe2ee]">
                          {h.isSecret ? (showSecret ? h.value : '••••••••••••••••••••••••') : h.value}
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            onClick={() => handleRemoveHeader(h.id)}
                            className="text-[#908fa0] hover:text-[#ffb4ab] p-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add header input form */}
              {showAddHeader && (
                <div className="flex items-center space-x-2 p-2 bg-[#0a0e16] border border-[#31353e] rounded-lg">
                  <input
                    type="text"
                    placeholder="Header Key (e.g. X-Trace-Id)"
                    value={newHeaderKey}
                    onChange={(e) => setNewHeaderKey(e.target.value)}
                    className="flex-1 bg-[#181c24] border border-[#262a33] rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 12345)"
                    value={newHeaderVal}
                    onChange={(e) => setNewHeaderVal(e.target.value)}
                    className="flex-1 bg-[#181c24] border border-[#262a33] rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleAddHeader}
                    className="px-2.5 py-1 bg-[#8083ff] text-[#0d0096] text-xs font-bold rounded"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddHeader(false)}
                    className="text-[#908fa0] hover:text-white text-xs px-1"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 03: Pagination, Rate Limits & Retry Policy */}
          <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4.5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-[#262a33]">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8083ff]/20 text-[#c0c1ff] font-bold">
                  03
                </span>
                <h2 className="text-sm font-bold text-white tracking-tight font-sans">
                  Pagination, Rate Limits & Retry Policy
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#908fa0]">Fault Tolerance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[#908fa0] font-medium">Pagination Traversal Strategy</label>
                <input
                  type="text"
                  value={bridge.paginationStrategy}
                  readOnly
                  className="w-full bg-[#0a0e16] border border-[#262a33] rounded-lg px-3 py-2 text-xs text-[#dfe2ee] font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#908fa0] font-medium">Egress Throttling Rate</label>
                <input
                  type="text"
                  value={throttlingRate}
                  onChange={(e) => setThrottlingRate(e.target.value)}
                  className="w-full bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded-lg px-3 py-2 text-xs text-[#dfe2ee] font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[#908fa0] font-medium">Execution Cadence (Cron Pattern)</label>
                <input
                  type="text"
                  value={bridge.cronExpression}
                  readOnly
                  className="w-full bg-[#0a0e16] border border-[#262a33] rounded-lg px-3 py-2 text-xs text-[#7bd0ff] font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#908fa0] font-medium">Exponential Backoff Rule</label>
                <input
                  type="text"
                  value={`Max ${bridge.maxRetries} Retries • ${bridge.backoffCeiling} ceiling`}
                  readOnly
                  className="w-full bg-[#0a0e16] border border-[#262a33] rounded-lg px-3 py-2 text-xs text-[#dfe2ee] font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Cache Snapshots Checkbox */}
            <label className="flex items-center space-x-2.5 p-2 bg-[#0a0e16] border border-[#262a33] rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={cacheSnapshots}
                onChange={(e) => setCacheSnapshots(e.target.checked)}
                className="w-4 h-4 rounded text-[#8083ff] focus:ring-0 bg-[#181c24] border-[#31353e]"
              />
              <div className="text-xs">
                <span className="font-medium text-white">Cache Persistent JSON Snapshots</span>
                <p className="text-[10px] text-[#908fa0]">
                  Saves encrypted JSON responses in local SQLite disk cache before downstream transformation.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Right Column: Live Handshake Simulator & Validation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-4.5 shadow-xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262a33]">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[18px] text-[#7bd0ff]">network_check</span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Live Handshake Simulator & Validation
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#262a33] text-[#c0c1ff]">
                RUN #2025-0214-9A
              </span>
            </div>

            {/* Connection Route Diagram */}
            <div className="p-3 bg-[#0a0e16] border border-[#262a33] rounded-lg">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-[#262a33] flex items-center justify-center text-[#8083ff] border border-[#31353e]">
                    <span className="material-symbols-outlined text-[18px]">dns</span>
                  </div>
                  <span className="text-[10px] text-[#908fa0] mt-1">Egress Bridge</span>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="text-[10px] text-[#4edea3] font-bold">TLS 1.3 / HTTP/2</span>
                  <div className="w-full h-0.5 bg-gradient-to-r from-[#8083ff] via-[#4edea3] to-[#7bd0ff] my-1" />
                  <span className="text-[9px] text-[#908fa0]">ECDHE-RSA-AES128-GCM</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded bg-[#262a33] flex items-center justify-center text-[#4edea3] border border-[#31353e]">
                    <span className="material-symbols-outlined text-[18px]">cloud</span>
                  </div>
                  <span className="text-[10px] text-[#908fa0] mt-1">Shopify Admin</span>
                </div>
              </div>
            </div>

            {/* Handshake verified status alert */}
            <div className="p-3 bg-[#4edea3]/10 border border-[#4edea3]/30 rounded-lg flex items-start space-x-2.5">
              <span className="material-symbols-outlined text-[#4edea3] text-[20px] mt-0.5">
                verified
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#4edea3] text-xs font-mono">HTTP 200 OK Handshake Verified</span>
                </div>
                <p className="text-[11px] text-[#dfe2ee] mt-0.5">
                  Upstream API answered probe in 138ms. Handshake validated with authorized scopes and valid JSON body.
                </p>
              </div>
            </div>

            {/* Telemetry Strip */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 bg-[#0a0e16] border border-[#262a33] rounded-lg">
                <span className="text-[10px] text-[#908fa0] block">Roundtrip</span>
                <span className="text-sm font-bold text-[#4edea3]">138 ms</span>
              </div>
              <div className="p-2 bg-[#0a0e16] border border-[#262a33] rounded-lg">
                <span className="text-[10px] text-[#908fa0] block">Payload</span>
                <span className="text-sm font-bold text-white">184.2 KB</span>
              </div>
              <div className="p-2 bg-[#0a0e16] border border-[#262a33] rounded-lg">
                <span className="text-[10px] text-[#908fa0] block">Headers</span>
                <span className="text-sm font-bold text-[#7bd0ff]">14 headers</span>
              </div>
            </div>

            {/* Certificate & Limit Vitals */}
            <div className="p-3 bg-[#0a0e16] border border-[#262a33] rounded-lg space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">SSL Certificate:</span>
                <span className="text-[#4edea3] font-medium">Valid (DigiCert, expires 2026-11-14)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">API Call Limit:</span>
                <span className="text-white">20/40 (50% available)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#908fa0]">X-Request-ID:</span>
                <span className="text-[#7bd0ff]">f82a-9921-bc01-e24</span>
              </div>
            </div>

            {/* Response Code Block */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#908fa0] font-mono text-[11px]">response_body.json</span>
                <button
                  onClick={handleCopyResponse}
                  className="text-[11px] font-mono text-[#7bd0ff] hover:underline flex items-center space-x-1"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {copyFeedback ? 'check' : 'content_copy'}
                  </span>
                  <span>{copyFeedback ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-[#0a0e16] border border-[#262a33] rounded-lg p-3 font-mono text-[11px] text-[#dfe2ee] max-h-48 overflow-y-auto leading-relaxed">
                <pre>{`{
  "orders": [
    {
      "id": 5519827102,
      "admin_graphql_api_id": "gid://shopify/Order/5519827102",
      "app_id": 1354745,
      "browser_ip": "192.0.2.1",
      "buyer_accepts_marketing": true,
      "cart_token": "c1-a83f98c21344",
      "checkout_id": 99283411,
      "created_at": "2025-02-14T14:19:42-05:00",
      "currency": "USD",
      "current_total_price": "271.33",
      "email": "jane.doe@enterprise-retail.com",
      "financial_status": "paid",
      "fulfillment_status": "unfulfilled"
    }
  ]
}`}</pre>
              </div>
            </div>

            {/* Schema Compatibility */}
            <div className="p-3 bg-[#262a33]/60 border border-[#31353e] rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Schema Compatibility Matrix</span>
                <span className="text-[#4edea3] font-mono font-bold">100% MATCH</span>
              </div>
              <p className="text-[11px] text-[#908fa0]">
                18 of 18 output attributes successfully mapped. No schema violations or uncastable datatypes detected.
              </p>
            </div>

            {/* Trigger Re-Test Button */}
            <button
              onClick={handleRunSimulatorTest}
              disabled={testingHandshake}
              className="w-full py-2 bg-[#262a33] hover:bg-[#31353e] text-white border border-[#31353e] rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <span className={`material-symbols-outlined text-[16px] text-[#8083ff] ${testingHandshake ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{testingHandshake ? 'Re-testing Probe...' : 'Re-run Handshake Probe'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
