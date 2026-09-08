import React from 'react';
import { UserActivity } from '../../../types';
import { Modal } from '../../../ui/composed/Modal';
import { Button } from '../../../ui/primitives/Button';
import { Code2 } from 'lucide-react';

interface MetadataModalProps {
  activity: UserActivity | null;
  onClose: () => void;
}

export const MetadataModal: React.FC<MetadataModalProps> = ({ activity, onClose }) => {
  if (!activity) return null;

  return (
    <Modal
      isOpen={!!activity}
      onClose={onClose}
      title="Event Context Metadata"
      subtitle={`Action: ${activity.actionType} • Feature: ${activity.featureName}`}
      icon={<Code2 className="w-4 h-4" />}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="p-4 bg-[#090d14] border border-[#262a33] rounded-xl overflow-x-auto">
          <pre className="text-xs font-mono text-[#7bd0ff] leading-relaxed">
            <code>{JSON.stringify(activity.metadata || {}, null, 2)}</code>
          </pre>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#908fa0]">
          <span>Event ID: {activity.id}</span>
          <span>Timestamp: {activity.timestamp}</span>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>Close Inspector</Button>
        </div>
      </div>
    </Modal>
  );
};
