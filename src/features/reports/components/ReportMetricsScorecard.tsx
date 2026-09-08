import React from 'react';
import { UsageMetricsSummary } from '../../../types';
import { formatNumber } from '../../../utils/formatters';
import { Activity, Users, Layers, Award } from 'lucide-react';

interface ReportMetricsScorecardProps {
  summary: UsageMetricsSummary;
}

export const ReportMetricsScorecard: React.FC<ReportMetricsScorecardProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#908fa0] text-[11px] font-mono">
          <span>TOTAL EVENTS</span>
          <Activity className="w-3.5 h-3.5 text-[#8083ff]" />
        </div>
        <div className="text-xl font-bold text-white font-mono mt-1">
          {formatNumber(summary.totalEvents)}
        </div>
      </div>

      <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#908fa0] text-[11px] font-mono">
          <span>ACTIVE USERS</span>
          <Users className="w-3.5 h-3.5 text-[#4edea3]" />
        </div>
        <div className="text-xl font-bold text-[#4edea3] font-mono mt-1">
          {formatNumber(summary.totalUsers)}
        </div>
      </div>

      <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#908fa0] text-[11px] font-mono">
          <span>FEATURES</span>
          <Layers className="w-3.5 h-3.5 text-[#7bd0ff]" />
        </div>
        <div className="text-xl font-bold text-[#7bd0ff] font-mono mt-1">
          {summary.featureStats?.length || 0}
        </div>
      </div>

      <div className="bg-[#181c24] border border-[#262a33] rounded-xl p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-[#908fa0] text-[11px] font-mono">
          <span>TOP FEATURE</span>
          <Award className="w-3.5 h-3.5 text-[#facc15]" />
        </div>
        <div className="text-sm font-bold text-white font-mono mt-1 truncate">
          {summary.topFeature || 'N/A'}
        </div>
      </div>
    </div>
  );
};
