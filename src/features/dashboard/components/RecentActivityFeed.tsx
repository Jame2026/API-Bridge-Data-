import React from 'react';
import { UserActivity, Project } from '../../../types';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/paths';
import { Activity, ArrowRight } from 'lucide-react';

interface RecentActivityFeedProps {
  activities: UserActivity[];
  projects: Project[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  projects,
}) => {
  return (
    <div className="bg-[#141822] border border-[#262a33] rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-[#262a33]">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#7bd0ff]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Live Stream Telemetry
          </h3>
        </div>
        <Link
          to={ROUTES.activityExplorer}
          className="text-[11px] text-[#7bd0ff] hover:underline font-mono flex items-center space-x-1"
        >
          <span>Open Explorer</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="mt-3 divide-y divide-[#262a33] font-mono text-xs max-h-64 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-[#908fa0]">No activity recorded yet.</div>
        ) : (
          activities.slice(0, 8).map((act) => {
            const proj = projects.find((p) => p.id === act.projectId);
            return (
              <div key={act.id} className="py-2 flex items-center justify-between hover:bg-[#181c24] px-1 rounded transition-colors">
                <div className="flex items-center space-x-2.5 truncate">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#8083ff]/15 text-[#8083ff]">
                    {act.actionType}
                  </span>
                  <div className="flex flex-col truncate">
                    <span className="text-white text-xs font-sans truncate">{act.userEmail || act.userId}</span>
                    <span className="text-[10px] text-[#908fa0]">
                      {act.featureName} {proj ? `• ${proj.name}` : ''}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-[#908fa0] shrink-0 font-mono">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
