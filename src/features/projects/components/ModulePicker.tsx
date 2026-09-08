import React, { useState } from 'react';
import { Badge } from '../../../ui/primitives/Badge';
import { ListPlus, CheckCircle2, Sparkles } from 'lucide-react';

export const STANDARD_MODULES = [
  'branches',
  'document_folders',
  'attendance_records',
  'employees',
  'leave_requests',
  'payroll_runs',
  'payroll_records',
  'task_activities',
  'tasks',
  'candidates',
  'it_assets',
  'performance_reviews',
];

interface ModulePickerProps {
  selectedModules: string[];
  onChange: (modules: string[]) => void;
  dbUrl?: string;
  dbKey?: string;
}

export const ModulePicker: React.FC<ModulePickerProps> = ({
  selectedModules,
  onChange,
  dbUrl,
  dbKey,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const toggleModule = (mod: string) => {
    if (selectedModules.includes(mod)) {
      onChange(selectedModules.filter((m) => m !== mod));
    } else {
      onChange([...selectedModules, mod]);
    }
  };

  const selectAll = () => {
    const combined = Array.from(new Set([...selectedModules, ...STANDARD_MODULES]));
    onChange(combined);
  };

  const handleAddCustom = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customInput.trim()) {
      e.preventDefault();
      const val = customInput.trim().toLowerCase();
      if (!selectedModules.includes(val)) {
        onChange([...selectedModules, val]);
      }
      setCustomInput('');
    }
  };

  const handleAutoDetect = async () => {
    if (!dbUrl || !dbKey) return;
    setIsDetecting(true);
    const cleanUrl = dbUrl.replace(/\/+$/, '');
    const found: string[] = [];

    for (const mod of STANDARD_MODULES) {
      try {
        const res = await fetch(`${cleanUrl}/rest/v1/${mod}?select=*&limit=1`, {
          headers: { apikey: dbKey, Authorization: `Bearer ${dbKey}` },
        });
        if (res.ok) found.push(mod);
      } catch {}
    }

    if (found.length > 0) {
      onChange(Array.from(new Set([...selectedModules, ...found])));
    }
    setIsDetecting(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-[#dfe2ee]/80 font-mono uppercase">
        <span className="flex items-center gap-1.5">
          <ListPlus className="w-3.5 h-3.5 text-[#4edea3]" />
          System Modules / Tables to Extract
        </span>
        <div className="flex items-center gap-2">
          {dbUrl && dbKey && (
            <button
              type="button"
              onClick={handleAutoDetect}
              disabled={isDetecting}
              className="text-[11px] text-[#8083ff] hover:text-[#9ea0ff] flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              {isDetecting ? 'Detecting...' : 'Auto-Detect'}
            </button>
          )}
          <button
            type="button"
            onClick={selectAll}
            className="text-[11px] text-[#4edea3] hover:underline"
          >
            Select All Standard
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#181c24] border border-[#262a33] rounded-xl">
        {STANDARD_MODULES.map((mod) => {
          const isSelected = selectedModules.includes(mod);
          return (
            <button
              key={mod}
              type="button"
              onClick={() => toggleModule(mod)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#8083ff]/20 text-[#8083ff] border border-[#8083ff]/50 font-semibold'
                  : 'bg-[#141822] text-[#908fa0] border border-[#262a33] hover:border-[#31353e] hover:text-white'
              }`}
            >
              {isSelected && <CheckCircle2 className="w-3 h-3 text-[#4edea3]" />}
              {mod}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleAddCustom}
          placeholder="Add custom table name (press Enter)..."
          className="w-full bg-[#181c24] border border-[#262a33] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#908fa0] focus:outline-none focus:border-[#8083ff]"
        />
      </div>

      {selectedModules.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1 text-[11px] text-[#908fa0]">
          <span>Active Targets ({selectedModules.length}):</span>
          {selectedModules.map((m) => (
            <Badge key={m} variant="neutral" className="text-[10px]">
              {m}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
