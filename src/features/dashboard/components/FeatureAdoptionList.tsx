import React from 'react';
import { FeatureUsageStat } from '../../../types';
import { formatNumber } from '../../../utils/formatters';
import { Layers } from 'lucide-react';

interface FeatureAdoptionListProps {
  featureStats: FeatureUsageStat[];
}

export const FeatureAdoptionList: React.FC<FeatureAdoptionListProps> = ({ featureStats }) => {
  return (
    <div className="bg-[#141822] border border-[#262a33] rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#262a33]">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#4edea3]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Feature Adoption Share
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#908fa0]">
          Top {Math.min(featureStats.length, 6)} Features
        </span>
      </div>

      <div className="mt-4 space-y-3.5">
        {featureStats.slice(0, 6).map((feat) => (
          <div key={feat.featureName} className="space-y-1 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium truncate max-w-[180px]">
                {feat.featureName}
              </span>
              <span className="text-[#908fa0] text-[11px]">
                {formatNumber(feat.actionCount)} runs ({feat.percentageShare.toFixed(1)}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#181c24] rounded-full overflow-hidden border border-[#262a33]">
              <div
                className="h-full bg-gradient-to-r from-[#8083ff] to-[#4edea3] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Math.max(feat.percentageShare, 2), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
