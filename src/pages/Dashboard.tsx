import React, { useState, useMemo } from 'react';
import { useActivitiesQuery } from '../features/activities/api/activities.queries';
import { useProjectsQuery } from '../features/projects/api/projects.queries';
import { useCreateReportMutation } from '../features/reports/api/reports.queries';
import { useUiStore } from '../state/uiStore';
import { aggregateUsageMetrics } from '../lib/supabase';
import { KpiGrid, DailyTrendChart, FeatureAdoptionList, RecentActivityFeed } from '../features/dashboard';
import { GenerateReportModal } from '../features/reports/components/GenerateReportModal';
import { Button } from '../ui/primitives/Button';
import { Sparkles, BarChart2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: activities = [] } = useActivitiesQuery();
  const { data: projects = [] } = useProjectsQuery();
  const createReportMutation = useCreateReportMutation();

  const activeProjectId = useUiStore((s) => s.activeProjectId);
  const dateRange = useUiStore((s) => s.dateRange);
  const addToast = useUiStore((s) => s.addToast);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Filter activities based on global active project and date range
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (activeProjectId !== 'all' && act.projectId !== activeProjectId) return false;
      if (dateRange === 'all') return true;

      const actDate = new Date(act.timestamp).getTime();
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      if (dateRange === 'today') return now - actDate <= dayMs;
      if (dateRange === '7d') return now - actDate <= 7 * dayMs;
      if (dateRange === '30d') return now - actDate <= 30 * dayMs;
      if (dateRange === '90d') return now - actDate <= 90 * dayMs;
      return true;
    });
  }, [activities, activeProjectId, dateRange]);

  const metrics = useMemo(() => aggregateUsageMetrics(filteredActivities), [filteredActivities]);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141822] border border-[#262a33] p-5 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              {activeProject ? `${activeProject.name} Usage Analytics` : 'Internal Usage & Feature Analytics'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-[#908fa0] mt-1">
            Aggregating internal user activities, feature adoption rates, and daily trend patterns.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Sparkles className="w-4 h-4" />}
          onClick={() => setIsReportModalOpen(true)}
        >
          Compile Usage Report
        </Button>
      </div>

      {/* KPI Cards */}
      <KpiGrid metrics={metrics} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DailyTrendChart dailyTrends={metrics.dailyTrends} />
        </div>
        <div className="lg:col-span-5">
          <FeatureAdoptionList featureStats={metrics.featureStats} />
        </div>
      </div>

      {/* Live Stream Telemetry Feed */}
      <RecentActivityFeed activities={filteredActivities} projects={projects} />

      {/* Report Modal */}
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projects={projects}
        activities={activities}
        activeProjectId={activeProjectId}
        onSaveReport={(newReport) => {
          createReportMutation.mutate(newReport);
          addToast(`Report snapshot "${newReport.title}" created successfully!`, 'success');
        }}
      />
    </div>
  );
};
export default Dashboard;
