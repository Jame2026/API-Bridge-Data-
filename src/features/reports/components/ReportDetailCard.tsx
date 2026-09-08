import React from 'react';
import { UsageReport, Project } from '../../../types';
import { ReportMetricsScorecard } from './ReportMetricsScorecard';
import { ReportTable } from './ReportTable';
import { exportReportToCsv, printReportPdf } from '../../../utils/exportUtils';
import { formatDate } from '../../../utils/formatters';
import { Button } from '../../../ui/primitives/Button';
import { Download, Printer, Trash2, Calendar, User as UserIcon } from 'lucide-react';

interface ReportDetailCardProps {
  report: UsageReport;
  project?: Project;
  onDelete: (id: string) => void;
}

export const ReportDetailCard: React.FC<ReportDetailCardProps> = ({
  report,
  project,
  onDelete,
}) => {
  return (
    <div className="bg-[#141822] border border-[#262a33] rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#262a33]">
        <div>
          <div className="flex items-center space-x-2 text-[#8083ff] text-xs font-mono font-bold uppercase">
            <span>{project?.name || 'All Internal Projects'}</span>
            <span>•</span>
            <span className="text-[#4edea3]">{report.dateRange.toUpperCase()} SNAPSHOT</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">{report.title}</h2>
          <div className="flex items-center space-x-4 text-xs text-[#908fa0] mt-1 font-mono">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Generated: {formatDate(report.generatedAt)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Author: {report.createdBy}</span>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5 text-[#7bd0ff]" />}
            onClick={() => exportReportToCsv(report)}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5 text-[#8083ff]" />}
            onClick={printReportPdf}
          >
            Print / PDF
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => onDelete(report.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Notes */}
      {report.notes && (
        <div className="p-3.5 bg-[#181c24] border border-[#262a33] rounded-xl text-xs text-[#dfe2ee]/90">
          <span className="font-bold text-[#8083ff] font-mono mr-1">AUDITOR NOTES:</span>
          {report.notes}
        </div>
      )}

      {/* Scorecards */}
      <ReportMetricsScorecard summary={report.summary} />

      {/* Feature Breakdown Table */}
      <ReportTable featureStats={report.summary.featureStats} />
    </div>
  );
};
