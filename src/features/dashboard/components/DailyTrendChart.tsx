import React, { useState } from 'react';
import { DailyTrendPoint } from '../../../types';
import { BarChart3 } from 'lucide-react';

interface DailyTrendChartProps {
  dailyTrends: DailyTrendPoint[];
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({ dailyTrends }) => {
  const [hoveredDay, setHoveredDay] = useState<DailyTrendPoint | null>(null);

  const maxEvents = Math.max(...dailyTrends.map((d) => d.eventCount), 1);

  return (
    <div className="bg-[#141822] border border-[#262a33] rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#262a33]">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-[#8083ff]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Daily Usage Frequency & Trend
          </h3>
        </div>
        <div className="text-[11px] font-mono text-[#908fa0]">
          {hoveredDay ? (
            <span className="text-[#8083ff] font-bold">
              {hoveredDay.date}: {hoveredDay.eventCount} actions ({hoveredDay.activeUsers} users)
            </span>
          ) : (
            'Hover on bar for metrics'
          )}
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-1.5 pt-6 pb-2 px-1">
        {dailyTrends.map((day) => {
          const heightPercent = Math.max(Math.round((day.eventCount / maxEvents) * 100), 8);
          const isHovered = hoveredDay?.date === day.date;

          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div
                className={`w-full max-w-[28px] rounded-t-sm transition-all ${
                  isHovered
                    ? 'bg-[#9194ff] shadow-lg shadow-[#8083ff]/40 scale-y-105'
                    : 'bg-[#8083ff]/40 hover:bg-[#8083ff]/80'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-[9px] font-mono text-[#908fa0] mt-1.5 truncate max-w-[32px]">
                {day.date.split('-').slice(1).join('/')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
