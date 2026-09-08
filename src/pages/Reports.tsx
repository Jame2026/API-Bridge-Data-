import React, { useState, useMemo } from 'react';
import { useReportsQuery, useCreateReportMutation, useDeleteReportMutation } from '../features/reports/api/reports.queries';
import { useProjectsQuery } from '../features/projects/api/projects.queries';
import { useActivitiesQuery } from '../features/activities/api/activities.queries';
import { useReportsFiltersStore } from '../features/reports/store/reportsFilters.store';
import { useUiStore } from '../state/uiStore';
import { ReportDetailCard } from '../features/reports/components/ReportDetailCard';
import { GenerateReportModal } from '../features/reports/components/GenerateReportModal';
import { Button } from '../ui/primitives/Button';
import { formatDate } from '../utils/formatters';
import { FileText, Plus, Calendar, Layers, Sparkles } from 'lucide-react';

export const Reports: React.FC = () => {
  const { data: reports = [] } = useReportsQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: activities = [] } = useActivitiesQuery();
  const createReportMutation = useCreateReportMutation();
  const deleteReportMutation = useDeleteReportMutation();

  const selectedReportId = useReportsFiltersStore((s) => s.selectedReportId);
  const setSelectedReportId = useReportsFiltersStore((s) => s.setSelectedReportId);
  const addToast = useUiStore((s) => s.addToast);

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Active or first report
  const activeReport = useMemo(() => {
    if (selectedReportId) {
      const found = reports.find((r) => r.id === selectedReportId);
      if (found) return found;
    }
    return reports[0] || null;
  }, [reports, selectedReportId]);

  const activeProject = projects.find((p) => p.id === activeReport?.projectId);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141822] border border-[#262a33] p-5 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Saved Usage Reports & Audit Archive</h1>
          <p className="text-xs text-[#908fa0] mt-1">
            Historical point-in-time snapshots for executive stakeholder reviews, feature audits, and export.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsGenerateModalOpen(true)}
        >
          Generate New Report
        </Button>
      </div>

      {reports.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#262a33] rounded-2xl p-8 bg-[#141822]">
          <FileText className="w-8 h-8 text-[#908fa0] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white font-mono">No Report Snapshots Found</h3>
          <p className="text-xs text-[#908fa0] mt-1 mb-4">
            Compile your first usage report snapshot to freeze metrics and export to CSV or PDF.
          </p>
          <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
            Compile Report Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Report Selection Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-[11px] font-mono text-[#908fa0] uppercase tracking-wider font-semibold">
              SAVED AUDIT SNAPSHOTS ({reports.length})
            </span>
            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {reports.map((rep) => {
                const isSelected = activeReport?.id === rep.id;
                const proj = projects.find((p) => p.id === rep.projectId);
                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#181c24] border-[#8083ff] shadow-lg shadow-[#8083ff]/10'
                        : 'bg-[#141822] border-[#262a33] hover:border-[#31353e]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[200px]">
                        {rep.title}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#8083ff]/15 text-[#8083ff]">
                        {rep.dateRange}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] text-[#908fa0] font-mono mt-2">
                      <span className="flex items-center space-x-1">
                        <Layers className="w-3 h-3" />
                        <span>{proj ? proj.name : 'All Projects'}</span>
                      </span>
                      <span>•</span>
                      <span>{formatDate(rep.generatedAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Report Preview (8 cols) */}
          <div className="lg:col-span-8">
            {activeReport && (
              <ReportDetailCard
                report={activeReport}
                project={activeProject}
                onDelete={(id) => {
                  deleteReportMutation.mutate(id);
                  addToast('Report snapshot deleted', 'info');
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        projects={projects}
        activities={activities}
        activeProjectId="all"
        onSaveReport={(newReport) => {
          createReportMutation.mutate(newReport);
          setSelectedReportId(newReport.id);
          addToast(`Report snapshot "${newReport.title}" compiled!`, 'success');
        }}
      />
    </div>
  );
};
export default Reports;
