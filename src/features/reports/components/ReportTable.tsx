import React from 'react';
import { FeatureUsageStat } from '../../../types';
import { formatNumber } from '../../../utils/formatters';

interface ReportTableProps {
  featureStats: FeatureUsageStat[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ featureStats }) => {
  return (
    <div className="border border-[#262a33] rounded-xl overflow-hidden bg-[#141822]">
      <div className="px-4 py-3 border-b border-[#262a33] bg-[#181c24]/80 flex items-center justify-between">
        <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
          Feature Adoption Breakdown
        </h4>
        <span className="text-[11px] font-mono text-[#908fa0]">
          {featureStats.length} Features Recorded
        </span>
      </div>
      <table className="w-full text-left font-mono text-xs">
        <thead>
          <tr className="border-b border-[#262a33] text-[#908fa0] text-[10px] uppercase bg-[#181c24]/30">
            <th className="py-2.5 px-4 font-semibold">Feature Name</th>
            <th className="py-2.5 px-4 font-semibold text-right">Invocations</th>
            <th className="py-2.5 px-4 font-semibold text-right">Unique Users</th>
            <th className="py-2.5 px-4 font-semibold text-right">Usage Share</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262a33]">
          {featureStats.map((stat) => (
            <tr key={stat.featureName} className="hover:bg-[#181c24]/50 transition-colors">
              <td className="py-2.5 px-4 font-medium text-white flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8083ff]" />
                <span>{stat.featureName}</span>
              </td>
              <td className="py-2.5 px-4 text-right text-[#dfe2ee]">
                {formatNumber(stat.actionCount)}
              </td>
              <td className="py-2.5 px-4 text-right text-[#7bd0ff]">
                {formatNumber(stat.uniqueUsersCount)}
              </td>
              <td className="py-2.5 px-4 text-right">
                <span className="px-2 py-0.5 rounded bg-[#8083ff]/15 text-[#8083ff] text-[11px] font-bold">
                  {stat.percentageShare.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
