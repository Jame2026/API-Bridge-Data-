import React, { useState, useEffect } from 'react';
import { Project } from '../../../types';
import { Modal } from '../../../ui/composed/Modal';
import { Button } from '../../../ui/primitives/Button';
import { Input } from '../../../ui/primitives/Input';
import { Select } from '../../../ui/primitives/Select';
import { ModulePicker } from './ModulePicker';
import { Layers, Database } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState<Project['environment']>('production');
  const [dbUrl, setDbUrl] = useState('');
  const [dbKey, setDbKey] = useState('');
  const [modules, setModules] = useState<string[]>([]);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setSlug(projectToEdit.slug);
      setDescription(projectToEdit.description);
      setEnvironment(projectToEdit.environment);
      setDbUrl(projectToEdit.dbUrl || '');
      setDbKey(projectToEdit.dbKey || '');
      setModules(projectToEdit.modules || ['branches', 'attendance_gps', 'employees', 'leave_requests']);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setEnvironment('production');
      setDbUrl('');
      setDbKey('');
      setModules(['branches', 'attendance_gps', 'employees', 'leave_requests']);
    }
  }, [projectToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const project: Project = {
      id: projectToEdit ? projectToEdit.id : `prj_${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      environment,
      baseUrl: dbUrl.trim() || 'Internal System',
      icon: 'layers',
      color: projectToEdit?.color || '#8083ff',
      dbUrl: dbUrl.trim() || undefined,
      dbKey: dbKey.trim() || undefined,
      modules: modules.length > 0 ? modules : undefined,
      createdAt: projectToEdit ? projectToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(project);
    onClose();
  };

  const envOptions = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Configure Project & Modules' : 'Create Project Workspace'}
      subtitle="Connect system database & define module extraction targets"
      icon={<Layers className="w-4 h-4" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Project Name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!projectToEdit) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            }}
            placeholder="e.g. HRmsystem"
          />
          <Select
            label="Environment"
            options={envOptions}
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as any)}
          />
        </div>

        <Input
          label="Project Identifier / Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. hrmsystem"
        />

        <Input
          label="Description / Purpose"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Attendance, payroll, employees, leave modules..."
        />

        <div className="pt-3 border-t border-[#262a33] space-y-3">
          <div className="flex items-center space-x-2 text-[#8083ff] text-xs font-mono font-bold uppercase">
            <Database className="w-3.5 h-3.5" />
            <span>Database API Connection (Direct PostgREST)</span>
          </div>

          <Input
            label="Database / Supabase Project URL"
            value={dbUrl}
            autoComplete="off"
            name="supabase_project_url_config"
            onChange={(e) => setDbUrl(e.target.value)}
            placeholder="e.g. https://blcvtbzwpwmqkphlcjji.supabase.co"
          />

          <Input
            label="API Key / Access Token"
            type="text"
            autoComplete="off"
            name="supabase_api_key_token"
            value={dbKey}
            onChange={(e) => setDbKey(e.target.value)}
            placeholder="Paste your Supabase anon or service role key..."
          />

          <ModulePicker
            selectedModules={modules}
            onChange={setModules}
            dbUrl={dbUrl}
            dbKey={dbKey}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#262a33]">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Workspace & Modules</Button>
        </div>
      </form>
    </Modal>
  );
};
export default ProjectModal;
