import React from 'react';
import { Project } from '../../../types';
import { Badge } from '../../../ui/primitives/Badge';
import { Button } from '../../../ui/primitives/Button';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  eventCount: number;
  userCount: number;
  featureCount: number;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onSync?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  eventCount,
  userCount,
  featureCount,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSync,
}) => {
  return (
    <div
      className={`bg-[#141822] border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
        isSelected
          ? 'border-[#8083ff] shadow-lg shadow-[#8083ff]/10'
          : 'border-[#262a33] hover:border-[#31353e]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border font-mono text-sm font-bold shadow-sm"
              style={{
                backgroundColor: `${project.color}15`,
                borderColor: `${project.color}30`,
                color: project.color,
              }}
            >
              {project.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{project.name}</h3>
              <span className="text-[11px] font-mono text-[#908fa0]">/{project.slug}</span>
            </div>
          </div>
          <Badge variant={project.environment === 'production' ? 'success' : 'neutral'}>
            {project.environment}
          </Badge>
        </div>

        <p className="text-xs text-[#908fa0] mt-1 line-clamp-2">{project.description}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-[#181c24] rounded-xl border border-[#262a33] text-center font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#908fa0]">EVENTS</div>
            <div className="text-white font-bold mt-0.5">{eventCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#908fa0]">USERS</div>
            <div className="text-[#4edea3] font-bold mt-0.5">{userCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#908fa0]">MODULES</div>
            <div className="text-[#7bd0ff] font-bold mt-0.5">{featureCount}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#262a33]">
        <Button size="sm" variant={isSelected ? 'primary' : 'secondary'} onClick={() => onSelect(project.id)}>
          {isSelected ? 'Active Scope' : 'Select Project'}
        </Button>
        <div className="flex items-center space-x-1">
          {onSync && project.dbUrl && (
            <Button
              size="sm"
              variant="ghost"
              title="Extract real database records now"
              onClick={() => onSync(project)}
              icon={<RefreshCw className="w-3.5 h-3.5 text-[#4edea3]" />}
            />
          )}
          <Button size="sm" variant="ghost" onClick={() => onEdit(project)} icon={<Edit2 className="w-3.5 h-3.5" />} />
          <Button size="sm" variant="ghost" onClick={() => onDelete(project.id)} icon={<Trash2 className="w-3.5 h-3.5 text-[#ffb4ab]" />} />
        </div>
      </div>
    </div>
  );
};
