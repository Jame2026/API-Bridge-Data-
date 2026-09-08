/**
 * API DATA BRIDGE
 * Enterprise API integration middleware, pipeline orchestrator, schema transformer,
 * and operational telemetry platform.
 */

import React, { useState, useEffect } from 'react';
import {
  NavView,
  BridgePipeline,
  SyncActivityLog,
  SchemaMapping,
  TabularRecord
} from './types';
import {
  isSupabaseConfigured,
  fetchBridgesFromSupabase,
  upsertBridgeToSupabase,
  recordSyncActivityToSupabase,
  fetchSyncLogsFromSupabase
} from './lib/supabase';
import {
  INITIAL_BRIDGES,
  INITIAL_LOGS,
  INITIAL_SCHEMA_MAPPINGS,
  INITIAL_TABULAR_RECORDS
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { ConnectAuthView } from './components/ConnectAuthView';
import { FetchInspectorView } from './components/FetchInspectorView';
import { ReportsView } from './components/ReportsView';
import { EndpointRegistryView } from './components/EndpointRegistryView';
import { AuditLogsView } from './components/AuditLogsView';
import { NewBridgeWizardModal } from './components/modals/NewBridgeWizardModal';
import { DryRunModal } from './components/modals/DryRunModal';
import { SuccessModal } from './components/modals/SuccessModal';
import { FailureModal } from './components/modals/FailureModal';
import { GenerateSqlModal } from './components/modals/GenerateSqlModal';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView>('overview-bridges');
  const [bridges, setBridges] = useState<BridgePipeline[]>(INITIAL_BRIDGES);
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>('');
  const [logs, setLogs] = useState<SyncActivityLog[]>(INITIAL_LOGS);
  const [schemaMappings, setSchemaMappings] = useState<SchemaMapping[]>(INITIAL_SCHEMA_MAPPINGS);
  const [tabularRecords, setTabularRecords] = useState<TabularRecord[]>(INITIAL_TABULAR_RECORDS);
  const [activeRegion, setActiveRegion] = useState<string>('us-east-1');

  // Async action states
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Modals state
  const [showNewBridgeModal, setShowNewBridgeModal] = useState(false);
  const [showDryRunModal, setShowDryRunModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  // Active toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const selectedBridge = bridges.find(b => b.id === selectedBridgeId) || (bridges.length > 0 ? bridges[0] : null);

  // Hydrate from Supabase on startup if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchBridgesFromSupabase().then((remoteBridges) => {
        if (remoteBridges && remoteBridges.length > 0) {
          setBridges(remoteBridges);
          setSelectedBridgeId(remoteBridges[0].id);
        }
      });
      fetchSyncLogsFromSupabase().then((remoteLogs) => {
        if (remoteLogs && remoteLogs.length > 0) {
          setLogs(remoteLogs);
        }
      });
    }
  }, []);

  // Trigger manual sync across active pipelines
  const handleTriggerSync = () => {
    if (bridges.length === 0) {
      showToast('No active pipelines found. Click "+ Create Pipeline" to connect your API first.', 'info');
      return;
    }

    setIsSyncing(true);
    showToast(`Triggering manual ingestion across ${bridges.length} pipeline(s)...`, 'info');

    setTimeout(() => {
      setIsSyncing(false);
      // Increment records on active bridges
      setBridges(prev =>
        prev.map(b =>
          b.status === 'healthy'
            ? { ...b, recordsSynced: b.recordsSynced + 1, lastSync: 'Just now' }
            : b
        )
      );

      // Prepend a fresh log
      const activeBridge = bridges.find(b => b.status === 'healthy') || bridges[0];
      const newLog: SyncActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toTimeString().slice(0, 12),
        statusCode: 200,
        statusText: '200 OK',
        bridgeName: activeBridge ? activeBridge.name : 'API Pipeline',
        recordsCount: 1,
        payloadSize: '2.4 KB',
        latencyMs: 86
      };
      setLogs(prev => [newLog, ...prev.slice(0, 15)]);
      recordSyncActivityToSupabase(newLog);

      showToast('Ingestion synchronized successfully.', 'success');
    }, 1200);
  };

  // Trigger single bridge sync
  const handleTriggerSingleSync = (bridgeId: string) => {
    const target = bridges.find(b => b.id === bridgeId);
    if (!target) return;

    if (target.status === 'degraded') {
      showToast(`Bridge ${target.name} encountered HTTP 429 Rate Limit Backoff. Opening diagnostic...`, 'error');
      setTimeout(() => {
        setShowFailureModal(true);
      }, 500);
      return;
    }

    setBridges(prev =>
      prev.map(b =>
        b.id === bridgeId
          ? { ...b, recordsSynced: b.recordsSynced + 120, lastSync: 'Just now' }
          : b
      )
    );

    const newLog: SyncActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toTimeString().slice(0, 12),
      statusCode: 200,
      statusText: '200 OK',
      bridgeName: target.name,
      recordsCount: 120,
      payloadSize: '92.4 KB',
      latencyMs: 124
    };
    setLogs(prev => [newLog, ...prev.slice(0, 15)]);
    recordSyncActivityToSupabase(newLog);

    showToast(`Pulled 120 records from ${target.name} (124ms).`, 'success');
  };

  // Refresh metrics
  const handleRefreshMetrics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Operational telemetry metrics refreshed from us-east-1.', 'success');
    }, 800);
  };

  // Live Fetch in Inspector
  const handleTriggerFetch = () => {
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      // Add a simulated record
      const newOrderNum = 5519827103 + Math.floor(Math.random() * 100);
      const newRecord: TabularRecord = {
        order_id: newOrderNum.toString(),
        invoice_number: `#${14093 + Math.floor(Math.random() * 50)}`,
        revenue_amount: `$${(Math.random() * 800 + 50).toFixed(2)} USD`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        customer_email: 'new.buyer@enterprise-retail.com',
        item_count: Math.floor(Math.random() * 4) + 1,
        shipping_state: 'Processing'
      };
      setTabularRecords(prev => [newRecord, ...prev.slice(0, 9)]);
      showToast('Fetched 250 records from upstream API (138ms roundtrip).', 'success');
    }, 1100);
  };

  // Bridge updates
  const handleUpdateBridge = (updated: BridgePipeline) => {
    setBridges(prev => prev.map(b => b.id === updated.id ? updated : b));
    upsertBridgeToSupabase(updated);
    showToast(`Pipeline configuration for ${updated.name} saved.`, 'success');
  };

  const handleAddNewBridge = (newBridge: BridgePipeline) => {
    setBridges(prev => [newBridge, ...prev]);
    setSelectedBridgeId(newBridge.id);
    upsertBridgeToSupabase(newBridge);
  };

  const handleLaunchDryRunAndDeploy = (newBridge: BridgePipeline) => {
    handleAddNewBridge(newBridge);
    setShowDryRunModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ee] flex flex-col font-sans selection:bg-[#8083ff]/30 selection:text-[#c0c1ff]">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-mono backdrop-blur-md ${
            toastMessage.type === 'success'
              ? 'bg-[#181c24]/95 border-[#4edea3]/40 text-[#4edea3]'
              : toastMessage.type === 'error'
              ? 'bg-[#181c24]/95 border-[#ffb4ab]/40 text-[#ffb4ab]'
              : 'bg-[#181c24]/95 border-[#8083ff]/40 text-[#c0c1ff]'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === 'success' ? 'check_circle' : toastMessage.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="text-[#dfe2ee] font-sans font-medium">{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#908fa0] hover:text-white pl-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Enterprise Top Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        activeRegion={activeRegion}
        onRegionChange={setActiveRegion}
      />

      {/* Main Workspace Layout (Sidebar + Active View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          bridges={bridges}
          selectedBridgeId={selectedBridgeId}
          onSelectBridge={setSelectedBridgeId}
          onOpenNewBridgeModal={() => setShowNewBridgeModal(true)}
        />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 overflow-y-auto bg-[#0f131c]">
          {currentView === 'overview-bridges' && (
            <OverviewView
              bridges={bridges}
              logs={logs}
              onNavigate={setCurrentView}
              onSelectBridge={setSelectedBridgeId}
              onTriggerSingleSync={handleTriggerSingleSync}
              onOpenNewBridgeModal={() => setShowNewBridgeModal(true)}
              onOpenFailureModal={() => setShowFailureModal(true)}
              onRefreshMetrics={handleRefreshMetrics}
              isRefreshing={isRefreshing}
            />
          )}

          {currentView === 'connect-auth' && (
            selectedBridge ? (
              <ConnectAuthView
                bridge={selectedBridge}
                onUpdateBridge={handleUpdateBridge}
                onRunDryRun={() => setShowDryRunModal(true)}
                onDeployPipeline={() => setShowSuccessModal(true)}
                onCancel={() => setCurrentView('overview-bridges')}
              />
            ) : (
              <div className="p-8 max-w-md mx-auto mt-20 text-center bg-[#181c24] border border-[#262a33] rounded-2xl shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-[#8083ff]/15 border border-[#8083ff]/30 text-[#8083ff] flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[30px]">settings_ethernet</span>
                </div>
                <h2 className="text-base font-bold text-white mb-1.5">No Pipeline Selected</h2>
                <p className="text-xs text-[#908fa0] mb-5">
                  Create a new pipeline or select one to configure its API endpoint, authentication strategy, headers, and polling schedule.
                </p>
                <button
                  onClick={() => setShowNewBridgeModal(true)}
                  className="px-4 py-2 bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] font-semibold text-xs rounded-lg transition-all shadow-lg shadow-[#8083ff]/20"
                >
                  + Create Your First Pipeline
                </button>
              </div>
            )
          )}

          {currentView === 'fetch-inspector' && (
            <FetchInspectorView
              bridges={bridges}
              selectedBridgeId={selectedBridgeId}
              onSelectBridge={setSelectedBridgeId}
              schemaMappings={schemaMappings}
              onUpdateSchemaMappings={setSchemaMappings}
              tabularRecords={tabularRecords}
              onOpenSqlModal={() => setShowSqlModal(true)}
              onTriggerFetch={handleTriggerFetch}
              isFetching={isFetching}
            />
          )}

          {currentView === 'reports-analytics' && (
            <ReportsView bridges={bridges} />
          )}

          {currentView === 'endpoint-registry' && (
            <EndpointRegistryView
              bridges={bridges}
              onSelectBridgeAndConfigure={(id) => {
                setSelectedBridgeId(id);
                setCurrentView('connect-auth');
              }}
            />
          )}

          {currentView === 'audit-logs' && (
            <AuditLogsView logs={logs} />
          )}
        </main>
      </div>

      {/* Modals */}
      {/* 1. Add New Bridge 3-Step Wizard */}
      <NewBridgeWizardModal
        isOpen={showNewBridgeModal}
        onClose={() => setShowNewBridgeModal(false)}
        onAddBridge={handleAddNewBridge}
        onLaunchDryRunAndDeploy={handleLaunchDryRunAndDeploy}
      />

      {/* 2. Pipeline Dry-Run & Verification */}
      {selectedBridge && (
        <DryRunModal
          isOpen={showDryRunModal}
          onClose={() => setShowDryRunModal(false)}
          bridge={selectedBridge}
          onCompleteSuccess={() => {
            setShowDryRunModal(false);
            setShowSuccessModal(true);
          }}
          onTriggerFailureDiagnostic={() => {
            setShowDryRunModal(false);
            setShowFailureModal(true);
          }}
        />
      )}

      {/* 3. Bridge Connector Deployed Successfully */}
      {selectedBridge && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          bridge={selectedBridge}
          onGoToInspector={() => setCurrentView('fetch-inspector')}
          onGoToDashboard={() => setCurrentView('overview-bridges')}
        />
      )}

      {/* 4. Bridge Verification Failed Diagnostic Modal */}
      <FailureModal
        isOpen={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        onEditConfig={() => {
          setSelectedBridgeId('jira-issues');
          setCurrentView('connect-auth');
        }}
        onRetrySuccess={() => {
          setBridges(prev =>
            prev.map(b =>
              b.id === 'jira-issues'
                ? { ...b, status: 'healthy', statusText: 'Healthy' }
                : b
            )
          );
          showToast('Jira Cloud Issues: Scope attached & backoff recovered. Status now Healthy!', 'success');
        }}
      />

      {/* 5. SQL DDL Generator Modal */}
      <GenerateSqlModal
        isOpen={showSqlModal}
        onClose={() => setShowSqlModal(false)}
        mappings={schemaMappings}
        tableName={`${selectedBridge.service}_orders_stream`}
      />
    </div>
  );
}
