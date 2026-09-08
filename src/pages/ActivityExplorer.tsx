import React, { useState, useMemo } from 'react';
import { useActivitiesQuery } from '../features/activities/api/activities.queries';
import { useProjectsQuery } from '../features/projects/api/projects.queries';
import { useUiStore } from '../state/uiStore';
import { useDebounce } from '../hooks/useDebounce';
import { ActivityTable } from '../features/activities/components/ActivityTable';
import { exportActivitiesToCsv } from '../utils/exportUtils';
import { Input } from '../ui/primitives/Input';
import { Select } from '../ui/primitives/Select';
import { Button } from '../ui/primitives/Button';
import { ACTION_TYPE_OPTIONS, DATE_RANGE_OPTIONS } from '../config/constants';
import { Search, Download, RefreshCw, Filter } from 'lucide-react';

export const ActivityExplorer: React.FC = () => {
  const { data: activities = [], isLoading, refetch } = useActivitiesQuery();
  const { data: projects = [] } = useProjectsQuery();

  const activeProjectId = useUiStore((s) => s.activeProjectId);
  const setActiveProjectId = useUiStore((s) => s.setActiveProjectId);
  const dateRange = useUiStore((s) => s.dateRange);
  const setDateRange = useUiStore((s) => s.setDateRange);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('all');

  const debouncedSearch = useDebounce(searchTerm, 250);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (activeProjectId !== 'all' && act.projectId !== activeProjectId) return false;
      if (selectedActionType !== 'all' && act.actionType !== selectedActionType) return false;

      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase();
        const matchesFeature = act.featureName.toLowerCase().includes(query);
        const matchesEmail = act.userEmail?.toLowerCase().includes(query);
        const matchesUserId = act.userId.toLowerCase().includes(query);
        if (!matchesFeature && !matchesEmail && !matchesUserId) return false;
      }

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
  }, [activities, activeProjectId, selectedActionType, debouncedSearch, dateRange]);

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141822] border border-[#262a33] p-5 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Internal User Activity Explorer</h1>
          <p className="text-xs text-[#908fa0] mt-1">
            Search, filter, and inspect raw interaction records across your internal system features.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => exportActivitiesToCsv(filteredActivities)}
          >
            Export Logs CSV ({filteredActivities.length})
          </Button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-[#141822] border border-[#262a33] rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by user email, user ID, or feature name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={projectOptions}
            value={activeProjectId}
            onChange={(e) => setActiveProjectId(e.target.value)}
          />
        </div>
        <div className="w-full md:w-44">
          <Select
            options={DATE_RANGE_OPTIONS}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
          />
        </div>
        <div className="w-full md:w-44">
          <Select
            options={ACTION_TYPE_OPTIONS}
            value={selectedActionType}
            onChange={(e) => setSelectedActionType(e.target.value)}
          />
        </div>
      </div>

      {/* Activities Data Table */}
      <ActivityTable
        activities={filteredActivities}
        projects={projects}
        isLoading={isLoading}
      />
    </div>
  );
};
export default ActivityExplorer;
