import React, { useState } from 'react';
import { BridgePipeline, SchemaMapping, TabularRecord } from '../types';
import { RAW_JSON_PAYLOAD_SAMPLE } from '../data/mockData';

interface FetchInspectorViewProps {
  bridges: BridgePipeline[];
  selectedBridgeId: string;
  onSelectBridge: (id: string) => void;
  schemaMappings: SchemaMapping[];
  onUpdateSchemaMappings: (mappings: SchemaMapping[]) => void;
  tabularRecords: TabularRecord[];
  onOpenSqlModal: () => void;
  onTriggerFetch: () => void;
  isFetching: boolean;
}

export const FetchInspectorView: React.FC<FetchInspectorViewProps> = ({
  bridges,
  selectedBridgeId,
  onSelectBridge,
  schemaMappings,
  onUpdateSchemaMappings,
  tabularRecords,
  onOpenSqlModal,
  onTriggerFetch,
  isFetching
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'tree' | 'headers'>('json');
  const [searchFilter, setSearchFilter] = useState('');
  const [copyCodeFeedback, setCopyCodeFeedback] = useState(false);
  const [mappings, setMappings] = useState<SchemaMapping[]>(schemaMappings);
  const [isSaved, setIsSaved] = useState(false);

  // New calculation form
  const [showAddCalc, setShowAddCalc] = useState(false);
  const [newCalcSource, setNewCalcSource] = useState('$.orders[*].line_items');
  const [newCalcOutput, setNewCalcOutput] = useState('average_item_price');
  const [newCalcRule, setNewCalcRule] = useState('Divide(total_price, item_count)');
  const [newCalcType, setNewCalcType] = useState<SchemaMapping['targetType']>('Decimal/Currency');

  const selectedBridge = bridges.find(b => b.id === selectedBridgeId) || (bridges.length > 0 ? bridges[0] : null);

  const handleTypeChange = (id: string, newType: SchemaMapping['targetType']) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, targetType: newType } : m));
    setIsSaved(false);
  };

  const handleOutputNameChange = (id: string, newName: string) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, outputField: newName } : m));
    setIsSaved(false);
  };

  const handleAddCalculation = () => {
    if (!newCalcOutput.trim() || !newCalcRule.trim()) return;
    const newField: SchemaMapping = {
      id: `sm-${Date.now()}`,
      sourceKey: newCalcSource.trim(),
      targetType: newCalcType,
      outputField: newCalcOutput.trim(),
      transformRule: newCalcRule.trim(),
      sampleValue: 'computed',
      state: 'computed',
      constraint: 'NUMERIC(12,2)'
    };
    const updated = [...mappings, newField];
    setMappings(updated);
    onUpdateSchemaMappings(updated);
    setShowAddCalc(false);
    setNewCalcOutput('');
    setNewCalcRule('');
  };

  const handleAutoInfer = () => {
    onUpdateSchemaMappings(mappings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2400);
  };

  const handleSaveSchemaMap = () => {
    onUpdateSchemaMappings(mappings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2400);
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Invoice #', 'Revenue', 'Timestamp', 'Customer Email', 'Items', 'Status'];
    const rows = tabularRecords.map(r => [
      r.order_id,
      r.invoice_number,
      `"${r.revenue_amount}"`,
      r.timestamp,
      r.customer_email,
      r.item_count,
      r.shipping_state
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `normalized-orders-export.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadSnapshot = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(RAW_JSON_PAYLOAD_SAMPLE, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `${selectedBridge ? selectedBridge.id : 'pipeline'}-raw-snapshot.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(RAW_JSON_PAYLOAD_SAMPLE, null, 2));
    setCopyCodeFeedback(true);
    setTimeout(() => setCopyCodeFeedback(false), 2000);
  };

  const rawJsonFormatted = JSON.stringify(RAW_JSON_PAYLOAD_SAMPLE, null, 2);

  if (!selectedBridge) {
    return (
      <div className="p-8 max-w-md mx-auto mt-20 text-center bg-[#181c24] border border-[#262a33] rounded-2xl shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#8083ff]/15 border border-[#8083ff]/30 text-[#8083ff] flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[30px]">terminal</span>
        </div>
        <h2 className="text-base font-bold text-white mb-1.5">No Active Pipelines To Inspect</h2>
        <p className="text-xs text-[#908fa0] mb-5">
          Connect your application's API pipeline first to test live endpoints, inspect JSON responses, and map schemas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5 max-w-[1600px] mx-auto">
      {/* Top Action & Selector Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#181c24] border border-[#262a33] p-3.5 rounded-xl shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#8083ff] text-[20px]">terminal</span>
            <span className="text-xs text-[#908fa0] font-mono uppercase tracking-wider">Active Pipeline:</span>
          </div>
          <select
            value={selectedBridgeId}
            onChange={(e) => onSelectBridge(e.target.value)}
            className="bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded-lg px-3 py-1.5 text-xs text-white font-sans focus:outline-none"
          >
            {bridges.map(b => (
              <option key={b.id} value={b.id} className="bg-[#181c24]">
                {b.name} ({b.tag})
              </option>
            ))}
          </select>

          {/* Telemetry pill */}
          <div className="flex items-center space-x-3 text-xs font-mono px-3 py-1 bg-[#0a0e16] border border-[#262a33] rounded-lg text-[#908fa0]">
            <span>Payload: <strong className="text-white">250 records (184.2 KB)</strong></span>
            <span className="text-[#31353e]">|</span>
            <span>Schema: <strong className="text-[#4edea3]">{mappings.length} Mapped</strong>, <strong className="text-white">0 Conflicts</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAutoInfer}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#c0c1ff] border border-[#262a33] rounded-lg text-xs font-medium transition-all"
            title="Automatically re-detect JSON fields and infer strict SQL types"
          >
            <span className="material-symbols-outlined text-[15px] text-[#8083ff]">auto_fix_high</span>
            <span>Auto-Infer Schema</span>
          </button>

          <button
            onClick={handleDownloadSnapshot}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] border border-[#262a33] rounded-lg text-xs font-medium transition-all"
            title="Download full encrypted JSON response snapshot"
          >
            <span className="material-symbols-outlined text-[15px] text-[#7bd0ff]">download</span>
            <span>Snapshot (.json)</span>
          </button>

          <button
            onClick={onTriggerFetch}
            disabled={isFetching}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] rounded-lg text-xs font-bold transition-all shadow-md shadow-[#8083ff]/20 active:scale-95"
          >
            <span className={`material-symbols-outlined text-[16px] ${isFetching ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isFetching ? 'Fetching Upstream...' : 'Execute Live Fetch Now'}</span>
          </button>
        </div>
      </div>

      {/* Main Split-Pane: Raw Payload (Left) vs Schema Transformer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Pane: Source API Raw Payload (5 cols) */}
        <div className="lg:col-span-5 bg-[#181c24] border border-[#262a33] rounded-xl overflow-hidden shadow-lg flex flex-col h-[680px]">
          {/* Header */}
          <div className="p-3 border-b border-[#262a33] bg-[#141820] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[17px] text-[#7bd0ff]">code</span>
              <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Source API Raw Payload
              </span>
            </div>

            {/* View Mode Selector */}
            <div className="flex items-center bg-[#0a0e16] border border-[#262a33] rounded-md p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setActiveTab('json')}
                className={`px-2 py-0.5 rounded transition-all ${
                  activeTab === 'json' ? 'bg-[#262a33] text-[#c0c1ff]' : 'text-[#908fa0] hover:text-white'
                }`}
              >
                JSON View
              </button>
              <button
                onClick={() => setActiveTab('headers')}
                className={`px-2 py-0.5 rounded transition-all ${
                  activeTab === 'headers' ? 'bg-[#262a33] text-[#c0c1ff]' : 'text-[#908fa0] hover:text-white'
                }`}
              >
                Headers (14)
              </button>
            </div>
          </div>

          {/* Search & Copy subheader */}
          <div className="px-3 py-2 border-b border-[#262a33] bg-[#0a0e16] flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-2 top-1.5 text-[#908fa0] text-[14px]">
                search
              </span>
              <input
                type="text"
                placeholder="Grep source key or value (e.g. current_total)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#181c24] border border-[#262a33] rounded px-2 pl-7 py-1 text-[11px] text-white font-mono placeholder-[#908fa0] focus:outline-none"
              />
            </div>
            <button
              onClick={handleCopyJson}
              className="px-2 py-1 bg-[#181c24] hover:bg-[#262a33] text-[#7bd0ff] rounded text-[11px] font-mono border border-[#262a33] flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-[13px]">
                {copyCodeFeedback ? 'check' : 'content_copy'}
              </span>
              <span>{copyCodeFeedback ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="flex-1 overflow-auto bg-[#0a0e16] p-3 font-mono text-[11px] leading-relaxed text-[#dfe2ee]">
            {activeTab === 'json' ? (
              <pre className="whitespace-pre">
                {rawJsonFormatted.split('\n').map((line, idx) => {
                  const matches = searchFilter && line.toLowerCase().includes(searchFilter.toLowerCase());
                  return (
                    <div
                      key={idx}
                      className={`flex hover:bg-[#181c24] px-1 rounded transition-colors ${
                        matches ? 'bg-[#8083ff]/30 text-white font-bold' : ''
                      }`}
                    >
                      <span className="w-8 text-[#464554] select-none text-right pr-3 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-[#c7c4d7]">{line}</span>
                    </div>
                  );
                })}
              </pre>
            ) : (
              <div className="space-y-2 p-1">
                <div className="text-[11px] text-[#908fa0] font-mono border-b border-[#262a33] pb-1">
                  HTTP/2 200 OK Upstream Headers
                </div>
                {[
                  { k: 'Content-Type', v: 'application/json; charset=utf-8' },
                  { k: 'X-Shopify-Shop-Api-Call-Limit', v: '20/40' },
                  { k: 'X-Sorting-Hat-PodId', v: '243' },
                  { k: 'Link', v: '<https://acme.myshopify.com/admin/api/2024-01/orders.json?page_info=eyJsYXN...>; rel="next"' },
                  { k: 'CF-Cache-Status', v: 'DYNAMIC' },
                  { k: 'Strict-Transport-Security', v: 'max-age=7889238; includeSubDomains' },
                  { k: 'X-Request-Id', v: 'f82a-9921-bc01-e24' },
                  { k: 'Server', v: 'cloudflare' }
                ].map((h, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-[#1c2028]">
                    <span className="text-[#7bd0ff] font-semibold">{h.k}:</span>
                    <span className="text-right truncate max-w-xs text-[#dfe2ee]">{h.v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-[#262a33] bg-[#141820] text-[10px] text-[#908fa0] font-mono flex items-center justify-between">
            <span>Encoding: UTF-8</span>
            <span className="text-[#4edea3]">● Stream Buffer: 184.2 KB</span>
          </div>
        </div>

        {/* Right Pane: Visual Schema Transformer & Type Mapper (7 cols) */}
        <div className="lg:col-span-7 bg-[#181c24] border border-[#262a33] rounded-xl overflow-hidden shadow-lg flex flex-col h-[680px]">
          {/* Header */}
          <div className="p-3 border-b border-[#262a33] bg-[#141820] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[17px] text-[#c0c1ff]">transform</span>
              <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Visual Schema Transformer & Type Mapper
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#4edea3]/20 text-[#4edea3] font-semibold">
                {mappings.length} Attributes Configured
              </span>
            </div>
          </div>

          {/* Action Subbar */}
          <div className="px-3 py-2 border-b border-[#262a33] bg-[#0a0e16] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddCalc(!showAddCalc)}
                className="flex items-center space-x-1 px-2.5 py-1 bg-[#262a33] hover:bg-[#31353e] text-[#c0c1ff] border border-[#31353e] rounded text-[11px] font-mono transition-all"
              >
                <span className="material-symbols-outlined text-[13px]">calculate</span>
                <span>+ Add Computed Field</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {isSaved && (
                <span className="text-[11px] text-[#4edea3] font-mono flex items-center space-x-1 animate-pulse">
                  <span className="material-symbols-outlined text-[13px]">check</span>
                  <span>Schema Saved!</span>
                </span>
              )}
              <button
                onClick={() => setMappings(schemaMappings)}
                className="px-2.5 py-1 bg-[#181c24] hover:bg-[#262a33] text-[#908fa0] rounded text-[11px] font-mono transition-all"
              >
                Reset
              </button>
              <button
                onClick={handleSaveSchemaMap}
                className="px-3 py-1 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] rounded text-[11px] font-bold font-mono transition-all shadow-sm"
              >
                Save Schema Map
              </button>
            </div>
          </div>

          {/* Add calculation row */}
          {showAddCalc && (
            <div className="p-3 bg-[#181c24] border-b border-[#31353e] space-y-2">
              <div className="text-xs font-semibold text-white">Add Computed / Virtual Schema Column</div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Output Field Name"
                  value={newCalcOutput}
                  onChange={(e) => setNewCalcOutput(e.target.value)}
                  className="bg-[#0a0e16] border border-[#262a33] rounded px-2 py-1 text-xs text-white font-mono"
                />
                <select
                  value={newCalcType}
                  onChange={(e) => setNewCalcType(e.target.value as any)}
                  className="bg-[#0a0e16] border border-[#262a33] rounded px-2 py-1 text-xs text-white font-mono"
                >
                  <option value="Decimal/Currency">Decimal/Currency</option>
                  <option value="Integer">Integer</option>
                  <option value="String">String</option>
                  <option value="Computed">Computed</option>
                </select>
                <input
                  type="text"
                  placeholder="Expression Rule"
                  value={newCalcRule}
                  onChange={(e) => setNewCalcRule(e.target.value)}
                  className="bg-[#0a0e16] border border-[#262a33] rounded px-2 py-1 text-xs text-white font-mono"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddCalc(false)}
                  className="px-2 py-1 text-xs text-[#908fa0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCalculation}
                  className="px-3 py-1 bg-[#8083ff] text-[#0d0096] text-xs font-bold rounded"
                >
                  Attach Field
                </button>
              </div>
            </div>
          )}

          {/* Mapping Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-[#0f131c] border-b border-[#262a33] z-10">
                <tr className="text-[#908fa0] font-mono text-[10px] uppercase">
                  <th className="py-2 px-3">Source Key Path</th>
                  <th className="py-2 px-3">Target Type</th>
                  <th className="py-2 px-3">Output Field Name</th>
                  <th className="py-2 px-3">Transform Rule</th>
                  <th className="py-2 px-3">Sample Value</th>
                  <th className="py-2 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262a33] font-mono text-[11px]">
                {mappings.map(map => (
                  <tr key={map.id} className="hover:bg-[#1c2028] transition-colors">
                    {/* Source Key */}
                    <td className="py-2 px-3 font-semibold text-[#7bd0ff] whitespace-nowrap">
                      {map.sourceKey}
                    </td>

                    {/* Target Type Selector */}
                    <td className="py-2 px-3">
                      <select
                        value={map.targetType}
                        onChange={(e) => handleTypeChange(map.id, e.target.value as any)}
                        className="bg-[#0a0e16] border border-[#262a33] rounded px-2 py-0.5 text-[11px] text-[#dfe2ee] font-mono focus:outline-none focus:border-[#8083ff]"
                      >
                        <option value="Integer">Integer</option>
                        <option value="String">String</option>
                        <option value="Decimal/Currency">Decimal/Currency</option>
                        <option value="ISO-8601">ISO-8601</option>
                        <option value="Computed">Computed</option>
                        <option value="Enum">Enum</option>
                        <option value="Boolean">Boolean</option>
                      </select>
                    </td>

                    {/* Output Field Name */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={map.outputField}
                        onChange={(e) => handleOutputNameChange(map.id, e.target.value)}
                        className="bg-[#0a0e16] border border-[#262a33] focus:border-[#8083ff] rounded px-2 py-0.5 text-[11px] text-white font-mono w-32 focus:outline-none"
                      />
                    </td>

                    {/* Transform Rule */}
                    <td className="py-2 px-3 text-[#908fa0] text-[10px]">
                      {map.transformRule}
                    </td>

                    {/* Sample Value */}
                    <td className="py-2 px-3 text-[#dfe2ee] text-[10px] truncate max-w-[120px]">
                      {map.sampleValue}
                    </td>

                    {/* State Icon */}
                    <td className="py-2 px-2 text-center">
                      {map.state === 'valid' && (
                        <span className="material-symbols-outlined text-[#4edea3] text-[16px]" title="Validated">
                          check_circle
                        </span>
                      )}
                      {map.state === 'masked' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8083ff]/20 text-[#c0c1ff]" title="PII Masked">
                          MASK
                        </span>
                      )}
                      {map.state === 'computed' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#7bd0ff]/20 text-[#7bd0ff]" title="Computed Virtual">
                          CALC
                        </span>
                      )}
                      {map.state === 'warning' && (
                        <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]" title="Warning">
                          warning
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-[#262a33] bg-[#141820] text-[10px] text-[#908fa0] font-mono flex items-center justify-between">
            <span>Auto-cast ANSI SQL Compliant</span>
            <span className="text-[#4edea3]">● 0 Incompatible Type Coercions</span>
          </div>
        </div>
      </div>

      {/* Bottom Drawer: Live Tabular Data Preview (Normalized Ingestion Output) */}
      <div className="bg-[#181c24] border border-[#262a33] rounded-xl overflow-hidden shadow-xl">
        <div className="p-3.5 border-b border-[#262a33] bg-[#141820] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[18px] text-[#4edea3]">table_chart</span>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Live Tabular Data Preview (Normalized Ingestion Output)
              </h3>
              <p className="text-[11px] text-[#908fa0]">
                Showing 6 sample normalized rows extracted from active ingestion buffer.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0a0e16] hover:bg-[#262a33] text-[#dfe2ee] border border-[#262a33] rounded-lg text-xs font-medium transition-all"
            >
              <span className="material-symbols-outlined text-[15px] text-[#7bd0ff]">csv</span>
              <span>Export CSV (.csv)</span>
            </button>
            <button
              onClick={onOpenSqlModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#262a33] hover:bg-[#353942] text-[#c0c1ff] border border-[#8083ff]/40 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-[#8083ff]">schema</span>
              <span>Generate SQL DDL</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#262a33] bg-[#0f131c] text-[#908fa0] font-mono text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">order_id</th>
                <th className="py-2.5 px-4 font-semibold">invoice_number</th>
                <th className="py-2.5 px-4 font-semibold">revenue_amount</th>
                <th className="py-2.5 px-4 font-semibold">timestamp (UTC)</th>
                <th className="py-2.5 px-4 font-semibold">customer_email</th>
                <th className="py-2.5 px-4 font-semibold text-center">item_count</th>
                <th className="py-2.5 px-4 font-semibold">shipping_state</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262a33] font-mono text-xs">
              {tabularRecords.map((rec, i) => (
                <tr key={i} className="hover:bg-[#1c2028] transition-colors">
                  <td className="py-2.5 px-4 font-bold text-white">{rec.order_id}</td>
                  <td className="py-2.5 px-4 text-[#7bd0ff]">{rec.invoice_number}</td>
                  <td className="py-2.5 px-4 text-[#4edea3] font-medium">{rec.revenue_amount}</td>
                  <td className="py-2.5 px-4 text-[#dfe2ee]">{rec.timestamp}</td>
                  <td className="py-2.5 px-4 text-[#908fa0] font-sans">{rec.customer_email}</td>
                  <td className="py-2.5 px-4 text-center text-white">{rec.item_count}</td>
                  <td className="py-2.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.shipping_state === 'Fulfilled'
                        ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30'
                        : rec.shipping_state === 'Processing'
                        ? 'bg-[#7bd0ff]/20 text-[#7bd0ff] border border-[#00a6e0]/30'
                        : 'bg-[#ffdad6]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                    }`}>
                      {rec.shipping_state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
