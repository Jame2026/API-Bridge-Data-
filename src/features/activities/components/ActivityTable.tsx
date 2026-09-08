import React, { useState } from 'react';
import { UserActivity, Project } from '../../../types';
import { DataTable } from '../../../ui/composed/DataTable';
import { Badge } from '../../../ui/primitives/Badge';
import { Button } from '../../../ui/primitives/Button';
import { MetadataModal } from './MetadataModal';
import { formatDateTime } from '../../../utils/formatters';
import { Eye } from 'lucide-react';

interface ActivityTableProps {
  activities: UserActivity[];
  projects: Project[];
  isLoading?: boolean;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  projects,
  isLoading,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'login': return 'success';
      case 'feature_use': return 'primary';
      case 'export_data':
      case 'export_run': return 'accent';
      case 'error': return 'danger';
      default: return 'neutral';
    }
  };

  const columns = [
    {
      key: 'actionType',
      header: 'ACTION',
      width: '120px',
      render: (act: UserActivity) => (
        <Badge variant={getActionBadgeVariant(act.actionType)}>
          {act.actionType}
        </Badge>
      ),
    },
    {
      key: 'featureName',
      header: 'FEATURE',
      render: (act: UserActivity) => (
        <span className="font-semibold text-white">{act.featureName}</span>
      ),
    },
    {
      key: 'projectId',
      header: 'PROJECT WORKSPACE',
      render: (act: UserActivity) => {
        const proj = projects.find((p) => p.id === act.projectId);
        return (
          <span className="text-[#908fa0]">
            {proj ? proj.name : act.projectId}
          </span>
        );
      },
    },
    {
      key: 'userEmail',
      header: 'USER',
      render: (act: UserActivity) => (
        <div className="flex flex-col truncate max-w-[200px]">
          <span className="text-[#dfe2ee] font-sans truncate">{act.userEmail || act.userId}</span>
          <span className="text-[10px] text-[#908fa0]">ID: {act.userId}</span>
        </div>
      ),
    },
    {
      key: 'timestamp',
      header: 'TIMESTAMP',
      width: '180px',
      render: (act: UserActivity) => (
        <span className="text-[#908fa0] text-[11px]">
          {formatDateTime(act.timestamp)}
        </span>
      ),
    },
    {
      key: 'metadata',
      header: 'CONTEXT',
      width: '90px',
      align: 'right' as const,
      render: (act: UserActivity) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedActivity(act)}
          icon={<Eye className="w-3 h-3" />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={activities}
        keyExtractor={(row) => row.id}
        emptyMessage="No activity logs match the selected filters."
        isLoading={isLoading}
      />
      <MetadataModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </>
  );
};
