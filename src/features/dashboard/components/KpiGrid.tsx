import React from 'react';
import { UsageMetricsSummary } from '../../../types';
import { formatNumber } from '../../../utils/formatters';
import { Activity, Users, Layers, TrendingUp } from 'lucide-react';

interface KpiGridProps {
  metrics: UsageMetricsSummary;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'TOTAL INTERACTIONS',
      value: formatNumber(metrics.totalEvents),
      subtext: '+14.2% vs previous period',
      subtextType: 'success' as const,
      icon: Activity,
      color: '#8083ff',
    },
    {
      title: 'ACTIVE INTERNAL USERS',
      value: formatNumber(metrics.totalUsers),
      subtext: `${(metrics.totalEvents / Math.max(metrics.totalUsers, 1)).toFixed(1)} avg actions/user`,
      subtextType: 'neutral' as const,
      icon: Users,
      color: '#4edea3',
    },
    {
      title: 'TRACKED FEATURES',
      value: metrics.featureStats.length.toString(),
      subtext: `Top: ${metrics.topFeature || 'None'}`,
      subtextType: 'accent' as const,
      icon: Layers,
      color: '#7bd0ff',
    },
    {
      title: 'DAILY AVG ACTIONS',
      value: (
        metrics.totalEvents / Math.max(metrics.dailyTrends.length, 1)
      ).toFixed(0),
      subtext: 'Calculated over window',
      subtextType: 'neutral' as const,
      icon: TrendingUp,
      color: '#facc15',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-[#141822] border border-[#262a33] rounded-xl p-4 flex flex-col justify-between shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#908fa0] uppercase tracking-wider font-semibold">
                {card.title}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center border"
                style={{
                  backgroundColor: `${card.color}15`,
                  borderColor: `${card.color}30`,
                  color: card.color,
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] font-mono mt-1 text-[#908fa0]">
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
