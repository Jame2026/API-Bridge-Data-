import React, { useState, useMemo } from 'react';
import { Project, UserActivity, UsageReport } from '../../../types';
import { aggregateUsageMetrics } from '../../../lib/supabase';
import { Modal } from '../../../ui/composed/Modal';
import { Button } from '../../../ui/primitives/Button';
import { Input } from '../../../ui/primitives/Input';
import { Select } from '../../../ui/primitives/Select';
import { DATE_RANGE_OPTIONS } from '../../../config/constants';
import { Sparkles, BarChart3 } from 'lucide-react';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activities: UserActivity[];
  activeProjectId: string;
  onSaveReport: (report: UsageReport) => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  projects,
  activities,
  activeProjectId,
  onSaveReport,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(activeProjectId || 'all');
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d' | 'all'>('7d');
  const [generatedBy, setGeneratedBy] = useState('Staff Engineer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewFiltered = useMemo(() => {
    return activities.filter((act) => {
      if (selectedProjectId !== 'all' && act.projectId !== selectedProjectId) return false;
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
  }, [activities, selectedProjectId, dateRange]);

  const previewMetrics = useMemo(() => aggregateUsageMetrics(previewFiltered), [previewFiltered]);

  React.useEffect(() => {
    const projName = selectedProjectId === 'all'
      ? 'All Systems'
      : (projects.find(p => p.id === selectedProjectId)?.name || 'Project');
    const rangeLabel = dateRange === 'today' ? 'Daily' : dateRange === '7d' ? 'Weekly' : dateRange === '30d' ? 'Monthly' : 'Quarterly';
    setTitle(`${projName} - ${rangeLabel} Usage & Adoption Audit`);
  }, [selectedProjectId, dateRange, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newReport: UsageReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title || 'Usage Report',
      notes: description || `Audit covering ${previewFiltered.length} interactions across ${previewMetrics.totalUsers} users.`,
      projectId: selectedProjectId,
      dateRange,
      generatedAt: new Date().toISOString(),
      createdBy: generatedBy || 'Internal Stakeholder',
      summary: previewMetrics,
    };
    setTimeout(() => {
      onSaveReport(newReport);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const projectOptions = [
    { value: 'all', label: 'All Internal Projects (Aggregate)' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Compile Usage Report Snapshot"
      subtitle="Freeze usage statistics for leadership reviews, audits, and export"
      icon={<Sparkles className="w-4 h-4" />}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Report Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Project Scope"
            options={projectOptions}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          />
          <Select
            label="Date Window"
            options={DATE_RANGE_OPTIONS}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
          />
        </div>
        <Input
          label="Author / Auditor Role"
          value={generatedBy}
          onChange={(e) => setGeneratedBy(e.target.value)}
        />
        <div className="p-3 bg-[#181c24] border border-[#262a33] rounded-xl flex items-center justify-between text-xs font-mono">
          <span className="text-[#908fa0] flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-[#8083ff]" />
            CALCULATED METRICS:
          </span>
          <span className="text-white font-bold">{previewMetrics.totalEvents} events</span>
          <span className="text-[#4edea3] font-bold">{previewMetrics.totalUsers} users</span>
          <span className="text-[#7bd0ff] font-bold">{previewMetrics.featureStats.length} features</span>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>Save Snapshot</Button>
        </div>
      </form>
    </Modal>
  );
};
