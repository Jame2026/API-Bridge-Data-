import React, { useState, useEffect } from 'react';
import { Project } from '../../../types';
import { Modal } from '../../../ui/composed/Modal';
import { Button } from '../../../ui/primitives/Button';
import { Input } from '../../../ui/primitives/Input';
import { Select } from '../../../ui/primitives/Select';
import { Layers } from 'lucide-react';

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
  const [color, setColor] = useState('#8083ff');

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setSlug(projectToEdit.slug);
      setDescription(projectToEdit.description);
      setEnvironment(projectToEdit.environment);
      setColor(projectToEdit.color);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setEnvironment('production');
      setColor('#8083ff');
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
      baseUrl: 'Internal Microservice',
      icon: 'layers',
      color,
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
      title={projectToEdit ? 'Edit Project Workspace' : 'Create Internal Project Workspace'}
      subtitle="Organize and isolate internal applications and feature telemetry"
      icon={<Layers className="w-4 h-4" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!projectToEdit) {
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            }
          }}
          placeholder="e.g. Core Billing Engine"
        />
        <Input
          label="Project Identifier / Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. billing-engine"
        />
        <Select
          label="Environment"
          options={envOptions}
          value={environment}
          onChange={(e) => setEnvironment(e.target.value as any)}
        />
        <Input
          label="Description / Purpose"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of application scope..."
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Workspace</Button>
        </div>
      </form>
    </Modal>
  );
};
